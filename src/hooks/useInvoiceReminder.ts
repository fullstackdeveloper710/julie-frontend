import { useEffect, useState } from 'react';
import { Subscription } from '@/types';

export const useInvoiceReminder = (subscription: Subscription | null) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [daysUntilDue, setDaysUntilDue] = useState(0);

  useEffect(() => {
    if (!subscription || subscription.plan !== 'founding') {
      setShouldShow(false);
      return;
    }

    const trialEnd = new Date(subscription.trialEndDate!);
    const warningDate = new Date(trialEnd.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day before
    const now = new Date();

    if (now >= warningDate && subscription.status === 'trialing') {
      setShouldShow(true);
      const diff = Math.floor((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntilDue(Math.max(0, diff));
    }
  }, [subscription]);

  return { shouldShow, daysUntilDue };
};
