import joi from 'joi';

export const createAnalyticsValidation = joi.object({
    date: joi.string().required(),
    category: joi.string().required(),
    region: joi.string().required(),
    value: joi.number().required(),
});
