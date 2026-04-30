import { useEffect, useState } from 'react';
import { Subscription } from '@/types';

export const useSeatUsage = (subscription: Subscription | null) => {
  const [seatUsage, setSeatUsage] = useState({
    managerSeats: { used: 0, available: 0, total: 0 },
    managerPercent: 0,
  });

  useEffect(() => {
    if (!subscription) return;

    const admin = {
      total: subscription.managerSeats,
      used: subscription.usedManagerSeats,
      available: subscription.managerSeats - subscription.usedManagerSeats,
    };

    setSeatUsage({
      managerSeats: admin,
      managerPercent: (admin.used / admin.total) * 100,
    });
  }, [
    subscription?.managerSeats,
    subscription?.usedManagerSeats,
  ]);

  return seatUsage;
};
