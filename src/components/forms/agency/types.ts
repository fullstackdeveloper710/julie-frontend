export type AgencyFormValues = {
    name: string;
    type: string;
    sizeCategory: string;
    primaryServiceJurisdiction: string;
    coverageArea: string;
    cardholderName: string;
    cardNumber: string;
    cardBrand: string;
    expMonth: string;
    expYear: string;
    postalCode: string;
    billingEmail: string;
};

export const AGENCY_INITIAL_VALUES: AgencyFormValues = {
    name: '',
    type: '',
    sizeCategory: '',
    primaryServiceJurisdiction: '',
    coverageArea: '',
    cardholderName: '',
    cardNumber: '',
    cardBrand: '',
    expMonth: '',
    expYear: '',
    postalCode: '',
    billingEmail: '',
};
