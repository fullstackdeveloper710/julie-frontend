'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Calendar,
  AlertCircle,
  ExternalLink,
  XCircle,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { Loading } from '@/components/ui';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';
import {
  useGetSubscriptionQuery,
  useCreateCheckoutSessionMutation,
  useGetBillingPortalMutation,
  useCancelSubscriptionMutation,
  type Subscription,
  type SubscriptionPlanKey,
  type BillingInterval,
} from '@/redux/api/subscriptionApi';
import { extractRtkErrorMessage } from '@/utils/rtkErrorHandler';
import { HEADING_FONT } from '@/utils/constant';

// Maps user.plan (display label from signup) → subscription plan key
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

const PLAN_NOTES: Record<SubscriptionPlanKey, string> = {
  founding: '$149/mo · 90-day free trial · price locked forever',
  early_adopter: '$249/mo or $2,739/yr',
  standard: '$499/mo or $5,489/yr',
  enterprise: '$7,000/yr · first agency + $2,000 each additional',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'text-emerald-400 border-emerald-400/40',
  trialing: 'text-blue-400 border-blue-400/40',
  past_due: 'text-red-400 border-red-400/40',
  canceled: 'text-slate-500 border-slate-600',
  incomplete: 'text-amber-400 border-amber-400/40',
};

const PLANS: Array<{
  key: SubscriptionPlanKey;
  label: string;
  note: string;
  intervals: BillingInterval[];
}> = [
  { key: 'founding', label: 'Founding', note: '$149/mo · 90-day free trial', intervals: ['monthly', 'annual'] },
  { key: 'early_adopter', label: 'Early Adopter', note: '$249/mo or $2,739/yr', intervals: ['monthly', 'annual'] },
  { key: 'standard', label: 'Standard', note: '$499/mo or $5,489/yr', intervals: ['monthly', 'annual'] },
  { key: 'enterprise', label: 'Enterprise', note: '$7,000/yr', intervals: ['annual'] },
];

