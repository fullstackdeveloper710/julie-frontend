import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

const AUTH_REDIRECTS = {
    emailConfirmation: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    passwordReset: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
    dashboard: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
} as const;

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
                        access_token: {
                            token: string;
                        };
                        refresh_token: {
                            token: string;
                        };
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

        // Sign out
        signOut: builder.mutation<{ success: boolean }, void>({
            queryFn: async () => {
                try {
                    const { error } = await supabase.auth.signOut();

                    if (error) {
                        return {
                            error: {
                                status: 500,
                                data: error.message,
                            },
                        };
                    }

                    return { data: { success: true } };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data: error instanceof Error ? error.message : 'Sign out failed',
                        },
                    };
                }
            },
            invalidatesTags: ['User', 'Auth'],
        }),

        // Reset password (send reset link)
        resetPassword: builder.mutation<{ success: boolean; message: string }, { email: string }>({
            queryFn: async ({ email }) => {
                try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: AUTH_REDIRECTS.passwordReset,
                    });

                    if (error) {
                        return {
                            error: {
                                status: 400,
                                data: error.message,
                            },
                        };
                    }

                    return {
                        data: {
                            success: true,
                            message: 'Password reset link sent to your email',
                        },
                    };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data: error instanceof Error ? error.message : 'Failed to send reset link',
                        },
                    };
                }
            },
            invalidatesTags: ['Auth'],
        }),

        // Update password (after user clicks reset link)
        updatePassword: builder.mutation<{ success: boolean }, { password: string }>({
            queryFn: async ({ password }) => {
                try {
                    const { error } = await supabase.auth.updateUser({ password });

                    if (error) {
                        return {
                            error: {
                                status: 400,
                                data: error.message,
                            },
                        };
                    }

                    return { data: { success: true } };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data: error instanceof Error ? error.message : 'Failed to update password',
                        },
                    };
                }
            },
            invalidatesTags: ['Auth'],
        }),

        // Get current session
        getCurrentSession: builder.query<{ session: any | null }, void>({
            queryFn: async () => {
                try {
                    const {
                        data: { session },
                    } = await supabase.auth.getSession();

                    return { data: { session } };
                } catch (error) {
                    return {
                        error: {
                            status: 500,
                            data: error instanceof Error ? error.message : 'Failed to fetch session',
                        },
                    };
                }
            },
            providesTags: ['Auth'],
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
    useGetCurrentSessionQuery,
} = authApi;
