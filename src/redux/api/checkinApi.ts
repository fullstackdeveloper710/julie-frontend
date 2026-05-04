import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import type { ApiSuccess } from '@/types/api-responses';
import {
  DataConfidenceLevel,
  BinaryAnswer,
  TernaryAnswer,
  HiringBudgetAvailability,
  StaffingBudgetConstraint,
  RestRequirementMet,
  PtoBacklog,
  TopLeadershipConcern,
  MonthlyCorePayload,
  MonthlyOptionalPayload,
  MonthlyCheckInRequest,
  MonthlyCheckinStatus,
  AnnualCheckinStatus,
  AnnualBaselineRequest,
  AnnualCheckInRecord,
  AnnualCheckInRequest,
} from '@/types/checkin';

// Re-export types for backward compatibility
export type {
  DataConfidenceLevel,
  BinaryAnswer,
  TernaryAnswer,
  HiringBudgetAvailability,
  StaffingBudgetConstraint,
  RestRequirementMet,
  PtoBacklog,
  TopLeadershipConcern,
  MonthlyCorePayload,
  MonthlyOptionalPayload,
  MonthlyCheckInRequest,
  MonthlyCheckinStatus,
  AnnualCheckinStatus,
  AnnualBaselineRequest,
  AnnualCheckInRecord,
  AnnualCheckInRequest,
} from '@/types/checkin';

// Re-export additional types from enums for backward compatibility
export type {
  AgencyType,
  AgencySizeCategory,
  ShiftScheduleType,
  PeerSupportTeamStatus,
  GoalTimeframe,
  SecondaryGoalTimeframe,
} from '@/types/enums';

// Re-export ApiSuccess for backward compatibility
export type { ApiSuccess } from '@/types/api-responses';

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

    getMonthlyCheckInStatus: builder.query<ApiSuccess<MonthlyCheckinStatus>, void>({
      query: () => ({ url: '/checkins/status', method: 'GET' }),
      providesTags: ['MonthlyCheckin'],
    }),

    getCurrentMonthlyCheckIn: builder.query<ApiSuccess<Record<string, any> | null>, void>({
      query: () => ({ url: '/checkins/current', method: 'GET' }),
      providesTags: ['MonthlyCheckin'],
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
  useGetMonthlyCheckInStatusQuery,
  useGetCurrentMonthlyCheckInQuery,
  useSubmitMonthlyCheckInMutation,
  useGetMyMonthlyCheckInsQuery,
  useUpdateMonthlyCheckInMutation,
  useSubmitAnnualCheckInMutation,
  useGetAnnualCheckInStatusQuery,
  useGetMyAnnualCheckInsQuery,
  useGetCurrentAnnualCheckInQuery,
  useUpdateAnnualCheckInMutation,
} = checkinApi;
