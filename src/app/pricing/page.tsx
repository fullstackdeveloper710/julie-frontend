'use client';

import { useEffect, useState } from 'react';
import { fetchPricingPlans, type PricingResponse } from '@/lib/pricing';
import { PricingCard } from '@/components/subscription/PricingCard';
import { USER_PLAN, BILLING_INTERVAL } from '@/types/enums';

export default function Pricing() {
  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [billingInterval, setBillingInterval] = useState<BILLING_INTERVAL>(BILLING_INTERVAL.MONTHLY);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await fetchPricingPlans();
        if (alive) setPricing(data);
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : 'Failed to load pricing plans');
      } finally {
        if (alive) setLoading(false);
      }
    };
    void load();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5 text-slate-300">
        Loading pricing plans...
      </div>
    );
  }

  if (error || !pricing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5 text-slate-300">
        {error || 'Pricing plans unavailable'}
      </div>
    );
  }

  // Backend already filters: founder XOR professional based on active founder count.
  // This page renders whatever the API returns — no client-side exclusivity logic needed.
  const { founderAvailable, founderSpotsRemaining, plans } = pricing;

  return (
    <div className="min-h-screen bg-slate-950">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="font-bold text-xs tracking-widest text-(--accent)! uppercase mb-3">
            Transparent Pricing
          </div>
          <h2 className="font-bold text-4xl text-white mb-4 leading-tight">
            Plans For Every Agency
          </h2>
          <p className="leading-relaxed max-w-2xl mb-6">
            Start with the plan that fits your agency. Every plan includes the full platform.
          </p>

          {/* Founder availability banner */}
          {founderAvailable && (
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              <span className="text-sm text-orange-300">
                Founder Plan available ·{' '}
                <span className="font-semibold">
                  {founderSpotsRemaining} of {pricing.founderCapTotal} spots remaining
                </span>
              </span>
            </div>
          )}

          {/* Billing toggle */}
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 p-1 gap-1">
              <button
                onClick={() => setBillingInterval(BILLING_INTERVAL.MONTHLY)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  billingInterval === BILLING_INTERVAL.MONTHLY
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval(BILLING_INTERVAL.ANNUAL)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  billingInterval === BILLING_INTERVAL.ANNUAL
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual
                <span className="ml-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  1 month free
                </span>
              </button>
            </div>
          </div>

          {billingInterval === BILLING_INTERVAL.ANNUAL && (
            <p className="mb-8 text-center text-xs text-slate-400">
              Annual plans are billed for 11 months — the 12th month is free.
            </p>
          )}

          {/* Plan grid — always 3 cards (founder/professional swap handled by backend) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-start">
            {plans?.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billingInterval={billingInterval}
                founderSpotsRemaining={
                  plan.id === USER_PLAN.FOUNDER ? founderSpotsRemaining : undefined
                }
              />
            ))}
          </div>

          {/* Grant eligibility */}
          <div className="bg-slate-800 border border-slate-700 rounded-md p-6 text-center mb-12">
            <h3 className="font-bold text-lg text-white mb-2">Grant-Eligible Platform</h3>
            <p className="text-sm leading-relaxed max-w-2xl mx-auto">
              Frontline Frameworks is a SHRM Recertification Provider. Subscription costs and
              training engagements may qualify for public safety wellness grants, workforce
              development funding, and HR professional development budgets.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-md p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-white mb-2">How does annual billing work?</h4>
                <p className="text-sm">
                  Annual plans are billed for 11 months upfront — the 12th month is free.
                  The exact dollar savings are shown on each card when Annual is selected.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Can I upgrade my plan later?</h4>
                <p className="text-sm">
                  Yes. You can upgrade at any time. Billing adjustments are prorated to your
                  current cycle.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">What is the Founder Plan?</h4>
                <p className="text-sm">
                  The Founder Plan offers full Professional access at $149/mo — locked for life.
                  Billing is suspended for 90 days after signup; it activates at month 4.
                  A 12-month minimum commitment applies (early cancellation = full annual charged).
                  You must submit 3 consecutive monthly check-ins to maintain the rate;
                  missing a month downgrades you to Essentials. Limited to the first 20 agencies.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">
                  What happens when Founder spots are gone?
                </h4>
                <p className="text-sm">
                  Once 20 agencies have activated Founder pricing, the plan is permanently closed.
                  New users see the Professional plan ($499/mo) in its place. Existing Founder
                  members keep their locked rate and all benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
