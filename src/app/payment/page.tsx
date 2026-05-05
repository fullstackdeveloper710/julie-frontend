'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux';
import { Button } from '@/components/ui';
import { fetchPricingPlans } from '@/lib/pricing';
import { BILLING_INTERVAL } from '@/types/enums';
import { setPaymentProcessing, setPaymentError, resetPaymentState } from '@/redux/slices';
import { useCreateStripeSessionMutation } from '@/redux/api/subscriptionApi';

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user.user);
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const { isPaymentProcessing, paymentError } = useAppSelector((state) => state.subscription);

  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingInterval, setBillingInterval] = useState<BILLING_INTERVAL>(
    BILLING_INTERVAL.MONTHLY,
  );
  const [pricingLoading, setPricingLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showRetryOption, setShowRetryOption] = useState(false);
  const isProcessing = useRef(false);

  const [createStripeSession] = useCreateStripeSessionMutation();

  // ✅ same logic (modal open always true now)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // ✅ removed isOpen condition only
  useEffect(() => {
    const loadPricing = async () => {
      try {
        setError('');
        setPricingLoading(true);
        setPricingPlans([]);
        setSelectedPlan('');

        const response = await fetchPricingPlans();
        const plans = response?.plans || [];
        setPricingPlans(plans);

        if (plans.length > 0) {
          const defaultPlan =
            plans.find(
              (p: any) => p.id?.toLowerCase().trim() === user?.plan?.toLowerCase().trim(),
            ) || plans[0];

          if (defaultPlan) {
            setSelectedPlan(defaultPlan.id);
          }
        }
      } catch (err) {
        console.error('Failed to load pricing plans:', err);
        setError('Failed to load pricing plans. Please try again.');
      } finally {
        setPricingLoading(false);
      }
    };

    loadPricing();
  }, [user?.plan]);

  useEffect(() => {
    if (paymentError) {
      setError(paymentError);
      setShowRetryOption(true);
    }
  }, [paymentError]);

  const handlePayment = async () => {
    if (!accessToken) {
      setError('User not authenticated');
      return;
    }

    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    if (isPaymentProcessing || isProcessing.current) return;

    isProcessing.current = true;
    dispatch(setPaymentProcessing(true));
    setError('');

    try {
      const res = await createStripeSession({
        planId: selectedPlan,
        billingInterval: billingInterval === BILLING_INTERVAL.MONTHLY ? 'monthly' : 'annual',
      }).unwrap();

      if (res?.url) {
        isProcessing.current = false;
        window.location.href = res.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      dispatch(setPaymentError(err.message));
      isProcessing.current = false;
    } finally {
      dispatch(setPaymentProcessing(false));
    }
  };

  const handleRetry = () => {
    setShowRetryOption(false);
    dispatch(resetPaymentState());
    setError('');
  };

  const handleClose = () => {
    if (!isPaymentProcessing) {
      dispatch(resetPaymentState());
      setError('');
      setShowRetryOption(false);
      router.push('/auth/signin');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && !isPaymentProcessing && handleClose()}
    >
      <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Complete Your Subscription</h2>
          <p className="text-sm text-slate-400">
            Choose your plan and billing interval to get started
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <div className="font-medium mb-2">Payment Error</div>
            <p>{error}</p>
            {showRetryOption && (
              <button
                onClick={handleRetry}
                className="mt-2 text-red-300 hover:text-red-200 underline text-xs font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* SAME UI BELOW — unchanged */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Select Plan</label>

          {pricingLoading ? (
            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-6 text-center text-sm text-slate-300">
              <div className="flex items-center justify-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-transparent border-t-slate-300" />
                <span>Loading plans...</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {pricingPlans?.map((plan: any) => (
                <label
                  key={plan.id}
                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition ${
                    selectedPlan === plan.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  } ${isPaymentProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selectedPlan === plan.id}
                    onChange={(e) => !isPaymentProcessing && setSelectedPlan(e.target.value)}
                    disabled={isPaymentProcessing}
                    className="mr-3"
                  />
                  <div className="flex-1 flex items-center justify-between pr-6">
                    <div>
                      <div className="font-semibold text-white text-base">{plan.name}</div>
                      <div className="text-sm text-slate-400 mt-0.5">{plan.description}</div>
                    </div>

                    {selectedPlan === plan.id && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        <span className="text-xs font-semibold text-emerald-400 tracking-wide">
                          Selected Plan
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">
                      $
                      {plan.id === 'enterprise'
                        ? plan.pricing.annual
                        : billingInterval === BILLING_INTERVAL.ANNUAL
                          ? plan.pricing.annual
                          : plan.pricing.monthly}
                      <span className="text-sm font-normal text-slate-400">
                        /
                        {plan.id === 'enterprise'
                          ? 'yr'
                          : billingInterval === BILLING_INTERVAL.ANNUAL
                            ? 'yr'
                            : 'mo'}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Billing */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Billing Interval</label>
          <div className="flex rounded-lg border border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => !isPaymentProcessing && setBillingInterval(BILLING_INTERVAL.MONTHLY)}
              disabled={isPaymentProcessing}
              className={`flex-1 px-4 py-2 text-sm transition ${
                billingInterval === BILLING_INTERVAL.MONTHLY
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => !isPaymentProcessing && setBillingInterval(BILLING_INTERVAL.ANNUAL)}
              disabled={isPaymentProcessing}
              className={`flex-1 px-4 py-2 text-sm transition ${
                billingInterval === BILLING_INTERVAL.ANNUAL
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            variant="secondary"
            className="flex-1"
            disabled={isPaymentProcessing}
          >
            {isPaymentProcessing ? 'Processing...' : 'Cancel'}
          </Button>
          <Button
            onClick={handlePayment}
            className="flex-1"
            disabled={!selectedPlan || isPaymentProcessing}
          >
            {isPaymentProcessing ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </div>

        {isPaymentProcessing && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
            <p className="text-sm text-blue-300">
              ⏳ Processing your payment. Please do not close this page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
