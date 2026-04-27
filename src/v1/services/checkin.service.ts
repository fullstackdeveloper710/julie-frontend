import MonthlyCheckin from '../models/checkin.model';
import { CustomError } from '@/errors/custom.error';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';

/**
 * Helper to normalize date to the first of the month
 */
const normalizeToMonth = (date?: Date | string) => {
    const d = date ? new Date(date) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
};

/**
 * Submit a new monthly check-in
 */
export const createCheckin = async (userId: string, data: any) => {
    const checkinMonth = normalizeToMonth(data.checkinMonth);

    // Check if a check-in already exists for this month
    const existingCheckin = await MonthlyCheckin.findOne({
        userId: userId as any,
        checkinMonth
    });

    if (existingCheckin) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, MESSAGES.CHECKIN.ALREADY_EXISTS);
    }

    return await MonthlyCheckin.create({
        ...data,
        userId,
        checkinMonth
    });
};

/**
 * Get all monthly check-ins for the user
 */
export const getCheckinsByUserId = async (userId: string) => {
    return await MonthlyCheckin.find({ userId: userId as any }).sort({ checkinMonth: -1 });
};

/**
 * Update an existing monthly check-in
 */
export const updateCheckin = async (checkinId: string, userId: string, data: any) => {
    // If checkinMonth is being updated, normalize it
    if (data.checkinMonth) {
        data.checkinMonth = normalizeToMonth(data.checkinMonth);
    }

    const checkin = await MonthlyCheckin.findOneAndUpdate(
        { _id: checkinId as any, userId: userId as any },
        data,
        { new: true }
    );

    if (!checkin) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.COMMON.NOT_FOUND);
    }
    return checkin;
};
