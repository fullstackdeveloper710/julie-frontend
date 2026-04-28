import { Response, NextFunction } from 'express';
import * as response from '@/utils/response';
import Services from '../services/index';
import Validate from '@/utils/validate.util';
import Validation from '../validations/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import MESSAGES from '@/constant/message';

/**
 * @route POST /api/v1/agencies
 * @desc Create a new agency for the current user (respects plan limit).
 */
export const createAgency = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        Validate(req.body, Validation.agency.createAgencyValidation);
        const userId = req.user?.user_id;
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }

        const agency = await Services.agency.createAgency(userId, req.body);
        return response.success(req, res, agency, RESPONSE_CODES.CREATED, MESSAGES.AGENCY.CREATED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/agencies
 * @desc List all agencies belonging to the current user, plus capacity metadata.
 */
export const listMyAgencies = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }

        const [agencies, capacity] = await Promise.all([
            Services.agency.getAgenciesByUserId(userId),
            Services.agency.getAgencyCapacity(userId),
        ]);

        return response.success(
            req,
            res,
            { agencies, capacity },
            RESPONSE_CODES.OK,
            MESSAGES.AGENCY.FETCHED
        );
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/agencies/me
 * @desc Legacy single-agency lookup (kept for backwards compatibility).
 */
export const getMyAgency = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }

        const agency = await Services.agency.getAgencyByUserId(userId);
        return response.success(req, res, agency, RESPONSE_CODES.OK, MESSAGES.AGENCY.FETCHED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/agencies/:id
 * @desc Get a specific agency by id, scoped to the current user.
 */
export const getAgencyById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;
        const id = req.params.id as string;
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }
        if (!id) {
            return response.failed(req, res, RESPONSE_CODES.BAD_REQUEST, MESSAGES.COMMON.ID_REQUIRED);
        }

        const agency = await Services.agency.getAgencyByIdForUser(userId, id);
        return response.success(req, res, agency, RESPONSE_CODES.OK, MESSAGES.AGENCY.FETCHED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route PATCH /api/v1/agencies/me
 * @desc Legacy single-agency update.
 */
export const updateMyAgency = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        Validate(req.body, Validation.agency.updateAgencyValidation);
        const userId = req.user?.user_id;
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }

        const agency = await Services.agency.updateAgency(userId, req.body);
        return response.success(req, res, agency, RESPONSE_CODES.OK, MESSAGES.AGENCY.UPDATED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route PATCH /api/v1/agencies/:id
 * @desc Update a specific agency owned by the current user.
 */
export const updateAgencyById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        Validate(req.body, Validation.agency.updateAgencyValidation);
        const userId = req.user?.user_id;
        const id = req.params.id as string;
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }
        if (!id) {
            return response.failed(req, res, RESPONSE_CODES.BAD_REQUEST, MESSAGES.COMMON.ID_REQUIRED);
        }

        const agency = await Services.agency.updateAgencyById(userId, id, req.body);
        return response.success(req, res, agency, RESPONSE_CODES.OK, MESSAGES.AGENCY.UPDATED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};
