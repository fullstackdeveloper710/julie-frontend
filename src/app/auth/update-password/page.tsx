'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { extractRtkErrorMessage, logRtkError } from '@/utils/rtkErrorHandler';
import { Input, Button } from '@/components/ui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { supabase } from '@/lib/supabase';
import { useUpdatePasswordMutation } from '@/redux/api/authApi';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [updatePassword, { isLoading, error: rtcError }] = useUpdatePasswordMutation();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setIsCheckingAuth(false);
                setAuthError('');
            } else if (event === 'PASSWORD_RECOVERY') {
                setIsCheckingAuth(false);
                setAuthError('');
            }
        });

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setTimeout(async () => {
                    const { data: { session: retrySession } } = await supabase.auth.getSession();
                    if (!retrySession) {
                        setAuthError('Invalid or expired reset link. Please request a new password reset.');
                    }
                    setIsCheckingAuth(false);
                }, 500);
            } else {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password'),
        }),
        onSubmit: async (values) => {
            try {
                await updatePassword({
                    password: values.password,
                }).unwrap();

                router.push('/auth/signin?message=Password updated successfully. Please sign in.');
            } catch (err: any) {
                logRtkError('Password update error', err);
                // Error is handled in the render via rtcError
            }
        },
    });

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-slate-950">
                <div
                    className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-64px)]"
                    style={{
                        background: 'linear-gradient(135deg, rgb(15, 25, 34) 0%, rgb(26, 42, 58) 100%)',
                    }}
                >
                    <div className="bg-slate-800 border-t-4 border-t-(--accent) border-slate-700 rounded-xl lg:p-10 p-5 w-full max-w-md">
                        <p className="text-center text-slate-300">Verifying your reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (authError) {
        return (
            <div className="min-h-screen bg-slate-950">
                <div
                    className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-64px)]"
                    style={{
                        background: 'linear-gradient(135deg, rgb(15, 25, 34) 0%, rgb(26, 42, 58) 100%)',
                    }}
                >
                    <div className="bg-slate-800 border-t-4 border-t-(--accent) border-slate-700 rounded-xl lg:p-10 p-5 w-full max-w-md">
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded mb-4">
                            {authError}
                        </div>
                        <Link
                            href="/auth/forgot-password"
                            className="text-(--accent) hover:text-(--accent)/80 font-semibold transition-colors"
                        >
                            Request a new reset link →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const errorMessage = extractRtkErrorMessage(rtcError);

    return (
        <div className="min-h-screen bg-slate-950">
            <div
                className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-64px)]"
                style={{
                    background: 'linear-gradient(135deg, rgb(15, 25, 34) 0%, rgb(26, 42, 58) 100%)',
                }}
            >
                <div className="bg-slate-800 border-t-4 border-t-(--accent) border-slate-700 rounded-xl lg:p-10 p-5 w-full max-w-md">
                    <div className="font-bold text-sm tracking-widest text-(--accent) uppercase mb-6">
                        Frontline Frameworks
                    </div>

                    <h2 className="font-bold text-3xl text-white mb-2">Create New Password</h2>
                    <p className="text-sm text-slate-300 mb-6">
                        Enter your new password below.
                    </p>

                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded mb-4">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <Input
                            type="password"
                            name="password"
                            label="New Password"
                            placeholder="••••••••"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            containerClassName="flex flex-col gap-2"
                            labelClassName="text-xs font-semibold tracking-widest"
                            inputClassName="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500"
                            error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                        />

                        <Input
                            type="password"
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="••••••••"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            required
                            containerClassName="flex flex-col gap-2"
                            labelClassName="text-xs font-semibold tracking-widest"
                            inputClassName="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500"
                            error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            buttonClassName="w-full bg-(--accent) hover:bg-(--accent)/80 disabled:bg-(--accent)/50 text-slate-950 font-bold text-sm tracking-widest uppercase py-3 rounded-lg transition-colors"
                        >
                            {isLoading ? 'Updating Password...' : 'Update Password →'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 border-t border-slate-700" />

                    {/* Back to Sign In */}
                    <p className="text-center text-sm">
                        <Link
                            href="/auth/signin"
                            className="text-(--accent) hover:text-(--accent)/80 font-semibold transition-colors"
                        >
                            Back to sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
