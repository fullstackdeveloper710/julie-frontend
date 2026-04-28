import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export type AgencyType =
    | 'Law enforcement'
    | 'Fire'
    | 'EMS'
    | 'Dispatch'
    | 'Combined';

export type AgencySize =
    | 'Small (<25)'
    | 'Medium (25-99)'
    | 'Large (100-299)'
    | 'Major (300+)';

export interface Agency {
    _id: string;
    userId: string;
    name: string;
    type: AgencyType;
    sizeCategory: AgencySize;
    primaryServiceJurisdiction: string;
    coverageArea: number;
    createdAt: string;
    updatedAt: string;
}

export interface AgencyCapacity {
    plan?: string;
    maxAllowed: number;
    used: number;
    canCreateMore: boolean;
}

export interface AgencyInput {
    name: string;
    type: AgencyType;
    sizeCategory: AgencySize;
    primaryServiceJurisdiction: string;
    coverageArea: number;
}

export interface ApiSuccess<T> {
    success: boolean;
    statusCode?: number;
    message?: string;
    data: T;
}

export const agencyApi = createApi({
    reducerPath: 'agencyApi',
    baseQuery: axiosBaseQuery({
        baseUrl: '',
    }),
    tagTypes: ['Agency', 'AgencyList'],
    endpoints: (builder) => ({
        listMyAgencies: builder.query<
            ApiSuccess<{ agencies: Agency[]; capacity: AgencyCapacity }>,
            void
        >({
            query: () => ({
                url: '/agencies',
                method: 'GET',
            }),
            providesTags: ['AgencyList'],
        }),

        getAgencyById: builder.query<ApiSuccess<Agency>, string>({
            query: (id) => ({
                url: `/agencies/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Agency', id }],
        }),

        createAgency: builder.mutation<ApiSuccess<Agency>, AgencyInput>({
            query: (body) => ({
                url: '/agencies',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AgencyList'],
        }),

        updateAgencyById: builder.mutation<
            ApiSuccess<Agency>,
            { id: string; data: Partial<AgencyInput> }
        >({
            query: ({ id, data }) => ({
                url: `/agencies/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'AgencyList',
                { type: 'Agency', id },
            ],
        }),
    }),
});

export const {
    useListMyAgenciesQuery,
    useGetAgencyByIdQuery,
    useCreateAgencyMutation,
    useUpdateAgencyByIdMutation,
} = agencyApi;
