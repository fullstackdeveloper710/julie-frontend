import { SelectOption } from '@/components/forms/checkins/shared/types';

export const AGENCY_TYPE_OPTIONS: SelectOption[] = [
    { label: 'Law enforcement', value: 'Law enforcement' },
    { label: 'Fire', value: 'Fire' },
    { label: 'EMS', value: 'EMS' },
    { label: 'Dispatch', value: 'Dispatch' },
    { label: 'Combined', value: 'Combined' },
];

export const AGENCY_SIZE_OPTIONS: SelectOption[] = [
    { label: 'Small (<25)', value: 'Small (<25)' },
    { label: 'Medium (25-99)', value: 'Medium (25-99)' },
    { label: 'Large (100-299)', value: 'Large (100-299)' },
    { label: 'Major (300+)', value: 'Major (300+)' },
];
