import { Response, NextFunction, Request } from 'express';
import Services from '../services/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';

/**
 * @route GET /api/v1/pricing
 * @desc Return backend-driven pricing plans and live Founding availability.
 */
export const getPricingPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pricing = await Services.pricing.getPricingPlans();
        return res.status(RESPONSE_CODES.OK).json(pricing);
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};