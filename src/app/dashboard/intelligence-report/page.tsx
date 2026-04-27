'use client';

import { useState } from 'react';
import { Card, CardTitle, EmptyState } from '@/components/ui';

export default function IntelligenceReportPage() {
  const [hasData, setHasData] = useState(false);

  return (
    <div className="px-7 py-8 max-w-6xl mx-auto">
      {hasData ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
              Intelligence Report
            </h1>
            <p className="text-sm ">Comprehensive workforce intelligence and insights</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardTitle>Executive Summary</CardTitle>
              <div className="mt-4 p-4 bg-slate-700 rounded border border-slate-600">
                <p className="text-slate-300 text-sm leading-relaxed">
                  This report provides comprehensive workforce intelligence covering staffing patterns,
                  overtime trends, FMLA utilization, and comparative benchmarking against peer departments.
                </p>
              </div>
            </Card>

            <Card>
              <CardTitle>Key Metrics</CardTitle>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-700 rounded border border-slate-600">
                  <p className="text-xs  uppercase">Current Staffing</p>
                  <p className="text-xl font-bold text-white mt-1">127 / 145</p>
                </div>
                <div className="p-3 bg-slate-700 rounded border border-slate-600">
                  <p className="text-xs  uppercase">Overtime Hours</p>
                  <p className="text-xl font-bold text-white mt-1">2,847</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <EmptyState
          icon="📋"
          title="No Data Available"
          description="Complete at least one Monthly Check-In to generate an Intelligence Report."
        />
      )}
    </div>
  );
}
