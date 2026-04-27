import type { AnnualCheckInRequest } from '@/redux/api/checkinApi';
import { AnnualFormValues } from './types';

const toOptionalString = (value: string): string | undefined => {
    const normalized = value.trim();
    return normalized ? normalized : undefined;
};

export const buildAnnualRequest = (values: AnnualFormValues): AnnualCheckInRequest => ({
    agencyIdentity: {
        agencyName: values.agencyName.trim(),
        agencyType: values.agencyType as
            | 'Law enforcement'
            | 'Fire'
            | 'EMS'
            | 'Dispatch'
            | 'Combined',
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
