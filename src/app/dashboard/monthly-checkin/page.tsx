'use client';

import { useState, useEffect } from 'react';
import { CalendarCheck, Pencil, Lock, Clock, ShieldOff } from 'lucide-react';
import {
  useGetMonthlyCheckInStatusQuery,
  useGetCurrentMonthlyCheckInQuery,
  useAppSelector,
} from '@/hooks';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';
import { USER_ROLE } from '@/types/enums';
import { MonthlyCheckInForm } from '@/components/forms/MonthlyCheckInForm';
import { HEADING_FONT_FAMILY } from '@/components/forms/checkins/shared/styles';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1" style={{ fontFamily: HEADING_FONT_FAMILY }}>
    {children}
  </p>
);

const FieldRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <div className="py-2 border-b border-slate-700/60 last:border-0">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="text-sm text-slate-200 mt-0.5">{value ?? '—'}</p>
  </div>
);

function MonthlyReadOnly({
  record,
  canEdit,
  editsRemaining,
  onEditClick,
  isReadOnly = false,
}: {
  record: Record<string, any>;
  canEdit: boolean;
  editsRemaining: number;
  onEditClick: () => void;
  isReadOnly?: boolean;
}) {
  const checkinMonth = record.checkinMonth
    ? new Date(record.checkinMonth).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : '—';

  const nextMonth = record.checkinMonth
    ? (() => {
        const d = new Date(record.checkinMonth);
        d.setUTCMonth(d.getUTCMonth() + 1);
        return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      })()
    : '—';

  const os = record.organizationalStability ?? {};
  const or_ = record.operationalResilience ?? {};
  const fr = record.fatigueResistance ?? {};
  const ps = record.peerSupportReadiness ?? {};
  const ls = record.leadershipSustainability ?? {};

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3" style={{ fontFamily: HEADING_FONT_FAMILY }}>
            <CalendarCheck className="w-7 h-7 text-emerald-400" />
            {checkinMonth} Monthly Check-In
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {record.createdAt && !isNaN(new Date(record.createdAt).getTime())
              ? `Submitted ${new Date(record.createdAt).toLocaleDateString()}`
              : 'Submitted'}
            {record.editCount > 0 && ` · edited ${record.editCount} time${record.editCount > 1 ? 's' : ''}`}
          </p>
          {!isReadOnly && !canEdit && (
            <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              Next edit available <span className="text-slate-400 font-medium ml-1">{nextMonth}</span>
            </p>
          )}
        </div>

        {isReadOnly ? (
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
            Edit limit reached for this month
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <SectionLabel>Organizational Stability</SectionLabel>
          <FieldRow label="Currently Filled Positions" value={os.currentlyFilledPositions} />
          <FieldRow label="Current Vacancies" value={os.currentVacancies} />
          <FieldRow label="Resignations This Month" value={os.resignationsThisMonth} />
          <FieldRow label="New Hires & Academy Graduates" value={os.newHiresAndAcademyGraduates} />
          <FieldRow label="Avg. Time to Fill (days)" value={os.averageTimeToFillDays} />
          <FieldRow label="Leadership Level Vacancies" value={os.leadershipLevelVacancies} />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <SectionLabel>Operational Resilience</SectionLabel>
          <FieldRow label="Total Overtime Hours" value={or_.totalOvertimeHours} />
          <FieldRow label="Avg. Shift Length (hours)" value={or_.averageShiftLengthHours} />
          <FieldRow label="Shift Coverage Shortages" value={or_.shiftCoverageShortages} />
          <FieldRow label="Mandatory OT %" value={or_.mandatoryOvertimePercentage} />
          <FieldRow label="Planned OT %" value={or_.plannedOvertimePercentage} />
          <FieldRow label="Unplanned OT %" value={or_.unplannedOvertimePercentage} />
          <FieldRow label="Call-In & Holdover Incidents" value={or_.callInAndHoldoverIncidents} />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <SectionLabel>Fatigue & Peer Support</SectionLabel>
          <FieldRow label="Total Sick Leave Days Used" value={fr.totalSickLeaveDaysUsed} />
          <FieldRow label="Employees on FMLA Leave" value={ps.employeesOnFmlaLeave} />
          <FieldRow label="New FMLA Requests" value={ps.newFmlaRequests} />
          <FieldRow label="Workers' Comp Claims Filed" value={ps.workersCompClaimsFiled} />
          <FieldRow label="Peer Support Activations" value={ps.peerSupportActivations} />
          <FieldRow label="Critical Incident Exposures" value={ps.criticalIncidentExposures} />
          <FieldRow label="Line-of-Duty Deaths / Serious Injuries" value={ps.lineOfDutyDeathsOrSeriousInjuries} />
          {ps.lineOfDutyDeathsOrSeriousInjuries === 'Yes' && (
            <FieldRow label="Count" value={ps.lineOfDutyDeathsOrSeriousInjuriesCount} />
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <SectionLabel>Leadership Sustainability</SectionLabel>
          <FieldRow label="Leadership Morale Rating" value={ls.leadershipMoraleRating} />
          <FieldRow label="Frontline Morale Rating" value={ls.frontlineMoraleRating} />
          <FieldRow label="Disciplinary Actions" value={ls.disciplinaryActions} />
          <FieldRow label="Formal Grievances Filed" value={ls.formalGrievancesFiled} />
          <FieldRow label="Promotions / Leadership Development" value={ls.promotionsOrLeadershipDevelopmentCount} />
          <FieldRow label="Data Confidence" value={record.dataConfidence} />
        </div>
      </div>

      {record.optional && (() => {
        const bf = record.optional.budgetAndFiscalContext ?? {};
        const od = record.optional.operationalDemandContext ?? {};
        const fp = record.optional.fatiguePrecisionInputs ?? {};
        const pd = record.optional.peerSupportDepthInputs ?? {};
        const hasOptional = [bf, od, fp, pd].some((s) => Object.keys(s).length > 0);
        if (!hasOptional) return null;
        return (
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3" style={{ fontFamily: HEADING_FONT_FAMILY }}>
              Optional Data
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {Object.keys(bf).length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                  <SectionLabel>Budget & Fiscal Context</SectionLabel>
                  {bf.overtimeBudgetUtilizationPercentage !== undefined && <FieldRow label="OT Budget Utilization %" value={bf.overtimeBudgetUtilizationPercentage} />}
                  {bf.hiringBudgetAvailability && <FieldRow label="Hiring Budget Availability" value={bf.hiringBudgetAvailability} />}
                  {bf.staffingBudgetConstraint && <FieldRow label="Staffing Budget Constraint" value={bf.staffingBudgetConstraint} />}
                </div>
              )}
              {Object.keys(od).length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                  <SectionLabel>Operational Demand Context</SectionLabel>
                  {od.totalCallsOrIncidents !== undefined && <FieldRow label="Total Calls / Incidents" value={od.totalCallsOrIncidents} />}
                  {od.responseTimeStandardsMet && <FieldRow label="Response Time Standards Met" value={od.responseTimeStandardsMet} />}
                  {od.specialtyUnitVacancies !== undefined && <FieldRow label="Specialty Unit Vacancies" value={od.specialtyUnitVacancies} />}
                </div>
              )}
              {Object.keys(fp).length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                  <SectionLabel>Fatigue Precision Inputs</SectionLabel>
                  {fp.minimumRestPeriodRequirementMet && <FieldRow label="Min Rest Period Requirement Met" value={fp.minimumRestPeriodRequirementMet} />}
                  {fp.ptoVacationAccrualBacklog && <FieldRow label="PTO / Vacation Accrual Backlog" value={fp.ptoVacationAccrualBacklog} />}
                  {fp.returnToDutyIncidentsBeforeFullRecovery !== undefined && <FieldRow label="Return-to-Duty Before Full Recovery" value={fp.returnToDutyIncidentsBeforeFullRecovery} />}
                </div>
              )}
              {Object.keys(pd).length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                  <SectionLabel>Peer Support Depth</SectionLabel>
                  {pd.eapReferralsOrUtilizations !== undefined && <FieldRow label="EAP Referrals / Utilizations" value={pd.eapReferralsOrUtilizations} />}
                  {pd.topLeadershipConcern && <FieldRow label="Top Leadership Concern" value={pd.topLeadershipConcern} />}
                  {pd.topLeadershipConcernOther && <FieldRow label="Top Leadership Concern (Other)" value={pd.topLeadershipConcernOther} />}
                  {pd.additionalContextOrNotes && <FieldRow label="Additional Notes" value={pd.additionalContextOrNotes} />}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default function MonthlyCheckInPage() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);

  const { data: userResp } = useGetCurrentUserQuery();
  const isReadOnly = [USER_ROLE.MANAGER, USER_ROLE.DEPARTMENT_USER].includes(userResp?.data?.role as USER_ROLE);

  const { data: statusResp, isLoading: isStatusLoading, isFetching: isStatusFetching } = useGetMonthlyCheckInStatusQuery();
  const { data: currentResp, isLoading: isCurrentLoading, isFetching: isCurrentFetching } = useGetCurrentMonthlyCheckInQuery();

  useEffect(() => {
    setMode('view');
  }, [selectedAgencyId]);

  const status = statusResp?.data;
  const currentRecord = (currentResp?.data ?? null) as Record<string, any> | null;

  if (isStatusLoading || isCurrentLoading || isStatusFetching || isCurrentFetching) {
    return (
      <div className="px-7 py-8">
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  if (!isReadOnly && status?.canSubmit) {
    return (
      <div className="px-7 py-8">
        <MonthlyCheckInForm onSuccess={() => {}} />
      </div>
    );
  }

  if (!isReadOnly && mode === 'edit' && status?.canEdit && currentRecord) {
    return (
      <div className="px-7 py-8">
        <button
          type="button"
          onClick={() => setMode('view')}
          className="mb-4 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          ← Back to view
        </button>
        <MonthlyCheckInForm
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
        <MonthlyReadOnly
          record={currentRecord}
          canEdit={status?.canEdit ?? false}
          editsRemaining={editsRemaining}
          onEditClick={() => setMode('edit')}
          isReadOnly={isReadOnly}
        />
      </div>
    );
  }

  return (
    <div className="px-7 py-8">
      <p className="text-sm text-slate-400">
        {isReadOnly
          ? 'The primary user has not yet submitted a monthly check-in for this month.'
          : 'Your monthly check-in is not available right now.'}
      </p>
    </div>
  );
}
