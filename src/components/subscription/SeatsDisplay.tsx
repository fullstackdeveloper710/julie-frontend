import React from 'react';
import { useGetSubscriptionQuery, useSeatUsage } from '@/hooks';
import { Card, Button } from '@/components/ui';
import { Users } from 'lucide-react';

export const SeatsDisplay: React.FC = () => {
  const { data, isLoading } = useGetSubscriptionQuery();
  const subscription = data?.subscription ?? null;
  const seatUsage = useSeatUsage(subscription);

  if (isLoading || !subscription) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Team Members</h3>
      </div>

      <div className="space-y-4">

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Admin Seats</span>
            <span className="text-sm font-semibold text-gray-900">
              {seatUsage.adminSeats.used} / {seatUsage.adminSeats.total}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${seatUsage.adminPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {seatUsage.adminSeats.available} available
          </p>
        </div>


        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Viewer Seats</span>
            <span className="text-sm font-semibold text-gray-900">
              {seatUsage.viewerSeats.used} / {seatUsage.viewerSeats.total}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${seatUsage.viewerPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {seatUsage.viewerSeats.available} available
          </p>
        </div>
      </div>


      {(seatUsage.adminSeats.available > 0 || seatUsage.viewerSeats.available > 0) && (
        <Button className="w-full mt-4" variant="outline">
          Invite Team Member
        </Button>
      )}


      {seatUsage.adminSeats.available === 0 && seatUsage.viewerSeats.available === 0 && (
        <p className="text-sm text-gray-500 mt-4 p-2 bg-gray-50 rounded">
          No available seats. Upgrade your plan to add more team members.
        </p>
      )}
    </Card>
  );
};
