import joi from 'joi';
import { EAgencyType, EAgencySize } from '../enums/agency.enum.js';

export const createAgencyValidation = joi.object({
    name: joi.string().required(),
    type: joi.string().valid(...Object.values(EAgencyType)).required(),
    sizeCategory: joi.string().valid(...Object.values(EAgencySize)).required(),
    primaryServiceJurisdiction: joi.string().required(),
    coverageArea: joi.number().precision(2).required(),
});

export const updateAgencyValidation = joi.object({
    name: joi.string(),
    type: joi.string().valid(...Object.values(EAgencyType)),
    sizeCategory: joi.string().valid(...Object.values(EAgencySize)),
    primaryServiceJurisdiction: joi.string().required(),
    coverageArea: joi.number().precision(2).required(),
});
