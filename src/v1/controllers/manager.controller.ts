import { Request, Response, NextFunction } from 'express';
import Services from '../services/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';

export const createManager = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, fullName } = req.body;
        // prefer authenticated user id if available
        const createdBy = (req as any).user?.user_id || req.body.createdBy;

        const result = await Services.auth.createManager(createdBy, { email, fullName });

        return res.status(RESPONSE_CODES.CREATED).json({
            success: true,
            message: 'Manager created and invite sent',
            data: result,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export default {
    createManager,
};
