import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Agency from '../models/agency.model.js';
import { generateAuthTokens, generateAccessToken, verify } from '../../utils/jwt.util.js';
import MESSAGES from '../../constant/message.js';
import RESPONSE_CODES from '../../constant/responseCode.js';
import { CustomError } from '../../errors/custom.error.js';
import { generateToken } from '../../utils/random.util.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendManagerInviteEmail } from '../../email/auth.email.js';
import crypto from 'crypto';
import { EUserRole, EUserPlan, EUserStatus } from '../enums/agency.enum.js';
import { TAuthBase, TSignUpInput, TUserAccount } from '../types/user.type.js';

/**
 * Register a new user
 */
export const signUp = async (userData: TSignUpInput) => {
    const { email, password, fullName, plan } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email, isDeleted: false });
    if (existingUser) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate verification token (for link)
    const verificationToken = generateToken();
    const verificationExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);// 2 days

    // Create user object, handling optional fields for exactOptionalPropertyTypes
    const newUserObj: TUserAccount = {
        email,
        password: passwordHash,
        isConfirmed: false,
        fullName,
        plan,
        verificationToken,
        verificationExpires,
    };
    // Create user
    const user = await User.create(newUserObj);

    // Send verification email
    const finalRedirect = process.env.FRONTEND_URL;
    if (!finalRedirect) {
        throw new CustomError(RESPONSE_CODES.INTERNAL_SERVER_ERROR, 'Frontend URL is not configured');
    }
    await sendVerificationEmail(email, verificationToken, finalRedirect);

    return {
        message: MESSAGES.TEXT.VERFICATION_SEND,
        user: {
            id: user._id,
            email: user.email,
        },
    };
};

/**
 * Verify the user's email via the link token. Idempotent: clicking a still-
 * valid link multiple times returns success instead of "invalid token", so
 * dev-mode double effects, browser back-button, or network retries don't
 * surface a fake error to the user.
 */
export const verifyEmail = async (token: string) => {
    const user = await User.findOne({
        verificationToken: token,
        verificationExpires: { $gt: new Date() },
        isDeleted: false,
    });

    if (!user) {
        throw new CustomError(
            RESPONSE_CODES.BAD_REQUEST,
            'Invalid or expired verification token'
        );
    }

    const alreadyVerified = user.isConfirmed === true;

    if (!alreadyVerified) {
        user.isConfirmed = true;
        await user.save();
    }
    // Token is intentionally retained until natural expiration so repeat
    // clicks on the same link stay idempotent.

    const tokens = generateAuthTokens({
        user_id: user._id.toString(),
    });

    const showAgencyModal = (user?.agencies?.length || 0) === 0;

    return {
        alreadyVerified,
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            plan: user.plan,
            agencies: user?.agencies,
            createdAt: user.createdAt,
            showAgencyModal,
        },
        tokens,
    };
};

/**
 * Login user
 */
export const signIn = async (credentials: TAuthBase) => {
    const { email, password } = credentials;

    const user = await User.findOne({ email, isDeleted: false })
    if (!user) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Check if email is confirmed
    if (!user.isConfirmed) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNVERIFIED_ACCOUNT);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Inactive accounts (disabled by Account Holder) cannot sign in.
    // Surface the disabled message verbatim per product spec.
    if (user.status === EUserStatus.INACTIVE) {
        throw new CustomError(RESPONSE_CODES.FORBIDDEN, MESSAGES.MANAGER.ACCOUNT_DISABLED);
    }

    // Generate tokens
    const tokens = generateAuthTokens({
        user_id: user._id.toString(),
    });

    const showAgencyModal = (user?.agencies?.length || 0) === 0;

    return {
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            plan: user.plan,
            agencies: user?.agencies,
            createdAt: user.createdAt,
            showAgencyModal,
        },
        tokens,
    };
};

/**
 * Send a password-reset link to the user's email if the account exists.
 * Always resolves successfully so the endpoint cannot be used to enumerate users.
 */
export const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email, isDeleted: false });

    if (user) {
        const resetToken = generateToken();
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        try {
            await sendPasswordResetEmail(user.email, resetToken);
        } catch (error) {
            console.error('[auth] failed to send password reset email', error);
        }
    }

    return {
        message: 'If an account exists for that email, a reset link has been sent.',
    };
};

/**
 * Reset a user's password using a valid reset token.
 */
export const resetPassword = async (token: string, newPassword: string) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
        isDeleted: false,
    });

    if (!user) {
        throw new CustomError(
            RESPONSE_CODES.BAD_REQUEST,
            'Invalid or expired password reset token'
        );
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    if (!user.isConfirmed) {
        user.isConfirmed = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
    }
    await user.save();

    return {
        message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESSFULLY,
    };
};

