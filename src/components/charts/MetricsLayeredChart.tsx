'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CustomTooltip from '../common/CustomTooltip';

interface MetricsLayeredChartProps {
  data: any[];
  title: string;
  description: string;
  height?: number;
}

export function MetricsLayeredChart({
  data,
  title,
  description,
  height = 350,
}: MetricsLayeredChartProps) {
  return (
    <div className="bg-slate-800 border border-t-4 border-t-(--accent) border-slate-700 rounded-lg p-6">
      <div className="mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-(--accent) uppercase tracking-widest mb-1">
          {title}
        </h2>
        <p className="text-xs">{description}</p>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBurnout" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area
            type="monotone"
            dataKey="health"
            stroke="#ff6b35"
            fillOpacity={1}
            fill="url(#colorHealth)"
            name="Health (Actual)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="healthIntervention"
            stroke="#10b981"
            fillOpacity={0.1}
            fill="none"
            strokeDasharray="5 5"
            name="Health (Intervention)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="burnout"
            stroke="#ff6b35"
            fillOpacity={0}
            strokeDasharray="5 5"
            name="Burnout (No Change)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
