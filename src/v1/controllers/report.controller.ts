import { Response, NextFunction } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import Services from '../services/index';
import Validate from '@/utils/validate.util';
import Validation from '../validations/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import MESSAGES from '@/constant/message';
import { EReportType } from '../enums/report.enum';

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

export const generateAIReport = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const { title, type, parameters } = req.body ?? {};
        if (!title || !type || !parameters) {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'title, type, and parameters are required',
            });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'ANTHROPIC_API_KEY is not configured',
            });
        }

        const client = new Anthropic({ apiKey });
        const prompt = buildReportPrompt(type, parameters);
        const message = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2048,
            messages: [{ role: 'user', content: prompt }],
        });

        const content =
            message.content[0]?.type === 'text'
                ? message.content[0].text
                : 'Unable to generate report';

        const report = await Services.report.createReport(userId, {
            title,
            content,
            type: resolveReportType(type),
            metadata: parameters,
        });

        return res.status(RESPONSE_CODES.CREATED).json({
            success: true,
            message: MESSAGES.REPORT.CREATED,
            data: report,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

const resolveReportType = (type: string): EReportType => {
    if (type === EReportType.Scenario) {
        return EReportType.Scenario;
    }

    if (type === EReportType.Analytics) {
        return EReportType.Analytics;
    }

    return EReportType.Custom;
};

const buildReportPrompt = (type: string, parameters: Record<string, unknown>): string => {
    if (type === EReportType.Scenario) {
        const { scenario = 'Default Scenario', baselineMetrics = {}, ...rest } = parameters;
        return `Generate a detailed scenario modeling report for the following workforce scenario:\n\nScenario Name: ${scenario}\nScenario Parameters: ${JSON.stringify(rest, null, 2)}\nBaseline Metrics: ${JSON.stringify(baselineMetrics, null, 2)}\n\nPlease provide:\n1. Scenario Description\n2. Expected Impact Analysis\n3. Workforce Adjustments Needed\n4. Resource Allocation Recommendations\n5. Risk Assessment\n6. Implementation Timeline\n7. Success Metrics\n\nUse professional language and format the report in markdown with clear sections and bullet points.`;
    }

    const { startDate = '', endDate = '', region = 'All', category = 'All', metrics = {} } = parameters;
    return `Generate a professional analytics report based on the following workforce data:\n\nPeriod: ${startDate} to ${endDate}\nRegion: ${region}\nCategory: ${category}\nData: ${JSON.stringify(metrics, null, 2)}\n\nPlease provide:\n1. Executive Summary (2-3 paragraphs)\n2. Key Metrics Analysis\n3. Trends and Insights\n4. Recommendations\n5. Conclusion\n\nUse professional language and format the report in markdown.`;
};
