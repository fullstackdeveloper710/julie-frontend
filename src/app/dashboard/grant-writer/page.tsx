'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

const GRANT_PROGRAMS = [
  'COPS Office – Community Policing Development Grant',
  'BJA – Justice and Mental Health Collaboration Program',
  'FEMA – Staffing for Adequate Fire & Emergency Response (SAFER)',
  'SAMHSA – First Responder Mental Health',
  'Local / State Workforce Development Fund',
  'Public Safety Wellness Initiative Grant',
  'Other / General Workforce Development',
];

export default function GrantWriterPage() {
  const [grantProgram, setGrantProgram] = useState('');
  const [purpose, setPurpose] = useState('');
  const [generating, setGenerating] = useState(false);
  const hasRecentCheckIn = true;

  const handleGenerate = async () => {
    setGenerating(true);
    console.log('Generating grant language for:', { grantProgram, purpose });
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="px-7 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-4xl font-black text-white mb-1"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.03em' }}
        >
          Grant Writing Assistant
        </h1>
        <p className="text-sm ">
          AI-generated grant language using your agency's operational data to justify funding needs.
        </p>
      </div>

      <div className="bg-slate-800 border-t-4 border-t-emerald-500 border border-slate-700 rounded-lg p-6 mb-5">
        <h2
          className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1"
          style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
        >
          Configure Your Grant Request
        </h2>
        <p className="text-xs  mb-5">
          Select the grant type and the platform will generate tailored justification language using your operational metrics.
        </p>

        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">Grant Program / Funding Source</label>
            <select
              value={grantProgram}
              onChange={e => setGrantProgram(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Select grant program…</option>
              {GRANT_PROGRAMS.map(program => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">
              Primary Purpose / What Funding Will Cover (Optional)
            </label>
            <textarea
              rows={2}
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="e.g. Fund Leadership Sustainability Training and Peer Support Foundations Training for 85 sworn officers and supervisors…"
              className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded px-3 py-2 mb-5">
          <p className="text-xs text-amber-400">
            <span className="font-semibold">Tip:</span> Submit a Monthly Check-In first so the platform can reference your actual operational data in the grant language — this significantly strengthens the application.
          </p>
        </div>

        <hr className="border-t border-slate-700 mb-5" />

        <Button
          onClick={handleGenerate}
          disabled={!grantProgram || generating || !hasRecentCheckIn}
          buttonClassName="w-full sm:w-auto px-6 py-3 bg-(--accent) hover:bg-orange-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-500 font-bold text-xs uppercase tracking-widest rounded transition-colors"
          style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
        >
          {generating ? 'Generating…' : 'Generate Grant Language →'}
        </Button>

        {!hasRecentCheckIn && (
          <p className="text-xs text-slate-500 mt-3">
            Submit a Monthly Check-In to unlock AI grant language generation
          </p>
        )}
      </div>
    </div>
  );
}

