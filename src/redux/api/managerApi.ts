import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export const managerApi = createApi({
    reducerPath: 'managerApi',
    baseQuery: axiosBaseQuery({
        baseUrl: '',
    }),
    tagTypes: ['Manager'],

    endpoints: (builder) => ({


        createManager: builder.mutation<
            {
                success: boolean;
                message: string;
                data: any;
            },
            {
                email: string;
                fullName: string;
            }
        >({
            query: (body) => ({
                url: '/managers',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Manager'],
        }),




    }),
});

export const {
    useCreateManagerMutation,

} = managerApi;