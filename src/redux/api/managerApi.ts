import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import type { ApiSuccess } from '@/types/api-responses';

export interface AdminSeat {
  _id: string;
  email: string;
  fullName?: string;
  title?: string;
  isConfirmed: boolean;
  status: 'active' | 'inactive';
  assignedAgencyId: string | null;
  createdAt: string;
}

export interface AdminCapacity {
  maxAllowed: number;
  used: number;
  canCreateMore: boolean;
}

// Re-export ApiSuccess for backward compatibility
export type { ApiSuccess } from '@/types/api-responses';

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

    setManagerStatus: builder.mutation<
      ApiSuccess<{ id: string; email: string; status: string }>,
      { id: string; status: 'active' | 'inactive' }
    >({
      query: ({ id, status }) => ({
        url: `/managers/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Manager'],
    }),

    resendManagerInvite: builder.mutation<ApiSuccess<{ id: string; email: string }>, string>({
      query: (id) => ({
        url: `/managers/${id}/resend-invite`,
        method: 'POST',
      }),
      invalidatesTags: ['Manager'],
    }),

    assignManagerAgency: builder.mutation<
      ApiSuccess<{ id: string; email: string; assignedAgencyId: string | null }>,
      { id: string; agencyId: string | null }
    >({
      query: ({ id, agencyId }) => ({
        url: `/managers/${id}/agency`,
        method: 'PATCH',
        body: { agencyId },
      }),
      invalidatesTags: ['Manager'],
    }),

    deleteManager: builder.mutation<ApiSuccess<{ id: string }>, string>({
      query: (id) => ({
        url: `/managers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Manager'],
    }),
  }),
});

export const {
  useListManagersQuery,
  useCreateManagerMutation,
  useSetManagerStatusMutation,
  useResendManagerInviteMutation,
  useAssignManagerAgencyMutation,
  useDeleteManagerMutation,
} = managerApi;
