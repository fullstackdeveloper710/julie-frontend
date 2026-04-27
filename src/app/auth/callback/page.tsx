'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Legacy auth callback. The Supabase-based OAuth callback was removed in favor
 * of a Node/Express verification flow. If a manager-invite or verification
 * email lands here with a token, forward it to the dedicated /verify page.
 * Otherwise, send the user to /auth/signin.
 */
export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (token) {
            router.replace(`/verify?token=${encodeURIComponent(token)}`);
            return;
        }

        if (error) {
            router.replace(`/auth/signin?error=${encodeURIComponent(errorDescription || error)}`);
            return;
        }

        router.replace('/auth/signin');
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="text-center">
                <h1 className="text-white text-2xl font-bold mb-2">Redirecting...</h1>
                <p className="text-slate-400">Please wait while we complete your authentication.</p>
            </div>
        </div>
    );
}
