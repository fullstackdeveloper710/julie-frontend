import Report from '../models/report.model';
import { CustomError } from '@/errors/custom.error';
import RESPONSE_CODES from '@/constant/responseCode';
import MESSAGES from '@/constant/message';

/**
 * Create a new report
 */
export const createReport = async (userId: string, data: any) => {
    return await Report.create({ ...data, userId });
};

/**
 * Get all reports for the authenticated user
 */
export const getReportsByUserId = async (userId: string) => {
    return await Report.find({ userId: userId as any }).sort({ createdAt: -1 });
};

/**
 * Get a specific report by ID
 */
export const getReportById = async (reportId: string, userId: string) => {
    const report = await Report.findOne({ _id: reportId as any, userId: userId as any });
    if (!report) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.REPORT.NOT_FOUND);
    }
    return report;
};

/**
 * Update a report
 */
export const updateReport = async (reportId: string, userId: string, data: any) => {
    const report = await Report.findOneAndUpdate(
        { _id: reportId as any, userId: userId as any },
        data,
        { new: true }
    );
    if (!report) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.REPORT.NOT_FOUND);
    }
    return report;
};

/**
 * Delete a report
 */
export const deleteReport = async (reportId: string, userId: string) => {
    const result = await Report.findOneAndDelete({ _id: reportId as any, userId: userId as any });
    if (!result) {
        throw new CustomError(RESPONSE_CODES.NOT_FOUND, MESSAGES.REPORT.NOT_FOUND);
    }
    return result;
};
