import React, { useState } from 'react';
import { useGetSubscriptionQuery } from '@/hooks';
import { Card, Button } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

export const BillingPrompt: React.FC = () => {
  const { data, isLoading } = useGetSubscriptionQuery();
  const subscription = data?.subscription;
  const [dismissed, setDismissed] = useState(false);

  const billingPausedUntil = subscription?.billingPausedUntil
    ? new Date(subscription.billingPausedUntil)
    : null;
  const pauseDaysRemaining = billingPausedUntil
    ? Math.max(0, Math.ceil((billingPausedUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (
    isLoading ||
    !subscription ||
    subscription.plan !== 'founder' ||
    pauseDaysRemaining > 14 ||
    pauseDaysRemaining <= 0 ||
    dismissed
  ) {
    return null;
  }

  return (
    <Card className="p-4 border-l-4 border-l-(--accent) bg-orange-50">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Billing Activating Soon</p>
          <p className="text-sm text-gray-700 mt-1">
            Your Founding Rate billing pause ends in {pauseDaysRemaining} day{pauseDaysRemaining !== 1 ? 's' : ''}.
            Ensure your payment method is on file to keep your locked $149/mo rate.
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="primary">
              Add Billing Info
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDismissed(true)}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
