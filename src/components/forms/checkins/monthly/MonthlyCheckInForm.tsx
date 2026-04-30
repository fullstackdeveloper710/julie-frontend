'use client';

import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button } from '@/components/ui';
import { useSubmitMonthlyCheckInMutation, useUpdateMonthlyCheckInMutation } from '@/hooks';
import { extractRtkErrorMessage } from '@/utils/rtkErrorHandler';

import {
  CheckInShell,
  FormStep,
  StepNavigation,
  PrimaryStepButton,
  validateStepFields,
  HEADING_FONT_FAMILY,
  SECONDARY_BUTTON_CLASS,
  TERTIARY_BUTTON_CLASS,
} from '../shared';
import { MONTHLY_CORE_STEPS, MONTHLY_INITIAL_VALUES, MONTHLY_OPTIONAL_STEPS } from './config';
import { monthlyValidationSchema } from './validation';
import {
  buildMonthlyRequest,
  clearMonthlyOptionalValues,
  getActiveMonthlyStepFields,
  recordToMonthlyFormValues,
} from './payload';
import { MonthlyCoreStepContent, MonthlyOptionalStepContent } from './MonthlySteps';
import type { MonthlyFormValues } from './types';

interface MonthlyCheckInFormProps {
  editId?: string;
  initialRecord?: Record<string, any>;
  onSuccess?: () => void;
}

