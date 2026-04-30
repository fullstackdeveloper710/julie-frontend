import Subscription from '../models/subscription.model';
import { CustomError } from '../../errors/custom.error';
import RESPONSE_CODES from '../../constant/responseCode';

const FOUNDING_RATE_CAP = 20;
const FOUNDING_RATE_MONTHLY_PRICE = 149;
const FOUNDING_RATE_ANNUAL_PRICE = 1639;
const FOUNDING_RATE_BILLING_PAUSE_DAYS = 90;
const FOUNDING_RATE_COMMITMENT_MONTHS = 12;
const FOUNDING_RATE_REQUIRED_CHECKINS = 3;

// ── Basic lookups ────────────────────────────────────────────────────────────

export const getSubscriptionByUserId = async (userId: string) =>
    Subscription.findOne({ userId: userId as any });

export const getSubscriptionByStripeCustomerId = async (stripeCustomerId: string) =>
    Subscription.findOne({ stripeCustomerId });

export const createOrUpdateSubscription = async (userId: string, data: any) =>
    Subscription.findOneAndUpdate({ userId: userId as any }, data, { upsert: true, new: true });

// ── Founding Rate ────────────────────────────────────────────────────────────

/**
 * Count how many subscriptions currently have the founding rate active.
 * Uses only confirmed/active founding rate records (not downgraded ones).
 */
export const getActiveFoundingRateCount = async (): Promise<number> =>
    Subscription.countDocuments({
        isFoundingRate: true,
        foundingRateDowngradedAt: null,
    });

/**
 * Check whether the founding rate is still available (cap not reached).
 */
export const isFoundingRateAvailable = async (): Promise<boolean> => {
    const count = await getActiveFoundingRateCount();
    return count < FOUNDING_RATE_CAP;
};

/**
 * Apply the founding rate to a new Professional subscription.
 * Sets billing pause, commitment end date, and locks the price.
 * Throws if the cap has already been reached.
 */
export const applyFoundingRate = async (userId: string): Promise<void> => {
    if (!(await isFoundingRateAvailable())) {
        throw new CustomError(
            RESPONSE_CODES.BAD_REQUEST,
            'Founding Rate is no longer available — all 20 spots have been claimed.'
        );
    }

    const now = new Date();
    const billingPausedUntil = new Date(now);
    billingPausedUntil.setDate(billingPausedUntil.getDate() + FOUNDING_RATE_BILLING_PAUSE_DAYS);

    // Commitment end is calculated from billing activation (after the pause)
    const commitmentEnd = new Date(billingPausedUntil);
    commitmentEnd.setMonth(commitmentEnd.getMonth() + FOUNDING_RATE_COMMITMENT_MONTHS);

    await Subscription.findOneAndUpdate(
        { userId: userId as any },
        {
            isFoundingRate: true,
            foundingRateLockedPrice: FOUNDING_RATE_MONTHLY_PRICE,
            billingPausedUntil,
            foundingRateActivatedAt: null, // set when billing actually starts (month 4)
            foundingRateCommitmentEndDate: commitmentEnd,
            consecutiveCheckins: 0,
            pricingLocked: true,
            lockedPrice: FOUNDING_RATE_MONTHLY_PRICE,
            lockedAt: now,
        },
        { new: true }
    );
};

/**
 * Record a successful monthly check-in for a founding rate subscription.
 * Returns true if the subscription is still in good standing,
 * or false and triggers a downgrade to Essentials if the 3-checkin
 * requirement has been violated (i.e. a check-in was missed).
 *
 * Call this from the monthly check-in submission flow.
 */
export const recordFoundingRateCheckin = async (
    userId: string,
    checkInDate: Date = new Date()
): Promise<{ downgraded: boolean }> => {
    const sub = await Subscription.findOne({ userId: userId as any });
    if (!sub || !sub.isFoundingRate || sub.foundingRateDowngradedAt) {
        return { downgraded: false };
    }

    const lastCheckin = sub.lastCheckinAt;
    let newConsecutive = sub.consecutiveCheckins;

    if (lastCheckin) {
        // Check if this check-in is within the same or next calendar month
        const lastMonth = new Date(lastCheckin);
        const expectedLatest = new Date(lastMonth);
        expectedLatest.setMonth(expectedLatest.getMonth() + 2); // allow up to 2 months gap

        if (checkInDate > expectedLatest) {
            // Missed a month — reset streak
            newConsecutive = 0;
        }
    }

    newConsecutive += 1;
    sub.consecutiveCheckins = newConsecutive;
    sub.lastCheckinAt = checkInDate;

    if (newConsecutive >= FOUNDING_RATE_REQUIRED_CHECKINS && !sub.foundingRateActivatedAt) {
        // 3 consecutive check-ins met — activate billing
        sub.foundingRateActivatedAt = checkInDate;
    }

    await sub.save();
    return { downgraded: false };
};

/**
 * Check all founding rate subscriptions for missed check-ins and downgrade
 * any that have gone more than 1 calendar month without a check-in.
 * Intended to be called from a scheduled job (e.g. nightly cron).
 */
export const enforceFoundingRateRequirements = async (): Promise<number> => {
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Find founding rate subs that have missed a check-in for more than a month
    const overdueSubscriptions = await Subscription.find({
        isFoundingRate: true,
        foundingRateDowngradedAt: null,
        $or: [
            { lastCheckinAt: { $lt: oneMonthAgo } },
            { lastCheckinAt: null },
        ],
    });

    let downgradedCount = 0;
    for (const sub of overdueSubscriptions) {
        sub.plan = 'essentials';
        sub.isFoundingRate = false;
        sub.foundingRateDowngradedAt = now;
        sub.pricingLocked = false;
        sub.lockedPrice = null;
        await sub.save();
        downgradedCount++;
    }

    return downgradedCount;
};

/**
 * Returns the early cancellation charge for a founding rate subscription.
 * If cancelled before commitment end, the full annual amount is still owed.
 */
export const getFoundingRateCancellationCharge = async (
    userId: string
): Promise<{ charge: number; commitmentEndDate: Date | null }> => {
    const sub = await Subscription.findOne({ userId: userId as any });
    if (!sub?.isFoundingRate || !sub.foundingRateCommitmentEndDate) {
        return { charge: 0, commitmentEndDate: null };
    }

    const now = new Date();
    if (now < sub.foundingRateCommitmentEndDate) {
        return {
            charge: FOUNDING_RATE_ANNUAL_PRICE,
            commitmentEndDate: sub.foundingRateCommitmentEndDate,
        };
    }

    return { charge: 0, commitmentEndDate: sub.foundingRateCommitmentEndDate };
};
