import type { AnnualCheckInRequest } from '@/redux/api/checkinApi';
import type { Agency } from '@/redux/api/agencyApi';
import { AnnualFormValues } from './types';
import { ANNUAL_INITIAL_VALUES } from './config';
import type { AnnualCheckInRecord } from '@/redux/api/checkinApi';

const toOptionalString = (value: string): string | undefined => {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
};

export const buildPrefilledValues = (agency: Agency | undefined): AnnualFormValues => {
  if (!agency) return ANNUAL_INITIAL_VALUES;
  return {
    ...ANNUAL_INITIAL_VALUES,
    agencyName: agency.name ?? '',
    agencyType: agency.type ?? '',
    agencySizeCategory: agency.sizeCategory ?? '',
    primaryServiceJurisdiction: agency.primaryServiceJurisdiction ?? '',
    geographicCoverageArea:
      agency.coverageArea !== undefined && agency.coverageArea !== null
        ? String(agency.coverageArea)
        : '',
  };
};

export const buildValuesFromRecord = (record: AnnualCheckInRecord): AnnualFormValues => ({
  agencyName: record.agencyIdentity.agencyName,
  agencyType: record.agencyIdentity.agencyType,
  agencySizeCategory: record.agencyIdentity.agencySizeCategory,
  primaryServiceJurisdiction: record.agencyIdentity.primaryServiceJurisdiction,
  geographicCoverageArea: String(record.agencyIdentity.geographicCoverageArea),
  totalAuthorizedPositions: String(record.structuralStaffingProfile.totalAuthorizedPositions),
  totalFundedPositions: String(record.structuralStaffingProfile.totalFundedPositions),
  minimumSafeStaffingLevel: String(record.structuralStaffingProfile.minimumSafeStaffingLevel),
  specialtyUnitPositionsCount: String(record.structuralStaffingProfile.specialtyUnitPositionsCount),
  supervisorToStaffRatio: record.structuralStaffingProfile.supervisorToStaffRatio,
  standardShiftLengthHours: String(record.operationalInfrastructure.standardShiftLengthHours),
  shiftScheduleType: record.operationalInfrastructure.shiftScheduleType,
  minimumRestPeriodPolicyExists: record.operationalInfrastructure.minimumRestPeriodPolicyExists,
  activePeerSupportTeam: record.operationalInfrastructure.activePeerSupportTeam,
  hasEmployeeAssistanceProgram: record.operationalInfrastructure.hasEmployeeAssistanceProgram,
  goal1PrimaryAnnualGoal: record.goalsAndStrategicDirection.goal1PrimaryAnnualGoal,
  goal1TargetMetric: record.goalsAndStrategicDirection.goal1TargetMetric ?? '',
  goal1Timeframe: record.goalsAndStrategicDirection.goal1Timeframe,
  goal2SecondaryAnnualGoal: record.goalsAndStrategicDirection.goal2SecondaryAnnualGoal ?? '',
  goal2TargetMetric: record.goalsAndStrategicDirection.goal2TargetMetric ?? '',
  goal2Timeframe: record.goalsAndStrategicDirection.goal2Timeframe ?? '',
});

export const buildAnnualRequest = (values: AnnualFormValues): AnnualCheckInRequest => ({
  agencyIdentity: {
    agencyName: values.agencyName.trim(),
    agencyType: values.agencyType as 'Law enforcement' | 'Fire' | 'EMS' | 'Dispatch' | 'Combined',
    agencySizeCategory: values.agencySizeCategory as
      | 'Small (<25)'
      | 'Medium (25-99)'
      | 'Large (100-299)'
      | 'Major (300+)',
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
    goal1Timeframe: values.goal1Timeframe as
      | 'Annual (Q1-Q4)'
      | 'First half (Q1-Q2)'
      | 'Second half (Q3-Q4)',
    goal2SecondaryAnnualGoal: toOptionalString(values.goal2SecondaryAnnualGoal),
    goal2TargetMetric: toOptionalString(values.goal2TargetMetric),
    goal2Timeframe: toOptionalString(values.goal2Timeframe) as
      | 'Annual'
      | 'First half'
      | 'Second half'
      | undefined,
  },
  baselineYear: new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1)).toISOString().slice(0, 10),
});
