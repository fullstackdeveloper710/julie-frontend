import React from 'react';
import { HEADING_FONT_FAMILY } from './styles';
import { StepProgress } from './StepProgress';

type CheckInShellProps = {
  title: string;
  subtitle?: string;
  errorMessage?: string;
  successMessage?: string;
  totalSteps: number;
  currentStep: number;
  children: React.ReactNode;
  banner?: React.ReactNode;
};

export function CheckInShell({
  title,
  subtitle,
  errorMessage,
  successMessage,
  totalSteps,
  currentStep,
  children,
  banner,
}: CheckInShellProps) {
  return (
    <div className="px-7 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-white mb-1"
          style={{ fontFamily: HEADING_FONT_FAMILY }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-sm">{subtitle}</p>}

        {errorMessage && (
          <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded">
            {successMessage}
          </div>
        )}
      </div>

      <div className="bg-slate-800 border-t-4 border-t-(--accent) border border-slate-700 rounded-lg p-7">
        {banner}
        <StepProgress totalSteps={totalSteps} currentStep={currentStep} />
        {children}
      </div>
    </div>
  );
}