export default function BillingPage() {
  const router = useRouter();
  const { data: userResp } = useGetCurrentUserQuery();
  const isAdmin = userResp?.data?.role === 'manager';

  useEffect(() => {
    if (isAdmin) router.replace('/dashboard');
  }, [isAdmin, router]);

  const { data: subResp, isLoading } = useGetSubscriptionQuery(undefined, { skip: isAdmin });
  const [createCheckout, { isLoading: isCheckingOut }] = useCreateCheckoutSessionMutation();
  const [getBillingPortal, { isLoading: isPortalLoading }] = useGetBillingPortalMutation();
  const [cancelSub, { isLoading: isCanceling }] = useCancelSubscriptionMutation();

  // Typed error strings — avoids rendering `unknown` in JSX
  const [actionError, setActionError] = useState('');

  const subscription = subResp?.data ?? null;

  // Derive the recommended plan from the user's signup plan
  const userPlanLabel = userResp?.data?.plan ?? '';
  const recommendedPlanKey: SubscriptionPlanKey =
    USER_PLAN_TO_KEY[userPlanLabel] ?? 'early_adopter';

  const handleCheckout = async (planKey: SubscriptionPlanKey, billingInterval: BillingInterval) => {
    setActionError('');
    try {
      const res = await createCheckout({ planKey, billingInterval }).unwrap();
      window.location.href = res.data.url;
    } catch (err: unknown) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to start checkout. Please try again.');
    }
  };

  const handlePortal = async () => {
    setActionError('');
    try {
      const res = await getBillingPortal().unwrap();
      window.location.href = res.data.url;
    } catch (err: unknown) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to open billing portal.');
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        'Cancel your subscription? You will keep access until the end of the current billing period.',
      )
    )
      return;
    setActionError('');
    try {
      await cancelSub().unwrap();
    } catch (err: unknown) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to cancel subscription.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-7 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-white mb-1 flex items-center gap-3"
          style={{ fontFamily: HEADING_FONT }}
        >
          <CreditCard className="w-7 h-7" />
          Billing &amp; Subscription
        </h1>
        <p className="text-sm text-slate-400">Manage your plan and payment details.</p>

        {actionError && (
          <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded">
            {actionError}
          </div>
        )}
      </div>

      {subscription ? (
        <ActiveSubscription
          subscription={subscription}
          onPortal={handlePortal}
          onCancel={handleCancel}
          isPortalLoading={isPortalLoading}
          isCanceling={isCanceling}
        />
      ) : (
        <NoSubscription
          recommendedPlanKey={recommendedPlanKey}
          userPlanLabel={String(userPlanLabel)}
          onCheckout={handleCheckout}
          isCheckingOut={isCheckingOut}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Active subscription view
───────────────────────────────────────────── */
interface ActiveSubscriptionProps {
  subscription: Subscription;
  onPortal: () => void;
  onCancel: () => void;
  isPortalLoading: boolean;
  isCanceling: boolean;
}

function ActiveSubscription({
  subscription,
  onPortal,
  onCancel,
  isPortalLoading,
  isCanceling,
}: ActiveSubscriptionProps) {
  const statusLabel = subscription.status.replace('_', ' ');
  const badgeCls = STATUS_BADGE[subscription.status] ?? 'text-slate-400 border-slate-600';
  const canCancel =
    !subscription.cancelAtPeriodEnd && subscription.status !== 'canceled';
  const isUpgradeable = ['trialing', 'active'].includes(subscription.status);
  const planKey: SubscriptionPlanKey = subscription.plan;

  return (
    <div className="space-y-5">
      {/* Plan card */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: HEADING_FONT }}>
              {PLAN_LABELS[planKey] ?? subscription.plan}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 capitalize">
              {subscription.billingInterval} billing
            </p>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${badgeCls}`}
          >
            {statusLabel}
          </span>
        </div>

        <dl className="space-y-2 text-xs text-slate-400">
          {subscription.trialEndDate && subscription.status === 'trialing' && (
            <div className="flex justify-between gap-3">
              <dt className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Trial ends
              </dt>
              <dd className="text-slate-200">
                {new Date(subscription.trialEndDate).toLocaleDateString()}
              </dd>
            </div>
          )}
          <div className="flex justify-between gap-3">
            <dt className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Period end
            </dt>
            <dd className="text-slate-200">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Admin seats</dt>
            <dd className="text-slate-200">{subscription.adminSeats}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Viewer seats</dt>
            <dd className="text-slate-200">{subscription.viewerSeats}</dd>
          </div>
          {subscription.pricingLocked && subscription.lockedPrice != null && (
            <div className="flex justify-between gap-3">
              <dt>Locked price</dt>
              <dd className="text-emerald-400 font-semibold">${subscription.lockedPrice}/mo</dd>
            </div>
          )}
        </dl>

        {subscription.cancelAtPeriodEnd && (
          <div className="mt-4 flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-2 rounded">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Subscription cancels on{' '}
            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
          </div>
        )}

        {subscription.status === 'past_due' && (
          <div className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Payment failed. Update your payment method to keep access.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={onPortal}
          disabled={isPortalLoading}
          className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60"
          style={{ fontFamily: HEADING_FONT }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {isPortalLoading ? 'Opening…' : 'Manage Billing'}
        </button>

        {isUpgradeable && (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
            style={{ fontFamily: HEADING_FONT }}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Upgrade Plan
          </Link>
        )}

        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isCanceling}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-widest text-red-400 border border-red-400/40 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-60"
            style={{ fontFamily: HEADING_FONT }}
          >
            <XCircle className="w-3.5 h-3.5" />
            {isCanceling ? 'Canceling…' : 'Cancel Plan'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   No subscription — show plan cards
───────────────────────────────────────────── */
interface NoSubscriptionProps {
  recommendedPlanKey: SubscriptionPlanKey;
  userPlanLabel: string;
  onCheckout: (planKey: SubscriptionPlanKey, billingInterval: BillingInterval) => void;
  isCheckingOut: boolean;
}

function NoSubscription({
  recommendedPlanKey,
  userPlanLabel,
  onCheckout,
  isCheckingOut,
}: NoSubscriptionProps) {
  return (
    <div className="space-y-6">
      {/* Callout */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-300 mb-1">No active subscription</p>
          <p className="text-xs text-slate-400">
            {userPlanLabel
              ? `You signed up for the ${userPlanLabel} plan. Choose a billing interval below to activate it, or browse all plans.`
              : 'Choose a plan to unlock full platform access.'}
          </p>
        </div>
      </div>

      {/* Recommended plan highlighted */}
      <RecommendedPlanCard
        planKey={recommendedPlanKey}
        onCheckout={onCheckout}
        isCheckingOut={isCheckingOut}
      />

      {/* Other plans */}
      <div>
        <p
          className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3"
          style={{ fontFamily: HEADING_FONT }}
        >
          Other Plans
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PLANS.filter((p) => p.key !== recommendedPlanKey).map(
            ({ key, label, note, intervals }) => (
              <div
                key={key}
                className="bg-slate-800 border border-slate-700 rounded-lg p-5"
              >
                <h3
                  className="text-white font-bold mb-0.5"
                  style={{ fontFamily: HEADING_FONT }}
                >
                  {label}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{note}</p>
                <div className="flex gap-2 flex-wrap">
                  {intervals.map((interval) => (
                    <button
                      key={interval}
                      type="button"
                      onClick={() => onCheckout(key, interval)}
                      disabled={isCheckingOut}
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-200 border border-slate-600 hover:border-slate-400 rounded-lg transition-colors disabled:opacity-60"
                      style={{ fontFamily: HEADING_FONT }}
                    >
                      {interval === 'monthly' ? 'Monthly' : 'Annual'}
                    </button>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--accent) hover:text-orange-400 uppercase tracking-widest transition-colors"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          View full plan comparison
        </Link>
      </div>
    </div>
  );
}

interface RecommendedPlanCardProps {
  planKey: SubscriptionPlanKey;
  onCheckout: (planKey: SubscriptionPlanKey, billingInterval: BillingInterval) => void;
  isCheckingOut: boolean;
}

function RecommendedPlanCard({ planKey, onCheckout, isCheckingOut }: RecommendedPlanCardProps) {
  const plan = PLANS.find((p) => p.key === planKey);
  if (!plan) return null;

  return (
    <div className="bg-slate-800 border-t-4 border-t-(--accent) border border-slate-700 rounded-lg p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-(--accent)">
            Recommended for you
          </span>
          <h2
            className="text-xl font-bold text-white mt-1"
            style={{ fontFamily: HEADING_FONT }}
          >
            {plan.label}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{PLAN_NOTES[planKey]}</p>
        </div>
        <CheckCircle2 className="w-5 h-5 text-(--accent) shrink-0 mt-1" />
      </div>

      <div className="flex gap-3 flex-wrap">
        {plan.intervals.map((interval) => (
          <button
            key={interval}
            type="button"
            onClick={() => onCheckout(planKey, interval)}
            disabled={isCheckingOut}
            className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60"
            style={{ fontFamily: HEADING_FONT }}
          >
            {isCheckingOut
              ? 'Redirecting…'
              : interval === 'monthly'
                ? 'Start Monthly'
                : 'Start Annual'}
          </button>
        ))}
      </div>
    </div>
  );
}
