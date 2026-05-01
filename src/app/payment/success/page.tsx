'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux';
import { setSubscription, resetPaymentState } from '@/redux/slices';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.user.user);

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Payment successful! Setting up your account...');

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Get session ID from URL params
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
          setStatus('error');
          setMessage('Invalid payment session. Redirecting...');
          setTimeout(() => router.replace('/payment'), 3000);
          return;
        }

        // Optional: Verify session with backend
        // const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
        // const data = await response.json();

        // Clear payment state
        dispatch(resetPaymentState());

        if (!user) {
          setStatus('error');
          setMessage('Session expired. Please sign in again.');
          setTimeout(() => router.replace('/auth/signin'), 3000);
          return;
        }

        setStatus('success');
        setMessage('Payment successful! Redirecting to your agency...');

        // Redirect to agency page after 2 seconds
        setTimeout(() => {
          router.replace('/agency');
        }, 2000);
      } catch (error) {
        console.error('Payment success handling failed:', error);
        setStatus('error');
        setMessage('There was an issue processing your payment. Please contact support.');
        setTimeout(() => router.replace('/payment'), 3000);
      }
    };

    handlePaymentSuccess();
  }, [searchParams, user, dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center max-w-md mx-auto px-4">
        {status === 'loading' && (
          <>
            <div className="mb-4 w-16 h-16 mx-auto rounded-full border-4 border-slate-700 border-t-orange-500 animate-spin"></div>
            <h1 className="text-white text-2xl font-bold mb-2">Processing</h1>
            <p className="text-slate-400">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-4 w-16 h-16 mx-auto rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">Success!</h1>
            <p className="text-slate-400">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-4 w-16 h-16 mx-auto rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-white text-2xl font-bold mb-2">Error</h1>
            <p className="text-slate-400">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
  }, [searchParams, router, user]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h1 className="text-white text-2xl font-bold mb-2">Processing Payment...</h1>
            <p className="text-slate-400">Please wait while we confirm your payment.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-white text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-slate-400">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-white text-2xl font-bold mb-2">Payment Error</h1>
            <p className="text-slate-400">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
