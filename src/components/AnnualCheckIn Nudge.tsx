import { useGetAnnualCheckInStatusQuery } from "@/hooks";
import { useGetCurrentUserQuery } from "@/redux/api/authApi";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { USER_ROLE } from "@/types/enums";
import Link from "next/link";

function AnnualCheckinNudge() {
  const { data: userResp } = useGetCurrentUserQuery();
  const isAdmin = [USER_ROLE.MANAGER, USER_ROLE.DEPARTMENT_USER].includes(userResp?.data?.role as USER_ROLE);
  const { data: statusResp } = useGetAnnualCheckInStatusQuery(undefined, { skip: isAdmin });
  const status = statusResp?.data;

  if (isAdmin || !status?.canSubmit) return null;

  return (
    <div className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/5 px-5 py-4 flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-3">
        <CalendarCheck className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-300">
            Complete your {new Date().getUTCFullYear()} Annual Check-In
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            The Annual Baseline drives your AI reports and analytics. It takes about 5 minutes and
            is required once per year.
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/annual-checkin"
        className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors border border-amber-500/30"
      >
        Start now
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default AnnualCheckinNudge