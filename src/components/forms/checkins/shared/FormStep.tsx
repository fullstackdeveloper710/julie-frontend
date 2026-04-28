import React from 'react';
import { HEADING_FONT_FAMILY } from './styles';

type FormStepProps = {
  title: string;
  description: string;
  stepLabel: string;
  children: React.ReactNode;
};

export function FormStep({ title, description, stepLabel, children }: FormStepProps) {
  return (
    <>
      <div className="mb-8">
        <h2
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: HEADING_FONT_FAMILY }}
        >
          {title}
        </h2>
        {/* <p className="text-sm">{description}</p> */}
        <p className="text-xs text-slate-400 mt-2">{stepLabel}</p>
      </div>

      <div className="mb-8">{children}</div>
    </>
  );
}
