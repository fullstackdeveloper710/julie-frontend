'use client';

import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, Button } from '@/components/ui';
import {
  useSubmitMonthlyCheckInMutation,
  useSubmitAnnualBaselineMutation,
} from '@/hooks';
import type { MonthlyOptionalPayload } from '@/redux/api/analyticsApi';
import { extractRtkErrorMessage } from '@/utils/rtkErrorHandler';

type ActiveFormTab = 'monthly' | 'annual';

type StepConfig = {
  id: number;
  title: string;
  description: string;
  fields: string[];
};

type TopLeadershipConcernOption = NonNullable<
  NonNullable<MonthlyOptionalPayload['peerSupportDepthInputs']>['topLeadershipConcern']
>;

type MonthlyFormValues = {
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

type AnnualBaselineFormValues = {
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

const MONTHLY_CORE_STEPS: StepConfig[] = [
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

const MONTHLY_OPTIONAL_STEPS: StepConfig[] = [
  {
    id: 1,
    title: 'Budget And Fiscal Context',
    description: 'Monthly optional questions B-1 to B-3',
    fields: ['overtimeBudgetUtilizationPercentage', 'hiringBudgetAvailability', 'staffingBudgetConstraint'],
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

const ANNUAL_STEPS: StepConfig[] = [
  {
    id: 1,
    title: 'Agency Identity',
    description: 'Annual baseline A-1 to A-5',
    fields: ['agencyName', 'agencyType', 'agencySizeCategory', 'primaryServiceJurisdiction', 'geographicCoverageArea'],
  },
  {
    id: 2,
    title: 'Structural Staffing Profile',
    description: 'Annual baseline A-6 to A-10',
    fields: [
      'totalAuthorizedPositions',
      'totalFundedPositions',
      'minimumSafeStaffingLevel',
      'specialtyUnitPositionsCount',
      'supervisorToStaffRatio',
    ],
  },
  {
    id: 3,
    title: 'Operational Infrastructure',
    description: 'Annual baseline A-11 to A-15',
    fields: [
      'standardShiftLengthHours',
      'shiftScheduleType',
      'minimumRestPeriodPolicyExists',
      'activePeerSupportTeam',
      'hasEmployeeAssistanceProgram',
    ],
  },
  {
    id: 4,
    title: 'Goals And Strategic Direction',
    description: 'Annual baseline G-1 to G-6',
    fields: [
      'goal1PrimaryAnnualGoal',
      'goal1TargetMetric',
      'goal1Timeframe',
      'goal2SecondaryAnnualGoal',
      'goal2TargetMetric',
      'goal2Timeframe',
    ],
  },
];

const MONTHLY_INITIAL_VALUES: MonthlyFormValues = {
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

const ANNUAL_INITIAL_VALUES: AnnualBaselineFormValues = {
  agencyName: '',
  agencyType: '',
  agencySizeCategory: '',
  primaryServiceJurisdiction: '',
  geographicCoverageArea: '',
  totalAuthorizedPositions: '',
  totalFundedPositions: '',
  minimumSafeStaffingLevel: '',
  specialtyUnitPositionsCount: '',
  supervisorToStaffRatio: '',
  standardShiftLengthHours: '',
  shiftScheduleType: '',
  minimumRestPeriodPolicyExists: '',
  activePeerSupportTeam: '',
  hasEmployeeAssistanceProgram: '',
  goal1PrimaryAnnualGoal: '',
  goal1TargetMetric: '',
  goal1Timeframe: '',
  goal2SecondaryAnnualGoal: '',
  goal2TargetMetric: '',
  goal2Timeframe: '',
};

const MONTHLY_OPTIONAL_FIELD_NAMES: (keyof MonthlyFormValues)[] = [
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

const MONTHLY_DATA_CONFIDENCE_OPTIONS = [
  { label: 'High - Data from reports and systems', value: 'High' },
  { label: 'Moderate - Some data estimated', value: 'Moderate' },
  { label: 'Low - Data primarily estimated', value: 'Low' },
];

const HIRING_BUDGET_OPTIONS = [
  { label: 'Full', value: 'Full' },
  { label: 'Limited', value: 'Limited' },
  { label: 'Frozen', value: 'Frozen' },
];

const STAFFING_BUDGET_CONSTRAINT_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'Under review', value: 'Under review' },
];

const RESPONSE_STANDARD_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'Partially', value: 'Partially' },
  { label: 'No', value: 'No' },
];

const REST_REQUIREMENT_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'No policy', value: 'No policy' },
];

const PTO_BACKLOG_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'Some personnel affected', value: 'Some personnel affected' },
];

const TOP_CONCERN_OPTIONS = [
  { label: 'Staffing shortage', value: 'Staffing shortage' },
  { label: 'Budget strain', value: 'Budget strain' },
  { label: 'Burnout concerns', value: 'Burnout concerns' },
  { label: 'Leadership turnover', value: 'Leadership turnover' },
  { label: 'Morale', value: 'Morale' },
  { label: 'Legal or compliance', value: 'Legal or compliance' },
  { label: 'Other', value: 'Other' },
];

const ANNUAL_AGENCY_TYPE_OPTIONS = [
  { label: 'Law enforcement', value: 'Law enforcement' },
  { label: 'Fire', value: 'Fire' },
  { label: 'EMS', value: 'EMS' },
  { label: 'Dispatch', value: 'Dispatch' },
  { label: 'Combined', value: 'Combined' },
];

const ANNUAL_AGENCY_SIZE_OPTIONS = [
  { label: 'Small (<25)', value: 'Small (<25)' },
  { label: 'Medium (25-99)', value: 'Medium (25-99)' },
  { label: 'Large (100-299)', value: 'Large (100-299)' },
  { label: 'Major (300+)', value: 'Major (300+)' },
];

const ANNUAL_SHIFT_SCHEDULE_OPTIONS = [
  { label: '8-hour', value: '8-hour' },
  { label: '10-hour', value: '10-hour' },
  { label: '12-hour', value: '12-hour' },
  { label: 'Mixed', value: 'Mixed' },
];

const YES_NO_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const PEER_SUPPORT_TEAM_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'In development', value: 'In development' },
];

const GOAL_1_TIMEFRAME_OPTIONS = [
  { label: 'Annual (Q1-Q4)', value: 'Annual (Q1-Q4)' },
  { label: 'First half (Q1-Q2)', value: 'First half (Q1-Q2)' },
  { label: 'Second half (Q3-Q4)', value: 'Second half (Q3-Q4)' },
];

const GOAL_2_TIMEFRAME_OPTIONS = [
  { label: 'Annual', value: 'Annual' },
  { label: 'First half', value: 'First half' },
  { label: 'Second half', value: 'Second half' },
];

const FIELD_LABEL_CLASS = 'text-xs font-bold text-gray-300 uppercase tracking-widest';
const FIELD_HELP_CLASS = 'text-xs text-slate-500 mt-1';
const FIELD_ERROR_CLASS = 'text-xs text-red-400';
const FIELD_INPUT_CLASS = 'bg-slate-900 border rounded-lg px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none';

const requiredNumberField = (label: string) =>
  Yup.number()
    .typeError(`${label} is required`)
    .required(`${label} is required`)
    .min(0, `${label} must be 0 or higher`);

const requiredPercentField = (label: string) =>
  requiredNumberField(label).max(100, `${label} must be 100 or less`);

const optionalNumberField = (label: string) =>
  Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null || typeof originalValue === 'undefined'
        ? undefined
        : value
    )
    .typeError(`${label} must be a valid number`)
    .min(0, `${label} must be 0 or higher`)
    .notRequired();