export function MonthlyCheckInForm({ editId, initialRecord, onSuccess }: MonthlyCheckInFormProps = {}) {
  const isEditMode = !!editId;

  const [currentCoreStep, setCurrentCoreStep] = useState(1);
  const [showOptionalFlow, setShowOptionalFlow] = useState(false);
  const [currentOptionalStep, setCurrentOptionalStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const submitWithOptionalRef = useRef(false);

  const [submitMonthlyCheckIn, { isLoading: isWorkingLoad, error: submitError }] =
    useSubmitMonthlyCheckInMutation();
  const [updateMonthlyCheckIn, { isLoading: isUpdating, error: updateError }] =
    useUpdateMonthlyCheckInMutation();

  const isWorking = isWorkingLoad || isUpdating;
  const submitErrorMessage = extractRtkErrorMessage(submitError ?? updateError);

  const formik = useFormik<MonthlyFormValues>({
    initialValues: initialRecord ? recordToMonthlyFormValues(initialRecord) : MONTHLY_INITIAL_VALUES,
    validationSchema: monthlyValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSuccessMessage('');

      try {
        const payload = buildMonthlyRequest(values, submitWithOptionalRef.current);

        if (isEditMode && editId) {
          await updateMonthlyCheckIn({ id: editId, data: payload }).unwrap();
          setSuccessMessage('Monthly check-in updated successfully.');
          onSuccess?.();
        } else {
          await submitMonthlyCheckIn(payload).unwrap();
          setSuccessMessage('Monthly check-in submitted successfully.');
          setCurrentCoreStep(1);
          setShowOptionalFlow(false);
          setCurrentOptionalStep(1);
          submitWithOptionalRef.current = false;
          resetForm();
          window.scrollTo(0, 0);
          onSuccess?.();
        }
      } catch {
        setSuccessMessage('');
      }
    },
  });

  const validateActiveStep = async (rawFields: string[]) => {
    const fields = getActiveMonthlyStepFields(formik.values, rawFields);
    return validateStepFields(formik, monthlyValidationSchema, fields);
  };

  const handleNext = async () => {
    if (showOptionalFlow) {
      if (currentOptionalStep >= MONTHLY_OPTIONAL_STEPS.length) return;
      const isValid = await validateActiveStep(
        MONTHLY_OPTIONAL_STEPS[currentOptionalStep - 1].fields,
      );
      if (isValid) {
        setCurrentOptionalStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
      return;
    }

    if (currentCoreStep >= MONTHLY_CORE_STEPS.length) return;
    const isValid = await validateActiveStep(MONTHLY_CORE_STEPS[currentCoreStep - 1].fields);
    if (isValid) {
      setCurrentCoreStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (showOptionalFlow) {
      if (currentOptionalStep > 1) {
        setCurrentOptionalStep((prev) => prev - 1);
      } else {
        setShowOptionalFlow(false);
        setCurrentCoreStep(MONTHLY_CORE_STEPS.length);
      }
      window.scrollTo(0, 0);
      return;
    }

    if (currentCoreStep > 1) {
      setCurrentCoreStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleOpenOptional = async () => {
    const isValid = await validateActiveStep(MONTHLY_CORE_STEPS[currentCoreStep - 1].fields);
    if (isValid) {
      setShowOptionalFlow(true);
      setCurrentOptionalStep(1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (includeOptional: boolean) => {
    submitWithOptionalRef.current = includeOptional;

    if (!includeOptional) {
      await formik.setValues(clearMonthlyOptionalValues(formik.values), false);
    }

    await formik.submitForm();
  };

  const stepData = showOptionalFlow
    ? MONTHLY_OPTIONAL_STEPS[currentOptionalStep - 1]
    : MONTHLY_CORE_STEPS[currentCoreStep - 1];
  const totalSteps = showOptionalFlow ? MONTHLY_OPTIONAL_STEPS.length : MONTHLY_CORE_STEPS.length;
  const stepIndex = showOptionalFlow ? currentOptionalStep : currentCoreStep;
  const stepLabel = showOptionalFlow
    ? `Optional Step ${stepIndex} of ${totalSteps}`
    : `Core Step ${stepIndex} of ${totalSteps}`;

  const optionalBanner = showOptionalFlow ? (
    <div className="mb-5 rounded-md border border-slate-600 bg-slate-900/70 px-3 py-2 text-xs text-slate-300">
      Monthly Optional secondary flow is active. All fields here are optional and do not block core
      submission if skipped.
    </div>
  ) : undefined;

  return (
    <CheckInShell
      title="Monthly Check-In"
      subtitle="Complete the required Monthly Core questions, then optionally add precision inputs."
      errorMessage={submitErrorMessage}
      successMessage={successMessage}
      totalSteps={totalSteps}
      currentStep={stepIndex}
      banner={optionalBanner}
    >
      <FormStep title={stepData.title} description={stepData.description} stepLabel={stepLabel}>
        <form onSubmit={formik.handleSubmit}>
          {showOptionalFlow ? (
            <MonthlyOptionalStepContent step={currentOptionalStep} formik={formik} />
          ) : (
            <MonthlyCoreStepContent step={currentCoreStep} formik={formik} />
          )}
        </form>
      </FormStep>

      <StepNavigation
        onBack={handleBack}
        backDisabled={(!showOptionalFlow && currentCoreStep === 1) || isWorking}
        rightSlot={
          <>
            {!showOptionalFlow && currentCoreStep < MONTHLY_CORE_STEPS.length && (
              <PrimaryStepButton onClick={handleNext} disabled={isWorking}>
                Next
              </PrimaryStepButton>
            )}

            {!showOptionalFlow && currentCoreStep === MONTHLY_CORE_STEPS.length && (
              <div className="flex gap-3 flex-wrap">
                <Button
                  type="button"
                  onClick={handleOpenOptional}
                  disabled={isWorking}
                  buttonClassName={TERTIARY_BUTTON_CLASS}
                  style={{ fontFamily: HEADING_FONT_FAMILY }}
                >
                  More (Optional)
                </Button>
                <PrimaryStepButton onClick={() => handleSubmit(false)} disabled={isWorking}>
                  {isWorking ? 'Saving...' : isEditMode ? 'Update Monthly Core' : 'Submit Monthly Core'}
                </PrimaryStepButton>
              </div>
            )}

            {showOptionalFlow && (
              <div className="flex gap-3 flex-wrap">
                {currentOptionalStep < MONTHLY_OPTIONAL_STEPS.length && (
                  <PrimaryStepButton onClick={handleNext} disabled={isWorking}>
                    Next
                  </PrimaryStepButton>
                )}

                <Button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={isWorking}
                  buttonClassName={SECONDARY_BUTTON_CLASS}
                  style={{ fontFamily: HEADING_FONT_FAMILY }}
                >
                  {isWorking ? 'Saving...' : isEditMode ? 'Skip Optional And Update Core' : 'Skip Optional And Submit Core'}
                </Button>

                {currentOptionalStep === MONTHLY_OPTIONAL_STEPS.length && (
                  <PrimaryStepButton onClick={() => handleSubmit(true)} disabled={isWorking}>
                    {isWorking ? 'Saving...' : isEditMode ? 'Update Core + Optional' : 'Submit Core + Optional'}
                  </PrimaryStepButton>
                )}
              </div>
            )}
          </>
        }
      />
    </CheckInShell>
  );
}