/**
 * Get user profile by ID. For Admins (role=manager) the agency context is
 * inherited from their Account Holder, so we surface `role`, `createdBy`, and
 * `title` so the frontend can gate UI accordingly.
 */
export const getProfile = async (userId: string) => {
    const user = await User.findById(userId).select(
        'email fullName plan role title status agencies createdBy createdAt isDeleted'
    );
    if (!user || user.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }

    const isAdmin = user.role === EUserRole.MANAGER;

    // Admins don't own agencies; the modal that nudges users to create one
    // should never show for them.
    const showAgencyModal = !isAdmin && (user?.agencies?.length || 0) === 0;

    return {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        plan: user.plan,
        role: user.role,
        title: user.title,
        status: user.status,
        createdBy: user.createdBy,
        agencies: user.agencies,
        createdAt: user.createdAt,
        showAgencyModal,
    };
};

/**
 * Exchange a valid refresh token for a new access token.
 * Validates the token, checks the user is still active, then issues
 * a fresh short-lived access token without requiring re-authentication.
 */
export const refreshAccessToken = async (refreshToken: string) => {
    let payload: { user_id: string };
    try {
        payload = verify(refreshToken, 'refresh_token') as { user_id: string };
    } catch {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.SESSION_EXPIRED);
    }

    const user = await User.findById(payload.user_id).select('isDeleted status');
    if (!user || user.isDeleted) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.PROFILE_NOT_FOUND);
    }
    if (user.status === EUserStatus.INACTIVE) {
        throw new CustomError(RESPONSE_CODES.FORBIDDEN, MESSAGES.MANAGER.ACCOUNT_DISABLED);
    }

    const access_token = generateAccessToken({ user_id: user._id.toString() });
    return { access_token };
};

const ADMIN_SEATS_BY_PLAN: Record<EUserPlan, number> = {
    [EUserPlan.FOUNDER]: 2,
    [EUserPlan.ESSENTIALS]: 2,
    [EUserPlan.PROFESSIONAL]: 2,
    [EUserPlan.ENTERPRISE]: 4,
};

const getMaxAdminSeats = (plan: EUserPlan): number => ADMIN_SEATS_BY_PLAN[plan] ?? 2;

/** @deprecated Use getMaxAdminSeats(plan) instead */
export const MAX_ADMIN_SEATS_PER_ACCOUNT = 2;

/**
 * Create an Admin (manager) seat under the current Account Holder.
 * Enforces the plan-based seat cap and sends an invite + temp password.
 * For Enterprise plans the caller may supply an agencyId to pre-assign;
 * for all other plans the owner's single agency is assigned automatically.
 */
export const createManager = async (
    createdByUserId: string | undefined,
    data: { email: string; fullName?: string; title?: string; agencyId?: string }
) => {
    const { email, fullName, title, agencyId } = data;

    if (!createdByUserId) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    }

    const creator = await User.findById(createdByUserId).select('plan isDeleted');
    if (!creator || creator.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }
    const creatorPlan = (creator.plan as EUserPlan) ?? EUserPlan.ESSENTIALS;

    const adminCount = await User.countDocuments({
        createdBy: createdByUserId as any,
        role: EUserRole.MANAGER,
        isDeleted: false,
    });
    const maxSeats = getMaxAdminSeats(creatorPlan);
    if (adminCount >= maxSeats) {
        throw new CustomError(
            RESPONSE_CODES.BAD_REQUEST,
            MESSAGES.MANAGER.LIMIT_REACHED(maxSeats)
        );
    }

    const existing = await User.findOne({ email, isDeleted: false });
    if (existing) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
    }

    // Resolve the agency to assign. For enterprise the caller may specify one;
    // for all plans fall back to the owner's first (and typically only) agency.
    let resolvedAgencyId: string | undefined;
    if (agencyId) {
        const owned = await Agency.findOne({ _id: agencyId as any, userId: createdByUserId as any });
        if (!owned) {
            throw new CustomError(RESPONSE_CODES.BAD_REQUEST, MESSAGES.MANAGER.AGENCY_NOT_OWNED);
        }
        resolvedAgencyId = String(owned._id);
    } else {
        const firstAgency = await Agency.findOne({ userId: createdByUserId as any }).sort({ createdAt: 1 });
        if (firstAgency) resolvedAgencyId = String(firstAgency._id);
    }

    const tempPassword = crypto.randomBytes(6).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);
    const verificationToken = generateToken();
    const verificationExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const newUser = await User.create({
        email,
        password: passwordHash,
        fullName: fullName || '',
        title: title?.trim() || undefined,
        isConfirmed: false,
        verificationToken,
        verificationExpires,
        plan: creatorPlan,
        role: EUserRole.MANAGER,
        createdBy: createdByUserId,
        assignedAgencyId: resolvedAgencyId ?? undefined,
    });

    await sendManagerInviteEmail(email, verificationToken, tempPassword);

    return {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        title: newUser.title,
        assignedAgencyId: newUser.assignedAgencyId ?? null,
    };
};

