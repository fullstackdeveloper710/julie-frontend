import { buildBackendApiUrl } from './backend';

/**
 * Initialize a subscription payment session for a new user
 * Calls backend to create Stripe checkout session
 */
export async function initializeSubscriptionForNewUser(
  accessToken: string,
  planId: string,
  billingInterval: 'monthly' | 'annual',
  isFoundingRate: boolean = false
) {
  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const successUrl = `${currentOrigin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${currentOrigin}/cancel`;

  const response = await fetch(buildBackendApiUrl('/subscriptions/create-checkout'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      planId,
      billingInterval,
      successUrl,
      cancelUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to initialize payment');
  }

  const data = await response.json();
  return data.data; // Returns { sessionId, url }
}

/**
 * Create a billing portal session to manage subscription
 */
export async function createBillingPortalSession(accessToken: string, returnUrl: string) {
  const response = await fetch(buildBackendApiUrl('/subscriptions/billing-portal'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      returnUrl,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create billing portal session');
  }

  const data = await response.json();
  return data.data; // Should return { url }
}


