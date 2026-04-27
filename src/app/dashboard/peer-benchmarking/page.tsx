'use client';

import { useState } from 'react';
import { Card, CardTitle, EmptyState } from '@/components/ui';

export default function PeerBenchmarkingPage() {
  const [hasData, setHasData] = useState(false);

  return (
    <div className="px-7 py-8 max-w-6xl mx-auto">
      {hasData ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
              Peer Benchmarking
            </h1>
            <p className="text-sm ">Compare your metrics against similar departments</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardTitle>Staffing Comparison</CardTitle>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded border border-slate-600">
                  <span className="text-sm text-slate-300">Your Department</span>
                  <span className="text-white font-bold">127 / 145</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded border border-slate-600">
                  <span className="text-sm text-slate-300">Regional Average</span>
                  <span className="text-white font-bold">135 / 150</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded border border-slate-600">
                  <span className="text-sm text-slate-300">National Average</span>
                  <span className="text-white font-bold">142 / 160</span>
                </div>
              </div>
            </Card>

            <Card>
              <CardTitle>Overtime Analysis</CardTitle>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded border border-slate-600">
                  <span className="text-sm text-slate-300">Your Department</span>
                  <span className="text-white font-bold">2,847 hrs</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded border border-slate-600">
                  <span className="text-sm text-slate-300">Regional Average</span>
                  <span className="text-white font-bold">3,120 hrs</span>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <EmptyState
          icon="📊"
          title="Peer Agency Benchmarking"
          description="How your agency compares to national averages for Law Enforcement agencies. All peer data is anonymized aggregate."
          subtitle="Benchmarks represent aggregated national averages for Law Enforcement agencies. In the production platform, benchmarks update as more agencies submit data — making comparisons increasingly precise over time."
          layout="default"
        >
          <div className="text-white font-condensed font-bold text-lg mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
            Submit a Check-In First
          </div>
          <div className=" text-sm">
            Your agency data is needed to generate a peer comparison.
          </div>
        </EmptyState>
      )}
    </div>
  );
}
