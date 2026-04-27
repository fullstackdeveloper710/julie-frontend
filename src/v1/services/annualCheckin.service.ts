import AnnualCheckin from '../models/annualCheckin.model';
import { CustomError } from '@/errors/custom.error';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';
import { IAnnualCheckinInput } from '../types/annualCheckin.type';

const normalizeToYear = (date?: Date | string) => {
    const d = date ? new Date(date) : new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
};

const sanitizeGoals = (goals: IAnnualCheckinInput['goalsAndStrategicDirection']) => {
    const cleaned = { ...goals };
    (
        ['goal1TargetMetric', 'goal2SecondaryAnnualGoal', 'goal2TargetMetric'] as const
    ).forEach((key) => {
        const value = cleaned[key];
        if (typeof value === 'string' && value.trim() === '') {
            delete cleaned[key];
        }
    });
    if (!cleaned.goal2Timeframe) {
        delete cleaned.goal2Timeframe;
    }
    return cleaned;
};

export const createAnnualCheckin = async (userId: string, data: IAnnualCheckinInput) => {
    const baselineYear = normalizeToYear(data.baselineYear);

    const existing = await AnnualCheckin.findOne({
        userId: userId as any,
        baselineYear,
    });

    if (existing) {
        throw new CustomError(
            RESPONSE_CODES.CONFLICT,
            MESSAGES.ANNUAL_CHECKIN.ALREADY_EXISTS
        );
    }

    return await AnnualCheckin.create({
        userId,
        baselineYear,
        agencyIdentity: data.agencyIdentity,
        structuralStaffingProfile: data.structuralStaffingProfile,
        operationalInfrastructure: data.operationalInfrastructure,
        goalsAndStrategicDirection: sanitizeGoals(data.goalsAndStrategicDirection),
    });
};

export const getAnnualCheckinsByUserId = async (userId: string) => {
    return await AnnualCheckin.find({ userId: userId as any }).sort({ baselineYear: -1 });
};

export const getCurrentAnnualCheckin = async (userId: string) => {
    return await AnnualCheckin.findOne({ userId: userId as any }).sort({ baselineYear: -1 });
};

export const updateAnnualCheckin = async (
    id: string,
    userId: string,
    data: Partial<IAnnualCheckinInput>
) => {
    const updates: Record<string, unknown> = { ...data };

    if (updates.baselineYear) {
        updates.baselineYear = normalizeToYear(updates.baselineYear as Date | string);
    }

    if (updates.goalsAndStrategicDirection) {
        updates.goalsAndStrategicDirection = sanitizeGoals(
            updates.goalsAndStrategicDirection as IAnnualCheckinInput['goalsAndStrategicDirection']
        );
    }

    const checkin = await AnnualCheckin.findOneAndUpdate(
        { _id: id as any, userId: userId as any },
        updates,
        { new: true, runValidators: true }
    );

    if (!checkin) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.ANNUAL_CHECKIN.NOT_FOUND);
    }
    return checkin;
};
