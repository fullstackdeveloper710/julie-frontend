import AnnualCheckin from '../models/annualCheckin.model';
import { CustomError } from '@/errors/custom.error';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';
import { IAnnualCheckinInput, IAnnualCheckinStatus } from '../types/annualCheckin.type';

/** Maximum number of post-submission edits allowed per year. */
export const MAX_ANNUAL_EDITS = 2;

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
        editCount: 0,
    });
};

export const getAnnualCheckinsByUserId = async (userId: string) => {
    return await AnnualCheckin.find({ userId: userId as any }).sort({ baselineYear: -1 });
};

export const getCurrentAnnualCheckin = async (userId: string) => {
    return await AnnualCheckin.findOne({ userId: userId as any }).sort({ baselineYear: -1 });
};

/**
 * Returns the submission/edit status for the current calendar year.
 * Drives the UI gate: form visible only when canSubmit, edit button visible
 * only when canEdit.
 */
export const getAnnualCheckinStatus = async (userId: string): Promise<IAnnualCheckinStatus> => {
    const currentYear = normalizeToYear();
    const checkin = await AnnualCheckin.findOne({
        userId: userId as any,
        baselineYear: currentYear,
    }).select('_id editCount');

    if (!checkin) {
        return {
            hasCurrentYearCheckin: false,
            currentCheckinId: null,
            editCount: 0,
            canEdit: false,
            canSubmit: true,
            maxEdits: MAX_ANNUAL_EDITS,
        };
    }

    const editCount = checkin.editCount ?? 0;
    return {
        hasCurrentYearCheckin: true,
        currentCheckinId: String(checkin._id),
        editCount,
        canEdit: editCount < MAX_ANNUAL_EDITS,
        canSubmit: false,
        maxEdits: MAX_ANNUAL_EDITS,
    };
};

export const updateAnnualCheckin = async (
    id: string,
    userId: string,
    data: Partial<IAnnualCheckinInput>
) => {
    const existing = await AnnualCheckin.findOne({ _id: id as any, userId: userId as any });
    if (!existing) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.ANNUAL_CHECKIN.NOT_FOUND);
    }

    const editCount = existing.editCount ?? 0;
    if (editCount >= MAX_ANNUAL_EDITS) {
        throw new CustomError(
            RESPONSE_CODES.BAD_REQUEST,
            MESSAGES.ANNUAL_CHECKIN.EDIT_LIMIT_REACHED(MAX_ANNUAL_EDITS)
        );
    }

    const updates: Record<string, unknown> = { ...data };

    if (updates.baselineYear) {
        updates.baselineYear = normalizeToYear(updates.baselineYear as Date | string);
    }

    if (updates.goalsAndStrategicDirection) {
        updates.goalsAndStrategicDirection = sanitizeGoals(
            updates.goalsAndStrategicDirection as IAnnualCheckinInput['goalsAndStrategicDirection']
        );
    }

    updates.editCount = editCount + 1;

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
