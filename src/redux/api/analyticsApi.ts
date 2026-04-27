import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { WorkforceMetric, AnalyticsFilter } from '@/types';

export interface AnalyticsData {
    id: string;
    date: string;
    metric: string;
    value: number;
    [key: string]: any;
}

export interface AnalyticsResponse {
    data: AnalyticsData[];
    summary?: Record<string, any>;
}

export type DataConfidenceLevel = 'High' | 'Moderate' | 'Low';
export type BinaryAnswer = 'Yes' | 'No';
export type TernaryAnswer = 'Yes' | 'No' | 'Partially';

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
        hiringBudgetAvailability?: 'Full' | 'Limited' | 'Frozen';
        staffingBudgetConstraint?: 'Yes' | 'No' | 'Under review';
    };
    operationalDemandContext?: {
        totalCallsOrIncidents?: number;
        responseTimeStandardsMet?: TernaryAnswer;
        specialtyUnitVacancies?: number;
    };
    fatiguePrecisionInputs?: {
        minimumRestPeriodRequirementMet?: 'Yes' | 'No' | 'No policy';
        ptoVacationAccrualBacklog?: 'Yes' | 'No' | 'Some personnel affected';
        returnToDutyIncidentsBeforeFullRecovery?: number;
    };
    peerSupportDepthInputs?: {
        eapReferralsOrUtilizations?: number;
        topLeadershipConcern?:
        | 'Staffing shortage'
        | 'Budget strain'
        | 'Burnout concerns'
        | 'Leadership turnover'
        | 'Morale'
        | 'Legal or compliance'
        | 'Other';
        topLeadershipConcernOther?: string;
        additionalContextOrNotes?: string;
    };
}

