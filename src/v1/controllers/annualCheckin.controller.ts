import * as response from '@/utils/response';
import { Response, NextFunction } from 'express';
import Services from '../services/index';
import Validate from '@/utils/validate.util';
import Validation from '../validations/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import MESSAGES from '@/constant/message';
import User from '../models/user.model';
import { EUserRole } from '../enums/agency.enum';

/**
 * Resolves the effective userId for Annual Baseline queries.
 * Managers (admin seats) have read-only access and should see the primary
 * user's baseline — found via the `createdBy` field on the manager's record.
 * Returns null if the primary user cannot be resolved.
 */
const resolveEffectiveUserId = async (requestingUserId: string, role: string): Promise<string | null> => {
    if (role !== EUserRole.MANAGER) return requestingUserId;

    const manager = await User.findById(requestingUserId).select('createdBy').lean();
    if (!manager?.createdBy) return null;
    return manager.createdBy.toString();
};

/**
 * @route GET /api/v1/annual-checkins/status
 * @desc Returns whether the user can submit or edit this year's annual check-in.
 */
export const getAnnualCheckinStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;
        const role = req.user?.role ?? '';
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }

        // Admin users get a read-only status — resolve the primary user's data
        if (role === EUserRole.MANAGER) {
            const primaryUserId = await resolveEffectiveUserId(userId, role);
            const primaryStatus = primaryUserId
                ? await Services.annualCheckin.getAnnualCheckinStatus(primaryUserId)
                : null;

            return response.success(req, res, {
                ...(primaryStatus ?? {
                    hasCurrentYearCheckin: false,
                    currentCheckinId: null,
                    editCount: 0,
                    maxEdits: 2,
                }),
                canSubmit: false,
                canEdit: false,
                isReadOnly: true,
            }, RESPONSE_CODES.OK, MESSAGES.ANNUAL_CHECKIN.STATUS_FETCHED);
        }

        const status = await Services.annualCheckin.getAnnualCheckinStatus(userId);
        return response.success(req, res, status, RESPONSE_CODES.OK, MESSAGES.ANNUAL_CHECKIN.STATUS_FETCHED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route POST /api/v1/annual-checkins
 * @desc Submit a new annual check-in baseline
 */
export const createAnnualCheckin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;
        const role = req.user?.role ?? '';
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }
        if (role === EUserRole.MANAGER) {
            return response.failed(req, res, RESPONSE_CODES.FORBIDDEN, MESSAGES.ANNUAL_CHECKIN.READ_ONLY_ACCESS);
        }

        Validate(req.body, Validation.annualCheckin.createAnnualCheckinValidation);
        const checkin = await Services.annualCheckin.createAnnualCheckin(userId, req.body);
        return response.success(
            req,
            res,
            checkin,
            RESPONSE_CODES.CREATED,
            MESSAGES.ANNUAL_CHECKIN.CREATED
        );
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/annual-checkins/me
 * @desc Fetch all annual check-ins for the current user
 */
export const getMyAnnualCheckins = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;
        const role = req.user?.role ?? '';
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }

        const effectiveUserId = await resolveEffectiveUserId(userId, role);
        if (!effectiveUserId) {
            return response.success(req, res, [], RESPONSE_CODES.OK, MESSAGES.ANNUAL_CHECKIN.FETCHED);
        }

        const checkins = await Services.annualCheckin.getAnnualCheckinsByUserId(effectiveUserId);
        return response.success(
            req,
            res,
            checkins,
            RESPONSE_CODES.OK,
            MESSAGES.ANNUAL_CHECKIN.FETCHED
        );
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/annual-checkins/current
 * @desc Fetch the most recent annual check-in for the current user
 */
export const getCurrentAnnualCheckin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;
        const role = req.user?.role ?? '';
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }

        const effectiveUserId = await resolveEffectiveUserId(userId, role);
        if (!effectiveUserId) {
            return response.success(req, res, null, RESPONSE_CODES.OK, MESSAGES.ANNUAL_CHECKIN.FETCHED);
        }

        const checkin = await Services.annualCheckin.getCurrentAnnualCheckin(effectiveUserId);
        return response.success(
            req,
            res,
            checkin,
            RESPONSE_CODES.OK,
            MESSAGES.ANNUAL_CHECKIN.FETCHED
        );
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route PATCH /api/v1/annual-checkins/:id
 * @desc Update a specific annual check-in
 */
export const updateAnnualCheckin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;
        const role = req.user?.role ?? '';
        const id = req.params.id as string;
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }
        if (role === EUserRole.MANAGER) {
            return response.failed(req, res, RESPONSE_CODES.FORBIDDEN, MESSAGES.ANNUAL_CHECKIN.READ_ONLY_ACCESS);
        }
        if (!id) {
            return response.failed(req, res, RESPONSE_CODES.BAD_REQUEST, MESSAGES.COMMON.ID_REQUIRED);
        }

        Validate(req.body, Validation.annualCheckin.updateAnnualCheckinValidation);
        const checkin = await Services.annualCheckin.updateAnnualCheckin(id, userId, req.body);
        return response.success(
            req,
            res,
            checkin,
            RESPONSE_CODES.OK,
            MESSAGES.ANNUAL_CHECKIN.UPDATED
        );
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};
