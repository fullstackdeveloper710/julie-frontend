import { useEffect, useState } from 'react';
import { Subscription } from '@/types';
import { USER_PLAN } from '@/types/enums';

const getFounderBillingStatus = (subscription: Subscription) => {
  if (subscription.plan !== USER_PLAN.FOUNDER) return null;

  const now = new Date();
  const pausedUntil = subscription.billingPausedUntil
    ? new Date(subscription.billingPausedUntil)
    : null;
  const commitmentEnd = subscription.foundingRateCommitmentEndDate
    ? new Date(subscription.foundingRateCommitmentEndDate)
    : null;

  const isPaused = pausedUntil !== null && now < pausedUntil;
  const pauseDaysRemaining = pausedUntil
    ? Math.max(0, Math.ceil((pausedUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    isPaused,
    pauseDaysRemaining,
    isActivated: !!subscription.foundingRateActivatedAt,
    consecutiveCheckins: subscription.consecutiveCheckins,
    checkinsNeeded: Math.max(0, 3 - subscription.consecutiveCheckins),
    commitmentEndDate: commitmentEnd,
    isDowngraded: !!subscription.foundingRateDowngradedAt,
  };
};

const formatSubscriptionDetails = (subscription: Subscription) => ({
  planName: subscription.plan,
  isFounder: subscription.plan === USER_PLAN.FOUNDER,
  status: subscription.status,
  emails: {
    needsBillingInfo: subscription.status === 'trialing' && !subscription.stripeCustomerId,
    needsTestimonial: subscription.testimonialRequired && !subscription.testimonialSubmitted,
  },
});

export const useSubscriptionStatus = (subscription: Subscription | null) => {
  const [founderStatus, setFounderStatus] = useState<ReturnType<typeof getFounderBillingStatus>>(null);
  const [formattedDetails, setFormattedDetails] = useState<any>(null);

  useEffect(() => {
    if (!subscription) return;
    setFounderStatus(getFounderBillingStatus(subscription));
    setFormattedDetails(formatSubscriptionDetails(subscription));
  }, [subscription]);

  return {
    founderStatus,
    formattedDetails,
    isFounder: subscription?.plan === USER_PLAN.FOUNDER,
    isBillingPaused: founderStatus?.isPaused ?? false,
    needsBillingInfo: formattedDetails?.emails?.needsBillingInfo ?? false,
    needsTestimonial: formattedDetails?.emails?.needsTestimonial ?? false,
  };
};
