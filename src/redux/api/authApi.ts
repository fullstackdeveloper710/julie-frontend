import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { User } from '@/types';
import { BILLING_INTERVAL } from '@/types/enums';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '',
  }),
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
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
      invalidatesTags: ['User', 'Auth'],
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
        billingInterval?: BILLING_INTERVAL;
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
    resetPassword: builder.mutation<{ success: boolean; message: string }, { email: string }>({
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
