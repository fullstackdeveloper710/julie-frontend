'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserCog, Mail, BadgeCheck, Clock, Trash2, PowerOff, Power, Building2, Send } from 'lucide-react';
import { Button } from '@/components/ui';
import { TextField } from '@/components/forms/checkins/shared/FormFields';
import {
  HEADING_FONT_FAMILY,
  PRIMARY_BUTTON_CLASS,
} from '@/components/forms/checkins/shared/styles';
import { extractRtkErrorMessage, logRtkError } from '@/utils/rtkErrorHandler';
import {
  useCreateManagerMutation,
  useListManagersQuery,
  useSetManagerStatusMutation,
  useResendManagerInviteMutation,
  useAssignManagerAgencyMutation,
  useDeleteManagerMutation,
} from '@/redux/api/managerApi';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';
import { useListMyAgenciesQuery } from '@/redux/api/agencyApi';
import { USER_ROLE } from '@/types/enums';

type FormValues = {
  fullName: string;
  email: string;
  title: string;
  agencyId: string;
};

const INITIAL_VALUES: FormValues = {
  fullName: '',
  email: '',
  title: '',
  agencyId: '',
};

const buildValidationSchema = (isEnterprise: boolean) =>
  Yup.object({
    fullName: Yup.string().trim().required('Full name is required').max(200),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    title: Yup.string().trim().max(200).notRequired(),
    agencyId: isEnterprise
      ? Yup.string().required('Please select an agency for this admin')
      : Yup.string().notRequired(),
  });

