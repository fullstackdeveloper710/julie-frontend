import joi from 'joi';
import { EReportType } from '../enums/report.enum.js';

export const createReportValidation = joi.object({
    title: joi.string().required(),
    content: joi.string().required(),
    type: joi.string().valid(...Object.values(EReportType)),
    metadata: joi.object(),
});

export const updateReportValidation = joi.object({
    title: joi.string(),
    content: joi.string(),
    type: joi.string().valid(...Object.values(EReportType)),
    metadata: joi.object(),
});