const monthlyValidationSchema = Yup.object().shape({
  currentlyFilledPositions: requiredNumberField('Currently filled positions'),
  currentVacancies: requiredNumberField('Current vacancies'),
  resignationsThisMonth: requiredNumberField('Resignations this month'),
  newHiresAndAcademyGraduates: requiredNumberField('New hires and academy graduates this month'),
  averageTimeToFillDays: requiredNumberField('Average time-to-fill (days)'),
  leadershipLevelVacancies: requiredNumberField('Leadership-level vacancies this month'),
  totalOvertimeHours: requiredNumberField('Total overtime hours this month'),
  averageShiftLengthHours: requiredNumberField('Average shift length this month'),
  shiftCoverageShortages: requiredNumberField('Shift coverage shortages this month'),
  mandatoryOvertimePercentage: requiredPercentField('Mandatory overtime percentage'),
  plannedOvertimePercentage: requiredPercentField('Planned overtime percentage').test(
    'planned-plus-unplanned-100',
    'Planned and unplanned overtime percentages must total 100',
    function (value) {
      const planned = Number(value);
      const unplanned = Number((this.parent as Record<string, unknown>).unplannedOvertimePercentage);
      if (!Number.isFinite(planned) || !Number.isFinite(unplanned)) {
        return true;
      }
      return Math.abs(planned + unplanned - 100) < 0.0001;
    }
  ),
  unplannedOvertimePercentage: requiredPercentField('Unplanned overtime percentage').test(
    'planned-plus-unplanned-100',
    'Planned and unplanned overtime percentages must total 100',
    function (value) {
      const unplanned = Number(value);
      const planned = Number((this.parent as Record<string, unknown>).plannedOvertimePercentage);
      if (!Number.isFinite(unplanned) || !Number.isFinite(planned)) {
        return true;
      }
      return Math.abs(planned + unplanned - 100) < 0.0001;
    }
  ),
  callInAndHoldoverIncidents: requiredNumberField('Call-in and holdover incidents this month'),
  totalSickLeaveDaysUsed: requiredNumberField('Total sick leave days used this month'),
  employeesOnFmlaLeave: requiredNumberField('Employees currently on FMLA leave'),
  newFmlaRequests: requiredNumberField('New FMLA requests this month'),
  workersCompClaimsFiled: requiredNumberField('Workers comp claims filed this month'),
  peerSupportActivations: requiredNumberField('Peer support activations this month'),
  criticalIncidentExposures: requiredNumberField('Critical incident exposures this month'),
  lineOfDutyDeathsOrSeriousInjuries: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select Yes or No')
    .required('Line-of-duty deaths or serious injuries is required'),
  lineOfDutyDeathsOrSeriousInjuriesCount: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null || typeof originalValue === 'undefined'
        ? undefined
        : value
    )
    .typeError('Line-of-duty deaths or serious injuries count must be a valid number')
    .when('lineOfDutyDeathsOrSeriousInjuries', {
      is: 'Yes',
      then: (schema) =>
        schema
          .required('Count is required when line-of-duty deaths or serious injuries is Yes')
          .min(1, 'Count must be at least 1 when Yes is selected'),
      otherwise: (schema) => schema.notRequired().min(0, 'Count must be 0 or higher'),
    }),
  leadershipMoraleRating: Yup.number()
    .typeError('Leadership morale rating is required')
    .required('Leadership morale rating is required')
    .min(1, 'Leadership morale rating must be between 1 and 10')
    .max(10, 'Leadership morale rating must be between 1 and 10'),
  frontlineMoraleRating: Yup.number()
    .typeError('Frontline morale rating is required')
    .required('Frontline morale rating is required')
    .min(1, 'Frontline morale rating must be between 1 and 10')
    .max(10, 'Frontline morale rating must be between 1 and 10'),
  disciplinaryActions: requiredNumberField('Disciplinary actions this month'),
  formalGrievancesFiled: requiredNumberField('Formal grievances or complaints filed this month'),
  promotionsOrLeadershipDevelopmentCount: requiredNumberField('Promotions or leadership development activity'),
  dataConfidence: Yup.string()
    .oneOf(['High', 'Moderate', 'Low'], 'Please select a data confidence level')
    .required('Data confidence level is required'),
  overtimeBudgetUtilizationPercentage: optionalNumberField('Overtime budget utilization percentage'),
  hiringBudgetAvailability: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(['Full', 'Limited', 'Frozen'], 'Hiring budget availability is invalid')
    .notRequired(),
  staffingBudgetConstraint: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(['Yes', 'No', 'Under review'], 'Budget constraint value is invalid')
    .notRequired(),
  totalCallsOrIncidents: optionalNumberField('Total calls or incidents this month'),
  responseTimeStandardsMet: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(['Yes', 'No', 'Partially'], 'Response time standards value is invalid')
    .notRequired(),
  specialtyUnitVacancies: optionalNumberField('Specialty unit vacancies this month'),
  minimumRestPeriodRequirementMet: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(['Yes', 'No', 'No policy'], 'Minimum rest period requirement value is invalid')
    .notRequired(),
  ptoVacationAccrualBacklog: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(['Yes', 'No', 'Some personnel affected'], 'PTO and vacation accrual backlog value is invalid')
    .notRequired(),
  returnToDutyIncidentsBeforeFullRecovery: optionalNumberField('Return-to-duty incidents before full recovery'),
  eapReferralsOrUtilizations: optionalNumberField('EAP referrals or utilizations this month'),
  topLeadershipConcern: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(
      [
        'Staffing shortage',
        'Budget strain',
        'Burnout concerns',
        'Leadership turnover',
        'Morale',
        'Legal or compliance',
        'Other',
      ],
      'Top leadership concern is invalid'
    )
    .notRequired(),
  topLeadershipConcernOther: Yup.string().when('topLeadershipConcern', {
    is: 'Other',
    then: (schema) => schema.trim().required('Please specify the "Other" leadership concern'),
    otherwise: (schema) => schema.notRequired(),
  }),
  additionalContextOrNotes: Yup.string().max(4000, 'Additional context is too long').notRequired(),
});

const annualValidationSchema = Yup.object()
  .shape({
    agencyName: Yup.string().trim().required('Agency name is required'),
    agencyType: Yup.string()
      .oneOf(['Law enforcement', 'Fire', 'EMS', 'Dispatch', 'Combined'], 'Agency type is invalid')
      .required('Agency type is required'),
    agencySizeCategory: Yup.string()
      .oneOf(['Small (<25)', 'Medium (25-99)', 'Large (100-299)', 'Major (300+)'], 'Agency size category is invalid')
      .required('Agency size category is required'),
    primaryServiceJurisdiction: Yup.string().trim().required('Primary service jurisdiction is required'),
    geographicCoverageArea: requiredNumberField('Geographic coverage area'),
    totalAuthorizedPositions: requiredNumberField('Total authorized positions'),
    totalFundedPositions: requiredNumberField('Total funded positions'),
    minimumSafeStaffingLevel: requiredNumberField('Minimum safe staffing level'),
    specialtyUnitPositionsCount: requiredNumberField('Specialty unit positions count'),
    supervisorToStaffRatio: Yup.string()
      .trim()
      .required('Supervisor-to-staff ratio is required')
      .matches(/^\d+\s*:\s*\d+$/, 'Supervisor-to-staff ratio must be in the format 1:8'),
    standardShiftLengthHours: requiredNumberField('Standard shift length'),
    shiftScheduleType: Yup.string()
      .oneOf(['8-hour', '10-hour', '12-hour', 'Mixed'], 'Shift schedule type is invalid')
      .required('Shift schedule type is required'),
    minimumRestPeriodPolicyExists: Yup.string()
      .oneOf(['Yes', 'No'], 'Minimum rest period policy value is invalid')
      .required('Minimum rest period policy value is required'),
    activePeerSupportTeam: Yup.string()
      .oneOf(['Yes', 'No', 'In development'], 'Active peer support team value is invalid')
      .required('Active peer support team value is required'),
    hasEmployeeAssistanceProgram: Yup.string()
      .oneOf(['Yes', 'No'], 'Employee Assistance Program value is invalid')
      .required('Employee Assistance Program value is required'),
    goal1PrimaryAnnualGoal: Yup.string().trim().required('Goal 1 primary annual goal is required'),
    goal1TargetMetric: Yup.string().trim().notRequired(),
    goal1Timeframe: Yup.string()
      .oneOf(['Annual (Q1-Q4)', 'First half (Q1-Q2)', 'Second half (Q3-Q4)'], 'Goal 1 timeframe is invalid')
      .required('Goal 1 timeframe is required'),
    goal2SecondaryAnnualGoal: Yup.string().trim().notRequired(),
    goal2TargetMetric: Yup.string().trim().notRequired(),
    goal2Timeframe: Yup.string()
      .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
      .oneOf(['Annual', 'First half', 'Second half'], 'Goal 2 timeframe is invalid')
      .notRequired(),
  })
  .test(
    'goal-metric-required',
    'At least one goal must include a measurable target (percentage, number, or threshold) so the system can track progress and generate accurate recommendations.',
    (values) => {
      if (!values) {
        return false;
      }

      const goal1Metric = typeof values.goal1TargetMetric === 'string' ? values.goal1TargetMetric.trim() : '';
      const goal2Metric = typeof values.goal2TargetMetric === 'string' ? values.goal2TargetMetric.trim() : '';
      return Boolean(goal1Metric || goal2Metric);
    }
  );

