import { SelectOption, StepConfig } from '../shared/types';
import { MonthlyFormValues } from './types';

export const MONTHLY_CORE_STEPS: StepConfig[] = [
  {
    id: 1,
    title: 'Domain 1 - Organizational Stability',
    description: 'Required monthly core questions 1-1 to 1-6',
    fields: [
      'currentlyFilledPositions',
      'currentVacancies',
      'resignationsThisMonth',
      'newHiresAndAcademyGraduates',
      'averageTimeToFillDays',
      'leadershipLevelVacancies',
    ],
  },
  {
    id: 2,
    title: 'Domain 2 - Operational Resilience',
    description: 'Required monthly core questions 2-1 to 2-6',
    fields: [
      'totalOvertimeHours',
      'averageShiftLengthHours',
      'shiftCoverageShortages',
      'mandatoryOvertimePercentage',
      'plannedOvertimePercentage',
      'unplannedOvertimePercentage',
      'callInAndHoldoverIncidents',
    ],
  },
  {
    id: 3,
    title: 'Domain 3 - Fatigue Resistance',
    description: 'Required monthly core question 3-1',
    fields: ['totalSickLeaveDaysUsed'],
  },
  {
    id: 4,
    title: 'Domain 4 - Peer Support Readiness',
    description: 'Required monthly core questions 4-1 to 4-6',
    fields: [
      'employeesOnFmlaLeave',
      'newFmlaRequests',
      'workersCompClaimsFiled',
      'peerSupportActivations',
      'criticalIncidentExposures',
      'lineOfDutyDeathsOrSeriousInjuries',
      'lineOfDutyDeathsOrSeriousInjuriesCount',
    ],
  },
  {
    id: 5,
    title: 'Domain 5 - Leadership Sustainability',
    description: 'Required monthly core questions 5-1 to 5-5',
    fields: [
      'leadershipMoraleRating',
      'frontlineMoraleRating',
      'disciplinaryActions',
      'formalGrievancesFiled',
      'promotionsOrLeadershipDevelopmentCount',
    ],
  },
  {
    id: 6,
    title: 'DC-1 Data Confidence',
    description: 'Required confidence declaration before monthly submission',
    fields: ['dataConfidence'],
  },
];

export const MONTHLY_OPTIONAL_STEPS: StepConfig[] = [
  {
    id: 1,
    title: 'Budget And Fiscal Context',
    description: 'Monthly optional questions B-1 to B-3',
    fields: [
      'overtimeBudgetUtilizationPercentage',
      'hiringBudgetAvailability',
      'staffingBudgetConstraint',
    ],
  },
  {
    id: 2,
    title: 'Operational Demand Context',
    description: 'Monthly optional questions OD-1 to OD-3',
    fields: ['totalCallsOrIncidents', 'responseTimeStandardsMet', 'specialtyUnitVacancies'],
  },
  {
    id: 3,
    title: 'Fatigue Precision Inputs',
    description: 'Monthly optional questions F-1 to F-3',
    fields: [
      'minimumRestPeriodRequirementMet',
      'ptoVacationAccrualBacklog',
      'returnToDutyIncidentsBeforeFullRecovery',
    ],
  },
  {
    id: 4,
    title: 'Peer Support Depth Inputs',
    description: 'Monthly optional questions PS-1 to PS-3',
    fields: [
      'eapReferralsOrUtilizations',
      'topLeadershipConcern',
      'topLeadershipConcernOther',
      'additionalContextOrNotes',
    ],
  },
];

export const MONTHLY_OPTIONAL_FIELD_NAMES: (keyof MonthlyFormValues)[] = [
  'overtimeBudgetUtilizationPercentage',
  'hiringBudgetAvailability',
  'staffingBudgetConstraint',
  'totalCallsOrIncidents',
  'responseTimeStandardsMet',
  'specialtyUnitVacancies',
  'minimumRestPeriodRequirementMet',
  'ptoVacationAccrualBacklog',
  'returnToDutyIncidentsBeforeFullRecovery',
  'eapReferralsOrUtilizations',
  'topLeadershipConcern',
  'topLeadershipConcernOther',
  'additionalContextOrNotes',
];

export const MONTHLY_INITIAL_VALUES: MonthlyFormValues = {
  currentlyFilledPositions: '',
  currentVacancies: '',
  resignationsThisMonth: '',
  newHiresAndAcademyGraduates: '',
  averageTimeToFillDays: '',
  leadershipLevelVacancies: '',
  totalOvertimeHours: '',
  averageShiftLengthHours: '',
  shiftCoverageShortages: '',
  mandatoryOvertimePercentage: '',
  plannedOvertimePercentage: '',
  unplannedOvertimePercentage: '',
  callInAndHoldoverIncidents: '',
  totalSickLeaveDaysUsed: '',
  employeesOnFmlaLeave: '',
  newFmlaRequests: '',
  workersCompClaimsFiled: '',
  peerSupportActivations: '',
  criticalIncidentExposures: '',
  lineOfDutyDeathsOrSeriousInjuries: '',
  lineOfDutyDeathsOrSeriousInjuriesCount: '',
  leadershipMoraleRating: '',
  frontlineMoraleRating: '',
  disciplinaryActions: '',
  formalGrievancesFiled: '',
  promotionsOrLeadershipDevelopmentCount: '',
  dataConfidence: '',
  overtimeBudgetUtilizationPercentage: '',
  hiringBudgetAvailability: '',
  staffingBudgetConstraint: '',
  totalCallsOrIncidents: '',
  responseTimeStandardsMet: '',
  specialtyUnitVacancies: '',
  minimumRestPeriodRequirementMet: '',
  ptoVacationAccrualBacklog: '',
  returnToDutyIncidentsBeforeFullRecovery: '',
  eapReferralsOrUtilizations: '',
  topLeadershipConcern: '',
  topLeadershipConcernOther: '',
  additionalContextOrNotes: '',
};

export const DATA_CONFIDENCE_OPTIONS: SelectOption[] = [
  { label: 'High - Data from reports and systems', value: 'High' },
  { label: 'Moderate - Some data estimated', value: 'Moderate' },
  { label: 'Low - Data primarily estimated', value: 'Low' },
];

export const HIRING_BUDGET_OPTIONS: SelectOption[] = [
  { label: 'Full', value: 'Full' },
  { label: 'Limited', value: 'Limited' },
  { label: 'Frozen', value: 'Frozen' },
];

export const STAFFING_BUDGET_CONSTRAINT_OPTIONS: SelectOption[] = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'Under review', value: 'Under review' },
];

export const RESPONSE_STANDARD_OPTIONS: SelectOption[] = [
  { label: 'Yes', value: 'Yes' },
  { label: 'Partially', value: 'Partially' },
  { label: 'No', value: 'No' },
];

export const REST_REQUIREMENT_OPTIONS: SelectOption[] = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'No policy', value: 'No policy' },
];

export const PTO_BACKLOG_OPTIONS: SelectOption[] = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'Some personnel affected', value: 'Some personnel affected' },
];

export const TOP_CONCERN_OPTIONS: SelectOption[] = [
  { label: 'Staffing shortage', value: 'Staffing shortage' },
  { label: 'Budget strain', value: 'Budget strain' },
  { label: 'Burnout concerns', value: 'Burnout concerns' },
  { label: 'Leadership turnover', value: 'Leadership turnover' },
  { label: 'Morale', value: 'Morale' },
  { label: 'Legal or compliance', value: 'Legal or compliance' },
  { label: 'Other', value: 'Other' },
];

export const YES_NO_OPTIONS: SelectOption[] = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];
