import { EReportType } from "../enums/report.enum.js";

export type TReportInput = {
    title: string;
    content: string;
    type?: EReportType;
    metadata?: Record<string, any>;
};

export type TReport = TReportInput & {
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};
