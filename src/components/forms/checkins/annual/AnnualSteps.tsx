import React from 'react';
import { FormikProps } from 'formik';
import { NumberField, SelectField, TextField, TextareaField } from '../shared/FormFields';
import { NumberFieldOptions, SelectOption } from '../shared/types';
import { AnnualFormValues } from './types';
import {
  ANNUAL_AGENCY_SIZE_OPTIONS,
  ANNUAL_AGENCY_TYPE_OPTIONS,
  ANNUAL_SHIFT_SCHEDULE_OPTIONS,
  GOAL_1_TIMEFRAME_OPTIONS,
  GOAL_2_TIMEFRAME_OPTIONS,
  PEER_SUPPORT_TEAM_OPTIONS,
  YES_NO_OPTIONS,
} from './config';

type AnnualFormik = FormikProps<AnnualFormValues>;

const getError = (formik: AnnualFormik, name: keyof AnnualFormValues): string | undefined => {
  const touched = formik.touched[name];
  const error = formik.errors[name];
  return touched && typeof error === 'string' ? error : undefined;
};

const renderTextField = (args: {
  formik: AnnualFormik;
  name: keyof AnnualFormValues;
  label: string;
  placeholder?: string;
  helpText?: string;
}) => (
  <TextField
    name={args.name}
    label={args.label}
    placeholder={args.placeholder}
    helpText={args.helpText}
    value={args.formik.values[args.name]}
    onChange={args.formik.handleChange}
    onBlur={args.formik.handleBlur}
    error={getError(args.formik, args.name)}
  />
);

const renderNumberField = (args: {
  formik: AnnualFormik;
  name: keyof AnnualFormValues;
  label: string;
  placeholder?: string;
  helpText?: string;
  options?: NumberFieldOptions;
}) => (
  <NumberField
    name={args.name}
    label={args.label}
    placeholder={args.placeholder}
    helpText={args.helpText}
    value={args.formik.values[args.name]}
    onChange={args.formik.handleChange}
    onBlur={args.formik.handleBlur}
    error={getError(args.formik, args.name)}
    options={args.options}
  />
);

const renderSelectField = (args: {
  formik: AnnualFormik;
  name: keyof AnnualFormValues;
  label: string;
  options: SelectOption[];
  helpText?: string;
}) => (
  <SelectField
    name={args.name}
    label={args.label}
    options={args.options}
    helpText={args.helpText}
    value={args.formik.values[args.name]}
    onChange={args.formik.handleChange}
    onBlur={args.formik.handleBlur}
    error={getError(args.formik, args.name)}
  />
);

const renderTextareaField = (args: {
  formik: AnnualFormik;
  name: keyof AnnualFormValues;
  label: string;
  placeholder?: string;
  helpText?: string;
  rows?: number;
}) => (
  <TextareaField
    name={args.name}
    label={args.label}
    placeholder={args.placeholder}
    helpText={args.helpText}
    rows={args.rows ?? 3}
    value={args.formik.values[args.name]}
    onChange={args.formik.handleChange}
    onBlur={args.formik.handleBlur}
    error={getError(args.formik, args.name)}
  />
);

