import { useEffect, useState } from 'react';
import { Subscription } from '@/types';

export const useTrialCountdown = (subscription: Subscription | null) => {
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    if (!subscription?.trialEndDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const endDate = new Date(subscription.trialEndDate!);
      const diff = endDate.getTime() - now.getTime();

      if (diff < 0) {
        setCountdown('Trial ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m left`);
      } else {
        setCountdown(`${minutes}m left`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [subscription?.trialEndDate]);

  return countdown;
};
