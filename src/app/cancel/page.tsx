'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.replace('/payment');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <div className="mb-6 w-16 h-16 mx-auto rounded-full bg-yellow-500/10 border-2 border-yellow-500 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-white text-2xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-slate-400 mb-6">
            Your payment was not completed. Your subscription setup is still pending.
          </p>

          <div className="space-y-3">
            <p className="text-sm text-slate-400">
              Redirecting to payment page in {countdown} seconds...
            </p>
            <div className="flex gap-3">
              <Link href="/payment" className="flex-1">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors">
                  Try Again
                </button>
              </Link>
              <Link href="/auth/signin" className="flex-1">
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors">
                  Back to Login
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300">
              💡 <span className="font-medium">Need help?</span> Contact our support team if you're
              experiencing any issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
