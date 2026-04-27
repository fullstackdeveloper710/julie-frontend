import React from 'react';
import { FormikProps } from 'formik';
import { NumberField, SelectField, TextareaField } from '../shared/FormFields';
import { NumberFieldOptions, SelectOption } from '../shared/types';
import { MonthlyFormValues } from './types';
import {
    DATA_CONFIDENCE_OPTIONS,
    HIRING_BUDGET_OPTIONS,
    PTO_BACKLOG_OPTIONS,
    RESPONSE_STANDARD_OPTIONS,
    REST_REQUIREMENT_OPTIONS,
    STAFFING_BUDGET_CONSTRAINT_OPTIONS,
    TOP_CONCERN_OPTIONS,
    YES_NO_OPTIONS,
} from './config';

type MonthlyFormik = FormikProps<MonthlyFormValues>;

const getError = (formik: MonthlyFormik, name: keyof MonthlyFormValues): string | undefined => {
    const touched = formik.touched[name];
    const error = formik.errors[name];
    return touched && typeof error === 'string' ? error : undefined;
};

type NumberFieldArgs = {
    formik: MonthlyFormik;
    name: keyof MonthlyFormValues;
    label: string;
    placeholder?: string;
    helpText?: string;
    options?: NumberFieldOptions;
};

const renderNumberField = ({
    formik,
    name,
    label,
    placeholder,
    helpText,
    options,
}: NumberFieldArgs) => (
    <NumberField
        name={name}
        label={label}
        placeholder={placeholder}
        helpText={helpText}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={getError(formik, name)}
        options={options}
    />
);

type SelectFieldArgs = {
    formik: MonthlyFormik;
    name: keyof MonthlyFormValues;
    label: string;
    options: SelectOption[];
    helpText?: string;
};

const renderSelectField = ({
    formik,
    name,
    label,
    options,
    helpText,
}: SelectFieldArgs) => (
    <SelectField
        name={name}
        label={label}
        options={options}
        helpText={helpText}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={getError(formik, name)}
    />
);

type TextareaFieldArgs = {
    formik: MonthlyFormik;
    name: keyof MonthlyFormValues;
    label: string;
    placeholder?: string;
    helpText?: string;
    rows?: number;
};

const renderTextareaField = ({
    formik,
    name,
    label,
    placeholder,
    helpText,
    rows,
}: TextareaFieldArgs) => (
    <TextareaField
        name={name}
        label={label}
        placeholder={placeholder}
        helpText={helpText}
        rows={rows}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={getError(formik, name)}
    />
);

