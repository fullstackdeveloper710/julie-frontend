import stripe from '@/config/stripe';
import RESPONSE_CODES from '@/constant/responseCode';
import { CustomError } from '@/errors/custom.error';

const FOUNDER_PLAN_PRICE_ID_CACHE = {
    monthlyPriceId: null as string | null,
};

/**
 * Create a Stripe customer and subscription with trial period for founder plan
 * @param userId - User ID in MongoDB
 * @param email - User email address
 * @param plan - Plan type (e.g., 'founder')
 * @param trialDays - Number of trial days (e.g., 90)
 * @returns Object with stripeCustomerId, subscriptionId, and trialEndsAt date
 */
export const createCustomerAndSubscription = async (
    userId: string,
    email: string,
    plan: string,
    trialDays: number
) => {
    try {
        // Create Stripe customer
        const customer = await stripe.customers.create({
            email,
            metadata: {
                userId,
                plan,
            },
        });

        // Get founder plan price ID
        const priceId = await ensureFounderPriceId();

        // Create subscription with trial
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price: priceId,
                },
            ],
            trial_period_days: trialDays,
            metadata: {
                userId,
                plan,
            },
        });

        const trialEndsAt = new Date(subscription.trial_end! * 1000);

        return {
            stripeCustomerId: customer.id,
            subscriptionId: subscription.id,
            trialEndsAt,
        };
    } catch (error: any) {
        console.error('Error creating Stripe customer/subscription:', error);
        throw new CustomError(
            RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            `Failed to create subscription: ${error.message}`
        );
    }
};

/**
 * Get or fetch the Stripe price ID for the founder plan (monthly billing)
 * Caches the result to avoid repeated API calls
 */
export const ensureFounderPriceId = async (): Promise<string> => {
    // Return cached value if available
    if (FOUNDER_PLAN_PRICE_ID_CACHE.monthlyPriceId) {
        return FOUNDER_PLAN_PRICE_ID_CACHE.monthlyPriceId;
    }

    try {
        // Try to get from environment variable first
        const envPriceId = process.env.STRIPE_FOUNDER_MONTHLY_PRICE_ID;
        if (envPriceId) {
            FOUNDER_PLAN_PRICE_ID_CACHE.monthlyPriceId = envPriceId;
            return envPriceId;
        }

        // Alternative: Query Stripe for founder product and fetch price
        const products = await stripe.products.list({
            active: true,
            limit: 100,
        });

        const founderProduct = products.data.find(
            (p) => p.name.toLowerCase().includes('founder') || p.metadata?.type === 'founder'
        );

        if (!founderProduct) {
            throw new Error('Founder product not found in Stripe');
        }

        const prices = await stripe.prices.list({
            product: founderProduct.id,
            active: true,
            type: 'recurring',
            recurring: { interval: 'month' },
        });

        if (prices.data.length === 0) {
            throw new Error('No monthly price found for founder product');
        }

        const monthlyPrice = prices.data[0];
        FOUNDER_PLAN_PRICE_ID_CACHE.monthlyPriceId = monthlyPrice.id;

        return monthlyPrice.id;
    } catch (error: any) {
        console.error('Error fetching founder price ID:', error);
        throw new CustomError(
            RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            `Failed to get founder price from Stripe: ${error.message}`
        );
    }
};

/**
 * Validate whether a user can cancel their subscription
 * Returns { allowed: boolean, reason?: string }
 */
export const validateCancellationAllowed = (subscription: any): { allowed: boolean; reason?: string } => {
    // Check if still in trial
    if (subscription.status === 'trialing') {
        return {
            allowed: false,
            reason: 'You cannot cancel during the trial period',
        };
    }

    // Check if in commitment period
    if (subscription.isFoundingRate && subscription.foundingRateCommitmentEndDate) {
        const commitmentEnd = new Date(subscription.foundingRateCommitmentEndDate);
        const now = new Date();

        if (now < commitmentEnd) {
            return {
                allowed: false,
                reason: `You cannot cancel your subscription until ${commitmentEnd.toLocaleDateString()} (end of 12-month commitment)`,
            };
        }
    }

    return { allowed: true };
};

/**
 * Cancel a Stripe subscription immediately
 */
export const cancelStripeSubscriptionImmediately = async (subscriptionId: string): Promise<void> => {
    try {
        await stripe.subscriptions.cancel(subscriptionId);
    } catch (error: any) {
        console.error('Error canceling Stripe subscription:', error);
        throw new CustomError(
            RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            `Failed to cancel subscription: ${error.message}`
        );
    }
};

/**
 * Get trial end date from Stripe subscription
 */
export const getTrialEndDate = (stripeSubscription: any): Date | null => {
    if (stripeSubscription.trial_end) {
        return new Date(stripeSubscription.trial_end * 1000);
    }
    return null;
};
