import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { User } from '@/types';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: axiosBaseQuery({ baseUrl: '' }),
    tagTypes: ['User', 'Users'],
    endpoints: (builder) => ({
        getCurrentUser: builder.query<{ user: User }, void>({
            query: () => ({
                url: '/api/user',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),

        getUserById: builder.query<{ user: User }, string>({
            query: (userId) => ({
                url: `/api/users/${userId}`,
                method: 'GET',
            }),
            providesTags: (result, error, userId) => [{ type: 'Users', id: userId }],
        }),

        updateUserProfile: builder.mutation<
            { user: User },
            Partial<User>
        >({
            query: (data) => ({
                url: '/api/user',
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['User'],
        }),

        updateUserSettings: builder.mutation<
            { success: boolean },
            Record<string, any>
        >({
            query: (data) => ({
                url: '/api/user/settings',
                method: 'PUT',
                data,
            }),
            invalidatesTags: ['User'],
        }),

        getAllUsers: builder.query<{ users: User[]; total: number }, { page?: number; limit?: number }>({
            query: (params) => ({
                url: '/api/users',
                method: 'GET',
                params,
            }),
            providesTags: ['Users'],
        }),

        deleteUser: builder.mutation<{ success: boolean }, string>({
            query: (userId) => ({
                url: `/api/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const {
    useGetCurrentUserQuery,
    useGetUserByIdQuery,
    useUpdateUserProfileMutation,
    useUpdateUserSettingsMutation,
    useGetAllUsersQuery,
    useDeleteUserMutation,
} = userApi;
