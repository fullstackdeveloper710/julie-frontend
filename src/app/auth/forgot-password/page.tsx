'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { extractRtkErrorMessage, logRtkError } from '@/utils/rtkErrorHandler';
import { Input, Button } from '@/components/ui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useResetPasswordMutation } from '@/redux/api/authApi';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [resetPassword, { isLoading, error: rtcError }] = useResetPasswordMutation();
    const [successMessage, setSuccessMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: async (values) => {
            try {
                setSuccessMessage('');
                const result = await resetPassword({
                    email: values.email,
                }).unwrap();

                setSuccessMessage(result.message || 'Password reset link sent to your email. Please check your inbox.');
                formik.resetForm();
            } catch (err: any) {
                logRtkError('Password reset error', err);
                // Error is handled in the render via rtcError
            }
        },
    });

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

                    <h2 className="font-bold text-3xl text-white mb-2">Reset Your Password</h2>
                    <p className="text-sm text-slate-300 mb-6">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded mb-4">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded mb-4">
                            {successMessage}
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
                            containerClassName="flex flex-col gap-2"
                            labelClassName="text-xs font-semibold tracking-widest"
                            inputClassName="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500"
                            error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            buttonClassName="w-full bg-(--accent) hover:bg-(--accent)/80 disabled:bg-(--accent)/50 text-slate-950 font-bold text-sm tracking-widest uppercase py-3 rounded-lg transition-colors"
                        >
                            {isLoading ? 'Sending Link...' : 'Send Reset Link →'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 border-t border-slate-700" />

                    {/* Back to Sign In */}
                    <p className="text-center text-sm">
                        Remember your password?{' '}
                        <Link
                            href="/auth/signin"
                            className="text-(--accent) hover:text-(--accent)/80 font-semibold transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