/**
 * List Admin seats owned by the current Account Holder, plus capacity.
 */
export const listManagers = async (createdByUserId: string | undefined) => {
    if (!createdByUserId) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    }

    const [admins, creator] = await Promise.all([
        User.find({
            createdBy: createdByUserId as any,
            role: EUserRole.MANAGER,
            isDeleted: false,
        })
            .select('email fullName title isConfirmed status assignedAgencyId createdAt')
            .sort({ createdAt: 1 }),
        User.findById(createdByUserId).select('plan'),
    ]);

    const creatorPlan = (creator?.plan as EUserPlan) ?? EUserPlan.ESSENTIALS;
    const maxAllowed = getMaxAdminSeats(creatorPlan);

    return {
        admins,
        capacity: {
            maxAllowed,
            used: admins.length,
            canCreateMore: admins.length < maxAllowed,
        },
    };
};

/**
 * Activate or deactivate an Admin account.
 * Only the Account Holder who created the admin may change its status.
 */
export const setManagerStatus = async (
    createdByUserId: string | undefined,
    adminId: string,
    status: EUserStatus
) => {
    if (!createdByUserId) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    }

    const admin = await User.findOne({
        _id: adminId,
        createdBy: createdByUserId as any,
        role: EUserRole.MANAGER,
        isDeleted: false,
    });

    if (!admin) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.MANAGER.NOT_FOUND);
    }

    admin.status = status;
    await admin.save();

    return {
        id: admin._id,
        email: admin.email,
        status: admin.status,
    };
};

/**
 * Resend an invite to an admin who hasn't verified their account yet.
 * Generates a fresh temp password + verification token and re-sends the email.
 * Throws if the admin is already confirmed (no point resending).
 */
export const resendManagerInvite = async (
    createdByUserId: string | undefined,
    adminId: string
) => {
    if (!createdByUserId) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    }

    const admin = await User.findOne({
        _id: adminId,
        createdBy: createdByUserId as any,
        role: EUserRole.MANAGER,
        isDeleted: false,
    });
    if (!admin) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.MANAGER.NOT_FOUND);
    }
    if (admin.isConfirmed) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, MESSAGES.MANAGER.ALREADY_CONFIRMED);
    }

    const tempPassword = crypto.randomBytes(6).toString('hex');
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(tempPassword, salt);
    admin.verificationToken = generateToken();
    admin.verificationExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await admin.save();

    await sendManagerInviteEmail(admin.email, admin.verificationToken, tempPassword);

    return { id: admin._id, email: admin.email };
};

/**
 * Assign (or re-assign) a specific agency to an admin.
 * Only available on the Enterprise plan where the owner has multiple agencies.
 * For other plans the assignment is managed automatically.
 * Pass agencyId=null to clear the assignment (admin loses all agency access).
 */
export const assignManagerAgency = async (
    createdByUserId: string | undefined,
    adminId: string,
    agencyId: string | null
) => {
    if (!createdByUserId) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    }

    const admin = await User.findOne({
        _id: adminId,
        createdBy: createdByUserId as any,
        role: EUserRole.MANAGER,
        isDeleted: false,
    });
    if (!admin) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.MANAGER.NOT_FOUND);
    }

    if (agencyId !== null) {
        const owned = await Agency.findOne({ _id: agencyId as any, userId: createdByUserId as any });
        if (!owned) {
            throw new CustomError(RESPONSE_CODES.BAD_REQUEST, MESSAGES.MANAGER.AGENCY_NOT_OWNED);
        }
    }

    admin.assignedAgencyId = agencyId === null ? undefined : agencyId;
    await admin.save();

    return {
        id: admin._id,
        email: admin.email,
        assignedAgencyId: admin.assignedAgencyId ?? null,
    };
};

/**
 * Permanently delete an Admin account (soft-delete).
 * Only the Account Holder who created the admin may delete it.
 */
export const deleteManager = async (
    createdByUserId: string | undefined,
    adminId: string
) => {
    if (!createdByUserId) {
        throw new CustomError(RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    }

    const admin = await User.findOne({
        _id: adminId,
        createdBy: createdByUserId as any,
        role: EUserRole.MANAGER,
        isDeleted: false,
    });

    if (!admin) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.MANAGER.NOT_FOUND);
    }

    admin.isDeleted = true;
    await admin.save();

    return { id: admin._id };
};
