import { useEffect, useState } from 'react';
import { Subscription } from '@/types';
import { USER_PLAN, BILLING_INTERVAL } from '@/types/enums';

export const usePricingDisplay = (subscription: Subscription | null) => {
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    if (!subscription) return;

    let displayPrice = '';
    let period = '';

    if (subscription.plan === USER_PLAN.FOUNDER && subscription.pricingLocked && subscription.lockedPrice) {
      displayPrice = `$${subscription.lockedPrice}`;
      period = subscription.billingInterval === BILLING_INTERVAL.MONTHLY ? '/mo (LOCKED)' : '/yr (LOCKED)';
    } else if (subscription.plan === USER_PLAN.ENTERPRISE) {
      const total = 10000 + (subscription.numberOfAgencies - 1) * 3000;
      displayPrice = `$${total.toLocaleString()}`;
      period = `/yr · ${subscription.numberOfAgencies} dept${subscription.numberOfAgencies > 1 ? 's' : ''}`;
    }

    setPricing({ displayPrice, period });
  }, [subscription]);

  return pricing;
};
