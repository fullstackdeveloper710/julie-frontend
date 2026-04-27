import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export interface Report {
    id: string;
    title: string;
    type: string;
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    updatedAt: string;
    data?: any;
}

export const reportsApi = createApi({
    reducerPath: 'reportsApi',
    baseQuery: axiosBaseQuery({ baseUrl: '' }),
    tagTypes: ['Report', 'Reports'],
    endpoints: (builder) => ({
        // Get all reports
        getAllReports: builder.query<
            { reports: Report[]; total: number },
            { page?: number; limit?: number; search?: string }
        >({
            query: (params) => ({
                url: '/api/reports',
                method: 'GET',
                params,
            }),
            providesTags: ['Reports'],
        }),

        // Get report by ID
        getReportById: builder.query<{ report: Report }, string>({
            query: (reportId) => ({
                url: `/api/reports/${reportId}`,
                method: 'GET',
            }),
            providesTags: (result, error, reportId) => [{ type: 'Report', id: reportId }],
        }),

        // Create report
        createReport: builder.mutation<
            { report: Report },
            Partial<Report>
        >({
            query: (data) => ({
                url: '/api/reports',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Reports'],
        }),

        // Update report
        updateReport: builder.mutation<
            { report: Report },
            { reportId: string; data: Partial<Report> }
        >({
            query: ({ reportId, data }) => ({
                url: `/api/reports/${reportId}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { reportId }) => [
                { type: 'Report', id: reportId },
                'Reports',
            ],
        }),

        // Delete report
        deleteReport: builder.mutation<{ success: boolean }, string>({
            query: (reportId) => ({
                url: `/api/reports/${reportId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reports'],
        }),

        // Generate Intelligence report
        generateAIReport: builder.mutation<
            { report: Report },
            { title: string; type: string; parameters: Record<string, any> }
        >({
            query: (data) => ({
                url: '/api/reports/ai/generate',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Reports'],
        }),
    }),
});

export const {
    useGetAllReportsQuery,
    useGetReportByIdQuery,
    useCreateReportMutation,
    useUpdateReportMutation,
    useDeleteReportMutation,
    useGenerateAIReportMutation,
} = reportsApi;
