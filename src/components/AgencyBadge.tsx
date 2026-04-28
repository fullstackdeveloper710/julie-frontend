import Link from 'next/link';
import { Building2, ChevronDown, Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui';
import { HEADING_FONT } from '@/utils/constant';

type AgencyBadgeProps = {
  isEnterprise: boolean;
  selected: { _id: string; name: string };
  agencies: Array<{ _id: string; name: string }>;
  canCreateMore: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onSwitch: (agencyId: string) => void;
};

function AgencyBadge({
  isEnterprise,
  selected,
  agencies,
  canCreateMore,
  isOpen,
  onToggle,
  onSwitch,
}: AgencyBadgeProps) {
  // Standard plan: render a static badge with the single agency name. No dropdown.
  if (!isEnterprise) {
    return (
      <Link
        href="/dashboard/agencies"
        className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors max-w-56"
        title={selected.name}
      >
        <Building2 className="w-4 h-4 text-(--accent)" />
        <span
          className="text-xs text-slate-200 font-semibold truncate uppercase"
          style={{ fontFamily: HEADING_FONT }}
        >
          {selected.name}
        </span>
      </Link>
    );
  }

  // Enterprise plan: dropdown with switcher + Add Agency.
  return (
    <div className="relative">
      <Button
        onClick={onToggle}
        buttonClassName="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors max-w-56"
        title={selected.name}
      >
        <Building2 className="w-4 h-4 text-(--accent)" />
        <span
          className="text-xs text-slate-200 font-semibold truncate uppercase"
          style={{ fontFamily: HEADING_FONT }}
        >
          {selected.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
          <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-700">
            Switch agency
          </p>
          {agencies.map((agency) => {
            const isCurrent = agency._id === selected._id;
            return (
              <button
                key={agency._id}
                type="button"
                onClick={() => onSwitch(agency._id)}
                disabled={isCurrent}
                className={`w-full text-left px-4 py-2 text-sm transition-colors uppercase ${
                  isCurrent
                    ? 'text-(--accent) font-semibold bg-slate-700/40 cursor-default'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-(--accent)'
                }`}
              >
                <span className="truncate block ">{agency.name}</span>
              </button>
            );
          })}
          <div className="border-t border-slate-700 mt-1 pt-1">
            {canCreateMore && (
              <Link
                href="/dashboard/agency-setup?mode=add"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-(--accent) transition-colors uppercase"
              >
                <Plus className="w-4 h-4" />
                Add Agency
              </Link>
            )}
            <Link
              href="/dashboard/agencies"
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-(--accent) transition-colors uppercase"
            >
              <Pencil className="w-4 h-4" />
              Manage {isEnterprise ? 'Agencies': 'Agency'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgencyBadge;
