import type {
  MonthlyCheckInRequest,
  MonthlyCorePayload,
  MonthlyOptionalPayload,
  TopLeadershipConcern,
} from '@/redux/api/checkinApi';
import { MonthlyFormValues } from './types';
import { MONTHLY_OPTIONAL_FIELD_NAMES } from './config';

const toOptionalString = (value: string): string | undefined => {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
};

const toOptionalNumber = (value: string): number | undefined => {
  const normalized = value.trim();
  if (!normalized) return undefined;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const hasAnyValues = (input: Record<string, unknown>): boolean =>
  Object.values(input).some((value) => value !== undefined && value !== null && value !== '');

export const buildMonthlyCorePayload = (values: MonthlyFormValues): MonthlyCorePayload => ({
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

export const buildMonthlyOptionalPayload = (
  values: MonthlyFormValues,
): MonthlyOptionalPayload | undefined => {
  const payload: MonthlyOptionalPayload = {};

  const budgetAndFiscalContext: NonNullable<MonthlyOptionalPayload['budgetAndFiscalContext']> = {
    overtimeBudgetUtilizationPercentage: toOptionalNumber(
      values.overtimeBudgetUtilizationPercentage,
    ),
    hiringBudgetAvailability: toOptionalString(values.hiringBudgetAvailability) as
      | 'Full'
      | 'Limited'
      | 'Frozen'
      | undefined,
    staffingBudgetConstraint: toOptionalString(values.staffingBudgetConstraint) as
      | 'Yes'
      | 'No'
      | 'Under review'
      | undefined,
  };

  if (hasAnyValues(budgetAndFiscalContext)) {
    payload.budgetAndFiscalContext = budgetAndFiscalContext;
  }

  const operationalDemandContext: NonNullable<MonthlyOptionalPayload['operationalDemandContext']> =
    {
      totalCallsOrIncidents: toOptionalNumber(values.totalCallsOrIncidents),
      responseTimeStandardsMet: toOptionalString(values.responseTimeStandardsMet) as
        | 'Yes'
        | 'No'
        | 'Partially'
        | undefined,
      specialtyUnitVacancies: toOptionalNumber(values.specialtyUnitVacancies),
    };

  if (hasAnyValues(operationalDemandContext)) {
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
    returnToDutyIncidentsBeforeFullRecovery: toOptionalNumber(
      values.returnToDutyIncidentsBeforeFullRecovery,
    ),
  };

  if (hasAnyValues(fatiguePrecisionInputs)) {
    payload.fatiguePrecisionInputs = fatiguePrecisionInputs;
  }

  const concern = toOptionalString(values.topLeadershipConcern) as TopLeadershipConcern | undefined;

  const peerSupportDepthInputs: NonNullable<MonthlyOptionalPayload['peerSupportDepthInputs']> = {
    eapReferralsOrUtilizations: toOptionalNumber(values.eapReferralsOrUtilizations),
    topLeadershipConcern: concern,
    topLeadershipConcernOther:
      concern === 'Other' ? toOptionalString(values.topLeadershipConcernOther) : undefined,
    additionalContextOrNotes: toOptionalString(values.additionalContextOrNotes),
  };

  if (hasAnyValues(peerSupportDepthInputs)) {
    payload.peerSupportDepthInputs = peerSupportDepthInputs;
  }

  return hasAnyValues(payload as Record<string, unknown>) ? payload : undefined;
};

export const buildMonthlyRequest = (
  values: MonthlyFormValues,
  includeOptional: boolean,
): MonthlyCheckInRequest => ({
  ...buildMonthlyCorePayload(values),
  optional: includeOptional ? buildMonthlyOptionalPayload(values) : undefined,
});

export const clearMonthlyOptionalValues = (values: MonthlyFormValues): MonthlyFormValues => {
  const next = { ...values };
  MONTHLY_OPTIONAL_FIELD_NAMES.forEach((field) => {
    next[field] = '';
  });
  return next;
};

export const recordToMonthlyFormValues = (record: Record<string, any>): MonthlyFormValues => {
  const n = (v: any): string => (v !== undefined && v !== null ? String(v) : '');
  const os = record.organizationalStability ?? {};
  const or = record.operationalResilience ?? {};
  const fr = record.fatigueResistance ?? {};
  const ps = record.peerSupportReadiness ?? {};
  const ls = record.leadershipSustainability ?? {};
  const opt = record.optional ?? {};
  const bf = opt.budgetAndFiscalContext ?? {};
  const od = opt.operationalDemandContext ?? {};
  const fp = opt.fatiguePrecisionInputs ?? {};
  const pd = opt.peerSupportDepthInputs ?? {};
  return {
    currentlyFilledPositions: n(os.currentlyFilledPositions),
    currentVacancies: n(os.currentVacancies),
    resignationsThisMonth: n(os.resignationsThisMonth),
    newHiresAndAcademyGraduates: n(os.newHiresAndAcademyGraduates),
    averageTimeToFillDays: n(os.averageTimeToFillDays),
    leadershipLevelVacancies: n(os.leadershipLevelVacancies),
    totalOvertimeHours: n(or.totalOvertimeHours),
    averageShiftLengthHours: n(or.averageShiftLengthHours),
    shiftCoverageShortages: n(or.shiftCoverageShortages),
    mandatoryOvertimePercentage: n(or.mandatoryOvertimePercentage),
    plannedOvertimePercentage: n(or.plannedOvertimePercentage),
    unplannedOvertimePercentage: n(or.unplannedOvertimePercentage),
    callInAndHoldoverIncidents: n(or.callInAndHoldoverIncidents),
    totalSickLeaveDaysUsed: n(fr.totalSickLeaveDaysUsed),
    employeesOnFmlaLeave: n(ps.employeesOnFmlaLeave),
    newFmlaRequests: n(ps.newFmlaRequests),
    workersCompClaimsFiled: n(ps.workersCompClaimsFiled),
    peerSupportActivations: n(ps.peerSupportActivations),
    criticalIncidentExposures: n(ps.criticalIncidentExposures),
    lineOfDutyDeathsOrSeriousInjuries: n(ps.lineOfDutyDeathsOrSeriousInjuries),
    lineOfDutyDeathsOrSeriousInjuriesCount: n(ps.lineOfDutyDeathsOrSeriousInjuriesCount),
    leadershipMoraleRating: n(ls.leadershipMoraleRating),
    frontlineMoraleRating: n(ls.frontlineMoraleRating),
    disciplinaryActions: n(ls.disciplinaryActions),
    formalGrievancesFiled: n(ls.formalGrievancesFiled),
    promotionsOrLeadershipDevelopmentCount: n(ls.promotionsOrLeadershipDevelopmentCount),
    dataConfidence: n(record.dataConfidence),
    overtimeBudgetUtilizationPercentage: n(bf.overtimeBudgetUtilizationPercentage),
    hiringBudgetAvailability: n(bf.hiringBudgetAvailability),
    staffingBudgetConstraint: n(bf.staffingBudgetConstraint),
    totalCallsOrIncidents: n(od.totalCallsOrIncidents),
    responseTimeStandardsMet: n(od.responseTimeStandardsMet),
    specialtyUnitVacancies: n(od.specialtyUnitVacancies),
    minimumRestPeriodRequirementMet: n(fp.minimumRestPeriodRequirementMet),
    ptoVacationAccrualBacklog: n(fp.ptoVacationAccrualBacklog),
    returnToDutyIncidentsBeforeFullRecovery: n(fp.returnToDutyIncidentsBeforeFullRecovery),
    eapReferralsOrUtilizations: n(pd.eapReferralsOrUtilizations),
    topLeadershipConcern: n(pd.topLeadershipConcern),
    topLeadershipConcernOther: n(pd.topLeadershipConcernOther),
    additionalContextOrNotes: n(pd.additionalContextOrNotes),
  };
};

export const getActiveMonthlyStepFields = (
  values: MonthlyFormValues,
  fields: string[],
): string[] => {
  let active = [...fields];

  if (values.lineOfDutyDeathsOrSeriousInjuries !== 'Yes') {
    active = active.filter((field) => field !== 'lineOfDutyDeathsOrSeriousInjuriesCount');
  }
  if (values.topLeadershipConcern !== 'Other') {
    active = active.filter((field) => field !== 'topLeadershipConcernOther');
  }

  return active;
};
