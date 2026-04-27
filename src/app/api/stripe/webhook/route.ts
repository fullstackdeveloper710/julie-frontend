import { headers } from 'next/headers';
import { stripe } from '@/services/stripe';
import { updateSubscription, getPlanFromPriceId } from '@/services/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }
}

async function handleSubscriptionCreated(subscription: any) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  const priceId = subscription.items.data[0]?.price.id;

  // Find user by customer ID
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !data) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const plan = getPlanFromPriceId(priceId);
  const status = subscription.status;

  await updateSubscription(data.user_id, {
    stripe_subscription_id: subscriptionId,
    plan,
    status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  });

  console.log(`Subscription created: ${subscriptionId} for user ${data.user_id}`);
}

async function handleSubscriptionUpdated(subscription: any) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  const priceId = subscription.items.data[0]?.price.id;

  // Find user
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !data) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const plan = getPlanFromPriceId(priceId);
  const status = subscription.status;

  await updateSubscription(data.user_id, {
    plan,
    status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  });

  console.log(`Subscription updated: ${subscriptionId} for user ${data.user_id}`);
}

async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer;

  // Find user
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !data) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await updateSubscription(data.user_id, {
    status: 'canceled',
    stripe_subscription_id: undefined,
  });

  console.log(`Subscription deleted for user ${data.user_id}`);
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  const customerId = invoice.customer;

  // Find user
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (data) {
    console.log(`Payment succeeded for user ${data.user_id}`);
    // Could send email notification here
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  const customerId = invoice.customer;

  // Find user
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (data) {
    console.log(`Payment failed for user ${data.user_id}`);
    // Could send email notification here
  }
}
