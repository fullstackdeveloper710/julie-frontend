import React from 'react';
import { useGetSubscriptionQuery, useTrialCountdown } from '@/hooks';
import { Card, Badge } from '@/components/ui';
import { Clock } from 'lucide-react';

export const TrialStatus: React.FC = () => {
  const { data, isLoading } = useGetSubscriptionQuery();
  const subscription = data?.subscription ?? null;
  const countdown = useTrialCountdown(subscription);

  if (
    isLoading ||
    !subscription ||
    subscription.plan !== 'founding' ||
    subscription.status !== 'trialing'
  ) {
    return null;
  }

  const daysRemaining = subscription.trialDaysRemaining || 0;
  const percentComplete = ((90 - daysRemaining) / 90) * 100;

  // Show more urgent messaging as trial ends
  const isUrgent = daysRemaining <= 14;
  const isCritical = daysRemaining <= 3;

  return (
    <Card
      className={`p-4 border-l-4 ${
        isCritical
          ? 'border-l-red-500 bg-red-50'
          : isUrgent
            ? 'border-l-(--accent) bg-orange-50'
            : 'border-l-blue-500 bg-blue-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock
            className={`w-5 h-5 ${
              isCritical ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-blue-600'
            }`}
          />
          <div>
            <p className="font-semibold text-gray-900">
              {isCritical ? '⚠️ Trial Ending Soon' : 'Founding Tier Trial'}
            </p>
            <p className="text-sm text-gray-600">
              {countdown || `${daysRemaining} days remaining`}
            </p>
          </div>
        </div>
        <Badge variant={isCritical ? 'danger' : isUrgent ? 'warning' : 'default'}>
          {percentComplete.toFixed(0)}% used
        </Badge>
      </div>

      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            isCritical ? 'bg-red-500' : isUrgent ? 'bg-(--accent)' : 'bg-blue-500'
          }`}
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      {isCritical && (
        <p className="mt-3 text-sm text-red-700 font-medium">
          Your trial expires in {daysRemaining} days. Submit a testimonial or add billing
          information to continue.
        </p>
      )}
      {isUrgent && !isCritical && (
        <p className="mt-3 text-sm text-orange-700">
          Trial expires in {daysRemaining} days. Prepare for transition to standard pricing.
        </p>
      )}
    </Card>
  );
};
