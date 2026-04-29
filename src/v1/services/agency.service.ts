import Agency from '../models/agency.model';
import User from '../models/user.model';
import { CustomError } from '@/errors/custom.error';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';
import { EUserPlan, EUserRole } from '../enums/agency.enum';

const maxAgenciesForPlan = (plan?: string): number => {
    return plan === EUserPlan.ENTERPRISE ? 2 : 1;
};

const isOwnedBy = (agencyUserId: unknown, userId: string): boolean =>
    String(agencyUserId) === String(userId);

type ResolvedOwner = {
    ownerId: string;
    isAdmin: boolean;
    selfPlan?: string;
    /** Set for admin callers: the single agency they may access. null = no agency assigned. */
    assignedAgencyId: string | null;
};

/**
 * Resolve the user id whose agencies the caller actually sees. For
 * Account Holders that's themselves; for Admins (role=manager) it's the
 * Account Holder who invited them. When the admin has an assignedAgencyId
 * set, agency queries will be further scoped to just that one agency.
 */
const resolveOwner = async (userId: string): Promise<ResolvedOwner> => {
    const user = await User.findById(userId).select('plan role createdBy assignedAgencyId isDeleted');
    if (!user || user.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }

    const isAdmin = user.role === EUserRole.MANAGER;
    if (!isAdmin) {
        return { ownerId: String(user._id), isAdmin: false, selfPlan: user.plan, assignedAgencyId: null };
    }

    if (!user.createdBy) {
        throw new CustomError(
            RESPONSE_CODES.NOT_FOUND,
            'No Account Holder is linked to this admin'
        );
    }

    const accountHolder = await User.findById(user.createdBy).select('plan isDeleted');
    if (!accountHolder || accountHolder.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, 'Account Holder not found');
    }

    const assignedAgencyId = user.assignedAgencyId ? String(user.assignedAgencyId) : null;
    return { ownerId: String(accountHolder._id), isAdmin: true, selfPlan: accountHolder.plan, assignedAgencyId };
};

/**
 * Create a new agency for the caller. Admins inherit their Account Holder's
 * agencies and cannot create their own.
 */
export const createAgency = async (userId: string, data: any) => {
    const user = await User.findById(userId).select('plan role isDeleted');
    if (!user || user.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }
    if (user.role === EUserRole.MANAGER) {
        throw new CustomError(
            RESPONSE_CODES.FORBIDDEN,
            'Admins use the Account Holder\'s agency and cannot create new ones'
        );
    }

    const agencyCount = await Agency.countDocuments({ userId: userId as any });
    const maxAllowed = maxAgenciesForPlan(user.plan);

    if (agencyCount >= maxAllowed) {
        throw new CustomError(
            RESPONSE_CODES.BAD_REQUEST,
            MESSAGES.AGENCY.LIMIT_REACHED(maxAllowed)
        );
    }

    try {
        const agency = await Agency.create({ ...data, userId });
        await User.findByIdAndUpdate(userId, {
            $addToSet: { agencies: agency._id },
        });
        return agency;
    } catch (error: any) {
        if (error?.code === RESPONSE_CODES.MONGO_DUPLICATE_ERROR) {
            throw new CustomError(
                RESPONSE_CODES.CONFLICT,
                'An agency with that name already exists for your account'
            );
        }
        throw error;
    }
};

/**
 * Get the first/only agency in the caller's effective scope. For admins
 * with an assignedAgencyId, that specific agency is returned.
 */
export const getAgencyByUserId = async (userId: string) => {
    const { ownerId, isAdmin, assignedAgencyId } = await resolveOwner(userId);

    if (isAdmin && assignedAgencyId) {
        const agency = await Agency.findOne({ _id: assignedAgencyId as any, userId: ownerId as any });
        if (!agency) throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
        return agency;
    }

    const agency = await Agency.findOne({ userId: ownerId as any }).sort({ createdAt: 1 });
    if (!agency) throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
    return agency;
};

/**
 * All agencies in the caller's effective scope. For admins with an
 * assignedAgencyId, only that one agency is returned.
 */
export const getAgenciesByUserId = async (userId: string) => {
    const { ownerId, isAdmin, assignedAgencyId } = await resolveOwner(userId);

    if (isAdmin && assignedAgencyId) {
        return Agency.find({ _id: assignedAgencyId as any, userId: ownerId as any });
    }

    return Agency.find({ userId: ownerId as any }).sort({ createdAt: 1 });
};

/**
 * One agency by id, restricted to the caller's effective scope.
 * Admins with an assignedAgencyId may only access that specific agency.
 */
export const getAgencyByIdForUser = async (userId: string, agencyId: string) => {
    const { ownerId, isAdmin, assignedAgencyId } = await resolveOwner(userId);

    // Admin restricted to a specific agency cannot access any other
    if (isAdmin && assignedAgencyId && assignedAgencyId !== agencyId) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
    }

    const agency = await Agency.findById(agencyId);
    if (!agency || !isOwnedBy(agency.userId, ownerId)) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
    }
    return agency;
};

/**
 * Legacy single-agency update — Account Holders only.
 */
export const updateAgency = async (userId: string, data: any) => {
    const user = await User.findById(userId).select('role isDeleted');
    if (!user || user.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }
    if (user.role === EUserRole.MANAGER) {
        throw new CustomError(
            RESPONSE_CODES.FORBIDDEN,
            'Admins cannot modify agency details'
        );
    }

    const agency = await Agency.findOneAndUpdate(
        { userId: userId as any },
        data,
        { new: true, runValidators: true }
    );
    if (!agency) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
    }
    return agency;
};

/**
 * Update a specific agency by id — Account Holders only, scoped to ownership.
 */
export const updateAgencyById = async (userId: string, agencyId: string, data: any) => {
    const user = await User.findById(userId).select('role isDeleted');
    if (!user || user.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }
    if (user.role === EUserRole.MANAGER) {
        throw new CustomError(
            RESPONSE_CODES.FORBIDDEN,
            'Admins cannot modify agency details'
        );
    }

    try {
        const agency = await Agency.findOneAndUpdate(
            { _id: agencyId as any, userId: userId as any },
            data,
            { new: true, runValidators: true }
        );
        if (!agency) {
            throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
        }
        return agency;
    } catch (error: any) {
        if (error?.code === RESPONSE_CODES.MONGO_DUPLICATE_ERROR) {
            throw new CustomError(
                RESPONSE_CODES.CONFLICT,
                'An agency with that name already exists for your account'
            );
        }
        throw error;
    }
};

/**
 * Plan-aware metadata used by the frontend to drive Add Agency UI. Admins
 * always get `canCreateMore: false` (they don't own seats).
 */
export const getAgencyCapacity = async (userId: string) => {
    const { ownerId, isAdmin, selfPlan, assignedAgencyId } = await resolveOwner(userId);
    const plan = selfPlan;
    const maxAllowed = isAdmin ? 0 : maxAgenciesForPlan(plan);
    const used = await Agency.countDocuments({ userId: ownerId as any });

    return {
        plan,
        maxAllowed,
        used,
        canCreateMore: !isAdmin && used < maxAllowed,
    };
};
