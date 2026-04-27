import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export const agencyApi = createApi({
    reducerPath: 'agencyApi',
    baseQuery: axiosBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    }),
    tagTypes: ['Agency'],
    endpoints: (builder) => ({

        // ✅ CREATE AGENCY
        createAgency: builder.mutation<
            {
                success: boolean;
                message: string;
                data: any;
            },
            {
                name: string;
                type: string;
                sizeCategory: string;
                primaryServiceJurisdiction: string;
                coverageArea: number;
            }
        >({
            query: (body) => ({
                url: '/agencies',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Agency'],
        }),

    }),
});

export const { useCreateAgencyMutation } = agencyApi;