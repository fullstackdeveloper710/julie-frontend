import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export type SubscriptionPlanKey = 'founding' | 'early_adopter' | 'standard' | 'enterprise';
export type BillingInterval = 'monthly' | 'annual';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';

export interface Subscription {
  _id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  plan: SubscriptionPlanKey;
  billingInterval: BillingInterval;
  status: SubscriptionStatus;
  trialStartDate: string | null;
  trialEndDate: string | null;
  pricingLocked: boolean;
  lockedPrice: number | null;
  lockedAt: string | null;
  numberOfAgencies: number;
  adminSeats: number;
  viewerSeats: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiSuccess<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: axiosBaseQuery({ baseUrl: '' }),
  tagTypes: ['Subscription'],

  endpoints: (builder) => ({
    getSubscription: builder.query<ApiSuccess<Subscription | null>, void>({
      query: () => ({ url: '/subscriptions/me', method: 'GET' }),
      providesTags: ['Subscription'],
    }),

    createCheckoutSession: builder.mutation<
      ApiSuccess<{ url: string }>,
      { planKey: SubscriptionPlanKey; billingInterval: BillingInterval }
    >({
      query: (body) => ({ url: '/subscriptions/checkout', method: 'POST', body }),
    }),

    getBillingPortal: builder.mutation<ApiSuccess<{ url: string }>, void>({
      query: () => ({ url: '/subscriptions/portal', method: 'POST' }),
    }),

    cancelSubscription: builder.mutation<ApiSuccess<Subscription>, void>({
      query: () => ({ url: '/subscriptions/cancel', method: 'POST' }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useCreateCheckoutSessionMutation,
  useGetBillingPortalMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;
