export type StepConfig = {
    id: number;
    title: string;
    description: string;
    fields: string[];
};

export type SelectOption = {
    label: string;
    value: string;
};

export type NumberFieldOptions = {
    min?: string | number;
    max?: string | number;
    step?: string | number;
};
