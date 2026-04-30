import React from 'react';
import { Button } from '@/components/ui';
import { HEADING_FONT_FAMILY, PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from './styles';

type Props = {
  onBack: () => void;
  backDisabled?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot: React.ReactNode;
};

export function StepNavigation({ onBack, backDisabled, leftSlot, rightSlot }: Props) {
  return (
    <>
      <hr className="border-t border-slate-700 mb-6" />
      <div className="flex justify-between gap-4 flex-wrap">
        {leftSlot ?? (
          <Button
            type="button"
            onClick={onBack}
            disabled={backDisabled}
            buttonClassName={SECONDARY_BUTTON_CLASS}
            style={{ fontFamily: HEADING_FONT_FAMILY }}
          >
            Back
          </Button>
        )}
        {rightSlot}
      </div>
    </>
  );
}

type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export function PrimaryStepButton({ onClick, disabled, children }: ButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      buttonClassName={PRIMARY_BUTTON_CLASS}
      style={{ fontFamily: HEADING_FONT_FAMILY }}
    >
      {children}
    </Button>
  );
}
