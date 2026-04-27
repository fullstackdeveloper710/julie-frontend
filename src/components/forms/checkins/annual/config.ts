import { SelectOption, StepConfig } from '../shared/types';
import { AnnualFormValues } from './types';

export const ANNUAL_STEPS: StepConfig[] = [
    {
        id: 1,
        title: 'Agency Identity',
        description: 'Annual baseline A-1 to A-5',
        fields: [
            'agencyName',
            'agencyType',
            'agencySizeCategory',
            'primaryServiceJurisdiction',
            'geographicCoverageArea',
        ],
    },
    {
        id: 2,
        title: 'Structural Staffing Profile',
        description: 'Annual baseline A-6 to A-10',
        fields: [
            'totalAuthorizedPositions',
            'totalFundedPositions',
            'minimumSafeStaffingLevel',
            'specialtyUnitPositionsCount',
            'supervisorToStaffRatio',
        ],
    },
    {
        id: 3,
        title: 'Operational Infrastructure',
        description: 'Annual baseline A-11 to A-15',
        fields: [
            'standardShiftLengthHours',
            'shiftScheduleType',
            'minimumRestPeriodPolicyExists',
            'activePeerSupportTeam',
            'hasEmployeeAssistanceProgram',
        ],
    },
    {
        id: 4,
        title: 'Goals And Strategic Direction',
        description: 'Annual baseline G-1 to G-6',
        fields: [
            'goal1PrimaryAnnualGoal',
            'goal1TargetMetric',
            'goal1Timeframe',
            'goal2SecondaryAnnualGoal',
            'goal2TargetMetric',
            'goal2Timeframe',
        ],
    },
];

export const ANNUAL_INITIAL_VALUES: AnnualFormValues = {
    agencyName: '',
    agencyType: '',
    agencySizeCategory: '',
    primaryServiceJurisdiction: '',
    geographicCoverageArea: '',
    totalAuthorizedPositions: '',
    totalFundedPositions: '',
    minimumSafeStaffingLevel: '',
    specialtyUnitPositionsCount: '',
    supervisorToStaffRatio: '',
    standardShiftLengthHours: '',
    shiftScheduleType: '',
    minimumRestPeriodPolicyExists: '',
    activePeerSupportTeam: '',
    hasEmployeeAssistanceProgram: '',
    goal1PrimaryAnnualGoal: '',
    goal1TargetMetric: '',
    goal1Timeframe: '',
    goal2SecondaryAnnualGoal: '',
    goal2TargetMetric: '',
    goal2Timeframe: '',
};

export const ANNUAL_AGENCY_TYPE_OPTIONS: SelectOption[] = [
    { label: 'Law enforcement', value: 'Law enforcement' },
    { label: 'Fire', value: 'Fire' },
    { label: 'EMS', value: 'EMS' },
    { label: 'Dispatch', value: 'Dispatch' },
    { label: 'Combined', value: 'Combined' },
];

export const ANNUAL_AGENCY_SIZE_OPTIONS: SelectOption[] = [
    { label: 'Small (<25)', value: 'Small (<25)' },
    { label: 'Medium (25-99)', value: 'Medium (25-99)' },
    { label: 'Large (100-299)', value: 'Large (100-299)' },
    { label: 'Major (300+)', value: 'Major (300+)' },
];

export const ANNUAL_SHIFT_SCHEDULE_OPTIONS: SelectOption[] = [
    { label: '8-hour', value: '8-hour' },
    { label: '10-hour', value: '10-hour' },
    { label: '12-hour', value: '12-hour' },
    { label: 'Mixed', value: 'Mixed' },
];

export const YES_NO_OPTIONS: SelectOption[] = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
];

export const PEER_SUPPORT_TEAM_OPTIONS: SelectOption[] = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'In development', value: 'In development' },
];

export const GOAL_1_TIMEFRAME_OPTIONS: SelectOption[] = [
    { label: 'Annual (Q1-Q4)', value: 'Annual (Q1-Q4)' },
    { label: 'First half (Q1-Q2)', value: 'First half (Q1-Q2)' },
    { label: 'Second half (Q3-Q4)', value: 'Second half (Q3-Q4)' },
];

export const GOAL_2_TIMEFRAME_OPTIONS: SelectOption[] = [
    { label: 'Annual', value: 'Annual' },
    { label: 'First half', value: 'First half' },
    { label: 'Second half', value: 'Second half' },
];
