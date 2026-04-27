'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/userSlice';

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing token');
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
          params: { token },
        });

        const { user, tokens } = res.data.data;

        // 🔥 Redux SAVE (IMPORTANT)
        dispatch(
          setCredentials({
            user,
            accessToken: tokens.access_token.token,
            refreshToken: tokens.refresh_token.token,
          }),
        );

        setStatus('success');
        setMessage('Account verified & logged in');

        // 🔥 redirect dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (error) {
        const err = error as AxiosError<any>;

        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };

    verifyUser();
  }, [params, router, dispatch]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {status === 'loading' && <p>🔄 Verifying your account...</p>}
      {status === 'success' && <p>✅ {message}</p>}
      {status === 'error' && <p>❌ {message}</p>}
    </div>
  );
}
