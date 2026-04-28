import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export interface AdminSeat {
  _id: string;
  email: string;
  fullName?: string;
  title?: string;
  isConfirmed: boolean;
  createdAt: string;
}

export interface AdminCapacity {
  maxAllowed: number;
  used: number;
  canCreateMore: boolean;
}

export interface ApiSuccess<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T;
}

export const managerApi = createApi({
  reducerPath: 'managerApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '',
  }),
  tagTypes: ['Manager'],

  endpoints: (builder) => ({
    listManagers: builder.query<ApiSuccess<{ admins: AdminSeat[]; capacity: AdminCapacity }>, void>(
      {
        query: () => ({
          url: '/managers',
          method: 'GET',
        }),
        providesTags: ['Manager'],
      },
    ),

    createManager: builder.mutation<
      ApiSuccess<{ id: string; email: string; fullName?: string; title?: string }>,
      { email: string; fullName: string; title?: string }
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

export const { useListManagersQuery, useCreateManagerMutation } = managerApi;
