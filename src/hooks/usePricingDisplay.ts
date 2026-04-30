import { useEffect, useState } from 'react';
import { Subscription } from '@/types';

export const usePricingDisplay = (subscription: Subscription | null) => {
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    if (!subscription) return;

    let displayPrice = '';
    let period = '';

    if (subscription.plan === 'founder' && subscription.pricingLocked && subscription.lockedPrice) {
      displayPrice = `$${subscription.lockedPrice}`;
      period = subscription.billingInterval === 'monthly' ? '/mo (LOCKED)' : '/yr (LOCKED)';
    } else if (subscription.plan === 'enterprise') {
      const total = 10000 + (subscription.numberOfAgencies - 1) * 3000;
      displayPrice = `$${total.toLocaleString()}`;
      period = `/yr · ${subscription.numberOfAgencies} dept${subscription.numberOfAgencies > 1 ? 's' : ''}`;
    }

    setPricing({ displayPrice, period });
  }, [subscription]);

  return pricing;
};
