export type TabType =
  | 'dashboard'
  | 'annual-checkin'
  | 'monthly-checkin'
  | 'intelligence-graphs'
  | 'fmla-ot-patterns'
  | 'alert-system'
  | 'peer-benchmarking'
  | 'grant-writer'
  | 'intelligence-report';

export interface AlertConfig {
  id: string;
  label: string;
  description: string;
  threshold: number;
  enabled: boolean;
}

export type ManagerFormValues = {
  fullName: string;
  email: string;
  title: string;
  agencyId: string;
};

export type AgencyFormValues = {
  name: string;
  type: string;
  sizeCategory: string;
  primaryServiceJurisdiction: string;
  coverageArea: string;
};

export type MonthlyFormValues = {
  currentlyFilledPositions: string;
  currentVacancies: string;
  resignationsThisMonth: string;
  newHiresAndAcademyGraduates: string;
  averageTimeToFillDays: string;
  leadershipLevelVacancies: string;
  totalOvertimeHours: string;
  averageShiftLengthHours: string;
  shiftCoverageShortages: string;
  mandatoryOvertimePercentage: string;
  plannedOvertimePercentage: string;
  unplannedOvertimePercentage: string;
  callInAndHoldoverIncidents: string;
  totalSickLeaveDaysUsed: string;
  employeesOnFmlaLeave: string;
  newFmlaRequests: string;
  workersCompClaimsFiled: string;
  peerSupportActivations: string;
  criticalIncidentExposures: string;
  lineOfDutyDeathsOrSeriousInjuries: string;
  lineOfDutyDeathsOrSeriousInjuriesCount: string;
  leadershipMoraleRating: string;
  frontlineMoraleRating: string;
  disciplinaryActions: string;
  formalGrievancesFiled: string;
  promotionsOrLeadershipDevelopmentCount: string;
  dataConfidence: string;
  overtimeBudgetUtilizationPercentage: string;
  hiringBudgetAvailability: string;
  staffingBudgetConstraint: string;
  totalCallsOrIncidents: string;
  responseTimeStandardsMet: string;
  specialtyUnitVacancies: string;
  minimumRestPeriodRequirementMet: string;
  ptoVacationAccrualBacklog: string;
  returnToDutyIncidentsBeforeFullRecovery: string;
  eapReferralsOrUtilizations: string;
  topLeadershipConcern: string;
  topLeadershipConcernOther: string;
  additionalContextOrNotes: string;
};

export type AnnualFormValues = {
  agencyName: string;
  agencyType: string;
  agencySizeCategory: string;
  primaryServiceJurisdiction: string;
  geographicCoverageArea: string;
  totalAuthorizedPositions: string;
  totalFundedPositions: string;
  minimumSafeStaffingLevel: string;
  specialtyUnitPositionsCount: string;
  supervisorToStaffRatio: string;
  standardShiftLengthHours: string;
  shiftScheduleType: string;
  minimumRestPeriodPolicyExists: string;
  activePeerSupportTeam: string;
  hasEmployeeAssistanceProgram: string;
  goal1PrimaryAnnualGoal: string;
  goal1TargetMetric: string;
  goal1Timeframe: string;
  goal2SecondaryAnnualGoal: string;
  goal2TargetMetric: string;
  goal2Timeframe: string;
};
