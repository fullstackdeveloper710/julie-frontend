import { Types } from 'mongoose';

export type DataConfidenceLevel = 'High' | 'Moderate' | 'Low';
export type BinaryAnswer = 'Yes' | 'No';
export type TernaryAnswer = 'Yes' | 'No' | 'Partially';
export type HiringBudgetAvailability = 'Full' | 'Limited' | 'Frozen';
export type StaffingBudgetConstraint = 'Yes' | 'No' | 'Under review';
export type RestRequirementMet = 'Yes' | 'No' | 'No policy';
export type PtoBacklog = 'Yes' | 'No' | 'Some personnel affected';
export type TopLeadershipConcern =
    | 'Staffing shortage'
    | 'Budget strain'
    | 'Burnout concerns'
    | 'Leadership turnover'
    | 'Morale'
    | 'Legal or compliance'
    | 'Other';

export interface IOrganizationalStability {
    currentlyFilledPositions: number;
    currentVacancies: number;
    resignationsThisMonth: number;
    newHiresAndAcademyGraduates: number;
    averageTimeToFillDays: number;
    leadershipLevelVacancies: number;
}

export interface IOperationalResilience {
    totalOvertimeHours: number;
    averageShiftLengthHours: number;
    shiftCoverageShortages: number;
    mandatoryOvertimePercentage: number;
    plannedOvertimePercentage: number;
    unplannedOvertimePercentage: number;
    callInAndHoldoverIncidents: number;
}

export interface IFatigueResistance {
    totalSickLeaveDaysUsed: number;
}

export interface IPeerSupportReadiness {
    employeesOnFmlaLeave: number;
    newFmlaRequests: number;
    workersCompClaimsFiled: number;
    peerSupportActivations: number;
    criticalIncidentExposures: number;
    lineOfDutyDeathsOrSeriousInjuries: BinaryAnswer;
    lineOfDutyDeathsOrSeriousInjuriesCount: number;
}

export interface ILeadershipSustainability {
    leadershipMoraleRating: number;
    frontlineMoraleRating: number;
    disciplinaryActions: number;
    formalGrievancesFiled: number;
    promotionsOrLeadershipDevelopmentCount: number;
}

export interface IBudgetAndFiscalContext {
    overtimeBudgetUtilizationPercentage?: number;
    hiringBudgetAvailability?: HiringBudgetAvailability;
    staffingBudgetConstraint?: StaffingBudgetConstraint;
}

export interface IOperationalDemandContext {
    totalCallsOrIncidents?: number;
    responseTimeStandardsMet?: TernaryAnswer;
    specialtyUnitVacancies?: number;
}

export interface IFatiguePrecisionInputs {
    minimumRestPeriodRequirementMet?: RestRequirementMet;
    ptoVacationAccrualBacklog?: PtoBacklog;
    returnToDutyIncidentsBeforeFullRecovery?: number;
}

export interface IPeerSupportDepthInputs {
    eapReferralsOrUtilizations?: number;
    topLeadershipConcern?: TopLeadershipConcern;
    topLeadershipConcernOther?: string;
    additionalContextOrNotes?: string;
}

export interface IMonthlyCheckinOptional {
    budgetAndFiscalContext?: IBudgetAndFiscalContext;
    operationalDemandContext?: IOperationalDemandContext;
    fatiguePrecisionInputs?: IFatiguePrecisionInputs;
    peerSupportDepthInputs?: IPeerSupportDepthInputs;
}

export interface IMonthlyCheckinCore {
    organizationalStability: IOrganizationalStability;
    operationalResilience: IOperationalResilience;
    fatigueResistance: IFatigueResistance;
    peerSupportReadiness: IPeerSupportReadiness;
    leadershipSustainability: ILeadershipSustainability;
    dataConfidence: DataConfidenceLevel;
}

export interface IMonthlyCheckinInput extends IMonthlyCheckinCore {
    optional?: IMonthlyCheckinOptional;
    checkinMonth?: Date | string;
}

export interface IMonthlyCheckin extends IMonthlyCheckinCore {
    optional?: IMonthlyCheckinOptional;
    userId: Types.ObjectId;
    checkinMonth: Date;
    createdAt: Date;
    updatedAt: Date;
}
