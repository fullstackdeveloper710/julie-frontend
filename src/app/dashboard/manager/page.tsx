'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, Button } from '@/components/ui';
import { extractRtkErrorMessage, logRtkError } from '@/utils/rtkErrorHandler';
import { useCreateManagerMutation } from '@/redux/api/managerApi';

export default function CreateManagerPage() {
  const [createManager, { isLoading }] = useCreateManagerMutation();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
    },

    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),

    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        setStatus({ error: '', success: '' });

        const res = await createManager(values).unwrap();

        if (res.success) {
          setStatus({ success: res.message || 'Manager created successfully' });
          resetForm();
        }
        console.log('Create Manager Response 👉', res);
      } catch (err: any) {
        logRtkError('Create manager error', err);

        setStatus({
          error: extractRtkErrorMessage(err) || 'Failed to create manager',
        });
      }
    },
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-xl border border-slate-700 border-t-[3px] border-t-(--accent) bg-slate-900 p-8 shadow-2xl">
          {/* TITLE */}
          <h2 className="text-2xl font-extrabold text-white mb-2">Create Manager</h2>
          <p className="mb-4 text-sm text-slate-400">Add a new manager to your agency</p>

          {/* STATUS MESSAGES */}
          {formik.status?.error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {formik.status.error}
            </div>
          )}

          {formik.status?.success && (
            <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {formik.status.success}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Input
              name="fullName"
              label="Full Name"
              placeholder="Enter full name"
              value={formik.values.fullName}
              inputClassName={'text-white'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.fullName && formik.errors.fullName
                  ? formik.errors.fullName
                  : undefined
              }
            />

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="manager@example.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              inputClassName={'text-white'}
            />

            <Button
              type="submit"
              disabled={isLoading}
              buttonClassName="w-full rounded-xl bg-(--accent) py-3 text-sm font-bold text-black"
            >
              {isLoading ? 'Creating...' : 'Create Manager'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
