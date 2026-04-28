'use client';

import { useEffect, useState } from 'react';
import { fetchPricingPlans, type PricingResponse } from '@/lib/pricing';
import { PricingCard } from '@/components/subscription/PricingCard';

export default function Pricing() {
  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;

    const loadPricing = async () => {
      try {
        const data = await fetchPricingPlans();

        if (!alive) {
          return;
        }

        setPricing(data);
      } catch (err) {
        if (!alive) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to load pricing plans');
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    void loadPricing();

    return () => {
      alive = false;
    };
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

  const plans = pricing.plans.filter((plan) => plan.available);
  const foundingMessage = pricing.foundingAvailable
    ? 'Founding spots are limited to the first 20 agencies.'
    : 'Founding spots are currently sold out.';

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
          <p className="leading-relaxed max-w-2xl mb-12">
            Start with the plan that fits your agency. Every plan includes full platform access
            with AI capabilities.
          </p>
          <p className="mb-12 text-sm text-slate-400">{foundingMessage}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-stretch">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-md p-6 text-center mb-12">
            <h3 className="font-bold text-lg text-white mb-2">Grant-Eligible Platform</h3>
            <p className=" text-sm leading-relaxed max-w-2xl mx-auto">
              Frontline Frameworks is a SHRM Recertification Provider. Subscription costs and
              training engagements may qualify for public safety wellness grants, workforce
              development funding, and HR professional development budgets. We provide grant support
              letters and budget justification language.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-md p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-white mb-2">
                  What happens after my trial or billing cycle starts?
                </h4>
                <p className="text-sm ">
                  Your selected plan stays active until you change it. You can update billing details
                  before the trial or renewal period ends.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Can I change my plan later?</h4>
                <p className="text-sm ">
                  Yes. You can upgrade at any time from your account settings.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Do you offer annual discounts?</h4>
                <p className="text-sm ">
                  Yes. Annual plans save 8-10% compared to monthly billing across all tiers.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Is there a setup fee?</h4>
                <p className="text-sm ">
                  No setup fees. Start your 90-day trial immediately with no credit card required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
