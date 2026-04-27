'use client';

import { useState } from 'react';
import { EmptyState } from '@/components/ui';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const [hasData, setHasData] = useState(false);

  return (
    <div className="px-7 py-8 max-w-6xl mx-auto">
      {hasData ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
              <BarChart3 className="w-8 h-8" />
              Analytics
            </h1>
            <p className="text-sm">Comprehensive analytics and metrics</p>
          </div>

          <div className="grid grid-cols-1 gap-6">

          </div>
        </>
      ) : (
        <EmptyState
          title="No Analytics Data Available"
          description="Start by submitting monthly check-ins to see analytics and trends"
          icon="📊"
          layout="centered"
        />
      )}
    </div>
  );
}
