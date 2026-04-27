import joi from 'joi';

export const createCheckinValidation = joi.object({
    staffingLevel: joi.number().min(0).required(),
    openPositions: joi.number().min(0).required(),
    newHires: joi.number().min(0).required(),
    overtimeHours: joi.number().min(0).required(),
    avgOvertimePerEmployee: joi.number().min(0).required(),
    fmlaHours: joi.number().min(0).required(),
    totalLeaveHours: joi.number().min(0).required(),
    separations: joi.number().min(0).required(),
    turnoverRate: joi.number().min(0).max(100).required(),
    morale: joi.number().min(1).max(10).required(),
    topConcern: joi.string().required(),
    disciplinaryActions: joi.number().min(0).required(),
    additionalContext: joi.string().allow('', null),
});

export const updateCheckinValidation = joi.object({
    staffingLevel: joi.number().min(0),
    openPositions: joi.number().min(0),
    newHires: joi.number().min(0),
    overtimeHours: joi.number().min(0),
    avgOvertimePerEmployee: joi.number().min(0),
    fmlaHours: joi.number().min(0),
    totalLeaveHours: joi.number().min(0),
    separations: joi.number().min(0),
    turnoverRate: joi.number().min(0).max(100),
    morale: joi.number().min(1).max(10),
    topConcern: joi.string(),
    disciplinaryActions: joi.number().min(0),
    additionalContext: joi.string().allow('', null),
});
