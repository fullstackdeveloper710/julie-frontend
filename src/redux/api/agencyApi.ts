import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import type { Agency } from '@/types/agency';
import { AgencyType, AgencySizeCategory } from '@/types/enums';
import type { ApiSuccess } from '@/types/api-responses';

/**
 * API response type for Agency
 * Alias to canonical Agency type from @/types/agency
 */
export type AgencyResponse = Agency;

export interface AgencyCapacity {
  plan?: string;
  maxAllowed: number;
  used: number;
  canCreateMore: boolean;
}

export interface AgencyInput {
  name: string;
  type: AgencyType;
  sizeCategory: AgencySizeCategory;
  primaryServiceJurisdiction: string;
  coverageArea: number;
}

// Re-export centralized types
export type { AgencyType, AgencySizeCategory } from '@/types/enums';
export type { Agency } from '@/types/agency';

export const agencyApi = createApi({
  reducerPath: 'agencyApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '',
  }),
  tagTypes: ['Agency', 'AgencyList'],
  endpoints: (builder) => ({
    listMyAgencies: builder.query<
      ApiSuccess<{ agencies: AgencyResponse[]; capacity: AgencyCapacity }>,
      void
    >({
      query: () => ({
        url: '/agencies',
        method: 'GET',
      }),
      providesTags: ['AgencyList'],
    }),

    getAgencyById: builder.query<ApiSuccess<AgencyResponse>, string>({
      query: (id) => ({
        url: `/agencies/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Agency', id }],
    }),

    createAgency: builder.mutation<ApiSuccess<AgencyResponse>, AgencyInput>({
      query: (body) => ({
        url: '/agencies',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AgencyList'],
    }),

    updateAgencyById: builder.mutation<
      ApiSuccess<AgencyResponse>,
      { id: string; data: Partial<AgencyInput> }
    >({
      query: ({ id, data }) => ({
        url: `/agencies/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['AgencyList', { type: 'Agency', id }],
    }),
  }),
});

export const {
  useListMyAgenciesQuery,
  useGetAgencyByIdQuery,
  useCreateAgencyMutation,
  useUpdateAgencyByIdMutation,
} = agencyApi;
