import { useEffect, useState } from 'react';
import { Subscription } from '@/types';

export const useSeatUsage = (subscription: Subscription | null) => {
  const [seatUsage, setSeatUsage] = useState({
    adminSeats: { used: 0, available: 0, total: 0 },
    viewerSeats: { used: 0, available: 0, total: 0 },
    adminPercent: 0,
    viewerPercent: 0,
  });

  useEffect(() => {
    if (!subscription) return;

    const admin = {
      total: subscription.adminSeats,
      used: subscription.usedAdminSeats,
      available: subscription.adminSeats - subscription.usedAdminSeats,
    };

    const viewer = {
      total: subscription.viewerSeats,
      used: subscription.usedViewerSeats,
      available: subscription.viewerSeats - subscription.usedViewerSeats,
    };

    setSeatUsage({
      adminSeats: admin,
      viewerSeats: viewer,
      adminPercent: (admin.used / admin.total) * 100,
      viewerPercent: (viewer.used / viewer.total) * 100,
    });
  }, [subscription?.adminSeats, subscription?.viewerSeats, subscription?.usedAdminSeats, subscription?.usedViewerSeats]);

  return seatUsage;
};
