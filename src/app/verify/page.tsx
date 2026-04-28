'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

const VERIFIED_TOKENS_KEY = 'frontline:verified-tokens';

const markTokenVerified = (token: string) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = window.sessionStorage.getItem(VERIFIED_TOKENS_KEY);
    const set = new Set<string>(existing ? JSON.parse(existing) : []);
    set.add(token);
    window.sessionStorage.setItem(VERIFIED_TOKENS_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore storage errors */
  }
};

const isTokenAlreadyVerified = (token: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const existing = window.sessionStorage.getItem(VERIFIED_TOKENS_KEY);
    if (!existing) return false;
    return (JSON.parse(existing) as string[]).includes(token);
  } catch {
    return false;
  }
};

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing token');
      const timer = setTimeout(() => {
        router.replace('/auth/signin?error=Invalid or missing verification token');
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (isTokenAlreadyVerified(token)) {
      setStatus('success');
      setMessage('Your email has been verified. Please sign in to continue.');
      const timer = setTimeout(() => {
        router.replace('/auth/signin?message=Email verified successfully. Please sign in.');
      }, 800);
      return () => clearTimeout(timer);
    }

    let cancelled = false;
    const verifyUser = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
          params: { token },
        });

        markTokenVerified(token);

        if (cancelled) return;
        setStatus('success');
        setMessage('Your email has been verified. Please sign in to continue.');

        setTimeout(() => {
          router.replace('/auth/signin?message=Email verified successfully. Please sign in.');
        }, 1500);
      } catch (error) {
        if (cancelled) return;
        const err = error as AxiosError<any>;
        const apiMessage = err.response?.data?.message || 'Verification failed';
        setStatus('error');
        setMessage(apiMessage);

        setTimeout(() => {
          router.replace(`/auth/signin?error=${encodeURIComponent(apiMessage)}`);
        }, 2000);
      }
    };

    verifyUser();
    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && <p className="text-slate-300">🔄 Verifying your account...</p>}
        {status === 'success' && <p className="text-green-400">✅ {message}</p>}
        {status === 'error' && <p className="text-red-400">❌ {message}</p>}
      </div>
    </div>
  );
}