export function AnnualStepContent({ step, formik }: { step: number; formik: AnnualFormik }) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-5">
          {renderTextField({
            formik,
            name: 'agencyName',
            label: 'Agency Name',
            placeholder: 'Agency name',
            helpText: 'Required annual baseline identity field.',
          })}
          {renderSelectField({
            formik,
            name: 'agencyType',
            label: 'Agency Type',
            options: ANNUAL_AGENCY_TYPE_OPTIONS,
            helpText: 'Required annual baseline identity field.',
          })}
          {renderSelectField({
            formik,
            name: 'agencySizeCategory',
            label: 'A-3 Agency Size Category',
            options: ANNUAL_AGENCY_SIZE_OPTIONS,
            helpText: 'Required annual baseline identity field.',
          })}
          {renderTextField({
            formik,
            name: 'primaryServiceJurisdiction',
            label: 'Primary Service Jurisdiction',
            placeholder: 'City, county, or district',
            helpText: 'Required annual baseline identity field.',
          })}
          {renderNumberField({
            formik,
            name: 'geographicCoverageArea',
            label: 'Geographic Coverage Area',
            placeholder: 'e.g. 220',
            helpText: 'Required. Enter square miles or zone count.',
            options: { min: 0 },
          })}
        </div>
      );
    case 2:
      return (
        <div className="space-y-5">
          {renderNumberField({
            formik,
            name: 'totalAuthorizedPositions',
            label: 'Total Authorized Positions',
            placeholder: 'e.g. 180',
            helpText: 'Required denominator for fill, vacancy, and turnover rates.',
            options: { min: 0 },
          })}
          {renderNumberField({
            formik,
            name: 'totalFundedPositions',
            label: 'Total Funded Positions',
            placeholder: 'e.g. 170',
            helpText: 'Required fiscal capacity input. Must not exceed authorized.',
            options: { min: 0 },
          })}
          {renderNumberField({
            formik,
            name: 'minimumSafeStaffingLevel',
            label: 'Minimum Safe Staffing Level (Agency-Defined)',
            placeholder: 'e.g. 132',
            helpText: 'Required absolute staffing floor.',
            options: { min: 0 },
          })}
          {renderNumberField({
            formik,
            name: 'specialtyUnitPositionsCount',
            label: 'Specialty Unit Positions (Count)',
            placeholder: 'e.g. 24',
            helpText: 'Required specialty staffing denominator.',
            options: { min: 0 },
          })}
          {renderTextField({
            formik,
            name: 'supervisorToStaffRatio',
            label: 'Supervisor-To-Staff Ratio (Current)',
            placeholder: 'e.g. 1:8',
            helpText: 'Required format is ratio such as 1:8.',
          })}
        </div>
      );
    case 3:
      return (
        <div className="space-y-5">
          {renderNumberField({
            formik,
            name: 'standardShiftLengthHours',
            label: 'Standard Shift Length (Hours)',
            placeholder: 'e.g. 12',
            helpText: 'Required baseline context for operational and fatigue domains.',
            options: { min: 0, max: 24, step: 0.5 },
          })}
          {renderSelectField({
            formik,
            name: 'shiftScheduleType',
            label: 'Shift Schedule Type',
            options: ANNUAL_SHIFT_SCHEDULE_OPTIONS,
            helpText: 'Required annual infrastructure setting.',
          })}
          {renderSelectField({
            formik,
            name: 'minimumRestPeriodPolicyExists',
            label: 'Minimum Rest Period Policy Between Shifts?',
            options: YES_NO_OPTIONS,
            helpText: 'Required baseline policy question.',
          })}
          {renderSelectField({
            formik,
            name: 'activePeerSupportTeam',
            label: 'Active Peer Support Team?',
            options: PEER_SUPPORT_TEAM_OPTIONS,
            helpText: 'Required baseline support infrastructure question.',
          })}
          {renderSelectField({
            formik,
            name: 'hasEmployeeAssistanceProgram',
            label: 'Employee Assistance Program (EAP)?',
            options: YES_NO_OPTIONS,
            helpText: 'Required baseline support infrastructure question.',
          })}
        </div>
      );
    case 4:
      return (
        <div className="space-y-5">
          {renderTextareaField({
            formik,
            name: 'goal1PrimaryAnnualGoal',
            label: 'Primary Annual Goal',
            placeholder: 'Describe the primary annual goal and include category context.',
            helpText: 'Required strategic goal input.',
          })}
          {renderTextField({
            formik,
            name: 'goal1TargetMetric',
            label: 'Target Metric',
            placeholder: 'e.g. Reach 90% fill rate',
            helpText: 'At least one of G-2 or G-5 must be provided.',
          })}
          {renderSelectField({
            formik,
            name: 'goal1Timeframe',
            label: 'Timeframe',
            options: GOAL_1_TIMEFRAME_OPTIONS,
            helpText: 'Required for milestone generation.',
          })}
          {renderTextareaField({
            formik,
            name: 'goal2SecondaryAnnualGoal',
            label: 'Secondary Annual Goal (Optional)',
            placeholder: 'Optional secondary goal.',
          })}
          {renderTextField({
            formik,
            name: 'goal2TargetMetric',
            label: 'Target Metric (Optional)',
            placeholder: 'e.g. Maintain OT below 15%',
          })}
          {renderSelectField({
            formik,
            name: 'goal2Timeframe',
            label: 'Timeframe (Optional)',
            options: GOAL_2_TIMEFRAME_OPTIONS,
          })}
          <div className="rounded-md border border-slate-700 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
            Validation rule: If both G-2 and G-5 are blank, submission is blocked.
          </div>
        </div>
      );
    default:
      return null;
  }
}
