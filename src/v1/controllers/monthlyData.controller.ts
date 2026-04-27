import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';
import MonthlyData from '../models/monthlyData.model';
import { CustomError } from '@/errors/custom.error';

const NON_NEGATIVE_FIELDS = [
    'filled',
    'authorized',
    'vacancies',
    'resignations',
    'hires',
    'timeToFill',
    'leadershipVacancies',
    'leadershipTotal',
    'overtimeHours',
    'shiftLength',
    'coverageShortages',
    'mandatoryOTPercent',
    'plannedOTPercent',
    'unplannedOTPercent',
    'callIns',
    'sickLeaveDays',
    'fmla',
    'fmlaNew',
    'workersComp',
    'peerSupport',
    'incidents',
    'leadershipMorale',
    'frontlineMorale',
    'discipline',
    'grievances',
    'promotions',
] as const;

const validateMonthlyDataPayload = (payload: Record<string, unknown>) => {
    const month = payload.month;
    if (typeof month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, 'month must be in YYYY-MM format');
    }

    for (const field of NON_NEGATIVE_FIELDS) {
        const value = payload[field];
        if (typeof value === 'number' && value < 0) {
            throw new CustomError(RESPONSE_CODES.BAD_REQUEST, `${field} cannot be negative`);
        }
    }

    const lodd = payload.lodd as { count?: number } | undefined;
    if (typeof lodd?.count === 'number' && lodd.count < 0) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, 'lodd.count cannot be negative');
    }

    const plannedOTPercent = payload.plannedOTPercent;
    const unplannedOTPercent = payload.unplannedOTPercent;
    if (
        typeof plannedOTPercent === 'number' &&
        typeof unplannedOTPercent === 'number' &&
        plannedOTPercent + unplannedOTPercent !== 100
    ) {
        throw new CustomError(
            RESPONSE_CODES.BAD_REQUEST,
            'plannedOTPercent and unplannedOTPercent must add up to 100'
        );
    }

    const filled = payload.filled;
    const authorized = payload.authorized;
    if (
        typeof filled === 'number' &&
        typeof authorized === 'number' &&
        filled > authorized
    ) {
        throw new CustomError(RESPONSE_CODES.BAD_REQUEST, 'filled must not exceed authorized');
    }

    const leadershipMorale = payload.leadershipMorale;
    if (
        typeof leadershipMorale === 'number' &&
        (leadershipMorale < 1 || leadershipMorale > 10)
    ) {
        throw new CustomError(
            RESPONSE_CODES.BAD_REQUEST,
            'leadershipMorale must be between 1 and 10'
        );
    }

    const frontlineMorale = payload.frontlineMorale;
    if (
        typeof frontlineMorale === 'number' &&
        (frontlineMorale < 1 || frontlineMorale > 10)
    ) {
        throw new CustomError(
            RESPONSE_CODES.BAD_REQUEST,
            'frontlineMorale must be between 1 and 10'
        );
    }
};

/**
 * @route POST /api/v1/monthly-data
 * @desc Save monthly agency data
 */
export const saveMonthlyData = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
                data: null,
            });
        }

        const payload = {
            ...req.body,
            createdBy: userId,
        };

        validateMonthlyDataPayload(payload);

        let data;
        try {
            data = await MonthlyData.create(payload);
        } catch (error: any) {
            if (error?.code === RESPONSE_CODES.MONGO_DUPLICATE_ERROR) {
                throw new CustomError(
                    RESPONSE_CODES.CONFLICT,
                    'Monthly data already exists for this agency and month'
                );
            }

            throw error;
        }

        return res.status(RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Monthly data saved successfully',
            data,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};
