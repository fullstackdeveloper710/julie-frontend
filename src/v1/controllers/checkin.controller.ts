
import * as response from '@/utils/response';
import { Response, NextFunction } from 'express';
import Services from '../services/index';
import Validate from '@/utils/validate.util';
import Validation from '../validations/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import MESSAGES from '@/constant/message';

/**
 * @route POST /api/v1/checkins
 * @desc Submit a new monthly check-in
 */
export const createCheckin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.checkin.createCheckinValidation);
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const checkin = await Services.checkin.createCheckin(userId, req.body);
       return response.success(req, res, checkin, RESPONSE_CODES.CREATED, MESSAGES.CHECKIN.CREATED);
        
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/checkins/me
 * @desc Fetch all check-ins for the current user
 */
export const getMyCheckins = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return response.failed(req, res, RESPONSE_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
        }

        const checkins = await Services.checkin.getCheckinsByUserId(userId);
        
       return response.success(req, res, checkins, RESPONSE_CODES.OK, MESSAGES.CHECKIN.FETCHED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route PATCH /api/v1/checkins/:id
 * @desc Update a specific check-in
 */
export const updateCheckin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.checkin.updateCheckinValidation);
        const userId = req.user?.user_id;
        const id = req.params.id as string;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const checkin = await Services.checkin.updateCheckin(id, userId, req.body);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.CHECKIN.UPDATED,
            data: checkin,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};
