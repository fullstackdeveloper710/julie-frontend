export type AgencyFormValues = {
    name: string;
    type: string;
    sizeCategory: string;
    primaryServiceJurisdiction: string;
    coverageArea: string;
};

export const AGENCY_INITIAL_VALUES: AgencyFormValues = {
    name: '',
    type: '',
    sizeCategory: '',
    primaryServiceJurisdiction: '',
    coverageArea: '',
};