export interface AnnualBaselineRequest {
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

export interface MonthlyCheckInRequest {
    core: MonthlyCorePayload;
    optional?: MonthlyOptionalPayload;
    checkinMonth?: string;
}

export interface MonthlyCheckInResponse {
    success: boolean;
    created: boolean;
    checkIn: Record<string, any>;
}

export interface AnnualBaselineResponse {
    success: boolean;
    created: boolean;
    baseline: Record<string, any>;
}

export const analyticsApi = createApi({
    reducerPath: 'analyticsApi',
    baseQuery: axiosBaseQuery({ baseUrl: '' }),
    tagTypes: ['Analytics', 'MetricsData', 'ScenarioData'],
    endpoints: (builder) => ({
        // Get dashboard metrics
        getMetrics: builder.query<
            AnalyticsResponse,
            { startDate?: string; endDate?: string; granularity?: 'day' | 'week' | 'month' }
        >({
            query: (params) => ({
                url: '/api/analytics/metrics',
                method: 'GET',
                params,
            }),
            providesTags: ['Analytics', 'MetricsData'],
        }),

        // Get scenario analytics
        getScenarioAnalytics: builder.query<
            AnalyticsResponse,
            { scenarioId: string; startDate?: string; endDate?: string }
        >({
            query: ({ scenarioId, ...params }) => ({
                url: `/api/analytics/scenarios/${scenarioId}`,
                method: 'GET',
                params,
            }),
            providesTags: (result, error, { scenarioId }) => [
                { type: 'ScenarioData', id: scenarioId },
            ],
        }),

        // Get custom report data
        getReportData: builder.query<
            AnalyticsResponse,
            { reportId: string; filters?: Record<string, any> }
        >({
            query: ({ reportId, filters }) => ({
                url: `/api/analytics/reports/${reportId}`,
                method: 'GET',
                params: filters,
            }),
            providesTags: (result, error, { reportId }) => [
                { type: 'Analytics', id: reportId },
            ],
        }),

        // Export analytics data
        exportAnalytics: builder.mutation<
            { url: string },
            { format: 'csv' | 'json' | 'excel'; filters?: Record<string, any> }
        >({
            query: (data) => ({
                url: '/api/analytics/export',
                method: 'POST',
                data,
            }),
        }),

        submitMonthlyCheckIn: builder.mutation<MonthlyCheckInResponse, MonthlyCheckInRequest>({
            query: (data) => ({
                url: '/analytics/monthly-checkin',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Analytics'],
        }),

        submitAnnualBaseline: builder.mutation<AnnualBaselineResponse, AnnualBaselineRequest>({
            query: (data) => ({
                url: '/analytics/annual-baseline',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Analytics'],
        }),

        // Insert analytics data (from lib/analytics.ts)
        insertAnalyticsData: builder.mutation<
            { success: boolean },
            { userId: string; metrics: WorkforceMetric[] }
        >({
            queryFn: async ({ userId, metrics }) => {
                try {
                    const data = metrics.map((m) => ({
                        user_id: userId,
                        date: m.date,
                        category: m.category,
                        region: m.region,
                        value: m.value,
                    }));

                    const { error } = await supabaseAdmin.from('analytics_data').insert(data);

                    if (error) throw error;

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

        // Get analytics data (from lib/analytics.ts)
        getAnalyticsData: builder.query<
            AnalyticsData[],
            { userId: string; filters?: AnalyticsFilter }
        >({
            queryFn: async ({ userId, filters = {} }) => {
                try {
                    let query = supabase
                        .from('analytics_data')
                        .select('*')
                        .eq('user_id', userId);

                    if (filters.startDate) {
                        query = query.gte('date', filters.startDate);
                    }

                    if (filters.endDate) {
                        query = query.lte('date', filters.endDate);
                    }

                    if (filters.region) {
                        query = query.eq('region', filters.region);
                    }

                    if (filters.category) {
                        query = query.eq('category', filters.category);
                    }

                    const { data, error } = await query.order('date', { ascending: false });

                    if (error) throw error;

                    return { data: data || [] };
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
        }),

        // Get dashboard metrics (from lib/analytics.ts)
        getDashboardMetrics: builder.query<
            { byCategory: Record<string, number>; byRegion: Record<string, number>; total: number },
            string
        >({
            queryFn: async (userId) => {
                try {
                    const { data, error } = await supabase.rpc('get_dashboard_metrics', {
                        p_user_id: userId,
                    });

                    if (error) {
                        // Fallback if RPC doesn't exist yet
                        console.warn('RPC function not available, returning basic data');
                        const rawData = await supabase
                            .from('analytics_data')
                            .select('category, region, value')
                            .eq('user_id', userId)
                            .order('date', { ascending: false })
                            .limit(100);

                        if (rawData.error) throw rawData.error;

                        // Group by category
                        const grouped: Record<string, number> = {};
                        rawData.data?.forEach((item: any) => {
                            grouped[item.category] = (grouped[item.category] || 0) + item.value;
                        });

                        return {
                            data: {
                                byCategory: grouped,
                                byRegion: {},
                                total: Object.values(grouped).reduce((a, b) => a + b, 0),
                            },
                        };
                    }

                    return { data };
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

        // Get available regions (from lib/analytics.ts)
        getAvailableRegions: builder.query<string[], string>({
            queryFn: async (userId) => {
                try {
                    const { data, error } = await supabase
                        .from('analytics_data')
                        .select('region')
                        .eq('user_id', userId)
                        .order('region');

                    if (error) throw error;

                    // Remove duplicates
                    const regions = [...new Set(data?.map((d) => d.region) || [])];
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

        // Get available categories (from lib/analytics.ts)
        getAvailableCategories: builder.query<string[], string>({
            queryFn: async (userId) => {
                try {
                    const { data, error } = await supabase
                        .from('analytics_data')
                        .select('category')
                        .eq('user_id', userId)
                        .order('category');

                    if (error) throw error;

                    // Remove duplicates
                    const categories = [...new Set(data?.map((d) => d.category) || [])];
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

        // Get metrics summary (from lib/analytics.ts)
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
            queryFn: async ({ userId, startDate, endDate }) => {
                try {
                    const { data, error } = await supabase
                        .from('analytics_data')
                        .select('*')
                        .eq('user_id', userId)
                        .gte('date', startDate)
                        .lte('date', endDate);

                    if (error) throw error;

                    // Calculate summary statistics
                    const summary = {
                        totalRecords: data?.length || 0,
                        averageValue: 0,
                        maxValue: 0,
                        minValue: 0,
                        byCategory: {} as Record<string, number>,
                        byRegion: {} as Record<string, number>,
                    };

                    if (data && data.length > 0) {
                        const values = data.map((d) => d.value);
                        summary.averageValue = values.reduce((a, b) => a + b, 0) / values.length;
                        summary.maxValue = Math.max(...values);
                        summary.minValue = Math.min(...values);

                        // Group by category and region
                        data.forEach((item: any) => {
                            summary.byCategory[item.category] = (summary.byCategory[item.category] || 0) + 1;
                            summary.byRegion[item.region] = (summary.byRegion[item.region] || 0) + 1;
                        });
                    }

                    return { data: summary };
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
    useGetMetricsQuery,
    useGetScenarioAnalyticsQuery,
    useGetReportDataQuery,
    useExportAnalyticsMutation,
    useSubmitMonthlyCheckInMutation,
    useSubmitAnnualBaselineMutation,
    useInsertAnalyticsDataMutation,
    useGetAnalyticsDataQuery,
    useGetDashboardMetricsQuery,
    useGetAvailableRegionsQuery,
    useGetAvailableCategoriesQuery,
    useGetMetricsSummaryQuery,
} = analyticsApi;
