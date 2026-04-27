import { Response, NextFunction } from 'express';
import Services from '../services/index';
import Validate from '@/utils/validate.util';
import Validation from '../validations/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import MESSAGES from '@/constant/message';

/**
 * @route POST /api/v1/reports
 * @desc Create a new report
 */
export const createReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.report.createReportValidation);
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const report = await Services.report.createReport(userId, req.body);
        return res.status(RESPONSE_CODES.CREATED).json({
            success: true,
            message: MESSAGES.REPORT.CREATED,
            data: report,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/reports/me
 * @desc Fetch all reports for the current user
 */
export const getMyReports = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const reports = await Services.report.getReportsByUserId(userId);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.REPORT.FETCHED,
            data: reports,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route PATCH /api/v1/reports/:id
 * @desc Update a specific report
 */
export const updateReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.report.updateReportValidation);
        const userId = req.user?.user_id;
        const id = req.params.id as string;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const report = await Services.report.updateReport(id, userId, req.body);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.REPORT.UPDATED,
            data: report,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route DELETE /api/v1/reports/:id
 * @desc Delete a specific report
 */
export const deleteReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        const id = req.params.id as string;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        await Services.report.deleteReport(id, userId);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.REPORT.DELETED,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};