export default function CreateManagerPage() {
  const router = useRouter();
  const { data: userResp } = useGetCurrentUserQuery();
  const isAdmin = userResp?.data?.role === USER_ROLE.MANAGER;

  useEffect(() => {
    if (isAdmin) router.replace('/dashboard');
  }, [isAdmin, router]);

  const { data: listResp, isLoading: isListLoading } = useListManagersQuery(undefined, {
    skip: isAdmin,
  });
  const { data: agencyListResp } = useListMyAgenciesQuery(undefined, { skip: isAdmin });

  const [createManager, { isLoading: isSubmitting }] = useCreateManagerMutation();
  const [setManagerStatus] = useSetManagerStatusMutation();
  const [resendInvite] = useResendManagerInviteMutation();
  const [assignManagerAgency] = useAssignManagerAgencyMutation();
  const [deleteManager] = useDeleteManagerMutation();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string>('');
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendSuccessId, setResendSuccessId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const admins = listResp?.data?.admins ?? [];
  const capacity = listResp?.data?.capacity;
  const canCreateMore = capacity?.canCreateMore ?? true;
  const used = capacity?.used ?? admins.length;
  const maxAllowed = capacity?.maxAllowed ?? 2;
  const agencies = agencyListResp?.data?.agencies ?? [];

  // Enterprise: maxAllowed === 4 (plan-based) and multiple agencies exist
  const isEnterprise = maxAllowed >= 4;

  const agencyNameById = (id: string | null) => {
    if (!id) return null;
    return agencies.find((a) => a._id === id)?.name ?? null;
  };

  const formik = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: buildValidationSchema(isEnterprise),
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        setStatus({ error: '', success: '' });
        const res = await createManager({
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          title: values.title.trim() || undefined,
          ...(isEnterprise && values.agencyId ? { agencyId: values.agencyId } : {}),
        } as any).unwrap();
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

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    setActionError('');
    const next = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await setManagerStatus({ id, status: next }).unwrap();
    } catch (err) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to update status');
    }
  };

  const handleResendInvite = async (id: string) => {
    setActionError('');
    setResendingId(id);
    setResendSuccessId(null);
    try {
      await resendInvite(id).unwrap();
      setResendSuccessId(id);
      // Clear the success indicator after 4 s
      setTimeout(() => setResendSuccessId((prev) => (prev === id ? null : prev)), 4000);
    } catch (err) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to resend invite');
    } finally {
      setResendingId(null);
    }
  };

  const handleAssignAgency = async (adminId: string, agencyId: string | null) => {
    setActionError('');
    setAssigningId(adminId);
    try {
      await assignManagerAgency({ id: adminId, agencyId }).unwrap();
    } catch (err) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to assign agency');
    } finally {
      setAssigningId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionError('');
    try {
      await deleteManager(id).unwrap();
      setConfirmDeleteId(null);
    } catch (err) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to delete admin');
      setConfirmDeleteId(null);
    }
  };

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

        {actionError && (
          <p className="mb-3 text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded">
            {actionError}
          </p>
        )}

        {admins.length > 0 && (
          <ul className="divide-y divide-slate-700">
            {admins.map((admin) => {
              const isInactive = admin.status === 'inactive';
              const assignedName = agencyNameById(admin.assignedAgencyId);
              return (
                <li key={admin._id} className="py-3 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${isInactive ? 'text-slate-500' : 'text-white'}`}>
                        {admin.fullName || admin.email}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5" />
                        {admin.email}
                      </p>
                      {admin.title && <p className="text-xs text-slate-500 mt-0.5">{admin.title}</p>}

                      {/* Agency assignment badge */}
                      {!isEnterprise && assignedName && (
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {assignedName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded inline-flex items-center gap-1 ${
                          isInactive
                            ? 'text-slate-500 border border-slate-600'
                            : admin.isConfirmed
                              ? 'text-emerald-400 border border-emerald-400/40'
                              : 'text-amber-400 border border-amber-400/40'
                        }`}
                      >
                        {isInactive ? (
                          'Disabled'
                        ) : admin.isConfirmed ? (
                          <><BadgeCheck className="w-3 h-3" /> Active</>
                        ) : (
                          <><Clock className="w-3 h-3" /> Pending</>
                        )}
                      </span>

                      <button
                        type="button"
                        title={isInactive ? 'Activate' : 'Deactivate'}
                        onClick={() => handleToggleStatus(admin._id, admin.status)}
                        className={`p-1.5 rounded border transition-colors ${
                          isInactive
                            ? 'text-emerald-400 border-emerald-400/40 hover:bg-emerald-400/10'
                            : 'text-amber-400 border-amber-400/40 hover:bg-amber-400/10'
                        }`}
                      >
                        {isInactive ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Resend invite — only while unverified */}
                      {!admin.isConfirmed && (
                        <button
                          type="button"
                          title={resendSuccessId === admin._id ? 'Invite sent!' : 'Resend invite'}
                          disabled={resendingId === admin._id}
                          onClick={() => handleResendInvite(admin._id)}
                          className={`p-1.5 rounded border transition-colors disabled:opacity-50 ${
                            resendSuccessId === admin._id
                              ? 'text-emerald-400 border-emerald-400/40'
                              : 'text-sky-400 border-sky-400/40 hover:bg-sky-400/10'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {confirmDeleteId === admin._id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(admin._id)}
                            className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[10px] font-bold uppercase px-2 py-1 rounded border border-slate-600 text-slate-400 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          title="Delete admin"
                          onClick={() => setConfirmDeleteId(admin._id)}
                          className="p-1.5 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Enterprise agency assignment row */}
                  {isEnterprise && agencies.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap ml-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-xs text-slate-500">Agency:</span>
                      <select
                        value={admin.assignedAgencyId ?? ''}
                        disabled={assigningId === admin._id}
                        onChange={(e) => handleAssignAgency(admin._id, e.target.value || null)}
                        className="text-xs bg-slate-700 border border-slate-600 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-slate-400 disabled:opacity-50"
                      >
                        <option value="">— Unassigned —</option>
                        {agencies.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                      {assigningId === admin._id && (
                        <span className="text-xs text-slate-500">Saving…</span>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
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

              {/* Enterprise: require agency selection on invite */}
              {isEnterprise && agencies.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    {/* <Building2 className="w-3.5 h-3.5" /> */}
                    Assign Agency
                  </label>
                  <select
                    name="agencyId"
                    value={formik.values.agencyId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="text-sm bg-slate-700 border border-slate-600 text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-slate-400"
                  >
                    <option value="">Select an agency…</option>
                    {agencies.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  {errorOf('agencyId') && (
                    <p className="text-xs text-red-400">{errorOf('agencyId')}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    This admin will only be able to access the selected agency.
                  </p>
                </div>
              )}
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
