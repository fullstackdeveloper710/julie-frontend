import joi from 'joi';

const requiredNumber = (label: string) =>
    joi.number().min(0).required().messages({
        'number.base': `${label} must be a number`,
        'number.min': `${label} must be 0 or greater`,
        'any.required': `${label} is required`,
    });

const requiredPercent = (label: string) =>
    joi.number().min(0).max(100).required().messages({
        'number.base': `${label} must be a number`,
        'number.min': `${label} must be 0 or greater`,
        'number.max': `${label} must be 100 or less`,
        'any.required': `${label} is required`,
    });

const optionalNonNegative = joi.number().min(0).optional();

const organizationalStabilityValidation = joi
    .object({
        currentlyFilledPositions: requiredNumber('currentlyFilledPositions'),
        currentVacancies: requiredNumber('currentVacancies'),
        resignationsThisMonth: requiredNumber('resignationsThisMonth'),
        newHiresAndAcademyGraduates: requiredNumber('newHiresAndAcademyGraduates'),
        averageTimeToFillDays: requiredNumber('averageTimeToFillDays'),
        leadershipLevelVacancies: requiredNumber('leadershipLevelVacancies'),
    })
    .required();

const operationalResilienceValidation = joi
    .object({
        totalOvertimeHours: requiredNumber('totalOvertimeHours'),
        averageShiftLengthHours: requiredNumber('averageShiftLengthHours'),
        shiftCoverageShortages: requiredNumber('shiftCoverageShortages'),
        mandatoryOvertimePercentage: requiredPercent('mandatoryOvertimePercentage'),
        plannedOvertimePercentage: requiredPercent('plannedOvertimePercentage'),
        unplannedOvertimePercentage: requiredPercent('unplannedOvertimePercentage'),
        callInAndHoldoverIncidents: requiredNumber('callInAndHoldoverIncidents'),
    })
    .required()
    .custom((value, helpers) => {
        const planned = Number(value.plannedOvertimePercentage);
        const unplanned = Number(value.unplannedOvertimePercentage);
        if (Math.abs(planned + unplanned - 100) > 0.0001) {
            return helpers.error('any.custom', {
                message: 'plannedOvertimePercentage and unplannedOvertimePercentage must total 100',
            });
        }
        return value;
    }, 'planned + unplanned must equal 100')
    .messages({
        'any.custom': '{#message}',
    });

const fatigueResistanceValidation = joi
    .object({
        totalSickLeaveDaysUsed: requiredNumber('totalSickLeaveDaysUsed'),
    })
    .required();

const peerSupportReadinessValidation = joi
    .object({
        employeesOnFmlaLeave: requiredNumber('employeesOnFmlaLeave'),
        newFmlaRequests: requiredNumber('newFmlaRequests'),
        workersCompClaimsFiled: requiredNumber('workersCompClaimsFiled'),
        peerSupportActivations: requiredNumber('peerSupportActivations'),
        criticalIncidentExposures: requiredNumber('criticalIncidentExposures'),
        lineOfDutyDeathsOrSeriousInjuries: joi.string().valid('Yes', 'No').required(),
        lineOfDutyDeathsOrSeriousInjuriesCount: joi.number().min(0).required(),
    })
    .required()
    .custom((value, helpers) => {
        if (
            value.lineOfDutyDeathsOrSeriousInjuries === 'Yes' &&
            (!Number.isFinite(value.lineOfDutyDeathsOrSeriousInjuriesCount) ||
                value.lineOfDutyDeathsOrSeriousInjuriesCount < 1)
        ) {
            return helpers.error('any.custom', {
                message: 'lineOfDutyDeathsOrSeriousInjuriesCount must be at least 1 when Yes',
            });
        }
        return value;
    }, 'count required when Yes')
    .messages({ 'any.custom': '{#message}' });

const leadershipSustainabilityValidation = joi
    .object({
        leadershipMoraleRating: joi.number().min(1).max(10).required(),
        frontlineMoraleRating: joi.number().min(1).max(10).required(),
        disciplinaryActions: requiredNumber('disciplinaryActions'),
        formalGrievancesFiled: requiredNumber('formalGrievancesFiled'),
        promotionsOrLeadershipDevelopmentCount: requiredNumber('promotionsOrLeadershipDevelopmentCount'),
    })
    .required();

const optionalValidation = joi
    .object({
        budgetAndFiscalContext: joi
            .object({
                overtimeBudgetUtilizationPercentage: optionalNonNegative,
                hiringBudgetAvailability: joi.string().valid('Full', 'Limited', 'Frozen').optional(),
                staffingBudgetConstraint: joi
                    .string()
                    .valid('Yes', 'No', 'Under review')
                    .optional(),
            })
            .optional(),
        operationalDemandContext: joi
            .object({
                totalCallsOrIncidents: optionalNonNegative,
                responseTimeStandardsMet: joi.string().valid('Yes', 'No', 'Partially').optional(),
                specialtyUnitVacancies: optionalNonNegative,
            })
            .optional(),
        fatiguePrecisionInputs: joi
            .object({
                minimumRestPeriodRequirementMet: joi
                    .string()
                    .valid('Yes', 'No', 'No policy')
                    .optional(),
                ptoVacationAccrualBacklog: joi
                    .string()
                    .valid('Yes', 'No', 'Some personnel affected')
                    .optional(),
                returnToDutyIncidentsBeforeFullRecovery: optionalNonNegative,
            })
            .optional(),
        peerSupportDepthInputs: joi
            .object({
                eapReferralsOrUtilizations: optionalNonNegative,
                topLeadershipConcern: joi
                    .string()
                    .valid(
                        'Staffing shortage',
                        'Budget strain',
                        'Burnout concerns',
                        'Leadership turnover',
                        'Morale',
                        'Legal or compliance',
                        'Other'
                    )
                    .optional(),
                topLeadershipConcernOther: joi.string().trim().max(500).allow('').optional(),
                additionalContextOrNotes: joi.string().trim().max(4000).allow('').optional(),
            })
            .custom((value, helpers) => {
                if (
                    value &&
                    value.topLeadershipConcern === 'Other' &&
                    !(value.topLeadershipConcernOther && String(value.topLeadershipConcernOther).trim())
                ) {
                    return helpers.error('any.custom', {
                        message: 'topLeadershipConcernOther is required when topLeadershipConcern is Other',
                    });
                }
                return value;
            }, 'other concern detail required')
            .messages({ 'any.custom': '{#message}' })
            .optional(),
    })
    .optional();

export const createCheckinValidation = joi.object({
    organizationalStability: organizationalStabilityValidation,
    operationalResilience: operationalResilienceValidation,
    fatigueResistance: fatigueResistanceValidation,
    peerSupportReadiness: peerSupportReadinessValidation,
    leadershipSustainability: leadershipSustainabilityValidation,
    dataConfidence: joi.string().valid('High', 'Moderate', 'Low').required(),
    optional: optionalValidation,
    checkinMonth: joi.alternatives(joi.date(), joi.string().isoDate()).optional(),
});

export const updateCheckinValidation = joi.object({
    organizationalStability: organizationalStabilityValidation.optional(),
    operationalResilience: operationalResilienceValidation.optional(),
    fatigueResistance: fatigueResistanceValidation.optional(),
    peerSupportReadiness: peerSupportReadinessValidation.optional(),
    leadershipSustainability: leadershipSustainabilityValidation.optional(),
    dataConfidence: joi.string().valid('High', 'Moderate', 'Low').optional(),
    optional: optionalValidation,
    checkinMonth: joi.alternatives(joi.date(), joi.string().isoDate()).optional(),
});
