'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ShieldCheck, UserCog, Mail, BadgeCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { TextField } from '@/components/forms/checkins/shared/FormFields';
import {
  HEADING_FONT_FAMILY,
  PRIMARY_BUTTON_CLASS,
} from '@/components/forms/checkins/shared/styles';
import { extractRtkErrorMessage, logRtkError } from '@/utils/rtkErrorHandler';
import { useCreateManagerMutation, useListManagersQuery } from '@/redux/api/managerApi';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';

type FormValues = {
  fullName: string;
  email: string;
  title: string;
};

const INITIAL_VALUES: FormValues = {
  fullName: '',
  email: '',
  title: '',
};

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required('Full name is required').max(200),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  title: Yup.string().trim().max(200).notRequired(),
});

export default function CreateManagerPage() {
  const router = useRouter();
  const { data: userResp } = useGetCurrentUserQuery();
  const isAdmin = userResp?.data?.role === 'manager';

  useEffect(() => {
    if (isAdmin) router.replace('/dashboard');
  }, [isAdmin, router]);

  const { data: listResp, isLoading: isListLoading } = useListManagersQuery(undefined, {
    skip: isAdmin,
  });
  const [createManager, { isLoading: isSubmitting }] = useCreateManagerMutation();

  const admins = listResp?.data?.admins ?? [];
  const capacity = listResp?.data?.capacity;
  const canCreateMore = capacity?.canCreateMore ?? true;
  const used = capacity?.used ?? admins.length;
  const maxAllowed = capacity?.maxAllowed ?? 2;

  const formik = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        setStatus({ error: '', success: '' });
        const res = await createManager({
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          title: values.title.trim() || undefined,
        }).unwrap();
        if (res.success) {
          setStatus({ success: res.message || 'Admin invite sent' });
          resetForm();
        }
      } catch (err) {
        logRtkError('Create admin error', err);
        setStatus({
          error: extractRtkErrorMessage(err) || 'Failed to create admin',
        });
      }
    },
  });

  const errorOf = (name: keyof FormValues): string | undefined => {
    const touched = formik.touched[name];
    const error = formik.errors[name];
    return touched && typeof error === 'string' ? error : undefined;
  };

  return (
    <div className="px-7 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-white mb-1 flex items-center gap-3"
          style={{ fontFamily: HEADING_FONT_FAMILY }}
        >
          <UserCog className="w-7 h-7" />
          Manage Admin
        </h1>
        <p className="text-sm text-slate-400">
          Invite a Deputy Chief, Lieutenant, or equivalent decision-maker. They&apos;ll receive an
          email with a temporary password and verification link.
        </p>

        {formik.status?.error && (
          <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded">
            {formik.status.error}
          </div>
        )}
        {formik.status?.success && (
          <div className="mt-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded">
            {formik.status.success}
          </div>
        )}
      </div>

      {/* SEAT USAGE / ROSTER */}
      <section className="mb-8 bg-slate-800 border border-slate-700 rounded-lg p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2
              className="text-sm font-bold text-white uppercase tracking-widest"
              style={{ fontFamily: HEADING_FONT_FAMILY }}
            >
              Admin Seats
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isListLoading ? 'Loading…' : `${used} of ${maxAllowed} admin seats used.`}
            </p>
          </div>
        </div>

        {!isListLoading && admins.length === 0 && (
          <p className="text-xs text-slate-500">
            No admin invites yet. Use the form below to create your first admin seat.
          </p>
        )}

        {admins.length > 0 && (
          <ul className="divide-y divide-slate-700">
            {admins.map((admin) => (
              <li key={admin._id} className="py-3 flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm text-white font-semibold truncate">
                    {admin.fullName || admin.email}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5" />
                    {admin.email}
                  </p>
                  {admin.title && <p className="text-xs text-slate-500 mt-0.5">{admin.title}</p>}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded inline-flex items-center gap-1 ${
                    admin.isConfirmed
                      ? 'text-emerald-400 border border-emerald-400/40'
                      : 'text-amber-400 border border-amber-400/40'
                  }`}
                >
                  {admin.isConfirmed ? (
                    <>
                      <BadgeCheck className="w-3 h-3" /> Active
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" /> Pending
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CREATE FORM */}
      {canCreateMore ? (
        <form
          onSubmit={formik.handleSubmit}
          className="bg-slate-800 border-t-4 border-t-(--accent) border border-slate-700 rounded-lg p-7 space-y-6"
        >
          <div>
            <h2
              className="text-xl font-bold text-white mb-1"
              style={{ fontFamily: HEADING_FONT_FAMILY }}
            >
              Admin Details
            </h2>
            <p className="text-xs text-slate-500 mb-5">The invite is sent to the email below.</p>

            <div className="space-y-5">
              <TextField
                name="fullName"
                label="Full Name"
                placeholder="Jane Doe"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={errorOf('fullName')}
              />
              <TextField
                name="email"
                label="Email"
                placeholder="admin@youragency.gov"
                helpText="Used for the invite and future sign-in."
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={errorOf('email')}
              />
              <TextField
                name="title"
                label="Typical Title"
                placeholder="Deputy Chief / Lieutenant or equivalent"
                helpText="Optional. Free-form rank or role."
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={errorOf('title')}
              />
            </div>
          </div>

          <hr className="border-t border-slate-700" />

          <div className="flex justify-end gap-3 flex-wrap">
            <Button
              type="submit"
              disabled={isSubmitting}
              buttonClassName={PRIMARY_BUTTON_CLASS}
              style={{ fontFamily: HEADING_FONT_FAMILY }}
            >
              {isSubmitting ? 'Sending invite…' : 'Save and Continue'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center text-slate-400 text-sm">
          All {maxAllowed} admin seats are in use. Remove an existing admin to invite another.
        </div>
      )}
    </div>
  );
}
