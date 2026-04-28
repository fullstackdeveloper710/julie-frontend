import joi from 'joi';
import { EAgencyType, EAgencySize } from '../enums/agency.enum.js';

export const createAgencyValidation = joi.object({
    name: joi.string().trim().min(1).max(200).required(),
    type: joi
        .string()
        .valid(...Object.values(EAgencyType))
        .required(),
    sizeCategory: joi
        .string()
        .valid(...Object.values(EAgencySize))
        .required(),
    primaryServiceJurisdiction: joi.string().trim().min(1).max(200).required(),
    coverageArea: joi.number().min(0).required(),
});

export const updateAgencyValidation = joi.object({
    name: joi.string().trim().min(1).max(200).optional(),
    type: joi
        .string()
        .valid(...Object.values(EAgencyType))
        .optional(),
    sizeCategory: joi
        .string()
        .valid(...Object.values(EAgencySize))
        .optional(),
    primaryServiceJurisdiction: joi.string().trim().min(1).max(200).optional(),
    coverageArea: joi.number().min(0).optional(),
});
