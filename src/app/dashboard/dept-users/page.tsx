'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Users, Mail, BadgeCheck, Clock, Building2, Trash2, PowerOff, Power, Send } from 'lucide-react';
import { Button } from '@/components/ui';
import { TextField } from '@/components/forms/checkins/shared/FormFields';
import {
  HEADING_FONT_FAMILY,
  PRIMARY_BUTTON_CLASS,
} from '@/components/forms/checkins/shared/styles';
import { extractRtkErrorMessage, logRtkError } from '@/utils/rtkErrorHandler';
import {
  useListDeptHoldersQuery,
  useCreateDeptHolderMutation,
  useSetDeptHolderStatusMutation,
  useResendDeptHolderInviteMutation,
  useDeleteDeptHolderMutation,
  useAssignDeptHolderAgencyMutation,
} from '@/redux/api/managerApi';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';
import { useListMyAgenciesQuery } from '@/redux/api/agencyApi';
import { USER_PLAN, USER_ROLE } from '@/types/enums';
import { ManagerFormValues } from '@/types';

const INITIAL_VALUES: ManagerFormValues = {
  fullName: '',
  email: '',
  title: '',
  agencyId: '',
};

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required('Full name is required').max(200),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  title: Yup.string().trim().max(200).notRequired(),
  agencyId: Yup.string().notRequired(),
});

