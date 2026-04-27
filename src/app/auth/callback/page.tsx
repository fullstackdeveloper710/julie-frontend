'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            // Get the code from URL (Supabase OAuth callback)
            const code = searchParams.get('code');

            if (code) {
                try {
                    // Exchange code for session
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                } catch (err) {
                    console.error('Auth callback error:', err);
                    router.push('/auth/signin?error=Authentication failed');
                    return;
                }
            }

            // Check if this is a password reset redirect
            const error = searchParams.get('error');
            const error_description = searchParams.get('error_description');

            if (error) {
                console.error('Auth error:', error_description);
                router.push(`/auth/signin?error=${encodeURIComponent(error_description || error)}`);
                return;
            }

            // Get current session to determine where to redirect
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                router.push('/auth/signin');
                return;
            }

            // Successfully authenticated, redirect to dashboard
            router.push('/dashboard');
        };

        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="text-center">
                <h1 className="text-white text-2xl font-bold mb-2">Authenticating...</h1>
                <p className="text-slate-400">Please wait while we complete your authentication.</p>
            </div>
        </div>
    );
}
