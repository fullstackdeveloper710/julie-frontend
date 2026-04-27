import React from 'react';
import { useGetSubscriptionQuery } from '@/hooks';
import { Card, Button } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

export const TestimonialPrompt: React.FC = () => {
  const { data, isLoading } = useGetSubscriptionQuery();
  const subscription = data?.subscription;

  if (
    isLoading ||
    !subscription ||
    !subscription.testimonialRequired ||
    subscription.testimonialSubmitted
  ) {
    return null;
  }

  const daysUntilDue = subscription.trialDaysRemaining || 0;
  const highPriority = daysUntilDue <= 14;

  return (
    <Card className={`p-4 border-l-4 ${highPriority
      ? 'border-l-red-500 bg-red-50'
      : 'border-l-blue-500 bg-blue-50'
      }`}>
      <div className="flex gap-3">
        <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${highPriority ? 'text-red-600' : 'text-blue-600'
          }`} />
        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            {highPriority ? '⭐ Share Your Feedback' : 'Tell Us About Your Experience'}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            As a founding tier member, we'd love to hear about your experience with Frontline Framework.
            Your testimonial helps us improve and validates our solution for others.
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="primary">
              Submit Testimonial
            </Button>
            <Button size="sm" variant="outline">
              Later
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
