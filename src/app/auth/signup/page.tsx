'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { extractRtkErrorMessage, logRtkError } from '@/utils/rtkErrorHandler';
import { Input, Button } from '@/components/ui';
import { useAppDispatch } from '@/redux';
import { useSignUpMutation } from '@/redux/api';
import { setCredentials } from '@/redux/slices/userSlice';
import { useState } from 'react';
import { PRICING_CONFIG } from '@/types';
import type { PlanType } from '@/types/subscription';
const validationSchema = Yup.object({
  // agencyName: Yup.string().required('Agency name is required'),
  // agencyType: Yup.string().required('Agency type is required'),
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
  // get fromm param
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan') as PlanType | null;
  const plan: PlanType =
    selectedPlan && PRICING_CONFIG[selectedPlan] ? selectedPlan : 'early_adopter';

  const formik = useFormik({
    initialValues: {
      agencyName: '',
      agencyType: 'Law Enforcement',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await signUp({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          plan: plan,
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

  const currentPlan = PRICING_CONFIG[plan];
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[linear-gradient(135deg,rgb(15,25,34)_0%,rgb(26,42,58)_100%)] px-5 py-10">
        <div className="w-full trialForm max-w-lg rounded-xl border border-slate-700 border-t-[3px] border-t-(--accent) bg-slate-900 p-10 shadow-2xl">
          <div className="mb-4 text-sm font-black uppercase tracking-[0.08em] text-(--accent)">
            Frontline Frameworks
          </div>

          {plan === 'founding' ? (
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
            {/* Plan Name */}
            <div className="text-sm font-extrabold text-(--accent)">{currentPlan.name} Plan</div>

            {/* Price */}
            <div className="mt-2 text-3xl font-bold text-white">
              {currentPlan.pricing.monthly
                ? `$${currentPlan.pricing.monthly}/month`
                : `$${currentPlan.pricing.annual}/year`}
            </div>

            {/* Trial */}
            {currentPlan.features.trialDays && (
              <div className="text-xs text-green-400 mt-1">
                {currentPlan.features.trialDays} days free trial
              </div>
            )}

            {/* Description */}
            <div className="mt-3 text-xs">{currentPlan.description}</div>

            {/* Seats */}
            <div className="mt-2 text-xs text-slate-400">
              {currentPlan.features.adminSeats} Admin + {currentPlan.features.viewerSeats} Viewer
              seats
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm ">
              <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl animate-fadeIn">
                {/* Icon */}
                <div className="mb-4 text-4xl">📩</div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-2">Verification Email Sent</h2>

                {/* Message */}
                <p className="text-sm text-slate-300 mb-2">A verification link has been sent to:</p>

                {/* Email Highlight */}
                <p className="text-sm font-semibold text-(--accent) mb-4 break-all">{userEmail}</p>

                {/* Instruction */}
                <p className="text-xs text-slate-400 mb-6">
                  Please check your inbox and verify your email to continue.
                </p>

                {/* Button */}
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
            {/* <div className="text-xs font-extrabold uppercase tracking-widest text-orange-400">
              Billing (Starts After Free Trial)
            </div> */}

            {/* <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-300">
                Card Number
              </label>
              <input
                name="cardNumber"
                value={formik.values.cardNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="4242 4242 4242 4242"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition bg-slate-800 ${
                  formik.touched.cardNumber && formik.errors.cardNumber
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-700 focus:border-(--accent)'
                }`}
              />
              {formik.touched.cardNumber && formik.errors.cardNumber && (
                <p className="text-xs text-red-400">{formik.errors.cardNumber}</p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-300">
                  Expiry
                </label>
                <input
                  name="expiry"
                  value={formik.values.expiry}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="MM / YY"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition bg-slate-800 ${
                    formik.touched.expiry && formik.errors.expiry
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-700 focus:border-(--accent)'
                  }`}
                />
                {formik.touched.expiry && formik.errors.expiry && (
                  <p className="text-xs text-red-400">{formik.errors.expiry}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.04em] text-slate-300">
                  CVC
                </label>
                <input
                  name="cvc"
                  value={formik.values.cvc}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="123"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition bg-slate-800 ${
                    formik.touched.cvc && formik.errors.cvc
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-700 focus:border-(--accent)'
                  }`}
                />
                {formik.touched.cvc && formik.errors.cvc && (
                  <p className="text-xs text-red-400">{formik.errors.cvc}</p>
                )}
              </div>
            </div> */}
            <Button
              type="submit"
              disabled={isLoading}
              buttonClassName="w-full rounded-xl bg-(--accent) px-5 py-3 text-sm !font-bold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Starting ' : 'Start '}
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