export default function DeptUsersPage() {
  const router = useRouter();
  const { data: userResp } = useGetCurrentUserQuery();
  const user = userResp?.data;
  const isOwner = user?.role === USER_ROLE.USER;
  const isEnterprise = user?.plan === USER_PLAN.ENTERPRISE;

  useEffect(() => {
    if (!userResp) return;
    // Only the main account holder (USER role) can manage dept users
    if (!isOwner || !isEnterprise) router.replace('/dashboard');
  }, [userResp, isOwner, isEnterprise, router]);

  const { data: deptHolderResp, isLoading } = useListDeptHoldersQuery(undefined, {
    skip: !userResp || !isOwner || !isEnterprise,
  });
  const { data: agencyListResp } = useListMyAgenciesQuery(undefined, {
    skip: !userResp || !isOwner || !isEnterprise,
  });

  const [createDeptHolder, { isLoading: isSubmitting }] = useCreateDeptHolderMutation();
  const [setDeptHolderStatus] = useSetDeptHolderStatusMutation();
  const [resendDeptHolderInvite] = useResendDeptHolderInviteMutation();
  const [deleteDeptHolder] = useDeleteDeptHolderMutation();
  const [assignDeptHolderAgency] = useAssignDeptHolderAgencyMutation();

  const [formStatus, setFormStatus] = useState<{ error?: string; success?: string }>({});
  const [actionError, setActionError] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendSuccessId, setResendSuccessId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const holders = deptHolderResp?.data?.holders ?? [];
  const capacity = deptHolderResp?.data?.capacity;
  const canCreateMore = capacity?.canCreateMore ?? true;
  const used = capacity?.used ?? holders.length;
  const maxAllowed = capacity?.maxAllowed ?? 2;
  const agencies = agencyListResp?.data?.agencies ?? [];

  const agencyNameById = (id: string | null) => {
    if (!id) return null;
    return agencies.find((a) => a._id === id)?.name ?? null;
  };

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    setActionError('');
    const next = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await setDeptHolderStatus({ id, status: next }).unwrap();
    } catch (err) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to update status');
    }
  };

  const handleResendInvite = async (id: string) => {
    setActionError('');
    setResendingId(id);
    setResendSuccessId(null);
    try {
      await resendDeptHolderInvite(id).unwrap();
      setResendSuccessId(id);
      setTimeout(() => setResendSuccessId((prev) => (prev === id ? null : prev)), 4000);
    } catch (err) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to resend invite');
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionError('');
    try {
      await deleteDeptHolder(id).unwrap();
      setConfirmDeleteId(null);
    } catch (err) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to remove department user');
      setConfirmDeleteId(null);
    }
  };

  const handleAssignAgency = async (holderId: string, agencyId: string | null) => {
    setActionError('');
    setAssigningId(holderId);
    try {
      await assignDeptHolderAgency({ id: holderId, agencyId }).unwrap();
    } catch (err) {
      setActionError(extractRtkErrorMessage(err) || 'Failed to assign agency');
    } finally {
      setAssigningId(null);
    }
  };

  const formik = useFormik<ManagerFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setFormStatus({});
      try {
        const res = await createDeptHolder({
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          title: values.title.trim() || undefined,
          ...(values.agencyId ? { agencyId: values.agencyId } : {}),
        } as any).unwrap();
        if (res.success) {
          setFormStatus({ success: res.message || 'Department user invite sent' });
          resetForm();
        }
      } catch (err) {
        logRtkError('Create dept user error', err);
        setFormStatus({ error: extractRtkErrorMessage(err) || 'Failed to send invite' });
      }
    },
  });

  const errorOf = (name: keyof ManagerFormValues): string | undefined => {
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
          <Users className="w-7 h-7" />
          Manage Department Users
        </h1>
        <p className="text-sm text-slate-400">
          Invite Department Account Holders who manage their own department&apos;s data. Up to{' '}
          {maxAllowed} dept holders are included in the Enterprise plan.
        </p>
      </div>

      {/* ROSTER */}
      <section className="mb-8 bg-slate-800 border border-slate-700 rounded-lg p-5">
        <div className="mb-4">
          <h2
            className="text-sm font-bold text-white uppercase tracking-widest"
            style={{ fontFamily: HEADING_FONT_FAMILY }}
          >
            Department User Seats
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLoading ? 'Loading…' : `${used} of ${maxAllowed} seats used.`}
          </p>
        </div>

        {!isLoading && holders.length === 0 && (
          <p className="text-xs text-slate-500">
            No department users yet. Use the form below to invite one.
          </p>
        )}

        {actionError && (
          <p className="mb-3 text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded">
            {actionError}
          </p>
        )}

        {holders.length > 0 && (
          <ul className="divide-y divide-slate-700">
            {holders.map((holder) => {
              const isInactive = holder.status === 'inactive';
              const assignedName = agencyNameById(holder.assignedAgencyId);
              return (
                <li key={holder._id} className="py-3 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${isInactive ? 'text-slate-500' : 'text-white'}`}>
                        {holder.fullName || holder.email}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5" />
                        {holder.email}
                      </p>
                      {holder.title && (
                        <p className="text-xs text-slate-500 mt-0.5">{holder.title}</p>
                      )}
                      {assignedName && (
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
                            : holder.isConfirmed
                              ? 'text-emerald-400 border border-emerald-400/40'
                              : 'text-amber-400 border border-amber-400/40'
                        }`}
                      >
                        {isInactive ? (
                          'Disabled'
                        ) : holder.isConfirmed ? (
                          <><BadgeCheck className="w-3 h-3" /> Active</>
                        ) : (
                          <><Clock className="w-3 h-3" /> Pending</>
                        )}
                      </span>

                      <button
                        type="button"
                        title={isInactive ? 'Activate' : 'Deactivate'}
                        onClick={() => handleToggleStatus(holder._id, holder.status)}
                        className={`p-1.5 rounded border transition-colors ${
                          isInactive
                            ? 'text-emerald-400 border-emerald-400/40 hover:bg-emerald-400/10'
                            : 'text-amber-400 border-amber-400/40 hover:bg-amber-400/10'
                        }`}
                      >
                        {isInactive ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                      </button>

                      {!holder.isConfirmed && (
                        <button
                          type="button"
                          title={resendSuccessId === holder._id ? 'Invite sent!' : 'Resend invite'}
                          disabled={resendingId === holder._id}
                          onClick={() => handleResendInvite(holder._id)}
                          className={`p-1.5 rounded border transition-colors disabled:opacity-50 ${
                            resendSuccessId === holder._id
                              ? 'text-emerald-400 border-emerald-400/40'
                              : 'text-sky-400 border-sky-400/40 hover:bg-sky-400/10'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {confirmDeleteId === holder._id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(holder._id)}
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
                          title="Remove department user"
                          onClick={() => setConfirmDeleteId(holder._id)}
                          className="p-1.5 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Agency assignment row */}
                  {agencies.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap ml-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-xs text-slate-500">Agency:</span>
                      <select
                        value={holder.assignedAgencyId ?? ''}
                        disabled={assigningId === holder._id}
                        onChange={(e) => handleAssignAgency(holder._id, e.target.value || null)}
                        className="text-xs bg-slate-700 border border-slate-600 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-slate-400 disabled:opacity-50"
                      >
                        <option value="">— Unassigned —</option>
                        {agencies.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                      {assigningId === holder._id && (
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

      {/* INVITE FORM */}
      {formStatus.error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded">
          {formStatus.error}
        </div>
      )}
      {formStatus.success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded">
          {formStatus.success}
        </div>
      )}

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
              Invite Department User
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
                placeholder="dept@youragency.gov"
                helpText="Used for the invite and future sign-in."
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={errorOf('email')}
              />
              <TextField
                name="title"
                label="Typical Title"
                placeholder="Department Head or equivalent"
                helpText="Optional. Free-form rank or role."
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={errorOf('title')}
              />

              {agencies.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Assign Department Agency
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
                  <p className="text-xs text-slate-500">
                    This user will manage the selected agency&apos;s department.
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
              {isSubmitting ? 'Sending invite…' : 'Send Invite'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center text-slate-400 text-sm">
          All {maxAllowed} department user seats are in use.
        </div>
      )}
    </div>
  );
}
