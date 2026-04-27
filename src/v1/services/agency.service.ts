import Agency from '../models/agency.model';
import User from '../models/user.model';
import { CustomError } from '@/errors/custom.error';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';
import { EUserPlan } from '../enums/agency.enum';

/**
 * Create a new agency for a user
 */
export const createAgency = async (userId: string, data: any) => {
    const user = await User.findById(userId).select('plan isDeleted');
    if (!user || user.isDeleted) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.USER.NOT_FOUND);
    }

    const agencyCount = await Agency.countDocuments({ userId: userId as any });
    const maxAllowedAgencies = user.plan === EUserPlan.ENTERPRISE ? 2 : 1;

    if (agencyCount >= maxAllowedAgencies) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, MESSAGES.AGENCY.LIMIT_REACHED(maxAllowedAgencies));
    }

    const agency = await Agency.create({ ...data, userId });
    await User.findByIdAndUpdate(userId, {
        $addToSet: { agencies: agency._id },
    });

    return agency;
};

/**
 * Get agency details for a user
 */
export const getAgencyByUserId = async (userId: string) => {
    const agency = await Agency.findOne({ userId: userId as any });
    if (!agency) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
    }
    return agency;
};

/**
 * Update agency details for a user
 */
export const updateAgency = async (userId: string, data: any) => {
    const agency = await Agency.findOneAndUpdate({ userId: userId as any }, data, { new: true });
    if (!agency) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.AGENCY.NOT_FOUND);
    }
    return agency;
};
