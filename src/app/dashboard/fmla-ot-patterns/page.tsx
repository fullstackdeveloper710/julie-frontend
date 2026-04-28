'use client';

import { useState } from 'react';
import { Card, CardTitle, EmptyState } from '@/components/ui';

export default function FmlaOtPatternsPage() {
  const [hasData, setHasData] = useState(false);

  return (
    <div className="px-7 py-8 max-w-6xl mx-auto">
      {hasData ? (
        <>
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
            >
              FMLA & OT Patterns
            </h1>
            <p className="text-sm ">Family and Medical Leave Act usage and overtime analysis</p>
          </div>

          <Card>
            <CardTitle>Pattern Analysis</CardTitle>
            <div className="mt-6 text-center py-12">
              <p className="">
                FMLA and overtime patterns will display here once sufficient data is collected
              </p>
            </div>
          </Card>
        </>
      ) : (
        <EmptyState
          icon="📋"
          title="No Data Yet"
          description="Submit a Monthly Check-In to activate FMLA pattern analysis."
        />
      )}
    </div>
  );
}
