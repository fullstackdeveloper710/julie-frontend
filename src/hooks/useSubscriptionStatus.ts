import { useEffect, useState } from 'react';
import { Subscription } from '@/types';

const getTrialStatus = (subscription: Subscription) => {
  if (subscription.plan !== 'founding' || subscription.status !== 'trialing') {
    return null;
  }

  const trialEnd = new Date(subscription.trialEndDate || '');
  const now = new Date();
  const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    isActive: subscription.status === 'trialing',
    daysRemaining: Math.max(0, daysRemaining),
    isEnding: daysRemaining <= 14,
    isCritical: daysRemaining <= 3,
  };
};

const formatSubscriptionDetails = (subscription: Subscription) => {
  return {
    planName: subscription.plan,
    status: subscription.status,
    emails: {
      needsBillingInfo: subscription.status === 'trialing' && !subscription.stripeCustomerId,
      needsTestimonial: subscription.testimonialRequired && !subscription.testimonialSubmitted,
    },
  };
};

const checkFoundingTierTransition = (subscription: Subscription) => {
  if (subscription.plan !== 'founding') return null;

  const trialEnd = new Date(subscription.trialEndDate || '');
  const now = new Date();
  const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    isAboutToTransition: daysRemaining <= 0,
    daysUntilTransition: Math.max(0, daysRemaining),
    requiresAction: !subscription.stripeCustomerId || !subscription.testimonialSubmitted,
  };
};

export const useSubscriptionStatus = (subscription: Subscription | null) => {
  const [trialStatus, setTrialStatus] = useState<any>(null);
  const [formattedDetails, setFormattedDetails] = useState<any>(null);
  const [shouldTransition, setShouldTransition] = useState<any>(null);

  useEffect(() => {
    if (!subscription) return;

    // Update trial status
    if (subscription.plan === 'founding') {
      setTrialStatus(getTrialStatus(subscription));

      // Check for tier transition
      const transition = checkFoundingTierTransition(subscription);
      setShouldTransition(transition);
    }

    // Format details for display
    setFormattedDetails(formatSubscriptionDetails(subscription));
  }, [subscription]);

  return {
    trialStatus,
    formattedDetails,
    shouldTransition,
    isTrialActive: trialStatus?.isActive ?? false,
    daysRemaining: trialStatus?.daysRemaining ?? 0,
    needsBillingInfo: formattedDetails?.emails?.needsBillingInfo ?? false,
    needsTestimonial: formattedDetails?.emails?.needsTestimonial ?? false,
  };
};
