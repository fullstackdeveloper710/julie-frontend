import cron from 'node-cron';
import type { ScheduledTask } from 'node-cron';
import Subscription from '../v1/models/subscription.model';
import { stripe } from '../config/stripe';

/**
 * Monitor founder plan subscriptions and handle trial-to-billing transitions
 * 
 * When a founder subscription's trial ends:
 * 1. Fetch subscription details from Stripe
 * 2. Update MongoDB status from 'trialing' to 'active'
 * 3. Initialize founding rate activation date (billing started)
 * 4. Log the transition
 */
export const founderTrialMonitor = () => {
    // Run every day at 2 AM UTC
    const task = cron.schedule('0 2 * * *', async () => {
        try {
            console.log('[CRON] founderTrialMonitor: Starting founder trial monitor job');

            // Find subscriptions that are in trial status and trial has ended
            const now = new Date();
            const expiredTrials = await Subscription.find({
                status: 'trialing',
                isFoundingRate: true,
                currentPeriodEnd: { $lte: now },
                foundingRateDowngradedAt: null,
            });

            console.log(`[CRON] Found ${expiredTrials.length} founder subscriptions with expired trials`);

            for (const subscription of expiredTrials) {
                try {
                    if (!subscription.stripeSubscriptionId) {
                        console.warn(
                            `[CRON] Subscription ${subscription._id} has no Stripe subscription ID`
                        );
                        continue;
                    }

                    // Fetch latest subscription details from Stripe
                    const stripeSubscription = await stripe.subscriptions.retrieve(
                        subscription.stripeSubscriptionId
                    );

                    // Update subscription status based on Stripe data
                    const stripeSubAsAny = stripeSubscription as any;
                    const newStatus = (stripeSubAsAny.status || subscription.status) as string;
                    const foundingRateActivatedAt =
                        subscription.foundingRateActivatedAt || new Date();

                    // Safe conversion of period dates
                    const currentPeriodStart = stripeSubAsAny.current_period_start
                        ? new Date((stripeSubAsAny.current_period_start as number) * 1000)
                        : subscription.currentPeriodStart;
                    const currentPeriodEnd = stripeSubAsAny.current_period_end
                        ? new Date((stripeSubAsAny.current_period_end as number) * 1000)
                        : subscription.currentPeriodEnd;

                    // Update MongoDB record
                    const updated = await Subscription.findByIdAndUpdate(
                        subscription._id,
                        {
                            status: newStatus,
                            foundingRateActivatedAt,
                            currentPeriodStart,
                            currentPeriodEnd,
                        },
                        { new: true }
                    );

                    console.log(
                        `[CRON] Transitioned subscription ${subscription._id} to status: ${newStatus}, billing activated`
                    );
                } catch (error) {
                    console.error(
                        `[CRON] Error processing subscription ${subscription._id}:`,
                        error
                    );
                }
            }

            console.log('[CRON] founderTrialMonitor: Job completed');
        } catch (error) {
            console.error('[CRON] founderTrialMonitor: Fatal error:', error);
        }
    });

    return task;
};

/**
 * Stop the cron job
 */
export const stopFounderTrialMonitor = (task: ScheduledTask) => {
    if (task) {
        task.stop();
        task.destroy();
        console.log('[CRON] founderTrialMonitor: Job stopped');
    }
};
