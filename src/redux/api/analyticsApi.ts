import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { axiosInstance } from './axiosInstance';
import { WorkforceMetric, AnalyticsFilter } from '@/types';

export interface AnalyticsData {
    id: string;
    date: string;
    metric: string;
    value: number;
    category?: string;
    region?: string;
    reportId?: string;
    scenarioId?: string;
    scenario?: string;
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

const getAnalyticsRecords = async (): Promise<AnalyticsData[]> => {
    const response = await axiosInstance.get('/analytics/me');
    const payload = response.data;
    return Array.isArray(payload?.data) ? payload.data : [];
};

const filterAnalyticsRecords = (records: AnalyticsData[], filters: AnalyticsFilter = {}): AnalyticsData[] => {
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
        insertAnalyticsData: builder.mutation<{ success: boolean }, { userId: string; metrics: WorkforceMetric[] }>({
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

        getAnalyticsData: builder.query<AnalyticsData[], { userId: string; filters?: AnalyticsFilter }>({
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
        }),

        getDashboardMetrics: builder.query<{ byCategory: Record<string, number>; byRegion: Record<string, number>; total: number }, string>({
            queryFn: async () => {
                try {
                    const records = await getAnalyticsRecords();
                    const summary = summarizeAnalyticsRecords(records);
                    return { data: { byCategory: summary.byCategory, byRegion: summary.byRegion, total: summary.total } };
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
                    const regions = Array.from(new Set(records.map((record) => record.region).filter(Boolean))) as string[];
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
                    const categories = Array.from(new Set(records.map((record) => record.category).filter(Boolean))) as string[];
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
