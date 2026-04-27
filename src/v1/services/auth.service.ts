import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateAuthTokens } from '../../utils/jwt.util.js';
import MESSAGES from '../../constant/message.js';
import RESPONSE_CODES from '../../constant/responseCode.js';
import { CustomError } from '../../errors/custom.error.js';
import { generateToken } from '../../utils/random.util.js';
import { sendVerificationEmail, sendManagerInviteEmail } from '../../email/auth.email.js';
import crypto from 'crypto';
import Agency from '../models/agency.model.js';
import { EUserRole, EUserPlan } from '../enums/agency.enum.js';
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
 * Verify user email via Link and log them in
 */
export const verifyEmail = async (token: string, redirectTo: string) => {
    // Find user by token and ensure token hasn't expired
    const user = await User.findOne({
        verificationToken: token,
        verificationExpires: { $gt: new Date() },
        isDeleted: false,
    });

    if (!user) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, 'Invalid or expired verification token');
    }

    // Update user status
    user.isConfirmed = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    // Generate tokens for direct login
    const tokens = generateAuthTokens({
        user_id: user._id.toString(),
    });

    // Construct redirect URL with tokens
    const redirectUrl = new URL(redirectTo);
    redirectUrl.searchParams.append('access_token', tokens.access_token.token);
    redirectUrl.searchParams.append('refresh_token', tokens.refresh_token.token);
    redirectUrl.searchParams.append('type', 'signup');

    return redirectUrl.toString();
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
 * Get user profile by ID
 */
export const getProfile = async (userId: string) => {
    const user = await User.findById(userId).select('email fullName plan agencies createdAt isDeleted');
    if (!user || user.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }

    const showAgencyModal = (user?.agencies?.length || 0) === 0;

    return {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        plan: user.plan,
        agencies: user.agencies,
        createdAt: user.createdAt,
        showAgencyModal,
    };
};

/**
 * Create manager user (invite) and send verification + temp password
 */
export const createManager = async (createdByUserId: string | undefined, data: { email: string; fullName?: string }) => {
    const { email, fullName } = data;

    // Validate creator
    let creatorPlan: EUserPlan = EUserPlan.STANDARD;
    if (createdByUserId) {
        try {
            const creator = await User.findById(createdByUserId).select('plan');
            if (creator && creator.plan) creatorPlan = creator.plan as EUserPlan;
        } catch (e) { }
    }

    // check existing user
    const existing = await User.findOne({ email, isDeleted: false });
    if (existing) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
    }

    // generate temp password and verification token
    const tempPassword = crypto.randomBytes(6).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);
    const verificationToken = generateToken();
    const verificationExpires = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const newUser = await User.create({
        email,
        password: passwordHash,
        fullName: fullName || '',
        isConfirmed: false,
        verificationToken,
        verificationExpires,
        plan: creatorPlan,
        role: EUserRole.MANAGER,
    });

    // send invite email with verification link + temp password
    await sendManagerInviteEmail(email, verificationToken, tempPassword);

    return {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
    };
};
