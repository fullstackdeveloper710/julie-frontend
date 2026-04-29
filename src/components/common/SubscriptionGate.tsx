'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { HEADING_FONT } from '@/utils/constant';
import {
  useCreateCheckoutSessionMutation,
  type SubscriptionPlanKey,
  type BillingInterval,
} from '@/redux/api/subscriptionApi';
import { extractRtkErrorMessage } from '@/utils/rtkErrorHandler';

// Maps the display label stored on User.plan to a checkout plan key
const USER_PLAN_TO_KEY: Record<string, SubscriptionPlanKey> = {
  'Early Adopter': 'early_adopter',
  Standard: 'standard',
  Enterprise: 'enterprise',
};

const PLAN_LABELS: Record<SubscriptionPlanKey, string> = {
  founding: 'Founding',
  early_adopter: 'Early Adopter',
  standard: 'Standard',
  enterprise: 'Government / Enterprise',
};

const PLAN_PRICE_HINT: Record<SubscriptionPlanKey, string> = {
  founding: '$149/mo · 90-day free trial',
  early_adopter: '$249/mo or $2,739/yr',
  standard: '$499/mo or $5,489/yr',
  enterprise: '$7,000/yr',
};

const PLAN_INTERVALS: Record<SubscriptionPlanKey, BillingInterval[]> = {
  founding: ['monthly', 'annual'],
  early_adopter: ['monthly', 'annual'],
  standard: ['monthly', 'annual'],
  enterprise: ['annual'],
};

interface SubscriptionGateProps {
  userPlan?: string;
}

export function SubscriptionGate({ userPlan = '' }: SubscriptionGateProps) {
  const [createCheckout, { isLoading }] = useCreateCheckoutSessionMutation();
  const [error, setError] = useState('');

  const planKey: SubscriptionPlanKey = USER_PLAN_TO_KEY[userPlan] ?? 'early_adopter';
  const intervals = PLAN_INTERVALS[planKey];

  const handleCheckout = async (billingInterval: BillingInterval) => {
    setError('');
    try {
      const res = await createCheckout({ planKey, billingInterval }).unwrap();
      window.location.href = res.data.url;
    } catch (err: unknown) {
      setError(extractRtkErrorMessage(err) || 'Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 bg-slate-950">
      <div className="w-full max-w-lg">
        {/* Lock icon + heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 border border-slate-700 mb-5">
            <Lock className="w-6 h-6 text-(--accent)" />
          </div>
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: HEADING_FONT }}
          >
            Activate Your Subscription
          </h1>
          <p className="text-sm text-slate-400">
            {userPlan
              ? `You signed up for the ${userPlan} plan. Choose how you'd like to be billed to unlock the platform.`
              : 'Choose a plan to unlock full platform access.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Recommended plan card */}
        <div className="bg-slate-800 border-t-4 border-t-(--accent) border border-slate-700 rounded-xl p-7 mb-4">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest text-(--accent)"
                style={{ fontFamily: HEADING_FONT }}
              >
                Your plan
              </span>
              <h2
                className="text-xl font-bold text-white mt-1"
                style={{ fontFamily: HEADING_FONT }}
              >
                {PLAN_LABELS[planKey]}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{PLAN_PRICE_HINT[planKey]}</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-(--accent) shrink-0 mt-1" />
          </div>

          <div className="flex gap-3 flex-wrap">
            {intervals.map((interval) => (
              <button
                key={interval}
                type="button"
                onClick={() => handleCheckout(interval)}
                disabled={isLoading}
                className="flex-1 px-5 py-3 text-sm font-bold uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60"
                style={{ fontFamily: HEADING_FONT }}
              >
                {isLoading
                  ? 'Redirecting…'
                  : interval === 'monthly'
                    ? 'Pay Monthly'
                    : 'Pay Annual'}
              </button>
            ))}
          </div>
        </div>

        {/* Browse all plans link */}
        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-(--accent) uppercase tracking-widest transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Browse all plans
          </Link>
        </div>
      </div>
    </div>
  );
}
