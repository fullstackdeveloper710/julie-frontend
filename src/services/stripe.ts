import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { PlanType } from '@/types';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const STRIPE_PRODUCTS = {
  basic: {
    name: 'Basic Plan',
    description: 'For small teams getting started',
    monthly: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID || '',
  },
  pro: {
    name: 'Pro Plan',
    description: 'For growing teams with advanced analytics',
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || '',
  },
  enterprise: {
    name: 'Enterprise Plan',
    description: 'Custom solutions with dedicated support',
    monthly: '', // Usually quoted
    yearly: '', // Usually quoted
  },
};

export async function createStripeCustomer(userId: string, email: string, userName: string) {
  const customer = await stripe.customers.create({
    email,
    name: userName,
    metadata: {
      userId,
    },
  });

  // Store Stripe customer ID in database
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .insert([
      {
        user_id: userId,
        stripe_customer_id: customer.id,
        plan: 'founding',
        status: 'trialing',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]);

  if (error) throw error;

  return customer;
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    // Prefill customer email (optional)
    customer_update: {
      address: 'auto',
    },
  });

  return session;
}

export async function getSubscription(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateSubscription(
  userId: string,
  updates: Partial<{
    plan: PlanType;
    status: string;
    stripe_subscription_id: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  }>
) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getStripeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export function getPlanFromPriceId(priceId: string): PlanType {
  // Map Stripe price IDs to plans
  if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID ||
    priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID
  ) {
    return 'founding';
  }
  if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
  ) {
    return 'standard';
  }
  return 'founding'; // Default to founding
}
