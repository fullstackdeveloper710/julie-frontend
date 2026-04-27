import { Response, NextFunction } from 'express';
import Services from '../services/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import MESSAGES from '@/constant/message';

/**
 * @route GET /api/v1/subscriptions/me
 * @desc Fetch current user's subscription details
 */
export const getMySubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const subscription = await Services.subscription.getSubscriptionByUserId(userId);
        
        if (!subscription) {
            return res.status(RESPONSE_CODES.OK).json({
                success: true,
                message: 'No active subscription found',
                data: null,
            });
        }

        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: 'Subscription details fetched successfully',
            data: subscription,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};
