import { Response, NextFunction } from 'express';
import Services from '../services/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';
import * as response from '@/utils/response';
import { AuthenticatedRequest } from '@/middlewares/authenticate';

export const createManager = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, fullName, title } = req.body ?? {};
        const createdBy = req.user?.user_id;

        const result = await Services.auth.createManager(createdBy, {
            email,
            fullName,
            title,
        });

        return response.success(req, res, result, RESPONSE_CODES.CREATED, MESSAGES.MANAGER.CREATED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export const listManagers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const createdBy = req.user?.user_id;
        const result = await Services.auth.listManagers(createdBy);
        return response.success(req, res, result, RESPONSE_CODES.OK, MESSAGES.MANAGER.FETCHED);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export default {
    createManager,
    listManagers,
};
