import joi from 'joi';

const agencyIdentityValidation = joi
    .object({
        agencyName: joi.string().trim().min(1).required(),
        agencyType: joi
            .string()
            .valid('Law enforcement', 'Fire', 'EMS', 'Dispatch', 'Combined')
            .required(),
        agencySizeCategory: joi
            .string()
            .valid('Small (<25)', 'Medium (25-99)', 'Large (100-299)', 'Major (300+)')
            .required(),
        primaryServiceJurisdiction: joi.string().trim().min(1).required(),
        geographicCoverageArea: joi.number().min(0).required(),
    })
    .required();

const structuralStaffingProfileValidation = joi
    .object({
        totalAuthorizedPositions: joi.number().min(0).required(),
        totalFundedPositions: joi.number().min(0).required(),
        minimumSafeStaffingLevel: joi.number().min(0).required(),
        specialtyUnitPositionsCount: joi.number().min(0).required(),
        supervisorToStaffRatio: joi
            .string()
            .trim()
            .pattern(/^\d+\s*:\s*\d+$/)
            .required()
            .messages({
                'string.pattern.base': 'supervisorToStaffRatio must be in the format 1:8',
            }),
    })
    .required()
    .custom((value, helpers) => {
        if (Number(value.totalFundedPositions) > Number(value.totalAuthorizedPositions)) {
            return helpers.error('any.custom', {
                message: 'totalFundedPositions cannot exceed totalAuthorizedPositions',
            });
        }
        return value;
    }, 'funded vs authorized')
    .messages({ 'any.custom': '{#message}' });

const operationalInfrastructureValidation = joi
    .object({
        standardShiftLengthHours: joi.number().min(0).max(24).required(),
        shiftScheduleType: joi.string().valid('8-hour', '10-hour', '12-hour', 'Mixed').required(),
        minimumRestPeriodPolicyExists: joi.string().valid('Yes', 'No').required(),
        activePeerSupportTeam: joi.string().valid('Yes', 'No', 'In development').required(),
        hasEmployeeAssistanceProgram: joi.string().valid('Yes', 'No').required(),
    })
    .required();

const goalsAndStrategicDirectionValidation = joi
    .object({
        goal1PrimaryAnnualGoal: joi.string().trim().min(1).max(4000).required(),
        goal1TargetMetric: joi.string().trim().max(1000).allow('').optional(),
        goal1Timeframe: joi
            .string()
            .valid('Annual (Q1-Q4)', 'First half (Q1-Q2)', 'Second half (Q3-Q4)')
            .required(),
        goal2SecondaryAnnualGoal: joi.string().trim().max(4000).allow('').optional(),
        goal2TargetMetric: joi.string().trim().max(1000).allow('').optional(),
        goal2Timeframe: joi.string().valid('Annual', 'First half', 'Second half').optional(),
    })
    .required()
    .custom((value, helpers) => {
        const goal1Metric = (value.goal1TargetMetric || '').toString().trim();
        const goal2Metric = (value.goal2TargetMetric || '').toString().trim();
        if (!goal1Metric && !goal2Metric) {
            return helpers.error('any.custom', {
                message:
                    'At least one of goal1TargetMetric or goal2TargetMetric must contain a measurable target',
            });
        }
        return value;
    }, 'measurable target required')
    .messages({ 'any.custom': '{#message}' });

export const createAnnualCheckinValidation = joi.object({
    agencyIdentity: agencyIdentityValidation,
    structuralStaffingProfile: structuralStaffingProfileValidation,
    operationalInfrastructure: operationalInfrastructureValidation,
    goalsAndStrategicDirection: goalsAndStrategicDirectionValidation,
    baselineYear: joi.alternatives(joi.date(), joi.string().isoDate()).optional(),
});

export const updateAnnualCheckinValidation = joi.object({
    agencyIdentity: agencyIdentityValidation.optional(),
    structuralStaffingProfile: structuralStaffingProfileValidation.optional(),
    operationalInfrastructure: operationalInfrastructureValidation.optional(),
    goalsAndStrategicDirection: goalsAndStrategicDirectionValidation.optional(),
    baselineYear: joi.alternatives(joi.date(), joi.string().isoDate()).optional(),
});
