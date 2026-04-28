import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import Services from '../services/index';
import { handleErrorResponse } from '@/utils/error.util';
import RESPONSE_CODES from '@/constant/responseCode';
import { AuthenticatedRequest } from '@/middlewares/authenticate';
import MESSAGES from '@/constant/message';

/**
 * @route GET /api/v1/subscriptions/me
 * @desc Fetch current user's subscription details
 */
export const getMySubscription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
            });
        }

        const subscription = await Services.subscription.getSubscriptionByUserId(userId);

        if (!subscription) {
            return res.status(RESPONSE_CODES.OK).json({
                success: true,
                message: 'No active subscription found',
                data: null,
            });
        }

        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: 'Subscription details fetched successfully',
            data: subscription,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/subscriptions/customer/:stripeCustomerId
 * @desc Look up a subscription by Stripe customer ID
 */
export const getSubscriptionByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stripeCustomerId = req.params.stripeCustomerId;
        const resolvedStripeCustomerId = Array.isArray(stripeCustomerId) ? stripeCustomerId[0] : stripeCustomerId;

        if (!resolvedStripeCustomerId) {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'stripeCustomerId is required',
            });
        }

        const subscription = await Services.subscription.getSubscriptionByStripeCustomerId(resolvedStripeCustomerId);

        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: subscription ? 'Subscription found' : 'Subscription not found',
            data: subscription,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route POST /api/v1/subscriptions/sync
 * @desc Upsert a subscription record from Stripe webhooks
 */
export const syncSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            userId,
            stripeCustomerId,
            stripeSubscriptionId,
            plan,
            status,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd,
        } = req.body || {};

        if (!userId || !stripeCustomerId) {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'userId and stripeCustomerId are required',
            });
        }

        const subscription = await Services.subscription.createOrUpdateSubscription(userId, {
            stripeCustomerId,
            stripeSubscriptionId,
            plan,
            status,
            currentPeriodStart,
            currentPeriodEnd,
            cancelAtPeriodEnd: Boolean(cancelAtPeriodEnd),
        });

        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: 'Subscription synced successfully',
            data: subscription,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const signature = req.header('stripe-signature');
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).send('Missing stripe-signature header');
    }

    if (!secret) {
        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).send('STRIPE_WEBHOOK_SECRET is not configured');
    }

    const rawBody = Buffer.isBuffer(req.body)
        ? req.body.toString('utf8')
        : typeof req.body === 'string'
            ? req.body
            : JSON.stringify(req.body);

    if (!verifyStripeSignature(rawBody, signature, secret)) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).send('Webhook signature verification failed');
    }

    const event = JSON.parse(rawBody) as { type?: string; data?: { object?: any } };

    try {
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await syncStripeSubscription(event.data?.object);
                break;
            case 'customer.subscription.deleted':
                await cancelStripeSubscription(event.data?.object);
                break;
            case 'invoice.payment_succeeded':
            case 'invoice.payment_failed':
                await touchStripeSubscription(event.data?.object);
                break;
            default:
                break;
        }

        return res.status(RESPONSE_CODES.OK).json({ received: true });
    } catch (error) {
        console.error('Stripe webhook error:', error);
        return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).send('Webhook processing failed');
    }
};

const verifyStripeSignature = (payload: string, signatureHeader: string, secret: string): boolean => {
    const parts = signatureHeader.split(',').reduce<Record<string, string>>((accumulator, part) => {
        const [key, value] = part.split('=');
        if (key && value) {
            accumulator[key] = value;
        }
        return accumulator;
    }, {});

    const timestamp = parts.t;
    const signature = parts.v1;

    if (!timestamp || !signature) {
        return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex');

    try {
        return crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(signature, 'hex'));
    } catch {
        return false;
    }
};

const resolvePlanFromPriceId = (priceId?: string): 'basic' | 'pro' | 'enterprise' => {
    if (
        priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
        priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
    ) {
        return 'pro';
    }

    if (priceId === process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID) {
        return 'enterprise';
    }

    return 'basic';
};

const syncStripeSubscription = async (subscription: any) => {
    if (!subscription?.customer) {
        return;
    }

    const currentSubscription = await Services.subscription.getSubscriptionByStripeCustomerId(
        String(subscription.customer)
    );

    if (!currentSubscription?.userId) {
        console.error('User not found for customer:', subscription.customer);
        return;
    }

    await Services.subscription.createOrUpdateSubscription(currentSubscription.userId.toString(), {
        stripeCustomerId: String(subscription.customer),
        stripeSubscriptionId: subscription.id,
        plan: resolvePlanFromPriceId(subscription.items?.data?.[0]?.price?.id),
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    });
};

const cancelStripeSubscription = async (subscription: any) => {
    if (!subscription?.customer) {
        return;
    }

    const currentSubscription = await Services.subscription.getSubscriptionByStripeCustomerId(
        String(subscription.customer)
    );

    if (!currentSubscription?.userId) {
        console.error('User not found for customer:', subscription.customer);
        return;
    }

    await Services.subscription.createOrUpdateSubscription(currentSubscription.userId.toString(), {
        stripeCustomerId: String(subscription.customer),
        stripeSubscriptionId: undefined,
        plan: currentSubscription.plan,
        status: 'canceled',
        currentPeriodStart: currentSubscription.currentPeriodStart,
        currentPeriodEnd: currentSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: true,
    });
};

const touchStripeSubscription = async (invoice: any) => {
    if (!invoice?.customer) {
        return;
    }

    const currentSubscription = await Services.subscription.getSubscriptionByStripeCustomerId(
        String(invoice.customer)
    );

    if (!currentSubscription?.userId) {
        return;
    }

    await Services.subscription.createOrUpdateSubscription(currentSubscription.userId.toString(), {
        stripeCustomerId: String(invoice.customer),
        stripeSubscriptionId: currentSubscription.stripeSubscriptionId,
        plan: currentSubscription.plan,
        status: currentSubscription.status,
        currentPeriodStart: currentSubscription.currentPeriodStart,
        currentPeriodEnd: currentSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: currentSubscription.cancelAtPeriodEnd,
    });
};