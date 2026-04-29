import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

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

export interface AnnualCheckinStatus {
  hasCurrentYearCheckin: boolean;
  currentCheckinId: string | null;
  editCount: number;
  canEdit: boolean;
  canSubmit: boolean;
  maxEdits: number;
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
    agencyType: 'Law enforcement' | 'Fire' | 'EMS' | 'Dispatch' | 'Combined';
    agencySizeCategory: 'Small (<25)' | 'Medium (25-99)' | 'Large (100-299)' | 'Major (300+)';
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
    shiftScheduleType: '8-hour' | '10-hour' | '12-hour' | 'Mixed';
    minimumRestPeriodPolicyExists: BinaryAnswer;
    activePeerSupportTeam: 'Yes' | 'No' | 'In development';
    hasEmployeeAssistanceProgram: BinaryAnswer;
  };
  goalsAndStrategicDirection: {
    goal1PrimaryAnnualGoal: string;
    goal1TargetMetric?: string;
    goal1Timeframe: 'Annual (Q1-Q4)' | 'First half (Q1-Q2)' | 'Second half (Q3-Q4)';
    goal2SecondaryAnnualGoal?: string;
    goal2TargetMetric?: string;
    goal2Timeframe?: 'Annual' | 'First half' | 'Second half';
  };
  baselineYear?: string;
}

export interface ApiSuccess<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T;
}

export const checkinApi = createApi({
  reducerPath: 'checkinApi',
  baseQuery: axiosBaseQuery({ baseUrl: '' }),
  tagTypes: ['MonthlyCheckin', 'AnnualCheckin'],
  endpoints: (builder) => ({
    submitMonthlyCheckIn: builder.mutation<ApiSuccess<Record<string, any>>, MonthlyCheckInRequest>({
      query: (data) => ({
        url: '/checkins',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['MonthlyCheckin'],
    }),

    getMyMonthlyCheckIns: builder.query<ApiSuccess<Record<string, any>[]>, void>({
      query: () => ({
        url: '/checkins/me',
        method: 'GET',
      }),
      providesTags: ['MonthlyCheckin'],
    }),

    updateMonthlyCheckIn: builder.mutation<
      ApiSuccess<Record<string, any>>,
      { id: string; data: Partial<MonthlyCheckInRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/checkins/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['MonthlyCheckin'],
    }),

    submitAnnualCheckIn: builder.mutation<ApiSuccess<AnnualCheckInRecord>, AnnualCheckInRequest>({
      query: (data) => ({
        url: '/annual-checkins',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['AnnualCheckin'],
    }),

    getAnnualCheckInStatus: builder.query<ApiSuccess<AnnualCheckinStatus>, void>({
      query: () => ({
        url: '/annual-checkins/status',
        method: 'GET',
      }),
      providesTags: ['AnnualCheckin'],
    }),

    getMyAnnualCheckIns: builder.query<ApiSuccess<AnnualCheckInRecord[]>, void>({
      query: () => ({
        url: '/annual-checkins/me',
        method: 'GET',
      }),
      providesTags: ['AnnualCheckin'],
    }),

    getCurrentAnnualCheckIn: builder.query<ApiSuccess<AnnualCheckInRecord | null>, void>({
      query: () => ({
        url: '/annual-checkins/current',
        method: 'GET',
      }),
      providesTags: ['AnnualCheckin'],
    }),

    updateAnnualCheckIn: builder.mutation<
      ApiSuccess<AnnualCheckInRecord>,
      { id: string; data: Partial<AnnualCheckInRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/annual-checkins/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['AnnualCheckin'],
    }),
  }),
});

export const {
  useSubmitMonthlyCheckInMutation,
  useGetMyMonthlyCheckInsQuery,
  useUpdateMonthlyCheckInMutation,
  useSubmitAnnualCheckInMutation,
  useGetAnnualCheckInStatusQuery,
  useGetMyAnnualCheckInsQuery,
  useGetCurrentAnnualCheckInQuery,
  useUpdateAnnualCheckInMutation,
} = checkinApi;
