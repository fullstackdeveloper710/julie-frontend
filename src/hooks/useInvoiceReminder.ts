import { useEffect, useState } from 'react';
import { Subscription } from '@/types';

export const useInvoiceReminder = (subscription: Subscription | null) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [daysUntilDue, setDaysUntilDue] = useState(0);

  useEffect(() => {
    // Only relevant for Founder plan during the billing pause window
    if (subscription?.plan !== 'founder' || !subscription.billingPausedUntil) {
      setShouldShow(false);
      return;
    }

    const pauseEnd = new Date(subscription.billingPausedUntil);
    const warningStart = new Date(pauseEnd.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before
    const now = new Date();

    if (now >= warningStart && now < pauseEnd) {
      setShouldShow(true);
      setDaysUntilDue(Math.max(0, Math.ceil((pauseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))));
    } else {
      setShouldShow(false);
    }
  }, [subscription]);

  return { shouldShow, daysUntilDue };
};
