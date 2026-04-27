import MonthlyCheckin from '../models/checkin.model';
import { CustomError } from '@/errors/custom.error';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';
import { IMonthlyCheckinInput } from '../types/checkin.type';

const normalizeToMonth = (date?: Date | string) => {
    const d = date ? new Date(date) : new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
};

const sanitizeOptional = (optional?: IMonthlyCheckinInput['optional']) => {
    if (!optional) return undefined;

    const cleaned: NonNullable<IMonthlyCheckinInput['optional']> = {};

    if (optional.budgetAndFiscalContext) {
        cleaned.budgetAndFiscalContext = optional.budgetAndFiscalContext;
    }
    if (optional.operationalDemandContext) {
        cleaned.operationalDemandContext = optional.operationalDemandContext;
    }
    if (optional.fatiguePrecisionInputs) {
        cleaned.fatiguePrecisionInputs = optional.fatiguePrecisionInputs;
    }
    if (optional.peerSupportDepthInputs) {
        const depth = { ...optional.peerSupportDepthInputs };
        if (depth.topLeadershipConcern !== 'Other') {
            delete depth.topLeadershipConcernOther;
        }
        cleaned.peerSupportDepthInputs = depth;
    }

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};

export const createCheckin = async (userId: string, data: IMonthlyCheckinInput) => {
    const checkinMonth = normalizeToMonth(data.checkinMonth);

    const existingCheckin = await MonthlyCheckin.findOne({
        userId: userId as any,
        checkinMonth,
    });

    if (existingCheckin) {
        throw new CustomError(RESPONSE_CODES.CONFLICT, MESSAGES.CHECKIN.ALREADY_EXISTS);
    }

    const payload = {
        userId,
        checkinMonth,
        organizationalStability: data.organizationalStability,
        operationalResilience: data.operationalResilience,
        fatigueResistance: data.fatigueResistance,
        peerSupportReadiness: data.peerSupportReadiness,
        leadershipSustainability: data.leadershipSustainability,
        dataConfidence: data.dataConfidence,
        optional: sanitizeOptional(data.optional),
    };

    return await MonthlyCheckin.create(payload);
};

export const getCheckinsByUserId = async (userId: string) => {
    return await MonthlyCheckin.find({ userId: userId as any }).sort({ checkinMonth: -1 });
};

export const updateCheckin = async (
    checkinId: string,
    userId: string,
    data: Partial<IMonthlyCheckinInput>
) => {
    const updates: Record<string, unknown> = { ...data };

    if (updates.checkinMonth) {
        updates.checkinMonth = normalizeToMonth(updates.checkinMonth as Date | string);
    }

    if (updates.optional !== undefined) {
        updates.optional = sanitizeOptional(updates.optional as IMonthlyCheckinInput['optional']);
    }

    const checkin = await MonthlyCheckin.findOneAndUpdate(
        { _id: checkinId as any, userId: userId as any },
        updates,
        { new: true, runValidators: true }
    );

    if (!checkin) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.COMMON.NOT_FOUND);
    }
    return checkin;
};
