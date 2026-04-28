'use client';

import { useFormik } from 'formik';
import { Button } from '@/components/ui';
import { NumberField, SelectField, TextField } from '@/components/forms/checkins/shared/FormFields';
import {
  HEADING_FONT_FAMILY,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from '@/components/forms/checkins/shared/styles';
import { agencyValidationSchema } from './validation';
import { AGENCY_TYPE_OPTIONS, AGENCY_SIZE_OPTIONS } from './config';
import { AGENCY_INITIAL_VALUES, AgencyFormValues } from './types';
import { buildAgencyPayload } from './payload';
import type { Agency, AgencyInput } from '@/redux/api/agencyApi';
import { agencyToFormValues } from './payload';

type AgencyDetailsFormProps = {
  agency?: Agency;
  onSubmit: (payload: AgencyInput) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  submitError?: string;
  successMessage?: string;
  title?: string;
  subtitle?: string;
};

export function AgencyDetailsForm({
  agency,
  onSubmit,
  onCancel,
  submitLabel = 'Save and Continue',
  submittingLabel = 'Saving...',
  isSubmitting = false,
  submitError,
  successMessage,
  title = 'Agency Details',
  subtitle = 'These fields drive baseline ratios and seed the Annual Baseline form.',
}: AgencyDetailsFormProps) {
  const formik = useFormik<AgencyFormValues>({
    enableReinitialize: true,
    initialValues: agency ? agencyToFormValues(agency) : AGENCY_INITIAL_VALUES,
    validationSchema: agencyValidationSchema,
    onSubmit: async (values) => {
      await onSubmit(buildAgencyPayload(values));
    },
  });

  const errorOf = (name: keyof AgencyFormValues): string | undefined => {
    const touched = formik.touched[name];
    const error = formik.errors[name];
    return touched && typeof error === 'string' ? error : undefined;
  };

  return (
    <div className="px-7 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-white mb-1"
          style={{ fontFamily: HEADING_FONT_FAMILY }}
        >
          {title}
        </h1>
        <p className="text-sm text-slate-400">{subtitle}</p>

        {submitError && (
          <div className="mt-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded">
            {submitError}
          </div>
        )}
        {successMessage && (
          <div className="mt-3 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-2 rounded">
            {successMessage}
          </div>
        )}
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-slate-800 border-t-4 border-t-(--accent) border border-slate-700 rounded-lg p-7 space-y-8"
      >
        <section>
          <h2
            className="text-xl font-bold text-white mb-1"
            style={{ fontFamily: HEADING_FONT_FAMILY }}
          >
            Agency Identity
          </h2>
          <p className="text-xs text-slate-500 mb-5">Baseline tracker.</p>

          <div className="space-y-5">
            <TextField
              name="name"
              label="Agency Name"
              placeholder="Agency name"
              helpText="Tracking only. No score."
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={errorOf('name')}
            />
            <SelectField
              name="type"
              label="Agency Type"
              options={AGENCY_TYPE_OPTIONS}
              helpText="Determines benchmark peer group."
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={errorOf('type')}
            />
            <SelectField
              name="sizeCategory"
              label="Agency Size Category"
              options={AGENCY_SIZE_OPTIONS}
              helpText="Determines benchmark peer group."
              value={formik.values.sizeCategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={errorOf('sizeCategory')}
            />
            <TextField
              name="primaryServiceJurisdiction"
              label="Primary Service Jurisdiction"
              placeholder="City, county, or district"
              helpText="Tracking only."
              value={formik.values.primaryServiceJurisdiction}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={errorOf('primaryServiceJurisdiction')}
            />
            <NumberField
              name="coverageArea"
              label="Geographic Coverage Area"
              placeholder="e.g. 220"
              helpText="Square miles or zone count. Feeds minimum staffing calculation."
              options={{ min: 0 }}
              value={formik.values.coverageArea}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={errorOf('coverageArea')}
            />
          </div>
        </section>

        <hr className="border-t border-slate-700" />

        <div className="flex justify-end gap-3 flex-wrap">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              buttonClassName={SECONDARY_BUTTON_CLASS}
              style={{ fontFamily: HEADING_FONT_FAMILY }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            buttonClassName={PRIMARY_BUTTON_CLASS}
            style={{ fontFamily: HEADING_FONT_FAMILY }}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
