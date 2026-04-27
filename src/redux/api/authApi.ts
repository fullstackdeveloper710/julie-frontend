import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { User } from '@/types';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    }),
    tagTypes: ['User', 'Auth'],
    endpoints: (builder) => ({
        // Get current user (with full profile)
        getCurrentUser: builder.query<
            {
                success: boolean;
                message: string;
                data: User;
            },
            void
        >({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),

        // Sign in with email/password
        signIn: builder.mutation<
            {
                success: boolean;
                message: string;
                data: {
                    user: User;
                    tokens: {
                        access_token: { token: string };
                        refresh_token: { token: string };
                    };
                };
            },
            { email: string; password: string }
        >({
            query: (body) => ({
                url: '/auth/signin',
                method: 'POST',
                body,
            }),
        }),

        // Sign up with email/password and agency details
        signUp: builder.mutation<
            {
                success: boolean;
                message: string;
                data: {
                    id: string;
                    email: string;
                };
            },
            {
                email: string;
                password: string;
                fullName?: string;
                plan?: string;
            }
        >({
            query: (body) => ({
                url: '/auth/signup',
                method: 'POST',
                body,
            }),
        }),

        // Sign out (stateless JWT — client also clears local credentials)
        signOut: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: '/auth/signout',
                method: 'POST',
            }),
            invalidatesTags: ['User', 'Auth'],
        }),

        // Reset password (send reset link)
        resetPassword: builder.mutation<
            { success: boolean; message: string },
            { email: string }
        >({
            query: (body) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Update password using a reset token
        updatePassword: builder.mutation<
            { success: boolean; message: string },
            { token: string; password: string }
        >({
            query: (body) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const {
    useGetCurrentUserQuery,
    useSignInMutation,
    useSignUpMutation,
    useSignOutMutation,
    useResetPasswordMutation,
    useUpdatePasswordMutation,
} = authApi;
