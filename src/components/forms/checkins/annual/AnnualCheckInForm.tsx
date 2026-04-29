'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  useAppSelector,
  useListMyAgenciesQuery,
  useSubmitAnnualCheckInMutation,
  useUpdateAnnualCheckInMutation,
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
import type { AnnualCheckInRecord } from '@/redux/api/checkinApi';

interface Props {
  editId?: string;
  initialRecord?: AnnualCheckInRecord;
  onSuccess?: () => void;
}

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

const buildValuesFromRecord = (record: AnnualCheckInRecord): AnnualFormValues => ({
  agencyName: record.agencyIdentity.agencyName,
  agencyType: record.agencyIdentity.agencyType,
  agencySizeCategory: record.agencyIdentity.agencySizeCategory,
  primaryServiceJurisdiction: record.agencyIdentity.primaryServiceJurisdiction,
  geographicCoverageArea: String(record.agencyIdentity.geographicCoverageArea),
  totalAuthorizedPositions: String(record.structuralStaffingProfile.totalAuthorizedPositions),
  totalFundedPositions: String(record.structuralStaffingProfile.totalFundedPositions),
  minimumSafeStaffingLevel: String(record.structuralStaffingProfile.minimumSafeStaffingLevel),
  specialtyUnitPositionsCount: String(record.structuralStaffingProfile.specialtyUnitPositionsCount),
  supervisorToStaffRatio: record.structuralStaffingProfile.supervisorToStaffRatio,
  standardShiftLengthHours: String(record.operationalInfrastructure.standardShiftLengthHours),
  shiftScheduleType: record.operationalInfrastructure.shiftScheduleType,
  minimumRestPeriodPolicyExists: record.operationalInfrastructure.minimumRestPeriodPolicyExists,
  activePeerSupportTeam: record.operationalInfrastructure.activePeerSupportTeam,
  hasEmployeeAssistanceProgram: record.operationalInfrastructure.hasEmployeeAssistanceProgram,
  goal1PrimaryAnnualGoal: record.goalsAndStrategicDirection.goal1PrimaryAnnualGoal,
  goal1TargetMetric: record.goalsAndStrategicDirection.goal1TargetMetric ?? '',
  goal1Timeframe: record.goalsAndStrategicDirection.goal1Timeframe,
  goal2SecondaryAnnualGoal: record.goalsAndStrategicDirection.goal2SecondaryAnnualGoal ?? '',
  goal2TargetMetric: record.goalsAndStrategicDirection.goal2TargetMetric ?? '',
  goal2Timeframe: record.goalsAndStrategicDirection.goal2Timeframe ?? '',
});

export function AnnualCheckInForm({ editId, initialRecord, onSuccess }: Props) {
  const isEditMode = !!editId;
  const [currentStep, setCurrentStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);
  const { data: agencyList } = useListMyAgenciesQuery();
  const selectedAgency = useMemo<Agency | undefined>(() => {
    const agencies = agencyList?.data?.agencies ?? [];
    return agencies.find((a) => a._id === selectedAgencyId) ?? agencies[0] ?? undefined;
  }, [agencyList, selectedAgencyId]);

  const [submitAnnualCheckIn, { isLoading: isSubmitting, error: submitError }] =
    useSubmitAnnualCheckInMutation();
  const [updateAnnualCheckIn, { isLoading: isUpdating, error: updateError }] =
    useUpdateAnnualCheckInMutation();

  const isBusy = isSubmitting || isUpdating;
  const submitErrorMessage = extractRtkErrorMessage(isEditMode ? updateError : submitError);

  const initialValues = useMemo(
    () => (initialRecord ? buildValuesFromRecord(initialRecord) : buildPrefilledValues(selectedAgency)),
    [initialRecord, selectedAgency],
  );

  const formik = useFormik<AnnualFormValues>({
    enableReinitialize: false,
    initialValues,
    validationSchema: annualValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSuccessMessage('');
      try {
        if (isEditMode && editId) {
          await updateAnnualCheckIn({ id: editId, data: buildAnnualRequest(values) }).unwrap();
          setSuccessMessage('Annual check-in updated successfully.');
        } else {
          await submitAnnualCheckIn(buildAnnualRequest(values)).unwrap();
          setSuccessMessage('Annual check-in submitted successfully.');
          resetForm({ values: buildPrefilledValues(selectedAgency) });
        }
        setCurrentStep(1);
        window.scrollTo(0, 0);
        onSuccess?.();
      } catch {
        setSuccessMessage('');
      }
    },
  });

  const lastSyncedAgencyIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (isEditMode || !selectedAgency) return;
    if (lastSyncedAgencyIdRef.current === selectedAgency._id) return;
    lastSyncedAgencyIdRef.current = selectedAgency._id;
    formik.setValues(
      {
        ...formik.values,
        agencyName: selectedAgency.name ?? '',
        agencyType: selectedAgency.type ?? '',
        agencySizeCategory: selectedAgency.sizeCategory ?? '',
        primaryServiceJurisdiction: selectedAgency.primaryServiceJurisdiction ?? '',
        geographicCoverageArea:
          selectedAgency.coverageArea !== undefined && selectedAgency.coverageArea !== null
            ? String(selectedAgency.coverageArea)
            : '',
      },
      false,
    );
  }, [selectedAgency, isEditMode]);

  const handleNext = async () => {
    if (currentStep >= ANNUAL_STEPS.length) return;
    const isValid = await validateStepFields(
      formik,
      annualValidationSchema,
      ANNUAL_STEPS[currentStep - 1].fields,
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

  const prefillBanner =
    !isEditMode && selectedAgency ? (
      <div className="mb-5 rounded-md border border-slate-600 bg-slate-900/70 px-3 py-2 text-xs text-slate-300">
        Agency identity (A-1 to A-5) is prefilled from{' '}
        <span className="text-(--accent) font-semibold">{selectedAgency.name}</span>. Updating those
        fields here does not modify the agency record — edit it from Manage Agencies.
      </div>
    ) : undefined;

  return (
    <CheckInShell
      title={isEditMode ? 'Edit Annual Check-In' : 'Annual Check-In'}
      subtitle={
        isEditMode
          ? 'Update your annual baseline. This counts as one of your allowed edits for this year.'
          : 'Complete the Annual Baseline once per year. Drives baseline ratios and AI plan generation.'
      }
      errorMessage={submitErrorMessage}
      successMessage={successMessage}
      totalSteps={ANNUAL_STEPS.length}
      currentStep={currentStep}
      banner={prefillBanner}
    >
      <FormStep title={stepData.title} description={stepData.description} stepLabel={stepLabel}>
        <form onSubmit={formik.handleSubmit}>
          <AnnualStepContent step={currentStep} formik={formik} />
        </form>
      </FormStep>

      <StepNavigation
        onBack={handleBack}
        backDisabled={currentStep === 1 || isBusy}
        rightSlot={
          currentStep < ANNUAL_STEPS.length ? (
            <PrimaryStepButton onClick={handleNext} disabled={isBusy}>
              Next
            </PrimaryStepButton>
          ) : (
            <PrimaryStepButton onClick={formik.submitForm} disabled={isBusy}>
              {isBusy
                ? isEditMode
                  ? 'Saving…'
                  : 'Submitting…'
                : isEditMode
                  ? 'Save Changes'
                  : 'Submit Annual Check-In'}
            </PrimaryStepButton>
          )
        }
      />
    </CheckInShell>
  );
}
