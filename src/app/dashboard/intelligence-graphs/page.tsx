'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { ScenarioChart, MetricsLayeredChart } from '@/components/charts';

const operationalHealthData = [
  { month: 'Jan', actual: 62, noChange: 62, intervention: 62 },
  { month: 'Feb', actual: 59, noChange: 60, intervention: 62 },
  { month: 'Mar', actual: 56, noChange: 58, intervention: 64 },
  { month: 'Apr', actual: 52, noChange: 55, intervention: 66 },
  { month: 'May', actual: 55, noChange: 52, intervention: 70 },
  { month: 'Jun', actual: 60, noChange: 48, intervention: 75 },
];

const allMetricsData = [
  { month: 'Jan', health: 62, healthIntervention: 62, burnout: 48, burnoutNoChange: 48 },
  { month: 'Feb', health: 59, healthIntervention: 62, burnout: 51, burnoutNoChange: 50 },
  { month: 'Mar', health: 56, healthIntervention: 64, burnout: 55, burnoutNoChange: 52 },
  { month: 'Apr', health: 52, healthIntervention: 66, burnout: 62, burnoutNoChange: 58 },
  { month: 'May', health: 55, healthIntervention: 70, burnout: 58, burnoutNoChange: 65 },
  { month: 'Jun', health: 60, healthIntervention: 75, burnout: 52, burnoutNoChange: 72 },
  { month: 'Jul', health: 65, healthIntervention: 80, burnout: 45, burnoutNoChange: 78 },
  { month: 'Aug', health: 70, healthIntervention: 82, burnout: 42, burnoutNoChange: 80 },
  { month: 'Sep', health: 72, healthIntervention: 83, burnout: 40, burnoutNoChange: 82 },
  { month: 'Oct', health: 75, healthIntervention: 84, burnout: 38, burnoutNoChange: 83 },
  { month: 'Nov', health: 78, healthIntervention: 85, burnout: 35, burnoutNoChange: 84 },
  { month: 'Dec', health: 80, healthIntervention: 86, burnout: 33, burnoutNoChange: 85 },
];

const burnoutRiskData = [
  { month: 'Jan', actual: 48, noChange: 48, intervention: 48 },
  { month: 'Feb', actual: 51, noChange: 50, intervention: 48 },
  { month: 'Mar', actual: 55, noChange: 52, intervention: 45 },
  { month: 'Apr', actual: 62, noChange: 58, intervention: 42 },
  { month: 'May', actual: 58, noChange: 65, intervention: 38 },
  { month: 'Jun', actual: 52, noChange: 72, intervention: 35 },
];

const retentionStabilityData = [
  { month: 'Jan', actual: 78, noChange: 78, intervention: 78 },
  { month: 'Feb', actual: 76, noChange: 77, intervention: 79 },
  { month: 'Mar', actual: 74, noChange: 75, intervention: 80 },
  { month: 'Apr', actual: 71, noChange: 72, intervention: 82 },
  { month: 'May', actual: 72, noChange: 68, intervention: 85 },
  { month: 'Jun', actual: 75, noChange: 63, intervention: 88 },
];

export default function IntelligenceGraphsPage() {
  const [activeTab, setActiveTab] = useState('operational-health');

  const tabButtons = [
    { id: 'operational-health', label: 'OPERATIONAL HEALTH' },
    { id: 'burnout-risk', label: 'BURNOUT RISK INDEX' },
    { id: 'retention-stability', label: 'RETENTION STABILITY' },
  ];

  return (
    <div className="px-7 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
          Intelligence Graphs
        </h1>
        <p className="text-sm ">
          Scenario comparison – actual vs projected. Toggle layers. Compare all metrics.
        </p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {tabButtons.map(tab => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            buttonClassName={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors ${activeTab === tab.id
              ? 'bg-(--accent) text-slate-950'
              : 'bg-transparent border border-slate-700 text-gray-300 hover:border-slate-600'
              }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'operational-health' && (
        <ScenarioChart
          data={operationalHealthData}
          title="Scenario Comparison – Operational Health"
          description="Overall 5-domain health score. Solid = historical. Dashed = projections."
        />
      )}

      {activeTab === 'burnout-risk' && (
        <ScenarioChart
          data={burnoutRiskData}
          title="Scenario Comparison – Burnout Risk Index"
          description="Burnout risk trajectory. Higher = more at-risk. Solid = historical. Dashed = projections."
        />
      )}

      {activeTab === 'retention-stability' && (
        <ScenarioChart
          data={retentionStabilityData}
          title="Scenario Comparison – Retention Stability"
          description="Retention rates over time. Higher = more stable workforce. Solid = historical. Dashed = projections."
        />
      )}

      <MetricsLayeredChart
        data={allMetricsData}
        title="All Three Metrics – Layered Comparison"
        description="Health Score, Burnout Risk, and Retention overlaid."
      />
    </div>
  );
}

