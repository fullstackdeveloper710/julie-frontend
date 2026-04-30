'use client';

import { useState } from 'react';
import { CalendarCheck, ChevronRight, Pencil, Lock, Eye, Clock, ShieldOff } from 'lucide-react';
import {
  useGetAnnualCheckInStatusQuery,
  useGetCurrentAnnualCheckInQuery,
  useGetMyAnnualCheckInsQuery,
} from '@/hooks';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';
import { USER_ROLE } from '@/types/enums';
import { AnnualCheckInForm } from '@/components/forms/checkins/annual';
import { HEADING_FONT_FAMILY } from '@/components/forms/checkins/shared/styles';
import type { AnnualCheckInRecord } from '@/redux/api/checkinApi';
import { formatYear } from '@/utils/methods';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1"
    style={{ fontFamily: HEADING_FONT_FAMILY }}
  >
    {children}
  </p>
);

const FieldRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <div className="py-2 border-b border-slate-700/60 last:border-0">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-sm text-slate-200 mt-0.5">{value ?? '—'}</p>
  </div>
);

function AnnualCheckinReadOnly({
  record,
  canEdit,
  editsRemaining,
  onEditClick,
  isAdmin = false,
}: {
  record: AnnualCheckInRecord;
  canEdit: boolean;
  editsRemaining: number;
  onEditClick: () => void;
  isAdmin?: boolean;
}) {
  const year = formatYear(record.baselineYear);
  const yearNum = typeof year === 'number' ? year : null;
  const nextEditDate = yearNum
    ? new Date(Date.UTC(yearNum + 1, 0, 1)).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-3xl font-bold text-white flex items-center gap-3"
            style={{ fontFamily: HEADING_FONT_FAMILY }}
          >
            <CalendarCheck className="w-7 h-7 text-emerald-400" />
            {year} Annual Check-In
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {record.createdAt && !isNaN(new Date(record.createdAt).getTime())
              ? `Submitted ${new Date(record.createdAt).toLocaleDateString()}`
              : 'Submitted'}
            {record.editCount > 0 &&
              ` · edited ${record.editCount} time${record.editCount > 1 ? 's' : ''}`}
          </p>
          {!isAdmin && !canEdit && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              Next edit available <span className="text-slate-400 font-medium ml-1">{nextEditDate}</span>
            </p>
          )}
        </div>

        {isAdmin ? (
          <span className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-700 px-3 py-2 rounded">
            <ShieldOff className="w-3.5 h-3.5" />
            View only — managed by Primary User
          </span>
        ) : canEdit ? (
          <button
            type="button"
            onClick={onEditClick}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded border border-sky-500/40 text-sky-400 hover:bg-sky-500/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit ({editsRemaining} edit{editsRemaining !== 1 ? 's' : ''} remaining)
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-700 px-3 py-2 rounded">
            <Lock className="w-3.5 h-3.5" />
            Edit limit reached for this year
          </span>
        )}
      </div>

      {/* 2-column grid for the four data cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Agency Identity */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <SectionLabel>Agency Identity</SectionLabel>
          <FieldRow label="Agency Name" value={record.agencyIdentity?.agencyName} />
          <FieldRow label="Agency Type" value={record.agencyIdentity?.agencyType} />
          <FieldRow label="Size Category" value={record.agencyIdentity?.agencySizeCategory} />
          <FieldRow
            label="Primary Service Jurisdiction"
            value={record.agencyIdentity?.primaryServiceJurisdiction}
          />
          <FieldRow
            label="Geographic Coverage Area (sq mi)"
            value={record.agencyIdentity?.geographicCoverageArea}
          />
        </div>

        {/* Structural Staffing Profile */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <SectionLabel>Structural Staffing Profile</SectionLabel>
          <FieldRow
            label="Total Authorized Positions"
            value={record.structuralStaffingProfile?.totalAuthorizedPositions}
          />
          <FieldRow
            label="Total Funded Positions"
            value={record.structuralStaffingProfile?.totalFundedPositions}
          />
          <FieldRow
            label="Minimum Safe Staffing Level"
            value={record.structuralStaffingProfile?.minimumSafeStaffingLevel}
          />
          <FieldRow
            label="Specialty Unit Positions"
            value={record.structuralStaffingProfile?.specialtyUnitPositionsCount}
          />
          <FieldRow
            label="Supervisor-to-Staff Ratio"
            value={record.structuralStaffingProfile?.supervisorToStaffRatio}
          />
        </div>

        {/* Operational Infrastructure */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <SectionLabel>Operational Infrastructure</SectionLabel>
          <FieldRow
            label="Standard Shift Length (hours)"
            value={record.operationalInfrastructure?.standardShiftLengthHours}
          />
          <FieldRow
            label="Shift Schedule Type"
            value={record.operationalInfrastructure?.shiftScheduleType}
          />
          <FieldRow
            label="Minimum Rest Period Policy"
            value={record.operationalInfrastructure?.minimumRestPeriodPolicyExists}
          />
          <FieldRow
            label="Active Peer Support Team"
            value={record.operationalInfrastructure?.activePeerSupportTeam}
          />
          <FieldRow
            label="Employee Assistance Program"
            value={record.operationalInfrastructure?.hasEmployeeAssistanceProgram}
          />
        </div>

        {/* Goals & Strategic Direction */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <SectionLabel>Goals & Strategic Direction</SectionLabel>
          <FieldRow
            label="Primary Annual Goal"
            value={record.goalsAndStrategicDirection?.goal1PrimaryAnnualGoal}
          />
          {record.goalsAndStrategicDirection?.goal1TargetMetric && (
            <FieldRow
              label="Goal 1 Target Metric"
              value={record.goalsAndStrategicDirection.goal1TargetMetric}
            />
          )}
          <FieldRow
            label="Goal 1 Timeframe"
            value={record.goalsAndStrategicDirection?.goal1Timeframe}
          />
          {record.goalsAndStrategicDirection?.goal2SecondaryAnnualGoal && (
            <FieldRow
              label="Secondary Annual Goal"
              value={record.goalsAndStrategicDirection.goal2SecondaryAnnualGoal}
            />
          )}
          {record.goalsAndStrategicDirection?.goal2TargetMetric && (
            <FieldRow
              label="Goal 2 Target Metric"
              value={record.goalsAndStrategicDirection.goal2TargetMetric}
            />
          )}
          {record.goalsAndStrategicDirection?.goal2Timeframe && (
            <FieldRow
              label="Goal 2 Timeframe"
              value={record.goalsAndStrategicDirection.goal2Timeframe}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── past years accordion ────────────────────────────────────────────────────

function PastYearsSection({ records }: { records: AnnualCheckInRecord[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (records.length === 0) return null;

  return (
    <div className="mt-10">
      <h3
        className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"
        style={{ fontFamily: HEADING_FONT_FAMILY }}
      >
        <Eye className="w-4 h-4" />
        Previous Years
      </h3>
      <div className="space-y-2">
        {records.map((r) => {
          const year = formatYear(r.baselineYear);
          const isOpen = expanded === r._id;
          return (
            <div
              key={r._id}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : r._id)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <span className="font-semibold">{year} Annual Check-In</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-slate-700 px-4 pb-4 pt-3 space-y-1">
                  <FieldRow label="Agency Name" value={r.agencyIdentity?.agencyName} />
                  <FieldRow
                    label="Primary Annual Goal"
                    value={r.goalsAndStrategicDirection?.goal1PrimaryAnnualGoal}
                  />
                  <FieldRow
                    label="Goal 1 Timeframe"
                    value={r.goalsAndStrategicDirection?.goal1Timeframe}
                  />
                  <p className="text-xs text-slate-500 pt-1">
                    {r.createdAt && !isNaN(new Date(r.createdAt).getTime())
                      ? `Submitted ${new Date(r.createdAt).toLocaleDateString()}`
                      : 'Submitted'}
                    {r.editCount > 0 && ` · edited ${r.editCount}×`}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnnualCheckInPage() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const { data: userResp } = useGetCurrentUserQuery();
  const isAdmin = [USER_ROLE.MANAGER, USER_ROLE.DEPARTMENT_USER].includes(userResp?.data?.role as USER_ROLE);

  const { data: statusResp, isLoading: isStatusLoading } = useGetAnnualCheckInStatusQuery();
  const { data: currentResp, isLoading: isCurrentLoading } = useGetCurrentAnnualCheckInQuery();
  const { data: allResp } = useGetMyAnnualCheckInsQuery();

  const status = statusResp?.data;
  const currentRecord = (currentResp?.data ?? null) as AnnualCheckInRecord | null;
  const allRecords = (allResp?.data ?? []) as AnnualCheckInRecord[];

  const currentYear = new Date().getUTCFullYear();
  const pastRecords = allRecords.filter(
    (r) => {
      const d = new Date(r.baselineYear);
      return !isNaN(d.getTime()) && d.getUTCFullYear() < currentYear;
    },
  );

  if (isStatusLoading || isCurrentLoading) {
    return (
      <div className="px-7 py-8">
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  // Admin users are always read-only — skip create/edit flows entirely
  if (!isAdmin && status?.canSubmit) {
    return (
      <div className="px-7 py-8">
        <AnnualCheckInForm onSuccess={() => {}} />
        <PastYearsSection records={pastRecords} />
      </div>
    );
  }

  if (!isAdmin && mode === 'edit' && status?.canEdit && currentRecord) {
    return (
      <div className="px-7 py-8">
        <button
          type="button"
          onClick={() => setMode('view')}
          className="mb-4 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          ← Back to view
        </button>
        <AnnualCheckInForm
          editId={status.currentCheckinId ?? undefined}
          initialRecord={currentRecord}
          onSuccess={() => setMode('view')}
        />
      </div>
    );
  }

  if (currentRecord) {
    const editsRemaining = (status?.maxEdits ?? 2) - (status?.editCount ?? 0);
    return (
      <div className="px-7 py-8">
        <AnnualCheckinReadOnly
          record={currentRecord}
          canEdit={status?.canEdit ?? false}
          editsRemaining={editsRemaining}
          onEditClick={() => setMode('edit')}
          isAdmin={isAdmin}
        />
        <PastYearsSection records={pastRecords} />
      </div>
    );
  }

  return (
    <div className="px-7 py-8">
      <p className="text-sm text-slate-400">
        {isAdmin
          ? 'The primary user has not yet submitted an annual baseline.'
          : 'Your annual check-in is not available right now.'}
      </p>
    </div>
  );
}
