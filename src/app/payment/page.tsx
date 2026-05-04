'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux';
import { Button } from '@/components/ui';
import { initializeSubscriptionForNewUser } from '@/services/stripe';
import { fetchPricingPlans } from '@/lib/pricing';
import { BILLING_INTERVAL } from '@/types/enums';

export default function PaymentPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const accessToken = useAppSelector((state) => state.user.accessToken);

  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingInterval, setBillingInterval] = useState<BILLING_INTERVAL>(
    BILLING_INTERVAL.MONTHLY,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user) {
      router.replace('/auth/signin');
      return;
    }

    if (user.hasActiveSubscription) {
      // User already has subscription, redirect to appropriate page
      router.replace('/dashboard/agencies');
      return;
    }

    // Load pricing plans
    const loadPricing = async () => {
      try {
        const response = await fetchPricingPlans();
        setPricingPlans(response.plans);

        // Set default plan based on user's plan or first available
        const defaultPlan =
          response.plans.find((p: any) => p.id === user.plan) || response.plans[0];
        if (defaultPlan) {
          setSelectedPlan(defaultPlan.id);
        }
      } catch (err) {
        console.error('Failed to load pricing plans:', err);
        setError('Failed to load pricing plans');
      }
    };

    loadPricing();
  }, [user, router]);

  const handlePayment = async () => {
    if (!accessToken || !selectedPlan) return;

    setIsLoading(true);
    setError('');

    try {
      const checkoutData = await initializeSubscriptionForNewUser(
        accessToken,
        selectedPlan,
        billingInterval.toLowerCase() as 'monthly' | 'annual',
        selectedPlan === 'founder', // Assuming founder plan uses founding rate
      );

      // Redirect to Stripe checkout
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Payment initialization failed:', err);
      setError(err.message || 'Payment initialization failed');
      setIsLoading(false);
    }
  };

  if (!user || user.hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  const selectedPlanData = pricingPlans.find((p: any) => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-10 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mb-4 text-sm font-black uppercase tracking-[0.08em] text-orange-400">
              Complete Your Account Setup
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Choose Your Plan</h2>
            <p className="text-sm text-slate-400">
              Select a plan to get started with Frontline Frameworks
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            {pricingPlans.map((plan: any) => (
              <div
                key={plan.id}
                className={`rounded-2xl border p-4 cursor-pointer transition ${
                  selectedPlan === plan.id
                    ? 'border-orange-400 bg-orange-400/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-white">{plan.name}</div>
                  <div className="text-xs text-slate-400">
                    {plan.pricing[billingInterval.toLowerCase()]
                      ? `$${plan.pricing[billingInterval.toLowerCase()]}/${billingInterval === BILLING_INTERVAL.ANNUAL ? 'yr' : 'mo'}`
                      : 'Contact us'}
                  </div>
                </div>
                <div className="text-xs text-slate-500">{plan.description}</div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex rounded-full border border-slate-700 overflow-hidden text-xs mb-4">
              <button
                type="button"
                onClick={() => setBillingInterval(BILLING_INTERVAL.MONTHLY)}
                className={`flex-1 px-3 py-2 transition ${
                  billingInterval === BILLING_INTERVAL.MONTHLY
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval(BILLING_INTERVAL.ANNUAL)}
                className={`flex-1 px-3 py-2 transition ${
                  billingInterval === BILLING_INTERVAL.ANNUAL
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual
              </button>
            </div>
          </div>

          <Button onClick={handlePayment} disabled={!selectedPlan || isLoading} className="w-full">
            {isLoading ? 'Setting up...' : 'Continue to Payment'}
          </Button>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.replace('/auth/signin')}
              className="text-xs text-slate-400 hover:text-slate-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
