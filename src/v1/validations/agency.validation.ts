import joi from 'joi';
import { EAgencyType, EAgencySize } from '../enums/agency.enum.js';

const billingSchema = joi
    .object({
        cardholderName: joi.string().trim().max(200).allow('').optional(),
        cardLast4: joi.string().trim().pattern(/^\d{4}$/).allow('').optional().messages({
            'string.pattern.base': 'cardLast4 must be exactly 4 digits',
        }),
        cardBrand: joi.string().trim().max(50).allow('').optional(),
        expMonth: joi.number().integer().min(1).max(12).optional(),
        expYear: joi
            .number()
            .integer()
            .min(new Date().getFullYear())
            .max(2100)
            .optional(),
        postalCode: joi.string().trim().max(20).allow('').optional(),
        billingEmail: joi.string().email().lowercase().max(200).allow('').optional(),
    })
    .optional();

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
    billing: billingSchema,
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
    billing: billingSchema,
});
