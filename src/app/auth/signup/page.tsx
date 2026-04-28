'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { logRtkError } from '@/utils/rtkErrorHandler';
import { Input, Button } from '@/components/ui';
import { useAppDispatch } from '@/redux';
import { useSignUpMutation } from '@/redux/api';
import { fetchPricingPlans, type BackendPlanId, type PricingPlan } from '@/lib/pricing';

type BackendPlan = 'Early Adopter' | 'Standard' | 'Enterprise';

const PLAN_KEY_TO_BACKEND_PLAN: Record<BackendPlanId, BackendPlan> = {
  founding: 'Early Adopter',
  early_adopter: 'Early Adopter',
  standard: 'Standard',
  enterprise: 'Enterprise',
};
const validationSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signUp, { isLoading, error: rtkError }] = useSignUpMutation();
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [pricingError, setPricingError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const selectedPlanKey = searchParams.get('plan') as BackendPlanId | null;

  useEffect(() => {
    let isMounted = true;

    const loadPricing = async () => {
      try {
        setPricingLoading(true);
        const response = await fetchPricingPlans();

        if (!isMounted) {
          return;
        }

        setPricingPlans(response.plans);
        setPricingError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setPricingError('Unable to load plan details right now.');
      } finally {
        if (isMounted) {
          setPricingLoading(false);
        }
      }
    };

    void loadPricing();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentPlan =
    pricingPlans.find((plan) => plan.id === selectedPlanKey) ??
    pricingPlans.find((plan) => plan.id === 'early_adopter') ??
    pricingPlans[0] ??
    null;

  const resolvedPlanKey: BackendPlanId =
    currentPlan?.available && currentPlan.id
      ? currentPlan.id
      : (pricingPlans.find((plan) => plan.available)?.id ?? 'early_adopter');

  const resolvedPlan = pricingPlans.find((plan) => plan.id === resolvedPlanKey) ?? currentPlan;

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await signUp({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          plan: PLAN_KEY_TO_BACKEND_PLAN[resolvedPlanKey],
        }).unwrap();

        setUserEmail(result.data.email);
        setSuccessMessage(result.message);
        setShowModal(true);
        resetForm();
      } catch (err: any) {
        logRtkError('Sign up error', err);
      }
    },
  });

  if (pricingLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
        <div className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-sm text-slate-300">
          Loading plan details...
        </div>
      </div>
    );
  }

  if (pricingError || !resolvedPlan) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
        <div className="max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Plan details unavailable</h2>
          <p className="text-sm text-slate-300">
            {pricingError ?? 'Please try again in a moment.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[linear-gradient(135deg,rgb(15,25,34)_0%,rgb(26,42,58)_100%)] px-5 py-10">
        <div className="w-full trialForm max-w-lg rounded-xl border border-slate-700 border-t-[3px] border-t-(--accent) bg-slate-900 p-10 shadow-2xl">
          <div className="mb-4 text-sm font-black uppercase tracking-[0.08em] text-(--accent)">
            Frontline Frameworks
          </div>

          {resolvedPlanKey === 'founding' ? (
            <>
              <h2 className="text-3xl font-extrabold text-white mb-2">Start Your Free Trial</h2>
              <p className="mb-3 text-sm">90 days free · No credit card required to start</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-white mb-2">Create Your Account</h2>
              <p className="mb-3 text-sm">Get started with the {currentPlan.name} plan</p>
            </>
          )}
          <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5 mb-4">
            <div className="text-sm font-extrabold text-(--accent)">{resolvedPlan.name} Plan</div>

            <div className="mt-2 text-3xl font-bold text-white">
              {resolvedPlan.display.priceLabel}
              <span className="text-sm font-medium text-slate-300">
                {resolvedPlan.display.priceIntervalLabel}
              </span>
            </div>

            {resolvedPlan.features.trialDays && (
              <div className="text-xs text-green-400 mt-1">
                {resolvedPlan.features.trialDays} days free trial
              </div>
            )}

            <div className="mt-3 text-xs">{resolvedPlan.description}</div>

            <div className="mt-2 text-xs text-slate-400">
              {resolvedPlan.features.adminSeats} Admin + {resolvedPlan.features.viewerSeats} Viewer
              seats
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm ">
              <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl animate-fadeIn">
                <div className="mb-4 text-4xl">📩</div>
                <h2 className="text-xl font-bold text-white mb-2">Verification Email Sent</h2>
                <p className="text-sm text-slate-300 mb-2">A verification link has been sent to:</p>
                <p className="text-sm font-semibold text-(--accent) mb-4 break-all">{userEmail}</p>
                <p className="text-xs text-slate-400 mb-6">
                  Please check your inbox and verify your email to continue.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full rounded-xl bg-(--accent) px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-600 cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </div>
          )}
          {formik.status?.error && (
            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {formik.status.error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-2">
            <Input
              name="fullName"
              label="Your Full Name"
              placeholder="First Last"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.fullName && formik.errors.fullName
                  ? formik.errors.fullName
                  : undefined
              }
              containerClassName="space-y-2"
              labelClassName="text-xs font-semibold uppercase tracking-[0.04em] text-slate-300"
              inputClassName="rounded-xl border px-4 py-3 text-sm text-white outline-none transition bg-slate-800"
              errorClassName="text-xs text-red-400"
            />

            <Input
              type="email"
              name="email"
              label="Work Email"
              placeholder="you@youragency.gov"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              containerClassName="space-y-2"
              labelClassName="text-xs font-semibold uppercase tracking-[0.04em] text-slate-300"
              inputClassName="rounded-xl border px-4 py-3 text-sm text-white outline-none transition bg-slate-800"
              errorClassName="text-xs text-red-400"
            />

            <Input
              type="password"
              name="password"
              label="Create Password"
              placeholder="Min. 8 characters"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : undefined
              }
              containerClassName="space-y-2"
              labelClassName="text-xs font-semibold uppercase tracking-[0.04em] text-slate-300"
              inputClassName="rounded-xl border px-4 py-3 text-sm text-white outline-none transition bg-slate-800"
              errorClassName="text-xs text-red-400"
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? formik.errors.confirmPassword
                  : undefined
              }
              containerClassName="space-y-2"
              labelClassName="text-xs font-semibold uppercase tracking-[0.04em] text-slate-300"
              inputClassName="rounded-xl border px-4 py-3 text-sm text-white outline-none transition bg-slate-800"
              errorClassName="text-xs text-red-400"
            />

            <hr className="border-slate-700" />
            <Button
              type="submit"
              disabled={isLoading}
              buttonClassName="w-full rounded-xl bg-(--accent) px-5 py-3 text-sm !font-bold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-semibold text-(--accent) hover:text-(--accent)/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
