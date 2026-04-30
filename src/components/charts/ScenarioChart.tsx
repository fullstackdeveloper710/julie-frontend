'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CustomTooltip from '../common/CustomTooltip';

interface Props {
  data: any[];
  title: string;
  description: string;
  height?: number;
  yAxisDomain?: [number, number];
}

export function ScenarioChart({
  data,
  title,
  description,
  height = 350,
  yAxisDomain = [0, 100],
}: Props) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
      <div className="mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-xl font-bold text-(--accent) uppercase tracking-widest mb-1">
          {title}
        </h2>
        <p className="text-xs ">{description}</p>
      </div>

      <div className="flex gap-4 mb-6 text-xs flex-wrap">
        <label className="flex items-center gap-2 text-slate-300">
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-(--accent)" />
          <span>Actual / Historical</span>
        </label>
        <label className="flex items-center gap-2 text-slate-300">
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-(--accent)" />
          <span>No-Change Projection</span>
        </label>
        <label className="flex items-center gap-2 text-slate-300">
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-(--accent)" />
          <span>With Intervention</span>
        </label>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={yAxisDomain} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#ff6b35"
            strokeWidth={2}
            dot={{ fill: '#ff6b35', r: 4 }}
            name="Actual / Historical"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="noChange"
            stroke="#ff6b35"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="No-Change Projection"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="intervention"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="With Intervention"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
