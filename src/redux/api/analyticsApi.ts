import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { axiosInstance } from './axiosInstance';
import { WorkforceMetric, AnalyticsFilter } from '@/types';
import { store } from '../store';
import {
  DataConfidenceLevel,
  BinaryAnswer,
  TernaryAnswer,
  MonthlyCorePayload,
  MonthlyOptionalPayload,
  MonthlyCheckInRequest as MonthlyCheckInRequestType,
  AnnualBaselineRequest,
} from '@/types/checkin';
import type {
  AnalyticsData,
  AnalyticsResponse,
  MonthlyCheckInResponse,
  AnnualBaselineResponse,
} from '@/types/api-responses';

const getAnalyticsRecords = async (): Promise<AnalyticsData[]> => {
  const selectedAgencyId = store.getState().agency?.selectedAgencyId ?? null;
  const params = selectedAgencyId ? { agencyId: selectedAgencyId } : undefined;
  const response = await axiosInstance.get('/analytics/me', { params });
  const payload = response.data;
  return Array.isArray(payload?.data) ? payload.data : [];
};

const filterAnalyticsRecords = (
  records: AnalyticsData[],
  filters: AnalyticsFilter = {},
): AnalyticsData[] => {
  return records.filter((record) => {
    const recordDate = record.date ? new Date(record.date) : null;
    if (filters.startDate && recordDate && recordDate < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && recordDate && recordDate > new Date(filters.endDate)) {
      return false;
    }
    if (filters.region && record.region !== filters.region) {
      return false;
    }
    if (filters.category && record.category !== filters.category) {
      return false;
    }
    return true;
  });
};

const summarizeAnalyticsRecords = (records: AnalyticsData[]) => {
  const byCategory: Record<string, number> = {};
  const byRegion: Record<string, number> = {};

  for (const record of records) {
    if (record.category) {
      byCategory[record.category] = (byCategory[record.category] || 0) + Number(record.value || 0);
    }
    if (record.region) {
      byRegion[record.region] = (byRegion[record.region] || 0) + Number(record.value || 0);
    }
  }

  const total = records.length;
  const values = records.map((record) => Number(record.value || 0));

  return {
    byCategory,
    byRegion,
    total,
    totalRecords: total,
    averageValue: total ? values.reduce((sum, value) => sum + value, 0) / total : 0,
    maxValue: total ? Math.max(...values) : 0,
    minValue: total ? Math.min(...values) : 0,
  };
};

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: axiosBaseQuery({ baseUrl: '' }),
  tagTypes: ['Analytics', 'MetricsData', 'ScenarioData'],
  endpoints: (builder) => ({
    insertAnalyticsData: builder.mutation<
      { success: boolean },
      { userId: string; metrics: WorkforceMetric[] }
    >({
      queryFn: async ({ metrics }) => {
        try {
          for (const metric of metrics) {
            await axiosInstance.post('/analytics', {
              date: metric.date,
              category: metric.category,
              region: metric.region,
              value: metric.value,
            });
          }

          return { data: { success: true } };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error instanceof Error ? error.message : 'Failed to insert analytics data',
            },
          };
        }
      },
      invalidatesTags: ['Analytics', 'MetricsData'],
    }),

    getAnalyticsData: builder.query<AnalyticsData[], { userId: string; filters?: AnalyticsFilter }>(
      {
        queryFn: async ({ filters = {} }) => {
          try {
            const records = await getAnalyticsRecords();
            return { data: filterAnalyticsRecords(records, filters) };
          } catch (error) {
            return {
              error: {
                status: 500,
                data: error instanceof Error ? error.message : 'Failed to fetch analytics data',
              },
            };
          }
        },
        providesTags: ['Analytics', 'MetricsData'],
      },
    ),

    getDashboardMetrics: builder.query<
      { byCategory: Record<string, number>; byRegion: Record<string, number>; total: number },
      string
    >({
      queryFn: async () => {
        try {
          const records = await getAnalyticsRecords();
          const summary = summarizeAnalyticsRecords(records);
          return {
            data: {
              byCategory: summary.byCategory,
              byRegion: summary.byRegion,
              total: summary.total,
            },
          };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error instanceof Error ? error.message : 'Failed to fetch dashboard metrics',
            },
          };
        }
      },
      providesTags: ['Analytics'],
    }),

    getAvailableRegions: builder.query<string[], string>({
      queryFn: async () => {
        try {
          const records = await getAnalyticsRecords();
          const regions = Array.from(
            new Set(records.map((record) => record.region).filter(Boolean)),
          ) as string[];
          return { data: regions };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error instanceof Error ? error.message : 'Failed to fetch regions',
            },
          };
        }
      },
      providesTags: ['Analytics'],
    }),

    getAvailableCategories: builder.query<string[], string>({
      queryFn: async () => {
        try {
          const records = await getAnalyticsRecords();
          const categories = Array.from(
            new Set(records.map((record) => record.category).filter(Boolean)),
          ) as string[];
          return { data: categories };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error instanceof Error ? error.message : 'Failed to fetch categories',
            },
          };
        }
      },
      providesTags: ['Analytics'],
    }),

    getMetricsSummary: builder.query<
      {
        totalRecords: number;
        averageValue: number;
        maxValue: number;
        minValue: number;
        byCategory: Record<string, number>;
        byRegion: Record<string, number>;
      },
      { userId: string; startDate: string; endDate: string }
    >({
      queryFn: async ({ startDate, endDate }) => {
        try {
          const records = await getAnalyticsRecords();
          const filteredRecords = filterAnalyticsRecords(records, { startDate, endDate });
          return { data: summarizeAnalyticsRecords(filteredRecords) };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error instanceof Error ? error.message : 'Failed to fetch metrics summary',
            },
          };
        }
      },
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useInsertAnalyticsDataMutation,
  useGetAnalyticsDataQuery,
  useGetDashboardMetricsQuery,
  useGetAvailableRegionsQuery,
  useGetAvailableCategoriesQuery,
  useGetMetricsSummaryQuery,
} = analyticsApi;
