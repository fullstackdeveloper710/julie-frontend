import Agency from '../models/agency.model';
import User from '../models/user.model';
import { CustomError } from '@/errors/custom.error';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';
import { EUserPlan } from '../enums/agency.enum';

const maxAgenciesForPlan = (plan?: string): number => {
    return plan === EUserPlan.ENTERPRISE ? 2 : 1;
};

const isOwnedBy = (agencyUserId: unknown, userId: string): boolean =>
    String(agencyUserId) === String(userId);

/**
 * Create a new agency for a user, respecting per-plan limits.
 */
export const createAgency = async (userId: string, data: any) => {
    const user = await User.findById(userId).select('plan isDeleted');
    if (!user || user.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
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
 * Get the first/only agency for a user (legacy single-agency endpoint).
 */
export const getAgencyByUserId = async (userId: string) => {
    const agency = await Agency.findOne({ userId: userId as any }).sort({ createdAt: 1 });
    if (!agency) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
    }
    return agency;
};

/**
 * Return all agencies belonging to the user, ordered by creation time.
 */
export const getAgenciesByUserId = async (userId: string) => {
    return Agency.find({ userId: userId as any }).sort({ createdAt: 1 });
};

/**
 * Return one agency by id, but only if it belongs to the user.
 */
export const getAgencyByIdForUser = async (userId: string, agencyId: string) => {
    const agency = await Agency.findById(agencyId);
    if (!agency || !isOwnedBy(agency.userId, userId)) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
    }
    return agency;
};

/**
 * Legacy single-agency update — keeps PATCH /agencies/me working.
 */
export const updateAgency = async (userId: string, data: any) => {
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
 * Update a specific agency by id, restricted to the owning user.
 */
export const updateAgencyById = async (userId: string, agencyId: string, data: any) => {
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
 * Plan-aware metadata used by the frontend to drive Add Agency UI.
 */
export const getAgencyCapacity = async (userId: string) => {
    const user = await User.findById(userId).select('plan');
    const plan = user?.plan as string | undefined;
    const maxAllowed = maxAgenciesForPlan(plan);
    const used = await Agency.countDocuments({ userId: userId as any });

    return {
        plan,
        maxAllowed,
        used,
        canCreateMore: used < maxAllowed,
    };
};
