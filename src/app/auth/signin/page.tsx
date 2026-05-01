'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { extractRtkErrorMessage, logRtkError } from '@/utils/rtkErrorHandler';
import { Input, Button } from '@/components/ui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/redux';
import { useSignInMutation } from '@/redux/api';
import { loginSuccess } from '@/redux/actions/auth';
import { useState, useEffect } from 'react';
import PaymentModal from '@/components/PaymentModal';
import { openPaymentModal, closePaymentModal } from '@/redux/slices';
import { USER_ROLE } from '@/types/enums';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [signIn, { isLoading, error: rtcError }] = useSignInMutation();
  const { isPaymentModalOpen } = useAppSelector((state) => state.subscription);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);

  const flashMessage = searchParams.get('message');
  const flashError = searchParams.get('error');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const result = await signIn({
          email: values.email,
          password: values.password,
        }).unwrap();

        const accessToken = result.data.tokens.access_token.token;
        const refreshToken = result.data.tokens.refresh_token.token;
        const user = result.data.user;

        if (!accessToken) {
          throw new Error('Access token not found');
        }

        dispatch(
          loginSuccess({
            user,
            accessToken,
            refreshToken,
          }),
        );

        const hasActiveSubscription = user.hasActiveSubscription === true;
        const isOwner = user.role === USER_ROLE.USER || user.role == null;

        if (isOwner && !hasActiveSubscription) {
          // Block navigation and show payment modal for owners without an active subscription
          setIsNavigationBlocked(true);
          setShowPaymentModal(true);
          dispatch(openPaymentModal());
        } else {
          // Non-owner users or already subscribed users go directly to dashboard
          router.push('/dashboard');
        }
      } catch (err: any) {
        console.log('LOGIN ERROR 👉', err);
        logRtkError('Sign in error', err);
      }
    },
  });

  const handlePaymentModalClose = () => {
    // Don't allow closing if payment is in progress
    setShowPaymentModal(false);
    setIsNavigationBlocked(false);
    dispatch(closePaymentModal());
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setIsNavigationBlocked(false);
    dispatch(closePaymentModal());
    // Redirect to agency page after successful payment
    router.push('/agency');
  };

  const errorMessage = extractRtkErrorMessage(rtcError);

  return (
    <>
      <div className="min-h-screen bg-slate-950">
        <div
          className="flex loginForm items-center justify-center px-4 py-8 min-h-[calc(100vh-64px)]"
          style={{
            background: 'linear-gradient(135deg, rgb(15, 25, 34) 0%, rgb(26, 42, 58) 100%)',
          }}
        >
          <div className="bg-slate-800 border-t-4 border-t-(--accent) border-slate-700 rounded-xl lg:p-10 p-5 w-full max-w-md">
            <div className="font-bold text-sm tracking-widest text-(--accent) uppercase mb-6">
              Frontline Frameworks
            </div>

            <h2 className="font-bold text-3xl text-white mb-2">Welcome Back</h2>
            <p className=" text-sm mb-6">Sign in to your agency dashboard</p>

            {flashMessage && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded mb-4">
                {flashMessage}
              </div>
            )}

            {flashError && !errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded mb-4">
                {flashError}
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded mb-4">
                {errorMessage}
              </div>
            )}

            {isNavigationBlocked && (
              <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-3 py-2 rounded mb-4">
                ⏳ Complete payment to continue...
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="admin@youragency.gov"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                disabled={isNavigationBlocked}
                containerClassName="flex flex-col gap-2"
                labelClassName="text-xs  font-semibold tracking-widest"
                inputClassName="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-(--accent) disabled:opacity-50"
              />

              {/* Password */}
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                disabled={isNavigationBlocked}
                containerClassName="flex flex-col gap-2"
                labelClassName="text-xs  font-semibold tracking-widest"
                inputClassName={`bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-(--accent) disabled:opacity-50 ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                error={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : undefined
                }
              />
              <div className="flex justify-between items-center text-xs mb-6">
                <label className="flex items-center gap-2  cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                    disabled={isNavigationBlocked}
                    className="accent-(--accent) disabled:opacity-50"
                  />
                  Remember me
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-(--accent) cursor-pointer hover:text-(--accent)/80 transition-colors font-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading || isNavigationBlocked}
                buttonClassName="w-full bg-(--accent) hover:bg-(--accent)/80 disabled:bg-(--accent)/50 text-slate-950 font-bold text-sm tracking-widest uppercase py-3 rounded-lg transition-colors"
              >
                {isLoading ? 'Signing In...' : 'Sign In →'}
              </Button>
            </form>

            <div className="my-6 border-t border-slate-700" />

            <p className="text-center text-sm ">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-(--accent) hover:text-(--accent)/80 font-semibold transition-colors"
              >
                Start your free trial
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal - shown after successful login if user is owner without subscription */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentModalClose}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}
