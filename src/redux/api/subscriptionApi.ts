import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import { Subscription } from '@/types';

export const subscriptionApi = createApi({
    reducerPath: 'subscriptionApi',
    baseQuery: axiosBaseQuery({ baseUrl: '' }),
    tagTypes: ['Subscription', 'Subscriptions'],
    endpoints: (builder) => ({
        getSubscription: builder.query<{ subscription: Subscription | null }, void>({
            query: () => ({
                url: '/subscriptions/me',
                method: 'GET',
            }),
            providesTags: ['Subscription'],
        }),

        getSubscriptionById: builder.query<{ subscription: Subscription }, string>({
            query: (subscriptionId) => ({
                url: `/subscriptions/${subscriptionId}`,
                method: 'GET',
            }),
            providesTags: (result, error, subscriptionId) => [{ type: 'Subscriptions', id: subscriptionId }],
        }),

        createSubscription: builder.mutation<
            { subscription: Subscription },
            { planId: string; seats: number }
        >({
            query: (body) => ({
                url: '/subscriptions',
                method: 'POST',
                data: body,
            }),
            invalidatesTags: ['Subscription', 'Subscriptions'],
        }),

        // Update subscription
        updateSubscription: builder.mutation<
            { subscription: Subscription },
            { subscriptionId: string; data: Partial<Subscription> }
        >({
            query: ({ subscriptionId, data }) => ({
                url: `/subscriptions/${subscriptionId}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { subscriptionId }) => [
                { type: 'Subscriptions', id: subscriptionId },
                'Subscription',
            ],
        }),

        // Cancel subscription
        cancelSubscription: builder.mutation<
            { subscription: Subscription },
            { subscriptionId: string; reason?: string }
        >({
            query: ({ subscriptionId, reason }) => ({
                url: `/subscriptions/${subscriptionId}/cancel`,
                method: 'POST',
                data: { reason },
            }),
            invalidatesTags: ['Subscription', 'Subscriptions'],
        }),

        // Get subscription invoices
        getInvoices: builder.query<{ invoices: any[] }, string>({
            query: (subscriptionId) => ({
                url: `/subscriptions/${subscriptionId}/invoices`,
                method: 'GET',
            }),
            providesTags: (result, error, subscriptionId) => [
                { type: 'Subscriptions', id: `${subscriptionId}-invoices` },
            ],
        }),

        // Submit testimonial for founding tier
        submitTestimonial: builder.mutation<
            { subscription: Subscription },
            {
                subscriptionId: string;
                testimonial: {
                    text: string;
                    authorName?: string;
                    authorTitle?: string;
                    authorCompany?: string;
                };
            }
        >({
            query: ({ subscriptionId, testimonial }) => ({
                url: `/subscriptions/${subscriptionId}/testimonial`,
                method: 'POST',
                data: testimonial,
            }),
            invalidatesTags: ['Subscription'],
        }),

        // Transition to a different tier
        transitionTier: builder.mutation<
            { subscription: Subscription },
            {
                subscriptionId: string;
                targetTier: string;
                billingInterval?: 'monthly' | 'annual';
            }
        >({
            query: ({ subscriptionId, targetTier, billingInterval }) => ({
                url: `/subscriptions/${subscriptionId}/transition`,
                method: 'POST',
                data: { targetTier, billingInterval },
            }),
            invalidatesTags: ['Subscription'],
        }),

        // Update billing info
        updateBillingInfo: builder.mutation<
            { subscription: Subscription },
            {
                subscriptionId: string;
                billingInfo: {
                    companyName?: string;
                    taxId?: string;
                    billingAddress?: {
                        street: string;
                        city: string;
                        state: string;
                        zip: string;
                        country: string;
                    };
                };
            }
        >({
            query: ({ subscriptionId, billingInfo }) => ({
                url: `/subscriptions/${subscriptionId}/billing`,
                method: 'PATCH',
                data: billingInfo,
            }),
            invalidatesTags: ['Subscription'],
        }),

        // Record monthly check-in
        recordCheckIn: builder.mutation<
            { subscription: Subscription },
            {
                subscriptionId: string;
                checkInData: {
                    notes?: string;
                    metrics?: Record<string, any>;
                };
            }
        >({
            query: ({ subscriptionId, checkInData }) => ({
                url: `/subscriptions/${subscriptionId}/checkin`,
                method: 'POST',
                data: checkInData,
            }),
            invalidatesTags: ['Subscription'],
        }),

        // Add additional agency (enterprise only)
        addAgency: builder.mutation<
            { subscription: Subscription },
            {
                subscriptionId: string;
                agencyData: {
                    name: string;
                    contacts?: string[];
                };
            }
        >({
            query: ({ subscriptionId, agencyData }) => ({
                url: `/subscriptions/${subscriptionId}/agencies`,
                method: 'POST',
                data: agencyData,
            }),
            invalidatesTags: ['Subscription'],
        }),

        // Invite user to subscription (add to seats)
        inviteUser: builder.mutation<
            { invitation: any },
            {
                subscriptionId: string;
                inviteData: {
                    email: string;
                    role: 'admin' | 'viewer';
                };
            }
        >({
            query: ({ subscriptionId, inviteData }) => ({
                url: `/subscriptions/${subscriptionId}/invitations`,
                method: 'POST',
                data: inviteData,
            }),
            invalidatesTags: ['Subscription'],
        }),

        // Create Stripe session
        createStripeSession: builder.mutation<
            { sessionId: string; url: string },
            { subscriptionId: string; redirectUrl: string }
        >({
            query: (body) => ({
                url: '/stripe/create-session',
                method: 'POST',
                data: body,
            }),
        }),
    }),
});

export const {
    useGetSubscriptionQuery,
    useGetSubscriptionByIdQuery,
    useCreateSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useCancelSubscriptionMutation,
    useGetInvoicesQuery,
    useSubmitTestimonialMutation,
    useTransitionTierMutation,
    useUpdateBillingInfoMutation,
    useRecordCheckInMutation,
    useAddAgencyMutation,
    useInviteUserMutation,
    useCreateStripeSessionMutation,
} = subscriptionApi;
