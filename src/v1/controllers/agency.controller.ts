import { Response, NextFunction } from 'express';
import Services from '../services/index';
import Validate from '@/utils/validate.util';
import Validation from '../validations/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import MESSAGES from '@/constant/message';

/**
 * @route POST /api/v1/agencies
 * @desc Create a new agency association for current user
 */
export const createAgency = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.agency.createAgencyValidation);
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const agency = await Services.agency.createAgency(userId, req.body);
        return res.status(RESPONSE_CODES.CREATED).json({
            success: true,
            message: MESSAGES.AGENCY.CREATED,
            data: agency,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/agencies/me
 * @desc Fetch current user's agency details
 */
export const getMyAgency = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const agency = await Services.agency.getAgencyByUserId(userId);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.AGENCY.FETCHED,
            data: agency,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route PATCH /api/v1/agencies/me
 * @desc Update current user's agency details
 */
export const updateMyAgency = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.agency.updateAgencyValidation);
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const agency = await Services.agency.updateAgency(userId, req.body);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.AGENCY.UPDATED,
            data: agency,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};
