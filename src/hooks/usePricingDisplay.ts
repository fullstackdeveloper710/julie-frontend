import { useEffect, useState } from 'react';
import { Subscription } from '@/types';

export const usePricingDisplay = (subscription: Subscription | null) => {
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    if (!subscription) return;

    let displayPrice = '';
    let period = '';
    let savedAmount = '';

    if (subscription.plan === 'founding') {
      if (subscription.pricingLocked) {
        displayPrice = `$${subscription.lockedPrice}/`;
        period = subscription.billingInterval === 'monthly' ? 'mo' : 'yr';
        displayPrice += period + ' (LOCKED)';
      } else {
        displayPrice = 'Free Trial in Progress';
        period = `${subscription.trialDaysRemaining} days remaining`;
      }
    } else if (subscription.plan === 'enterprise') {
      const basePrice = 7000;
      const totalPrice = basePrice + (subscription.numberOfAgencies - 1) * 2000;
      displayPrice = `$${totalPrice}/year`;
      period = `${subscription.numberOfAgencies} agencies`;
    }

    setPricing({ displayPrice, period, savedAmount });
  }, [subscription]);

  return pricing;
};