const toOptionalString = (value: string): string | undefined => {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
};

const toOptionalNumber = (value: string): number | undefined => {
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const hasAnyPayloadValues = (input: Record<string, unknown>): boolean => {
  return Object.values(input).some((value) => value !== undefined && value !== null && value !== '');
};

const buildMonthlyCorePayload = (values: MonthlyFormValues) => ({
  organizationalStability: {
    currentlyFilledPositions: Number(values.currentlyFilledPositions),
    currentVacancies: Number(values.currentVacancies),
    resignationsThisMonth: Number(values.resignationsThisMonth),
    newHiresAndAcademyGraduates: Number(values.newHiresAndAcademyGraduates),
    averageTimeToFillDays: Number(values.averageTimeToFillDays),
    leadershipLevelVacancies: Number(values.leadershipLevelVacancies),
  },
  operationalResilience: {
    totalOvertimeHours: Number(values.totalOvertimeHours),
    averageShiftLengthHours: Number(values.averageShiftLengthHours),
    shiftCoverageShortages: Number(values.shiftCoverageShortages),
    mandatoryOvertimePercentage: Number(values.mandatoryOvertimePercentage),
    plannedOvertimePercentage: Number(values.plannedOvertimePercentage),
    unplannedOvertimePercentage: Number(values.unplannedOvertimePercentage),
    callInAndHoldoverIncidents: Number(values.callInAndHoldoverIncidents),
  },
  fatigueResistance: {
    totalSickLeaveDaysUsed: Number(values.totalSickLeaveDaysUsed),
  },
  peerSupportReadiness: {
    employeesOnFmlaLeave: Number(values.employeesOnFmlaLeave),
    newFmlaRequests: Number(values.newFmlaRequests),
    workersCompClaimsFiled: Number(values.workersCompClaimsFiled),
    peerSupportActivations: Number(values.peerSupportActivations),
    criticalIncidentExposures: Number(values.criticalIncidentExposures),
    lineOfDutyDeathsOrSeriousInjuries: values.lineOfDutyDeathsOrSeriousInjuries as 'Yes' | 'No',
    lineOfDutyDeathsOrSeriousInjuriesCount:
      values.lineOfDutyDeathsOrSeriousInjuries === 'Yes'
        ? Number(values.lineOfDutyDeathsOrSeriousInjuriesCount)
        : 0,
  },
  leadershipSustainability: {
    leadershipMoraleRating: Number(values.leadershipMoraleRating),
    frontlineMoraleRating: Number(values.frontlineMoraleRating),
    disciplinaryActions: Number(values.disciplinaryActions),
    formalGrievancesFiled: Number(values.formalGrievancesFiled),
    promotionsOrLeadershipDevelopmentCount: Number(values.promotionsOrLeadershipDevelopmentCount),
  },
  dataConfidence: values.dataConfidence as 'High' | 'Moderate' | 'Low',
});

const buildMonthlyOptionalPayload = (values: MonthlyFormValues): MonthlyOptionalPayload | undefined => {
  const payload: MonthlyOptionalPayload = {};

  const budgetAndFiscalContext: NonNullable<MonthlyOptionalPayload['budgetAndFiscalContext']> = {
    overtimeBudgetUtilizationPercentage: toOptionalNumber(values.overtimeBudgetUtilizationPercentage),
    hiringBudgetAvailability: toOptionalString(values.hiringBudgetAvailability) as 'Full' | 'Limited' | 'Frozen' | undefined,
    staffingBudgetConstraint: toOptionalString(values.staffingBudgetConstraint) as
      | 'Yes'
      | 'No'
      | 'Under review'
      | undefined,
  };

  if (hasAnyPayloadValues(budgetAndFiscalContext)) {
    payload.budgetAndFiscalContext = budgetAndFiscalContext;
  }

  const operationalDemandContext: NonNullable<MonthlyOptionalPayload['operationalDemandContext']> = {
    totalCallsOrIncidents: toOptionalNumber(values.totalCallsOrIncidents),
    responseTimeStandardsMet: toOptionalString(values.responseTimeStandardsMet) as 'Yes' | 'No' | 'Partially' | undefined,
    specialtyUnitVacancies: toOptionalNumber(values.specialtyUnitVacancies),
  };

  if (hasAnyPayloadValues(operationalDemandContext)) {
    payload.operationalDemandContext = operationalDemandContext;
  }

  const fatiguePrecisionInputs: NonNullable<MonthlyOptionalPayload['fatiguePrecisionInputs']> = {
    minimumRestPeriodRequirementMet: toOptionalString(values.minimumRestPeriodRequirementMet) as
      | 'Yes'
      | 'No'
      | 'No policy'
      | undefined,
    ptoVacationAccrualBacklog: toOptionalString(values.ptoVacationAccrualBacklog) as
      | 'Yes'
      | 'No'
      | 'Some personnel affected'
      | undefined,
    returnToDutyIncidentsBeforeFullRecovery: toOptionalNumber(values.returnToDutyIncidentsBeforeFullRecovery),
  };

  if (hasAnyPayloadValues(fatiguePrecisionInputs)) {
    payload.fatiguePrecisionInputs = fatiguePrecisionInputs;
  }

  const concern = toOptionalString(values.topLeadershipConcern) as TopLeadershipConcernOption | undefined;
  const peerSupportDepthInputs: NonNullable<MonthlyOptionalPayload['peerSupportDepthInputs']> = {
    eapReferralsOrUtilizations: toOptionalNumber(values.eapReferralsOrUtilizations),
    topLeadershipConcern: concern,
    topLeadershipConcernOther: concern === 'Other' ? toOptionalString(values.topLeadershipConcernOther) : undefined,
    additionalContextOrNotes: toOptionalString(values.additionalContextOrNotes),
  };

  if (hasAnyPayloadValues(peerSupportDepthInputs)) {
    payload.peerSupportDepthInputs = peerSupportDepthInputs;
  }

  return hasAnyPayloadValues(payload as Record<string, unknown>) ? payload : undefined;
};

const clearMonthlyOptionalValues = (values: MonthlyFormValues): MonthlyFormValues => {
  const nextValues = { ...values };

  MONTHLY_OPTIONAL_FIELD_NAMES.forEach((field) => {
    nextValues[field] = '';
  });

  return nextValues;
};

export function MonthlyCheckInForm() {
  const [activeTab, setActiveTab] = useState<ActiveFormTab>('monthly');
  const [currentMonthlyCoreStep, setCurrentMonthlyCoreStep] = useState(1);
  const [showMonthlyOptionalFlow, setShowMonthlyOptionalFlow] = useState(false);
  const [currentMonthlyOptionalStep, setCurrentMonthlyOptionalStep] = useState(1);
  const [currentAnnualStep, setCurrentAnnualStep] = useState(1);
  const [monthlySuccessMessage, setMonthlySuccessMessage] = useState('');
  const [annualSuccessMessage, setAnnualSuccessMessage] = useState('');
  const submitMonthlyWithOptionalRef = useRef(false);

  const [submitMonthlyCheckIn, { isLoading: isSubmittingMonthly, error: monthlySubmitError }] = useSubmitMonthlyCheckInMutation();
  const [submitAnnualBaseline, { isLoading: isSubmittingAnnual, error: annualSubmitError }] = useSubmitAnnualBaselineMutation();

  const monthlySubmitErrorMessage = extractRtkErrorMessage(monthlySubmitError);
  const annualSubmitErrorMessage = extractRtkErrorMessage(annualSubmitError);

  const monthlyFormik = useFormik<MonthlyFormValues>({
    initialValues: MONTHLY_INITIAL_VALUES,
    validationSchema: monthlyValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setMonthlySuccessMessage('');

      try {
        await submitMonthlyCheckIn({
          core: buildMonthlyCorePayload(values),
          optional: submitMonthlyWithOptionalRef.current ? buildMonthlyOptionalPayload(values) : undefined,
        }).unwrap();

        setMonthlySuccessMessage('Monthly check-in submitted successfully.');
        setCurrentMonthlyCoreStep(1);
        setShowMonthlyOptionalFlow(false);
        setCurrentMonthlyOptionalStep(1);
        submitMonthlyWithOptionalRef.current = false;
        resetForm();
        window.scrollTo(0, 0);
      } catch {
        setMonthlySuccessMessage('');
      }
    },
  });

  const annualFormik = useFormik<AnnualBaselineFormValues>({
    initialValues: ANNUAL_INITIAL_VALUES,
    validationSchema: annualValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setAnnualSuccessMessage('');

      try {
        await submitAnnualBaseline({
          agencyIdentity: {
            agencyName: values.agencyName.trim(),
            agencyType: values.agencyType as 'Law enforcement' | 'Fire' | 'EMS' | 'Dispatch' | 'Combined',
            agencySizeCategory: values.agencySizeCategory as 'Small (<25)' | 'Medium (25-99)' | 'Large (100-299)' | 'Major (300+)',
            primaryServiceJurisdiction: values.primaryServiceJurisdiction.trim(),
            geographicCoverageArea: Number(values.geographicCoverageArea),
          },
          structuralStaffingProfile: {
            totalAuthorizedPositions: Number(values.totalAuthorizedPositions),
            totalFundedPositions: Number(values.totalFundedPositions),
            minimumSafeStaffingLevel: Number(values.minimumSafeStaffingLevel),
            specialtyUnitPositionsCount: Number(values.specialtyUnitPositionsCount),
            supervisorToStaffRatio: values.supervisorToStaffRatio.trim(),
          },
          operationalInfrastructure: {
            standardShiftLengthHours: Number(values.standardShiftLengthHours),
            shiftScheduleType: values.shiftScheduleType as '8-hour' | '10-hour' | '12-hour' | 'Mixed',
            minimumRestPeriodPolicyExists: values.minimumRestPeriodPolicyExists as 'Yes' | 'No',
            activePeerSupportTeam: values.activePeerSupportTeam as 'Yes' | 'No' | 'In development',
            hasEmployeeAssistanceProgram: values.hasEmployeeAssistanceProgram as 'Yes' | 'No',
          },
          goalsAndStrategicDirection: {
            goal1PrimaryAnnualGoal: values.goal1PrimaryAnnualGoal.trim(),
            goal1TargetMetric: toOptionalString(values.goal1TargetMetric),
            goal1Timeframe: values.goal1Timeframe as 'Annual (Q1-Q4)' | 'First half (Q1-Q2)' | 'Second half (Q3-Q4)',
            goal2SecondaryAnnualGoal: toOptionalString(values.goal2SecondaryAnnualGoal),
            goal2TargetMetric: toOptionalString(values.goal2TargetMetric),
            goal2Timeframe: toOptionalString(values.goal2Timeframe) as 'Annual' | 'First half' | 'Second half' | undefined,
          },
          baselineYear: new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1)).toISOString().slice(0, 10),
        }).unwrap();

        setAnnualSuccessMessage('Annual baseline submitted successfully.');
        setCurrentAnnualStep(1);
        resetForm();
        window.scrollTo(0, 0);
      } catch {
        setAnnualSuccessMessage('');
      }
    },
  });

  const getMonthlyFieldError = (fieldName: keyof MonthlyFormValues): string | null => {
    const touched = monthlyFormik.touched[fieldName];
    const error = monthlyFormik.errors[fieldName];
    return touched && typeof error === 'string' ? error : null;
  };

  const getAnnualFieldError = (fieldName: keyof AnnualBaselineFormValues): string | null => {
    const touched = annualFormik.touched[fieldName];
    const error = annualFormik.errors[fieldName];
    return touched && typeof error === 'string' ? error : null;
  };

  const validateMonthlyStep = async (fields: string[]) => {
    const touchedFields: Record<string, boolean> = {};
    fields.forEach((field) => {
      touchedFields[field] = true;
    });

    monthlyFormik.setTouched({ ...(monthlyFormik.touched as Record<string, boolean>), ...touchedFields });

    try {
      const stepValues: Record<string, unknown> = {};
      fields.forEach((field) => {
        stepValues[field] = monthlyFormik.values[field as keyof MonthlyFormValues];
      });

      const schemaFields = (monthlyValidationSchema as Yup.AnyObjectSchema).fields as Record<string, Yup.AnySchema>;
      const stepSchemaShape: Record<string, Yup.AnySchema> = {};
      fields.forEach((field) => {
        const fieldSchema = schemaFields[field];
        if (fieldSchema) {
          stepSchemaShape[field] = fieldSchema;
        }
      });

      const stepSchema = Yup.object().shape(stepSchemaShape);
      await stepSchema.validate(stepValues, { abortEarly: false });
      return true;
    } catch {
      return false;
    }
  };

  const validateAnnualStep = async (fields: string[]) => {
    const touchedFields: Record<string, boolean> = {};
    fields.forEach((field) => {
      touchedFields[field] = true;
    });

    annualFormik.setTouched({ ...(annualFormik.touched as Record<string, boolean>), ...touchedFields });

    try {
      const stepValues: Record<string, unknown> = {};
      fields.forEach((field) => {
        stepValues[field] = annualFormik.values[field as keyof AnnualBaselineFormValues];
      });

      const schemaFields = (annualValidationSchema as Yup.AnyObjectSchema).fields as Record<string, Yup.AnySchema>;
      const stepSchemaShape: Record<string, Yup.AnySchema> = {};
      fields.forEach((field) => {
        const fieldSchema = schemaFields[field];
        if (fieldSchema) {
          stepSchemaShape[field] = fieldSchema;
        }
      });

      const stepSchema = Yup.object().shape(stepSchemaShape);
      await stepSchema.validate(stepValues, { abortEarly: false });
      return true;
    } catch {
      return false;
    }
  };

  const getActiveMonthlyStepFields = (fields: string[]) => {
    let activeFields = [...fields];

    if (monthlyFormik.values.lineOfDutyDeathsOrSeriousInjuries !== 'Yes') {
      activeFields = activeFields.filter((field) => field !== 'lineOfDutyDeathsOrSeriousInjuriesCount');
    }

    if (monthlyFormik.values.topLeadershipConcern !== 'Other') {
      activeFields = activeFields.filter((field) => field !== 'topLeadershipConcernOther');
    }

    return activeFields;
  };

  const handleMonthlyNext = async () => {
    if (showMonthlyOptionalFlow) {
      if (currentMonthlyOptionalStep >= MONTHLY_OPTIONAL_STEPS.length) {
        return;
      }

      const fields = getActiveMonthlyStepFields(MONTHLY_OPTIONAL_STEPS[currentMonthlyOptionalStep - 1].fields);
      const isValid = await validateMonthlyStep(fields);

      if (isValid) {
        setCurrentMonthlyOptionalStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }

      return;
    }

    if (currentMonthlyCoreStep >= MONTHLY_CORE_STEPS.length) {
      return;
    }

    const fields = getActiveMonthlyStepFields(MONTHLY_CORE_STEPS[currentMonthlyCoreStep - 1].fields);
    const isValid = await validateMonthlyStep(fields);

    if (isValid) {
      setCurrentMonthlyCoreStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleMonthlyBack = () => {
    if (showMonthlyOptionalFlow) {
      if (currentMonthlyOptionalStep > 1) {
        setCurrentMonthlyOptionalStep((prev) => prev - 1);
      } else {
        setShowMonthlyOptionalFlow(false);
        setCurrentMonthlyCoreStep(MONTHLY_CORE_STEPS.length);
      }

      window.scrollTo(0, 0);
      return;
    }

    if (currentMonthlyCoreStep > 1) {
      setCurrentMonthlyCoreStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleOpenMonthlyOptionalFlow = async () => {
    const fields = getActiveMonthlyStepFields(MONTHLY_CORE_STEPS[currentMonthlyCoreStep - 1].fields);
    const isValid = await validateMonthlyStep(fields);

    if (isValid) {
      setShowMonthlyOptionalFlow(true);
      setCurrentMonthlyOptionalStep(1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmitMonthly = async (includeOptional: boolean) => {
    submitMonthlyWithOptionalRef.current = includeOptional;

    if (!includeOptional) {
      await monthlyFormik.setValues(clearMonthlyOptionalValues(monthlyFormik.values), false);
    }

    await monthlyFormik.submitForm();
  };

  const handleAnnualNext = async () => {
    if (currentAnnualStep >= ANNUAL_STEPS.length) {
      return;
    }

    const isValid = await validateAnnualStep(ANNUAL_STEPS[currentAnnualStep - 1].fields);
    if (isValid) {
      setCurrentAnnualStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleAnnualBack = () => {
    if (currentAnnualStep > 1) {
      setCurrentAnnualStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderMonthlyNumberField = (
    name: keyof MonthlyFormValues,
    label: string,
    placeholder: string,
    helpText: string,
    options?: { min?: string | number; max?: string | number; step?: string | number }
  ) => (
    <Input
      type="number"
      name={name}
      label={label}
      placeholder={placeholder}
      helpText={helpText}
      value={monthlyFormik.values[name]}
      onChange={monthlyFormik.handleChange}
      onBlur={monthlyFormik.handleBlur}
      error={getMonthlyFieldError(name) || undefined}
      min={options?.min}
      max={options?.max}
      step={options?.step}
      containerClassName="flex flex-col gap-1"
      labelClassName={FIELD_LABEL_CLASS}
      inputClassName={FIELD_INPUT_CLASS}
      errorClassName={FIELD_ERROR_CLASS}
      helpTextClassName={FIELD_HELP_CLASS}
    />
  );

  const renderMonthlySelectField = (
    name: keyof MonthlyFormValues,
    label: string,
    options: Array<{ label: string; value: string }>,
    helpText: string
  ) => {
    const error = getMonthlyFieldError(name);

    return (
      <div className="flex flex-col gap-1">
        <label className={FIELD_LABEL_CLASS}>{label}</label>
        <select
          name={name}
          value={monthlyFormik.values[name]}
          onChange={monthlyFormik.handleChange}
          onBlur={monthlyFormik.handleBlur}
          className={`${FIELD_INPUT_CLASS} transition-colors ${
            error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-(--accent)'
          }`}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className={FIELD_ERROR_CLASS}>{error}</p>}
        <p className={FIELD_HELP_CLASS}>{helpText}</p>
      </div>
    );
  };

  const renderMonthlyTextareaField = (
    name: keyof MonthlyFormValues,
    label: string,
    placeholder: string,
    helpText: string
  ) => {
    const error = getMonthlyFieldError(name);

    return (
      <div className="flex flex-col gap-1">
        <label className={FIELD_LABEL_CLASS}>{label}</label>
        <textarea
          name={name}
          value={monthlyFormik.values[name]}
          onChange={monthlyFormik.handleChange}
          onBlur={monthlyFormik.handleBlur}
          rows={4}
          placeholder={placeholder}
          className={`${FIELD_INPUT_CLASS} resize-none transition-colors ${
            error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-(--accent)'
          }`}
        />
        {error && <p className={FIELD_ERROR_CLASS}>{error}</p>}
        <p className={FIELD_HELP_CLASS}>{helpText}</p>
      </div>
    );
  };

  const renderAnnualTextField = (
    name: keyof AnnualBaselineFormValues,
    label: string,
    placeholder: string,
    helpText: string
  ) => (
    <Input
      type="text"
      name={name}
      label={label}
      placeholder={placeholder}
      helpText={helpText}
      value={annualFormik.values[name]}
      onChange={annualFormik.handleChange}
      onBlur={annualFormik.handleBlur}
      error={getAnnualFieldError(name) || undefined}
      containerClassName="flex flex-col gap-1"
      labelClassName={FIELD_LABEL_CLASS}
      inputClassName={FIELD_INPUT_CLASS}
      errorClassName={FIELD_ERROR_CLASS}
      helpTextClassName={FIELD_HELP_CLASS}
    />
  );

  const renderAnnualNumberField = (
    name: keyof AnnualBaselineFormValues,
    label: string,
    placeholder: string,
    helpText: string,
    options?: { min?: string | number; max?: string | number; step?: string | number }
  ) => (
    <Input
      type="number"
      name={name}
      label={label}
      placeholder={placeholder}
      helpText={helpText}
      value={annualFormik.values[name]}
      onChange={annualFormik.handleChange}
      onBlur={annualFormik.handleBlur}
      error={getAnnualFieldError(name) || undefined}
      min={options?.min}
      max={options?.max}
      step={options?.step}
      containerClassName="flex flex-col gap-1"
      labelClassName={FIELD_LABEL_CLASS}
      inputClassName={FIELD_INPUT_CLASS}
      errorClassName={FIELD_ERROR_CLASS}
      helpTextClassName={FIELD_HELP_CLASS}
    />
  );

  const renderAnnualSelectField = (
    name: keyof AnnualBaselineFormValues,
    label: string,
    options: Array<{ label: string; value: string }>,
    helpText: string
  ) => {
    const error = getAnnualFieldError(name);

    return (
      <div className="flex flex-col gap-1">
        <label className={FIELD_LABEL_CLASS}>{label}</label>
        <select
          name={name}
          value={annualFormik.values[name]}
          onChange={annualFormik.handleChange}
          onBlur={annualFormik.handleBlur}
          className={`${FIELD_INPUT_CLASS} transition-colors ${
            error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-(--accent)'
          }`}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className={FIELD_ERROR_CLASS}>{error}</p>}
        <p className={FIELD_HELP_CLASS}>{helpText}</p>
      </div>
    );
  };

  const renderAnnualTextareaField = (
    name: keyof AnnualBaselineFormValues,
    label: string,
    placeholder: string,
    helpText: string,
    rows = 3
  ) => {
    const error = getAnnualFieldError(name);

    return (
      <div className="flex flex-col gap-1">
        <label className={FIELD_LABEL_CLASS}>{label}</label>
        <textarea
          name={name}
          value={annualFormik.values[name]}
          onChange={annualFormik.handleChange}
          onBlur={annualFormik.handleBlur}
          rows={rows}
          placeholder={placeholder}
          className={`${FIELD_INPUT_CLASS} resize-none transition-colors ${
            error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-(--accent)'
          }`}
        />
        {error && <p className={FIELD_ERROR_CLASS}>{error}</p>}
        <p className={FIELD_HELP_CLASS}>{helpText}</p>
      </div>
    );
  };

  const renderMonthlyStepContent = () => {
    if (showMonthlyOptionalFlow) {
      switch (currentMonthlyOptionalStep) {
        case 1:
          return (
            <div className="space-y-5">
              {renderMonthlyNumberField(
                'overtimeBudgetUtilizationPercentage',
                'B-1 Overtime Budget Utilization This Month (%)',
                'e.g. 112',
                'Optional precision input. Over 100% indicates over-budget overtime.',
                { min: 0 }
              )}
              {renderMonthlySelectField(
                'hiringBudgetAvailability',
                'B-2 Is Recruitment Or Hiring Budget Currently Available?',
                HIRING_BUDGET_OPTIONS,
                'Optional context for staffing and vacancy interventions.'
              )}
              {renderMonthlySelectField(
                'staffingBudgetConstraint',
                'B-3 Is The Agency Operating Under A Budget Constraint Affecting Staffing Decisions?',
                STAFFING_BUDGET_CONSTRAINT_OPTIONS,
                'Optional strategic context for all domain recommendations.'
              )}
            </div>
          );
        case 2:
          return (
            <div className="space-y-5">
              {renderMonthlyNumberField(
                'totalCallsOrIncidents',
                'OD-1 Total Calls Or Incidents This Month',
                'e.g. 1850',
                'Optional demand-side context used for staffing-to-demand interpretation.',
                { min: 0 }
              )}
              {renderMonthlySelectField(
                'responseTimeStandardsMet',
                'OD-2 Were Response Time Standards Met This Month?',
                RESPONSE_STANDARD_OPTIONS,
                'Optional operational outcome signal.'
              )}
              {renderMonthlyNumberField(
                'specialtyUnitVacancies',
                'OD-3 Specialty Unit Vacancies This Month',
                'e.g. 2',
                'Optional capability gap indicator separate from general vacancies.',
                { min: 0 }
              )}
            </div>
          );
        case 3:
          return (
            <div className="space-y-5">
              {renderMonthlySelectField(
                'minimumRestPeriodRequirementMet',
                'F-1 Is The Agency Meeting Its Minimum Rest Period Requirement Between Shifts?',
                REST_REQUIREMENT_OPTIONS,
                'Optional compliance check against baseline policy.'
              )}
              {renderMonthlySelectField(
                'ptoVacationAccrualBacklog',
                'F-2 PTO And Vacation Accrual Backlog Present?',
                PTO_BACKLOG_OPTIONS,
                'Optional fatigue and morale precision signal.'
              )}
              {renderMonthlyNumberField(
                'returnToDutyIncidentsBeforeFullRecovery',
                'F-3 Return-To-Duty Incidents Before Full Recovery (Count)',
                'e.g. 1',
                'Optional liability and wellness context.',
                { min: 0 }
              )}
            </div>
          );
        case 4:
          return (
            <div className="space-y-5">
              {renderMonthlyNumberField(
                'eapReferralsOrUtilizations',
                'PS-1 EAP Referrals Or Utilizations This Month',
                'e.g. 4',
                'Optional context for peer support utilization depth.',
                { min: 0 }
              )}
              {renderMonthlySelectField(
                'topLeadershipConcern',
                'PS-2 Top Leadership Concern This Month',
                TOP_CONCERN_OPTIONS,
                'Optional strategic input that enriches the AI plan engine.'
              )}
              {monthlyFormik.values.topLeadershipConcern === 'Other' &&
                renderMonthlyTextareaField(
                  'topLeadershipConcernOther',
                  'PS-2 Other Leadership Concern',
                  'Describe the other top leadership concern...',
                  'Required only when "Other" is selected.'
                )}
              {renderMonthlyTextareaField(
                'additionalContextOrNotes',
                'PS-3 Additional Context Or Notes',
                'Add any context not captured by structured fields...',
                'Optional unstructured context for report interpretation and planning.'
              )}
            </div>
          );
        default:
          return null;
      }
    }

    switch (currentMonthlyCoreStep) {
      case 1:
        return (
          <div className="space-y-5">
            {renderMonthlyNumberField(
              'currentlyFilledPositions',
              '1-1 Currently Filled Positions',
              'e.g. 145',
              'Required. Used for fill rate and multiple domain calculations.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'currentVacancies',
              '1-2 Current Vacancies',
              'e.g. 8',
              'Required. Used for monthly vacancy rate.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'resignationsThisMonth',
              '1-3 Resignations This Month',
              'e.g. 2',
              'Required. Used for turnover rate.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'newHiresAndAcademyGraduates',
              '1-4 New Hires And Academy Graduates This Month',
              'e.g. 3',
              'Required. Used for hiring effectiveness.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'averageTimeToFillDays',
              '1-5 Average Time-To-Fill For Positions Opened This Month (Days)',
              'e.g. 45',
              'Required. Enter 0 if no positions opened.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'leadershipLevelVacancies',
              '1-6 Leadership-Level Vacancies This Month',
              'e.g. 1',
              'Required. Supervisor level and above.',
              { min: 0 }
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            {renderMonthlyNumberField(
              'totalOvertimeHours',
              '2-1 Total Overtime Hours (Agency-Wide) This Month',
              'e.g. 2847',
              'Required. Core overtime exposure input.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'averageShiftLengthHours',
              '2-2 Average Shift Length This Month (Hours)',
              'e.g. 11.5',
              'Required. Actual monthly average shift length.',
              { min: 0, step: 0.1 }
            )}
            {renderMonthlyNumberField(
              'shiftCoverageShortages',
              '2-3 Shift Coverage Shortages This Month (Number Of Shifts)',
              'e.g. 6',
              'Required. Count of uncovered or below-minimum shifts.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'mandatoryOvertimePercentage',
              '2-4 Percentage Of Overtime That Was Mandatory',
              'e.g. 35',
              'Required. Enter a percentage between 0 and 100.',
              { min: 0, max: 100, step: 0.1 }
            )}
            {renderMonthlyNumberField(
              'plannedOvertimePercentage',
              '2-5 Planned Overtime Percentage',
              'e.g. 40',
              'Required. Planned + unplanned must equal 100.',
              { min: 0, max: 100, step: 0.1 }
            )}
            {renderMonthlyNumberField(
              'unplannedOvertimePercentage',
              '2-5 Unplanned Overtime Percentage',
              'e.g. 60',
              'Required. Planned + unplanned must equal 100.',
              { min: 0, max: 100, step: 0.1 }
            )}
            {renderMonthlyNumberField(
              'callInAndHoldoverIncidents',
              '2-6 Call-In And Holdover Incidents This Month',
              'e.g. 9',
              'Required. Includes call-ins and holdovers.',
              { min: 0 }
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            {renderMonthlyNumberField(
              'totalSickLeaveDaysUsed',
              '3-1 Total Sick Leave Days Used This Month (Agency-Wide)',
              'e.g. 54',
              'Required. Domain 3 dedicated monthly question.',
              { min: 0 }
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            {renderMonthlyNumberField(
              'employeesOnFmlaLeave',
              '4-1 Employees Currently On FMLA Leave',
              'e.g. 5',
              'Required. Used for FMLA rate.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'newFmlaRequests',
              '4-2 New FMLA Requests This Month',
              'e.g. 2',
              'Required. Tracks growth in leave stress.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'workersCompClaimsFiled',
              '4-3 Workers Comp Claims Filed This Month',
              'e.g. 1',
              'Required monthly count.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'peerSupportActivations',
              '4-4 Peer Support Activations This Month',
              'e.g. 4',
              'Required. Evaluated relative to critical incidents.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'criticalIncidentExposures',
              '4-5 Critical Incident Exposures This Month',
              'e.g. 6',
              'Required context for peer support activation ratio.',
              { min: 0 }
            )}
            {renderMonthlySelectField(
              'lineOfDutyDeathsOrSeriousInjuries',
              '4-6 Line-Of-Duty Deaths Or Serious Injuries This Period',
              YES_NO_OPTIONS,
              'Required. If Yes, enter count.'
            )}
            {monthlyFormik.values.lineOfDutyDeathsOrSeriousInjuries === 'Yes' &&
              renderMonthlyNumberField(
                'lineOfDutyDeathsOrSeriousInjuriesCount',
                '4-6 Count For Line-Of-Duty Deaths Or Serious Injuries',
                'e.g. 1',
                'Required when 4-6 is Yes.',
                { min: 1 }
              )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-5">
            {renderMonthlyNumberField(
              'leadershipMoraleRating',
              '5-1 Leadership Morale Rating This Month (1-10)',
              '1 = Very Low, 10 = Excellent',
              'Required command-level morale indicator.',
              { min: 1, max: 10 }
            )}
            {renderMonthlyNumberField(
              'frontlineMoraleRating',
              '5-2 Frontline / Line-Level Morale Rating This Month (1-10)',
              '1 = Very Low, 10 = Excellent',
              'Required frontline morale indicator.',
              { min: 1, max: 10 }
            )}
            {renderMonthlyNumberField(
              'disciplinaryActions',
              '5-3 Disciplinary Actions This Month (Count)',
              'e.g. 1',
              'Required monthly count.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'formalGrievancesFiled',
              '5-4 Formal Grievances Or Complaints Filed By Personnel This Month',
              'e.g. 2',
              'Required monthly count.',
              { min: 0 }
            )}
            {renderMonthlyNumberField(
              'promotionsOrLeadershipDevelopmentCount',
              '5-5 Promotions Or Leadership Development Activity This Period',
              'e.g. 1',
              'Required. Enter 0 if none.',
              { min: 0 }
            )}
          </div>
        );
      case 6:
        return (
          <div className="space-y-5">
            {renderMonthlySelectField(
              'dataConfidence',
              'DC-1 What Is The Confidence Level Of The Data Submitted This Month?',
              MONTHLY_DATA_CONFIDENCE_OPTIONS,
              'Required. This does not change scores but it adjusts report language and AI tone.'
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderAnnualStepContent = () => {
    switch (currentAnnualStep) {
      case 1:
        return (
          <div className="space-y-5">
            {renderAnnualTextField('agencyName', 'A-1 Agency Name', 'Agency name', 'Required annual baseline identity field.')}
            {renderAnnualSelectField(
              'agencyType',
              'A-2 Agency Type',
              ANNUAL_AGENCY_TYPE_OPTIONS,
              'Required annual baseline identity field.'
            )}
            {renderAnnualSelectField(
              'agencySizeCategory',
              'A-3 Agency Size Category',
              ANNUAL_AGENCY_SIZE_OPTIONS,
              'Required annual baseline identity field.'
            )}
            {renderAnnualTextField(
              'primaryServiceJurisdiction',
              'A-4 Primary Service Jurisdiction',
              'City, county, or district',
              'Required annual baseline identity field.'
            )}
            {renderAnnualNumberField(
              'geographicCoverageArea',
              'A-5 Geographic Coverage Area',
              'e.g. 220',
              'Required. Enter square miles or zone count.',
              { min: 0 }
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            {renderAnnualNumberField(
              'totalAuthorizedPositions',
              'A-6 Total Authorized Positions',
              'e.g. 180',
              'Required denominator for fill, vacancy, and turnover rates.',
              { min: 0 }
            )}
            {renderAnnualNumberField(
              'totalFundedPositions',
              'A-7 Total Funded Positions',
              'e.g. 170',
              'Required fiscal capacity input.',
              { min: 0 }
            )}
            {renderAnnualNumberField(
              'minimumSafeStaffingLevel',
              'A-8 Minimum Safe Staffing Level (Agency-Defined)',
              'e.g. 132',
              'Required absolute staffing floor.',
              { min: 0 }
            )}
            {renderAnnualNumberField(
              'specialtyUnitPositionsCount',
              'A-9 Specialty Unit Positions (Count)',
              'e.g. 24',
              'Required specialty staffing denominator.',
              { min: 0 }
            )}
            {renderAnnualTextField(
              'supervisorToStaffRatio',
              'A-10 Supervisor-To-Staff Ratio (Current)',
              'e.g. 1:8',
              'Required format is ratio such as 1:8.'
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            {renderAnnualNumberField(
              'standardShiftLengthHours',
              'A-11 Standard Shift Length (Hours)',
              'e.g. 12',
              'Required baseline context for operational and fatigue domains.',
              { min: 0 }
            )}
            {renderAnnualSelectField(
              'shiftScheduleType',
              'A-12 Shift Schedule Type',
              ANNUAL_SHIFT_SCHEDULE_OPTIONS,
              'Required annual infrastructure setting.'
            )}
            {renderAnnualSelectField(
              'minimumRestPeriodPolicyExists',
              'A-13 Minimum Rest Period Policy Between Shifts?',
              YES_NO_OPTIONS,
              'Required baseline policy question.'
            )}
            {renderAnnualSelectField(
              'activePeerSupportTeam',
              'A-14 Active Peer Support Team?',
              PEER_SUPPORT_TEAM_OPTIONS,
              'Required baseline support infrastructure question.'
            )}
            {renderAnnualSelectField(
              'hasEmployeeAssistanceProgram',
              'A-15 Employee Assistance Program (EAP)?',
              YES_NO_OPTIONS,
              'Required baseline support infrastructure question.'
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            {renderAnnualTextareaField(
              'goal1PrimaryAnnualGoal',
              'G-1 Goal 1 - Primary Annual Goal',
              'Describe the primary annual goal and include category context.',
              'Required strategic goal input.'
            )}
            {renderAnnualTextField(
              'goal1TargetMetric',
              'G-2 Goal 1 - Target Metric',
              'e.g. Reach 90% fill rate',
              'At least one of G-2 or G-5 must be provided.'
            )}
            {renderAnnualSelectField(
              'goal1Timeframe',
              'G-3 Goal 1 - Timeframe',
              GOAL_1_TIMEFRAME_OPTIONS,
              'Required for Goal 1 milestone generation.'
            )}
            {renderAnnualTextareaField(
              'goal2SecondaryAnnualGoal',
              'G-4 Goal 2 - Secondary Annual Goal (Optional)',
              'Optional secondary goal.',
              'Optional strategic secondary goal.'
            )}
            {renderAnnualTextField(
              'goal2TargetMetric',
              'G-5 Goal 2 - Target Metric (Optional)',
              'e.g. Maintain OT below 15%',
              'At least one of G-2 or G-5 must be provided.'
            )}
            {renderAnnualSelectField(
              'goal2Timeframe',
              'G-6 Goal 2 - Timeframe (Optional)',
              GOAL_2_TIMEFRAME_OPTIONS,
              'Optional timeframe for Goal 2.'
            )}
            <div className="rounded-md border border-slate-700 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
              Validation rule: If both G-2 and G-5 are blank, submission is blocked.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const monthlyStepData = showMonthlyOptionalFlow
    ? MONTHLY_OPTIONAL_STEPS[currentMonthlyOptionalStep - 1]
    : MONTHLY_CORE_STEPS[currentMonthlyCoreStep - 1];
  const monthlyStepCount = showMonthlyOptionalFlow ? MONTHLY_OPTIONAL_STEPS.length : MONTHLY_CORE_STEPS.length;
  const monthlyStepIndex = showMonthlyOptionalFlow ? currentMonthlyOptionalStep : currentMonthlyCoreStep;
  const annualStepData = ANNUAL_STEPS[currentAnnualStep - 1];

  return (
    <div className="px-7 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
          Operational Diagnostic System Forms
        </h1>
        <p className="text-sm">
          Complete Monthly Core required questions, optional precision inputs, and the Annual Baseline in separate flows.
        </p>

        <div className="mt-4 inline-flex rounded-lg border border-slate-700 bg-slate-900/70 p-1 gap-1">
          <Button
            type="button"
            onClick={() => setActiveTab('monthly')}
            buttonClassName={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${
              activeTab === 'monthly'
                ? 'bg-(--accent) text-slate-950'
                : 'bg-transparent text-slate-300 border border-slate-700 hover:text-white'
            }`}
            style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
          >
            Monthly
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab('annual')}
            buttonClassName={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${
              activeTab === 'annual'
                ? 'bg-(--accent) text-slate-950'
                : 'bg-transparent text-slate-300 border border-slate-700 hover:text-white'
            }`}
            style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
          >
            Annual
          </Button>
        </div>

        {activeTab === 'monthly' && monthlySubmitErrorMessage && (
          <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded">
            {monthlySubmitErrorMessage}
          </div>
        )}
        {activeTab === 'monthly' && monthlySuccessMessage && (
          <div className="mt-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded">
            {monthlySuccessMessage}
          </div>
        )}

        {activeTab === 'annual' && annualSubmitErrorMessage && (
          <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded">
            {annualSubmitErrorMessage}
          </div>
        )}
        {activeTab === 'annual' && annualSuccessMessage && (
          <div className="mt-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded">
            {annualSuccessMessage}
          </div>
        )}
      </div>

      {activeTab === 'monthly' && (
        <div className="bg-slate-800 border-t-4 border-t-(--accent) border border-slate-700 rounded-lg p-7">
          {showMonthlyOptionalFlow && (
            <div className="mb-5 rounded-md border border-slate-600 bg-slate-900/70 px-3 py-2 text-xs text-slate-300">
              Monthly Optional secondary flow is active. All fields here are optional and do not block core submission if skipped.
            </div>
          )}

          <div className="flex gap-1 mb-8">
            {[...Array(monthlyStepCount)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  i < monthlyStepIndex ? 'bg-(--accent)' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
              {monthlyStepData.title}
            </h2>
            <p className="text-sm">{monthlyStepData.description}</p>
            <p className="text-xs text-slate-400 mt-2">
              {showMonthlyOptionalFlow
                ? `Optional Step ${monthlyStepIndex} of ${monthlyStepCount}`
                : `Core Step ${monthlyStepIndex} of ${monthlyStepCount}`}
            </p>
          </div>

          <form onSubmit={monthlyFormik.handleSubmit} className="mb-8">
            {renderMonthlyStepContent()}
          </form>

          <hr className="border-t border-slate-700 mb-6" />

          <div className="flex justify-between gap-4 flex-wrap">
            <Button
              onClick={handleMonthlyBack}
              disabled={(!showMonthlyOptionalFlow && currentMonthlyCoreStep === 1) || isSubmittingMonthly}
              buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-gray-300 border border-slate-700 rounded-lg hover:border-slate-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
              type="button"
            >
              Back
            </Button>

            {!showMonthlyOptionalFlow && currentMonthlyCoreStep < MONTHLY_CORE_STEPS.length && (
              <Button
                onClick={handleMonthlyNext}
                disabled={isSubmittingMonthly}
                buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors"
                style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                type="button"
              >
                Next
              </Button>
            )}

            {!showMonthlyOptionalFlow && currentMonthlyCoreStep === MONTHLY_CORE_STEPS.length && (
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={handleOpenMonthlyOptionalFlow}
                  disabled={isSubmittingMonthly}
                  buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-gray-200 border border-slate-600 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                  type="button"
                >
                  More (Optional)
                </Button>
                <Button
                  onClick={() => handleSubmitMonthly(false)}
                  disabled={isSubmittingMonthly}
                  buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                  type="button"
                >
                  {isSubmittingMonthly ? 'Submitting...' : 'Submit Monthly Core'}
                </Button>
              </div>
            )}

            {showMonthlyOptionalFlow && (
              <div className="flex gap-3 flex-wrap">
                {currentMonthlyOptionalStep < MONTHLY_OPTIONAL_STEPS.length && (
                  <Button
                    onClick={handleMonthlyNext}
                    disabled={isSubmittingMonthly}
                    buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors"
                    style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                    type="button"
                  >
                    Next
                  </Button>
                )}

                <Button
                  onClick={() => handleSubmitMonthly(false)}
                  disabled={isSubmittingMonthly}
                  buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-gray-200 border border-slate-600 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                  type="button"
                >
                  {isSubmittingMonthly ? 'Submitting...' : 'Skip Optional And Submit Core'}
                </Button>

                {currentMonthlyOptionalStep === MONTHLY_OPTIONAL_STEPS.length && (
                  <Button
                    onClick={() => handleSubmitMonthly(true)}
                    disabled={isSubmittingMonthly}
                    buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors"
                    style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                    type="button"
                  >
                    {isSubmittingMonthly ? 'Submitting...' : 'Submit Core + Optional'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'annual' && (
        <div className="bg-slate-800 border-t-4 border-t-(--accent) border border-slate-700 rounded-lg p-7">
          <div className="flex gap-1 mb-8">
            {[...Array(ANNUAL_STEPS.length)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  i < currentAnnualStep ? 'bg-(--accent)' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
              {annualStepData.title}
            </h2>
            <p className="text-sm">{annualStepData.description}</p>
            <p className="text-xs text-slate-400 mt-2">
              Annual Step {currentAnnualStep} of {ANNUAL_STEPS.length}
            </p>
          </div>

          <form onSubmit={annualFormik.handleSubmit} className="mb-8">
            {renderAnnualStepContent()}
          </form>

          <hr className="border-t border-slate-700 mb-6" />

          <div className="flex justify-between gap-4 flex-wrap">
            <Button
              onClick={handleAnnualBack}
              disabled={currentAnnualStep === 1 || isSubmittingAnnual}
              buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-gray-300 border border-slate-700 rounded-lg hover:border-slate-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
              type="button"
            >
              Back
            </Button>

            {currentAnnualStep < ANNUAL_STEPS.length ? (
              <Button
                onClick={handleAnnualNext}
                disabled={isSubmittingAnnual}
                buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors"
                style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                type="button"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={annualFormik.submitForm}
                disabled={isSubmittingAnnual}
                buttonClassName="px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors"
                style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                type="button"
              >
                {isSubmittingAnnual ? 'Submitting...' : 'Submit Annual Baseline'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}