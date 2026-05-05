import { useEffect, useState } from 'react';
import { Subscription } from '@/types';

export const useSeatUsage = (subscription: Subscription | null) => {
  const [seatUsage, setSeatUsage] = useState({
    managerSeats: { used: 0, available: 0, total: 0 },
    departmentUserSeats: { used: 0, available: 0, total: 0 },
    managerPercent: 0,
    departmentUserPercent: 0,
  });

  useEffect(() => {
    if (!subscription) return;

    const admin = {
      total: subscription.managerSeats,
      used: subscription.usedManagerSeats,
      available: subscription.managerSeats - subscription.usedManagerSeats,
    };

    const deptUser = {
      total: subscription.departmentUserSeats,
      used: subscription.usedDepartmentUserSeats,
      available: subscription.departmentUserSeats - subscription.usedDepartmentUserSeats,
    };

    setSeatUsage({
      managerSeats: admin,
      departmentUserSeats: deptUser,
      managerPercent: (admin.used / admin.total) * 100,
      departmentUserPercent: (deptUser.used / deptUser.total) * 100,
    });
  }, [
    subscription?.managerSeats,
    subscription?.usedManagerSeats,
    subscription?.departmentUserSeats,
    subscription?.usedDepartmentUserSeats,
  ]);

  return seatUsage;
};