export function MonthlyCoreStepContent({
    step,
    formik,
}: {
    step: number;
    formik: MonthlyFormik;
}) {
    switch (step) {
        case 1:
            return (
                <div className="space-y-5">
                    {renderNumberField({
                        formik,
                        name: 'currentlyFilledPositions',
                        label: '1-1 Currently Filled Positions',
                        placeholder: 'e.g. 145',
                        helpText: 'Required. Used for fill rate and multiple domain calculations.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'currentVacancies',
                        label: '1-2 Current Vacancies',
                        placeholder: 'e.g. 8',
                        helpText: 'Required. Used for monthly vacancy rate.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'resignationsThisMonth',
                        label: '1-3 Resignations This Month',
                        placeholder: 'e.g. 2',
                        helpText: 'Required. Used for turnover rate.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'newHiresAndAcademyGraduates',
                        label: '1-4 New Hires And Academy Graduates This Month',
                        placeholder: 'e.g. 3',
                        helpText: 'Required. Used for hiring effectiveness.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'averageTimeToFillDays',
                        label: '1-5 Average Time-To-Fill For Positions Opened This Month (Days)',
                        placeholder: 'e.g. 45',
                        helpText: 'Required. Enter 0 if no positions opened.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'leadershipLevelVacancies',
                        label: '1-6 Leadership-Level Vacancies This Month',
                        placeholder: 'e.g. 1',
                        helpText: 'Required. Supervisor level and above.',
                        options: { min: 0 },
                    })}
                </div>
            );
        case 2:
            return (
                <div className="space-y-5">
                    {renderNumberField({
                        formik,
                        name: 'totalOvertimeHours',
                        label: '2-1 Total Overtime Hours (Agency-Wide) This Month',
                        placeholder: 'e.g. 2847',
                        helpText: 'Required. Core overtime exposure input.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'averageShiftLengthHours',
                        label: '2-2 Average Shift Length This Month (Hours)',
                        placeholder: 'e.g. 11.5',
                        helpText: 'Required. Actual monthly average shift length.',
                        options: { min: 0, step: 0.1 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'shiftCoverageShortages',
                        label: '2-3 Shift Coverage Shortages This Month (Number Of Shifts)',
                        placeholder: 'e.g. 6',
                        helpText: 'Required. Count of uncovered or below-minimum shifts.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'mandatoryOvertimePercentage',
                        label: '2-4 Percentage Of Overtime That Was Mandatory',
                        placeholder: 'e.g. 35',
                        helpText: 'Required. Enter a percentage between 0 and 100.',
                        options: { min: 0, max: 100, step: 0.1 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'plannedOvertimePercentage',
                        label: '2-5 Planned Overtime Percentage',
                        placeholder: 'e.g. 40',
                        helpText: 'Required. Planned + unplanned must equal 100.',
                        options: { min: 0, max: 100, step: 0.1 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'unplannedOvertimePercentage',
                        label: '2-5 Unplanned Overtime Percentage',
                        placeholder: 'e.g. 60',
                        helpText: 'Required. Planned + unplanned must equal 100.',
                        options: { min: 0, max: 100, step: 0.1 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'callInAndHoldoverIncidents',
                        label: '2-6 Call-In And Holdover Incidents This Month',
                        placeholder: 'e.g. 9',
                        helpText: 'Required. Includes call-ins and holdovers.',
                        options: { min: 0 },
                    })}
                </div>
            );
        case 3:
            return (
                <div className="space-y-5">
                    {renderNumberField({
                        formik,
                        name: 'totalSickLeaveDaysUsed',
                        label: '3-1 Total Sick Leave Days Used This Month (Agency-Wide)',
                        placeholder: 'e.g. 54',
                        helpText: 'Required. Domain 3 dedicated monthly question.',
                        options: { min: 0 },
                    })}
                </div>
            );
        case 4:
            return (
                <div className="space-y-5">
                    {renderNumberField({
                        formik,
                        name: 'employeesOnFmlaLeave',
                        label: '4-1 Employees Currently On FMLA Leave',
                        placeholder: 'e.g. 5',
                        helpText: 'Required. Used for FMLA rate.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'newFmlaRequests',
                        label: '4-2 New FMLA Requests This Month',
                        placeholder: 'e.g. 2',
                        helpText: 'Required. Tracks growth in leave stress.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'workersCompClaimsFiled',
                        label: '4-3 Workers Comp Claims Filed This Month',
                        placeholder: 'e.g. 1',
                        helpText: 'Required monthly count.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'peerSupportActivations',
                        label: '4-4 Peer Support Activations This Month',
                        placeholder: 'e.g. 4',
                        helpText: 'Required. Evaluated relative to critical incidents.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'criticalIncidentExposures',
                        label: '4-5 Critical Incident Exposures This Month',
                        placeholder: 'e.g. 6',
                        helpText: 'Required context for peer support activation ratio.',
                        options: { min: 0 },
                    })}
                    {renderSelectField({
                        formik,
                        name: 'lineOfDutyDeathsOrSeriousInjuries',
                        label: '4-6 Line-Of-Duty Deaths Or Serious Injuries This Period',
                        options: YES_NO_OPTIONS,
                        helpText: 'Required. If Yes, enter count.',
                    })}
                    {formik.values.lineOfDutyDeathsOrSeriousInjuries === 'Yes' &&
                        renderNumberField({
                            formik,
                            name: 'lineOfDutyDeathsOrSeriousInjuriesCount',
                            label: '4-6 Count For Line-Of-Duty Deaths Or Serious Injuries',
                            placeholder: 'e.g. 1',
                            helpText: 'Required when 4-6 is Yes.',
                            options: { min: 1 },
                        })}
                </div>
            );
        case 5:
            return (
                <div className="space-y-5">
                    {renderNumberField({
                        formik,
                        name: 'leadershipMoraleRating',
                        label: '5-1 Leadership Morale Rating This Month (1-10)',
                        placeholder: '1 = Very Low, 10 = Excellent',
                        helpText: 'Required command-level morale indicator.',
                        options: { min: 1, max: 10 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'frontlineMoraleRating',
                        label: '5-2 Frontline / Line-Level Morale Rating This Month (1-10)',
                        placeholder: '1 = Very Low, 10 = Excellent',
                        helpText: 'Required frontline morale indicator.',
                        options: { min: 1, max: 10 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'disciplinaryActions',
                        label: '5-3 Disciplinary Actions This Month (Count)',
                        placeholder: 'e.g. 1',
                        helpText: 'Required monthly count.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'formalGrievancesFiled',
                        label: '5-4 Formal Grievances Or Complaints Filed By Personnel This Month',
                        placeholder: 'e.g. 2',
                        helpText: 'Required monthly count.',
                        options: { min: 0 },
                    })}
                    {renderNumberField({
                        formik,
                        name: 'promotionsOrLeadershipDevelopmentCount',
                        label: '5-5 Promotions Or Leadership Development Activity This Period',
                        placeholder: 'e.g. 1',
                        helpText: 'Required. Enter 0 if none.',
                        options: { min: 0 },
                    })}
                </div>
            );
        case 6:
            return (
                <div className="space-y-5">
                    {renderSelectField({
                        formik,
                        name: 'dataConfidence',
                        label: 'DC-1 What Is The Confidence Level Of The Data Submitted This Month?',
                        options: DATA_CONFIDENCE_OPTIONS,
                        helpText:
                            'Required. This does not change scores but it adjusts report language and AI tone.',
                    })}
                </div>
            );
        default:
            return null;
    }
}

export function MonthlyOptionalStepContent({
    step,
    formik,
}: {
    step: number;
    formik: MonthlyFormik;
}) {
    switch (step) {
        case 1:
            return (
                <div className="space-y-5">
                    {renderNumberField({
                        formik,
                        name: 'overtimeBudgetUtilizationPercentage',
                        label: 'B-1 Overtime Budget Utilization This Month (%)',
                        placeholder: 'e.g. 112',
                        helpText: 'Optional precision input. Over 100% indicates over-budget overtime.',
                        options: { min: 0 },
                    })}
                    {renderSelectField({
                        formik,
                        name: 'hiringBudgetAvailability',
                        label: 'B-2 Is Recruitment Or Hiring Budget Currently Available?',
                        options: HIRING_BUDGET_OPTIONS,
                        helpText: 'Optional context for staffing and vacancy interventions.',
                    })}
                    {renderSelectField({
                        formik,
                        name: 'staffingBudgetConstraint',
                        label:
                            'B-3 Is The Agency Operating Under A Budget Constraint Affecting Staffing Decisions?',
                        options: STAFFING_BUDGET_CONSTRAINT_OPTIONS,
                        helpText: 'Optional strategic context for all domain recommendations.',
                    })}
                </div>
            );
        case 2:
            return (
                <div className="space-y-5">
                    {renderNumberField({
                        formik,
                        name: 'totalCallsOrIncidents',
                        label: 'OD-1 Total Calls Or Incidents This Month',
                        placeholder: 'e.g. 1850',
                        helpText:
                            'Optional demand-side context used for staffing-to-demand interpretation.',
                        options: { min: 0 },
                    })}
                    {renderSelectField({
                        formik,
                        name: 'responseTimeStandardsMet',
                        label: 'OD-2 Were Response Time Standards Met This Month?',
                        options: RESPONSE_STANDARD_OPTIONS,
                        helpText: 'Optional operational outcome signal.',
                    })}
                    {renderNumberField({
                        formik,
                        name: 'specialtyUnitVacancies',
                        label: 'OD-3 Specialty Unit Vacancies This Month',
                        placeholder: 'e.g. 2',
                        helpText: 'Optional capability gap indicator separate from general vacancies.',
                        options: { min: 0 },
                    })}
                </div>
            );
        case 3:
            return (
                <div className="space-y-5">
                    {renderSelectField({
                        formik,
                        name: 'minimumRestPeriodRequirementMet',
                        label:
                            'F-1 Is The Agency Meeting Its Minimum Rest Period Requirement Between Shifts?',
                        options: REST_REQUIREMENT_OPTIONS,
                        helpText: 'Optional compliance check against baseline policy.',
                    })}
                    {renderSelectField({
                        formik,
                        name: 'ptoVacationAccrualBacklog',
                        label: 'F-2 PTO And Vacation Accrual Backlog Present?',
                        options: PTO_BACKLOG_OPTIONS,
                        helpText: 'Optional fatigue and morale precision signal.',
                    })}
                    {renderNumberField({
                        formik,
                        name: 'returnToDutyIncidentsBeforeFullRecovery',
                        label: 'F-3 Return-To-Duty Incidents Before Full Recovery (Count)',
                        placeholder: 'e.g. 1',
                        helpText: 'Optional liability and wellness context.',
                        options: { min: 0 },
                    })}
                </div>
            );
        case 4:
            return (
                <div className="space-y-5">
                    {renderNumberField({
                        formik,
                        name: 'eapReferralsOrUtilizations',
                        label: 'PS-1 EAP Referrals Or Utilizations This Month',
                        placeholder: 'e.g. 4',
                        helpText: 'Optional context for peer support utilization depth.',
                        options: { min: 0 },
                    })}
                    {renderSelectField({
                        formik,
                        name: 'topLeadershipConcern',
                        label: 'PS-2 Top Leadership Concern This Month',
                        options: TOP_CONCERN_OPTIONS,
                        helpText: 'Optional strategic input that enriches the AI plan engine.',
                    })}
                    {formik.values.topLeadershipConcern === 'Other' &&
                        renderTextareaField({
                            formik,
                            name: 'topLeadershipConcernOther',
                            label: 'PS-2 Other Leadership Concern',
                            placeholder: 'Describe the other top leadership concern...',
                            helpText: 'Required only when "Other" is selected.',
                        })}
                    {renderTextareaField({
                        formik,
                        name: 'additionalContextOrNotes',
                        label: 'PS-3 Additional Context Or Notes',
                        placeholder: 'Add any context not captured by structured fields...',
                        helpText:
                            'Optional unstructured context for report interpretation and planning.',
                    })}
                </div>
            );
        default:
            return null;
    }
}
