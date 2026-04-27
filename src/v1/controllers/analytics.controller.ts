import { Response, NextFunction } from 'express';
import Services from '../services/index';
import Validate from '@/utils/validate.util';
import Validation from '../validations/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import MESSAGES from '@/constant/message';

/**
 * @route POST /api/v1/analytics
 * @desc Log new analytics data point
 */
export const addAnalyticsData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.analytics.createAnalyticsValidation);
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const analytics = await Services.analytics.createAnalytics(userId, req.body);
        return res.status(RESPONSE_CODES.CREATED).json({
            success: true,
            message: MESSAGES.ANALYTICS.ADDED,
            data: analytics,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/analytics/me
 * @desc Fetch analytics history for current user
 */
export const getMyAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const analytics = await Services.analytics.getAnalyticsByUserId(userId);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.ANALYTICS.FETCHED,
            data: analytics,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};
