import Stripe from 'stripe';
import { buildBackendApiUrl } from './backend';

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

type BackendPlan = 'basic' | 'pro' | 'enterprise';

export async function createStripeCustomer(userId: string, email: string, userName: string) {
  const customer = await stripe.customers.create({
    email,
    name: userName,
    metadata: {
      userId,
    },
  });

  await syncSubscriptionRecord(userId, {
    stripeCustomerId: customer.id,
    plan: 'basic',
    status: 'trialing',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
  });

  return customer;
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
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

export async function updateSubscription(
  userId: string,
  updates: Partial<{
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    plan: BackendPlan;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  }>,
) {
  const response = await fetch(buildBackendApiUrl('/subscriptions/sync'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      stripeCustomerId: updates.stripeCustomerId,
      stripeSubscriptionId: updates.stripeSubscriptionId,
      plan: updates.plan,
      status: updates.status,
      currentPeriodStart: updates.currentPeriodStart,
      currentPeriodEnd: updates.currentPeriodEnd,
      cancelAtPeriodEnd: updates.cancelAtPeriodEnd,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to sync subscription (${response.status})`);
  }

  const payload = await response.json();
  return payload.data;
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

export function getPlanFromPriceId(priceId: string): BackendPlan {
  // Map Stripe price IDs to plans
  if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID ||
    priceId === process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID
  ) {
    return 'basic';
  }
  if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
  ) {
    return 'pro';
  }
  return 'basic';
}

async function syncSubscriptionRecord(
  userId: string,
  updates: Partial<{
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    plan: BackendPlan;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  }>,
) {
  const response = await fetch(buildBackendApiUrl('/subscriptions/sync'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      stripeCustomerId: updates.stripeCustomerId,
      stripeSubscriptionId: updates.stripeSubscriptionId,
      plan: updates.plan,
      status: updates.status,
      currentPeriodStart: updates.currentPeriodStart,
      currentPeriodEnd: updates.currentPeriodEnd,
      cancelAtPeriodEnd: updates.cancelAtPeriodEnd,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to sync subscription (${response.status})`);
  }
}
