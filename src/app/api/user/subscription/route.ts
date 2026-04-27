import { getCurrentUserServer } from '@/services/auth-server';
import { createCheckoutSession, createPortalSession, getSubscription } from '@/services/stripe';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserServer();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const subscription = await getSubscription(user.id);

    return new Response(JSON.stringify(subscription), { status: 200 });
  } catch (error: any) {
    console.error('Get subscription error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch subscription' }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserServer();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const { priceId, action } = body;

    // Check if user has admin role here or allow all users to manage their subscription
    // For now, allowing all authenticated users to manage their subscription
    const subscription = await getSubscription(user.id);

    if (action === 'portal') {
      // Return billing portal URL
      const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`;
      const session = await createPortalSession(subscription.stripe_customer_id, returnUrl);

      return new Response(JSON.stringify({ url: session.url }), { status: 200 });
    }

    if (action === 'checkout') {
      if (!priceId) {
        return new Response(JSON.stringify({ error: 'Missing priceId' }), { status: 400 });
      }

      // Create checkout session
      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`;

      const session = await createCheckoutSession(
        subscription.stripe_customer_id,
        priceId,
        successUrl,
        cancelUrl
      );

      return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (error: any) {
    console.error('Subscription action error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process subscription action' }),
      { status: 500 }
    );
  }
}
