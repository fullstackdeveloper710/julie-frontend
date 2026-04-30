import joi from 'joi';
import { EUserPlan, EUserRole } from '../enums/agency.enum';
export const signInValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
})
export const signUpValidation = joi.object({
    fullName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    plan: joi.string().valid(...Object.values(EUserPlan)).required(),
    billingInterval: joi.string().valid('monthly', 'annual').optional(),
})
export const getMeValidation = joi.object({
    user_id: joi.string().required(),
    role: joi.string().optional(),
})

export const forgotPasswordValidation = joi.object({
    email: joi.string().email().required(),
});

export const resetPasswordValidation = joi.object({
    token: joi.string().min(10).required(),
    password: joi.string().min(6).required(),
});