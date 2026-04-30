import {
  DataConfidenceLevel,
  BinaryAnswer,
  TernaryAnswer,
  HiringBudgetAvailability,
  StaffingBudgetConstraint,
  RestRequirementMet,
  PtoBacklog,
  TopLeadershipConcern,
  AgencyType,
  AgencySizeCategory,
  ShiftScheduleType,
  PeerSupportTeamStatus,
  GoalTimeframe,
  SecondaryGoalTimeframe,
} from './enums';

export type {
  DataConfidenceLevel,
  BinaryAnswer,
  TernaryAnswer,
  HiringBudgetAvailability,
  StaffingBudgetConstraint,
  RestRequirementMet,
  PtoBacklog,
  TopLeadershipConcern,
} from './enums';

// MONTHLY CHECK-IN TYPES
export interface MonthlyCorePayload {
  organizationalStability: {
    currentlyFilledPositions: number;
    currentVacancies: number;
    resignationsThisMonth: number;
    newHiresAndAcademyGraduates: number;
    averageTimeToFillDays: number;
    leadershipLevelVacancies: number;
  };
  operationalResilience: {
    totalOvertimeHours: number;
    averageShiftLengthHours: number;
    shiftCoverageShortages: number;
    mandatoryOvertimePercentage: number;
    plannedOvertimePercentage: number;
    unplannedOvertimePercentage: number;
    callInAndHoldoverIncidents: number;
  };
  fatigueResistance: {
    totalSickLeaveDaysUsed: number;
  };
  peerSupportReadiness: {
    employeesOnFmlaLeave: number;
    newFmlaRequests: number;
    workersCompClaimsFiled: number;
    peerSupportActivations: number;
    criticalIncidentExposures: number;
    lineOfDutyDeathsOrSeriousInjuries: BinaryAnswer;
    lineOfDutyDeathsOrSeriousInjuriesCount: number;
  };
  leadershipSustainability: {
    leadershipMoraleRating: number;
    frontlineMoraleRating: number;
    disciplinaryActions: number;
    formalGrievancesFiled: number;
    promotionsOrLeadershipDevelopmentCount: number;
  };
  dataConfidence: DataConfidenceLevel;
}

export interface MonthlyOptionalPayload {
  budgetAndFiscalContext?: {
    overtimeBudgetUtilizationPercentage?: number;
    hiringBudgetAvailability?: HiringBudgetAvailability;
    staffingBudgetConstraint?: StaffingBudgetConstraint;
  };
  operationalDemandContext?: {
    totalCallsOrIncidents?: number;
    responseTimeStandardsMet?: TernaryAnswer;
    specialtyUnitVacancies?: number;
  };
  fatiguePrecisionInputs?: {
    minimumRestPeriodRequirementMet?: RestRequirementMet;
    ptoVacationAccrualBacklog?: PtoBacklog;
    returnToDutyIncidentsBeforeFullRecovery?: number;
  };
  peerSupportDepthInputs?: {
    eapReferralsOrUtilizations?: number;
    topLeadershipConcern?: TopLeadershipConcern;
    topLeadershipConcernOther?: string;
    additionalContextOrNotes?: string;
  };
}
export type MonthlyCheckInRequest = MonthlyCorePayload & {
  optional?: MonthlyOptionalPayload;
  checkinMonth?: string;
};

// ANNUAL CHECK-IN TYPES
export interface AnnualBaselineRequest {
  agencyIdentity: {
    agencyName: string;
    agencyType: AgencyType;
    agencySizeCategory: AgencySizeCategory;
    primaryServiceJurisdiction: string;
    geographicCoverageArea: number;
  };
  structuralStaffingProfile: {
    totalAuthorizedPositions: number;
    totalFundedPositions: number;
    minimumSafeStaffingLevel: number;
    specialtyUnitPositionsCount: number;
    supervisorToStaffRatio: string;
  };
  operationalInfrastructure: {
    standardShiftLengthHours: number;
    shiftScheduleType: ShiftScheduleType;
    minimumRestPeriodPolicyExists: BinaryAnswer;
    activePeerSupportTeam: PeerSupportTeamStatus;
    hasEmployeeAssistanceProgram: BinaryAnswer;
  };
  goalsAndStrategicDirection: {
    goal1PrimaryAnnualGoal: string;
    goal1TargetMetric?: string;
    goal1Timeframe: GoalTimeframe;
    goal2SecondaryAnnualGoal?: string;
    goal2TargetMetric?: string;
    goal2Timeframe?: SecondaryGoalTimeframe;
  };
  baselineYear?: string;
}
export interface AnnualCheckinStatus {
  hasCurrentYearCheckin: boolean;
  currentCheckinId: string | null;
  editCount: number;
  canEdit: boolean;
  canSubmit: boolean;
  maxEdits: number;
}

export interface MonthlyCheckinStatus {
  hasCurrentMonthCheckin: boolean;
  currentCheckinId: string | null;
  editCount: number;
  canEdit: boolean;
  canSubmit: boolean;
  maxEdits: number;
  isReadOnly?: boolean;
}
export interface AnnualCheckInRecord {
  _id: string;
  userId: string;
  baselineYear: string;
  editCount: number;
  agencyIdentity: {
    agencyName: string;
    agencyType: string;
    agencySizeCategory: string;
    primaryServiceJurisdiction: string;
    geographicCoverageArea: number;
  };
  structuralStaffingProfile: {
    totalAuthorizedPositions: number;
    totalFundedPositions: number;
    minimumSafeStaffingLevel: number;
    specialtyUnitPositionsCount: number;
    supervisorToStaffRatio: string;
  };
  operationalInfrastructure: {
    standardShiftLengthHours: number;
    shiftScheduleType: string;
    minimumRestPeriodPolicyExists: string;
    activePeerSupportTeam: string;
    hasEmployeeAssistanceProgram: string;
  };
  goalsAndStrategicDirection: {
    goal1PrimaryAnnualGoal: string;
    goal1TargetMetric?: string;
    goal1Timeframe: string;
    goal2SecondaryAnnualGoal?: string;
    goal2TargetMetric?: string;
    goal2Timeframe?: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface AnnualCheckInRequest {
  agencyIdentity: {
    agencyName: string;
    agencyType: AgencyType;
    agencySizeCategory: AgencySizeCategory;
    primaryServiceJurisdiction: string;
    geographicCoverageArea: number;
  };
  structuralStaffingProfile: {
    totalAuthorizedPositions: number;
    totalFundedPositions: number;
    minimumSafeStaffingLevel: number;
    specialtyUnitPositionsCount: number;
    supervisorToStaffRatio: string;
  };
  operationalInfrastructure: {
    standardShiftLengthHours: number;
    shiftScheduleType: ShiftScheduleType;
    minimumRestPeriodPolicyExists: BinaryAnswer;
    activePeerSupportTeam: PeerSupportTeamStatus;
    hasEmployeeAssistanceProgram: BinaryAnswer;
  };
  goalsAndStrategicDirection: {
    goal1PrimaryAnnualGoal: string;
    goal1TargetMetric?: string;
    goal1Timeframe: GoalTimeframe;
    goal2SecondaryAnnualGoal?: string;
    goal2TargetMetric?: string;
    goal2Timeframe?: SecondaryGoalTimeframe;
  };
  baselineYear?: string;
}
