'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TabType =
  | 'dashboard'
  | 'annual-checkin'
  | 'monthly-checkin'
  | 'intelligence-graphs'
  | 'fmla-ot-patterns'
  | 'alert-system'
  | 'peer-benchmarking'
  | 'grant-writer'
  | 'intelligence-report';

const TABS: { id: TabType; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'annual-checkin', label: 'Annual Check-In' },
  { id: 'monthly-checkin', label: 'Monthly Check-In' },
  { id: 'intelligence-graphs', label: 'Intelligence Graphs' },
  { id: 'fmla-ot-patterns', label: 'FMLA & OT Patterns' },
  { id: 'peer-benchmarking', label: 'Peer Benchmarking' },
  { id: 'grant-writer', label: 'Grant Writer' },
  { id: 'intelligence-report', label: 'Intelligence Report' },
  { id: 'alert-system', label: 'Alert System' },
];

export function Tabs() {
  const pathname = usePathname();

  const isActiveTab = (tabId: TabType) => {
    if (tabId === 'dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname === `/dashboard/${tabId}`;
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 overflow-x-auto">
      <div className="flex px-7 gap-1">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.id === 'dashboard' ? '/dashboard' : `/dashboard/${tab.id}`}
            className={`px-4 py-4 border-b-4 text-sm font-semibold transition-colors whitespace-nowrap ${
              isActiveTab(tab.id)
                ? 'border-b-(--accent) text-(--accent)'
                : 'border-b-transparent  hover:border-b-(--accent) hover:text-(--accent)'
            }`}
            style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
