'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useSubmitAnnualCheckInMutation } from '@/hooks';
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

export function AnnualCheckInForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');

    const [submitAnnualCheckIn, { isLoading: isSubmitting, error: submitError }] =
        useSubmitAnnualCheckInMutation();

    const submitErrorMessage = extractRtkErrorMessage(submitError);

    const formik = useFormik<AnnualFormValues>({
        initialValues: ANNUAL_INITIAL_VALUES,
        validationSchema: annualValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSuccessMessage('');

            try {
                await submitAnnualCheckIn(buildAnnualRequest(values)).unwrap();

                setSuccessMessage('Annual check-in submitted successfully.');
                setCurrentStep(1);
                resetForm();
                window.scrollTo(0, 0);
            } catch {
                setSuccessMessage('');
            }
        },
    });

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

    return (
        <CheckInShell
            title="Annual Check-In"
            subtitle="Complete the Annual Baseline once per year. Drives baseline ratios and AI plan generation."
            errorMessage={submitErrorMessage}
            successMessage={successMessage}
            totalSteps={ANNUAL_STEPS.length}
            currentStep={currentStep}
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
