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
  const adminUsagePercent = (seatUsage.adminSeats.used / seatUsage.adminSeats.total) * 100;
  const viewerUsagePercent = (seatUsage.viewerSeats.used / seatUsage.viewerSeats.total) * 100;

  if (adminUsagePercent < 80 && viewerUsagePercent < 80) {
    return null;
  }

  return (
    <Card className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200">
      <p className="font-semibold text-gray-900">Need More Capacity?</p>
      <p className="text-sm text-gray-700 mt-1">
        You're using {Math.max(adminUsagePercent, viewerUsagePercent).toFixed(0)}% of your available seats.
        Consider upgrading to the Standard or Enterprise plan for more team members.
      </p>
      <Button size="sm" className="mt-3">
        Explore Plans
      </Button>
    </Card>
  );
};
