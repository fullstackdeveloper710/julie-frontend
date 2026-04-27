'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui';

interface AlertConfig {
  id: string;
  label: string;
  description: string;
  threshold: number;
  enabled: boolean;
}

const DEFAULT_ALERTS: AlertConfig[] = [
  { id: 'health-score', label: 'Overall Health Score drops below', description: '', threshold: 50, enabled: true },
  { id: 'fatigue', label: 'Fatigue Resistance score drops below', description: '', threshold: 45, enabled: true },
  { id: 'fmla', label: 'FMLA rate exceeds', description: '', threshold: 6, enabled: true },
  { id: 'peer-support', label: 'Peer support readiness drops below', description: '', threshold: 40, enabled: false },
  { id: 'vacancy', label: 'Vacancy rate exceeds', description: '', threshold: 20, enabled: true },
  { id: 'morale', label: 'Morale rating drops below', description: '', threshold: 4, enabled: false },
];

export default function AlertSystemPage() {
  const [alerts, setAlerts] = useState<AlertConfig[]>(DEFAULT_ALERTS);
  const [email, setEmail] = useState('');

  const handleAlertToggle = (id: string) => {
    setAlerts(alerts.map(alert => (alert.id === id ? { ...alert, enabled: !alert.enabled } : alert)));
  };

  const handleThresholdChange = (id: string, value: number) => {
    setAlerts(alerts.map(alert => (alert.id === id ? { ...alert, threshold: value } : alert)));
  };

  const handleSaveEmail = () => {
    console.log('Saving email:', email);
  };

  return (
    <div className="px-7 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-4xl font-black text-white mb-1"
          style={{ fontFamily: '\"Barlow Condensed\", sans-serif', letterSpacing: '0.03em' }}
        >
          Custom Alert System
        </h1>
        <p className="text-sm">
          Configure thresholds that trigger notifications when your agency's metrics cross critical levels.
        </p>
      </div>

      <div className="bg-slate-800 border-t-4 border-t-(--accent) border border-slate-700 rounded-lg p-6 mb-5">
        <h2
          className="text-xs font-black uppercase tracking-widest text-(--accent) mb-1"
          style={{ fontFamily: '\"Barlow Condensed\", sans-serif' }}
        >
          Alert Configuration
        </h2>
        <p className="text-xs mb-4">
          Toggle alerts on/off and set your threshold values. Alerts are evaluated each time a check-in is submitted.
        </p>

        <div className="space-y-0 divide-y divide-slate-700">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-4 py-4 flex-wrap">
              <input
                type="checkbox"
                checked={alert.enabled}
                onChange={() => handleAlertToggle(alert.id)}
                className="w-4 h-4 accent-(--accent) cursor-pointer"
              />

              <div className={`flex-1 min-w-48 text-sm ${alert.enabled ? 'text-white' : 'text-slate-500'}`}>
                {alert.label}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name={`threshold-${alert.id}`}
                  value={alert.threshold}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleThresholdChange(alert.id, Number(e.target.value))}
                  disabled={!alert.enabled}
                  containerClassName=""
                  inputClassName={`w-16 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white text-sm text-center focus:outline-none focus:border-(--accent) transition-colors ${!alert.enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                />
                <span className="text-xs text-slate-500">threshold</span>
              </div>

              <div className="min-w-20">
                {alert.enabled ? (
                  <span className="inline-block text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                ) : (
                  <span className="inline-block text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-slate-700/30 text-slate-500 border border-slate-700">
                    Off
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2
          className="text-xs font-black uppercase tracking-widest text-(--accent) mb-1"
          style={{ fontFamily: '\"Barlow Condensed\", sans-serif' }}
        >
          Notification Email
        </h2>
        <p className="text-xs mb-4">
          Enter the email address where alert notifications should be sent when thresholds are triggered.
        </p>

        <div className="flex gap-3 items-center mb-3 flex-wrap">
          <input
            type="email"
            placeholder="command@youragency.gov"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-80 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white text-sm placeholder-slate-600 focus:outline-none focus:border-(--accent) transition-colors"
          />
          <Button
            onClick={handleSaveEmail}
            buttonClassName="px-6 py-2 bg-(--accent) hover:bg-orange-600 text-slate-950 font-bold text-xs uppercase tracking-widest rounded transition-colors"
            style={{ fontFamily: '\"Barlow Condensed\", sans-serif' }}
          >
            Save Email
          </Button>
        </div>

        <p className="text-xs text-slate-500">
          In the production version, alerts will be delivered via automated email when a check-in submission triggers any active threshold.
        </p>
      </div>
    </div>
  );
}
