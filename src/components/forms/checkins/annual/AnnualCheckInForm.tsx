'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
    useAppSelector,
    useListMyAgenciesQuery,
    useSubmitAnnualCheckInMutation,
} from '@/hooks';
import { extractRtkErrorMessage } from '@/utils/rtkErrorHandler';

import {
    CheckInShell,
    FormStep,
    StepNavigation,
    PrimaryStepButton,
    validateStepFields,
} from '../shared';
import { ANNUAL_INITIAL_VALUES, ANNUAL_STEPS } from './config';
import { annualValidationSchema } from './validation';
import { buildAnnualRequest } from './payload';
import { AnnualStepContent } from './AnnualSteps';
import type { AnnualFormValues } from './types';
import type { Agency } from '@/redux/api/agencyApi';

/**
 * Maps the active agency's identity fields onto the Annual Baseline form so
 * users don't have to retype data they already provided during onboarding.
 * Agency identity fields (A-1 to A-5) come from the agency record; the rest
 * stay empty for the user to fill in.
 */
const buildPrefilledValues = (agency: Agency | undefined): AnnualFormValues => {
    if (!agency) return ANNUAL_INITIAL_VALUES;
    return {
        ...ANNUAL_INITIAL_VALUES,
        agencyName: agency.name ?? '',
        agencyType: agency.type ?? '',
        agencySizeCategory: agency.sizeCategory ?? '',
        primaryServiceJurisdiction: agency.primaryServiceJurisdiction ?? '',
        geographicCoverageArea:
            agency.coverageArea !== undefined && agency.coverageArea !== null
                ? String(agency.coverageArea)
                : '',
    };
};

export function AnnualCheckInForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');

    const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);
    const { data: agencyList } = useListMyAgenciesQuery();

    const selectedAgency = useMemo<Agency | undefined>(() => {
        const agencies = agencyList?.data?.agencies ?? [];
        return (
            agencies.find((a) => a._id === selectedAgencyId) ?? agencies[0] ?? undefined
        );
    }, [agencyList, selectedAgencyId]);

    const [submitAnnualCheckIn, { isLoading: isSubmitting, error: submitError }] =
        useSubmitAnnualCheckInMutation();

    const submitErrorMessage = extractRtkErrorMessage(submitError);

    const initialValues = useMemo(
        () => buildPrefilledValues(selectedAgency),
        [selectedAgency]
    );

    const formik = useFormik<AnnualFormValues>({
        enableReinitialize: false,
        initialValues,
        validationSchema: annualValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSuccessMessage('');
            try {
                await submitAnnualCheckIn(buildAnnualRequest(values)).unwrap();

                setSuccessMessage('Annual check-in submitted successfully.');
                setCurrentStep(1);
                // Reset back to a fresh prefilled state so the agency identity
                // section stays in sync with the active agency after submit.
                resetForm({ values: buildPrefilledValues(selectedAgency) });
                window.scrollTo(0, 0);
            } catch {
                setSuccessMessage('');
            }
        },
    });

    // When the active agency changes (or arrives async), refresh ONLY the
    // identity fields so user-entered values for the rest of the form are not
    // wiped out. We track the last agency id we synced from to avoid loops.
    const lastSyncedAgencyIdRef = useRef<string | null>(null);
    useEffect(() => {
        if (!selectedAgency) return;
        if (lastSyncedAgencyIdRef.current === selectedAgency._id) return;
        lastSyncedAgencyIdRef.current = selectedAgency._id;

        formik.setValues(
            {
                ...formik.values,
                agencyName: selectedAgency.name ?? '',
                agencyType: selectedAgency.type ?? '',
                agencySizeCategory: selectedAgency.sizeCategory ?? '',
                primaryServiceJurisdiction:
                    selectedAgency.primaryServiceJurisdiction ?? '',
                geographicCoverageArea:
                    selectedAgency.coverageArea !== undefined &&
                    selectedAgency.coverageArea !== null
                        ? String(selectedAgency.coverageArea)
                        : '',
            },
            false
        );
        // formik intentionally not in deps — reading current values inline is
        // fine and adding it would cause re-runs on every keystroke.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAgency]);

    const handleNext = async () => {
        if (currentStep >= ANNUAL_STEPS.length) return;
        const isValid = await validateStepFields(
            formik,
            annualValidationSchema,
            ANNUAL_STEPS[currentStep - 1].fields
        );
        if (isValid) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const stepData = ANNUAL_STEPS[currentStep - 1];
    const stepLabel = `Annual Step ${currentStep} of ${ANNUAL_STEPS.length}`;

    const prefillBanner = selectedAgency ? (
        <div className="mb-5 rounded-md border border-slate-600 bg-slate-900/70 px-3 py-2 text-xs text-slate-300">
            Agency identity (A-1 to A-5) is prefilled from{' '}
            <span className="text-(--accent) font-semibold">{selectedAgency.name}</span>.
            Updating those fields here does not modify the agency record — edit it from
            Manage Agencies.
        </div>
    ) : undefined;

    return (
        <CheckInShell
            title="Annual Check-In"
            subtitle="Complete the Annual Baseline once per year. Drives baseline ratios and AI plan generation."
            errorMessage={submitErrorMessage}
            successMessage={successMessage}
            totalSteps={ANNUAL_STEPS.length}
            currentStep={currentStep}
            banner={prefillBanner}
        >
            <FormStep
                title={stepData.title}
                description={stepData.description}
                stepLabel={stepLabel}
            >
                <form onSubmit={formik.handleSubmit}>
                    <AnnualStepContent step={currentStep} formik={formik} />
                </form>
            </FormStep>

            <StepNavigation
                onBack={handleBack}
                backDisabled={currentStep === 1 || isSubmitting}
                rightSlot={
                    currentStep < ANNUAL_STEPS.length ? (
                        <PrimaryStepButton onClick={handleNext} disabled={isSubmitting}>
                            Next
                        </PrimaryStepButton>
                    ) : (
                        <PrimaryStepButton
                            onClick={formik.submitForm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Annual Check-In'}
                        </PrimaryStepButton>
                    )
                }
            />
        </CheckInShell>
    );
}
