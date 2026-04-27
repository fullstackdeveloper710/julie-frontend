'use client';


import { Alert, Input, Button } from '@/components/ui';

import { useState } from 'react';

export default function PlatformDemo() {
  const [formData, setFormData] = useState({
    agencyName: '',
    agencyType: '',
    totalPersonnel: '',
    filled: '',
    otHours: '',
    resignations: '',
    trainingHours: '',
    morale: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">



      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="font-bold text-xs tracking-widest text-(--accent) uppercase mb-3">
            Interactive Demo
          </div>
          <h2 className="font-bold text-4xl text-white mb-4 leading-tight">
            See It In Action
          </h2>
          <p className="leading-relaxed max-w-2xl mb-12">
            Enter a few key metrics below and see how the platform scores your agency's operational health in real time.
          </p>


          <Alert className="mb-8 bg-red-500/10 border border-red-500/30">
            <div className="text-sm text-red-400">
              <div className="font-bold mb-1">Founding Tier Alert</div>
              <div>
                Founding spots are limited to 20 agencies; confirmation is on a first-come, first-served basis.
              </div>
            </div>
          </Alert>


          <div className="bg-slate-800 agencyForm border-t-4 border-t-(--accent) border-slate-700 rounded-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="font-bold text-lg text-white">Agency Quick-Scan Demo</h3>
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded">
                ● Live Scoring
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                name="agencyName"
                label="Agency Name"
                placeholder="e.g. Springfield Police Dept"
                value={formData.agencyName}
                onChange={handleChange}
                containerClassName="flex flex-col gap-2"
                labelClassName="text-xs  font-semibold tracking-widest"
                inputClassName="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 text-sm"
              />
              <div className="flex flex-col gap-2">
                <label className="text-xs  font-semibold tracking-widest">Agency Type</label>
                <select
                  name="agencyType"
                  value={formData.agencyType}
                  onChange={handleChange}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="">Select type...</option>
                  <option value="Law Enforcement">Law Enforcement</option>
                  <option value="Fire Department">Fire Department</option>
                  <option value="EMS">EMS / Emergency Medical</option>
                  <option value="911 Dispatch">911 Dispatch</option>
                  <option value="Corrections">Corrections</option>
                </select>
              </div>

              <Input
                name="totalPersonnel"
                label="Total Personnel"
                placeholder="e.g. 120"
                type="number"
                value={formData.totalPersonnel}
                onChange={handleChange}
                containerClassName="flex flex-col gap-2"
                labelClassName="text-xs  font-semibold tracking-widest"
                inputClassName="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 text-sm"
              />

              <Input
                name="filled"
                label="Currently Filled"
                placeholder="e.g. 98"
                type="number"
                value={formData.filled}
                onChange={handleChange}
                containerClassName="flex flex-col gap-2"
                labelClassName="text-xs  font-semibold tracking-widest"
                inputClassName="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 text-sm"
              />

              <Input
                name="otHours"
                label="Monthly OT Hours"
                placeholder="e.g. 840"
                type="number"
                value={formData.otHours}
                onChange={handleChange}
                containerClassName="flex flex-col gap-2"
                labelClassName="text-xs  font-semibold tracking-widest"
                inputClassName="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 text-sm"
              />

              <Input
                name="resignations"
                label="Resignations This Month"
                placeholder="e.g. 3"
                type="number"
                value={formData.resignations}
                onChange={handleChange}
                containerClassName="flex flex-col gap-2"
                labelClassName="text-xs  font-semibold tracking-widest"
                inputClassName="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 text-sm"
              />

              <Input
                name="trainingHours"
                label="Training Hours"
                placeholder="e.g. 120"
                type="number"
                value={formData.trainingHours}
                onChange={handleChange}
                containerClassName="flex flex-col gap-2"
                labelClassName="text-xs  font-semibold tracking-widest"
                inputClassName="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 text-sm"
              />

              <Input
                name="morale"
                label="Morale Rating (1-10)"
                placeholder="e.g. 6"
                type="number"
                min="1"
                max="10"
                value={formData.morale}
                onChange={handleChange}
                containerClassName="flex flex-col gap-2"
                labelClassName="text-xs  font-semibold tracking-widest"
                inputClassName="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 text-sm"
              />
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              <Button buttonClassName="font-bold text-sm tracking-widest uppercase px-8 py-3 rounded bg-(--accent) text-slate-950 hover:bg-orange-600 transition-colors">
                Generate ODS Score →
              </Button>
              <span className="text-xs text-slate-500">Takes 2 seconds. No account needed.</span>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
