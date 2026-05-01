'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux';
import { Button } from '@/components/ui';
import { initializeSubscriptionForNewUser } from '@/services/stripe';
import { fetchPricingPlans } from '@/lib/pricing';
import { BILLING_INTERVAL } from '@/types/enums';
import {
  closePaymentModal,
  setPaymentProcessing,
  setPaymentError,
  resetPaymentState,
} from '@/redux/slices';

interface PaymentModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
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
  const [error, setError] = useState<string>('');
  const [showRetryOption, setShowRetryOption] = useState(false);
  const isProcessing = useRef(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Load pricing plans when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const loadPricing = async () => {
      try {
        setError('');
        const response = await fetchPricingPlans();
        setPricingPlans(response.plans);

        // Set default plan based on user's plan or first available
        const defaultPlan =
          response.plans.find((p: any) => p.id === user?.plan) || response.plans[0];
        if (defaultPlan) {
          setSelectedPlan(defaultPlan.id);
        }
      } catch (err) {
        console.error('Failed to load pricing plans:', err);
        setError('Failed to load pricing plans. Please try again.');
      }
    };

    loadPricing();
  }, [isOpen, user?.plan]);

  // Sync Redux error with local state
  useEffect(() => {
    if (paymentError) {
      setError(paymentError);
      setShowRetryOption(true);
    }
  }, [paymentError]);

  const handlePayment = async () => {
    if (!accessToken || !selectedPlan || isPaymentProcessing || isProcessing.current) return;

    isProcessing.current = true;
    dispatch(setPaymentProcessing(true));
    setError('');
    setShowRetryOption(false);

    try {
      const checkoutData = await initializeSubscriptionForNewUser(
        accessToken,
        selectedPlan,
        billingInterval.toLowerCase() as 'monthly' | 'annual',
        selectedPlan === 'founder',
      );

      // Redirect to Stripe checkout
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Payment initialization failed:', err);
      const errorMessage =
        err.message || 'Payment initialization failed. Please try again or contact support.';
      setError(errorMessage);
      dispatch(setPaymentError(errorMessage));
      setShowRetryOption(true);
      isProcessing.current = false;
    }
  };

  const handleRetry = () => {
    setShowRetryOption(false);
    dispatch(resetPaymentState());
    setError('');
  };

  const handleClose = () => {
    if (!isPaymentProcessing) {
      dispatch(closePaymentModal());
      dispatch(resetPaymentState());
      setError('');
      setShowRetryOption(false);
      onClose?.();
    }
  };

  if (!isOpen) return null;

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

        {/* Plan Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Select Plan</label>
          <div className="grid gap-3">
            {pricingPlans.map((plan: any) => (
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
                <div className="flex-1">
                  <div className="font-medium text-white">{plan.name}</div>
                  <div className="text-sm text-slate-400">{plan.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">
                    $
                    {billingInterval === BILLING_INTERVAL.ANNUAL
                      ? plan.pricing.annual
                      : plan.pricing.monthly}
                    <span className="text-sm font-normal text-slate-400">
                      /{billingInterval === BILLING_INTERVAL.ANNUAL ? 'yr' : 'mo'}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Billing Interval */}
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
              } ${isPaymentProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              } ${isPaymentProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Action Buttons */}
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
