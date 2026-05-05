import React from 'react';
import { useGetSubscriptionQuery, useSeatUsage } from '@/hooks';
import { Card, Button } from '@/components/ui';

export const UpgradePrompt: React.FC = () => {
  const { data, isLoading } = useGetSubscriptionQuery();
  const subscription = data?.subscription ?? null;
  const seatUsage = useSeatUsage(subscription);

  if (isLoading || !subscription) {
    return null;
  }

  // Show if 80%+ of seats are used
  const managerUsagePercent = (seatUsage.managerSeats.used / seatUsage.managerSeats.total) * 100;
  const departmentUserUsagePercent = (seatUsage.departmentUserSeats.used / seatUsage.departmentUserSeats.total) * 100;

  if (managerUsagePercent < 80 && departmentUserUsagePercent < 80) {
    return null;
  }

  return (
    <Card className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200">
      <p className="font-semibold text-gray-900">Need More Capacity?</p>
      <p className="text-sm text-gray-700 mt-1">
        You're using {Math.max(managerUsagePercent, departmentUserUsagePercent).toFixed(0)}% of your available
        seats. Consider upgrading to the Standard or Enterprise plan for more team members.
      </p>
      <Button size="sm" className="mt-3">
        Explore Plans
      </Button>
    </Card>
  );
};
