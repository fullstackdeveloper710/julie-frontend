import type { AgencyInput, AgencyType, AgencySize, AgencyBilling } from '@/redux/api/agencyApi';
import type { Agency } from '@/redux/api/agencyApi';
import { AgencyFormValues, AGENCY_INITIAL_VALUES } from './types';

const last4 = (cardNumber: string): string | undefined => {
    const digits = cardNumber.replace(/\s+/g, '');
    if (!digits) return undefined;
    return digits.slice(-4);
};

const trimOrUndefined = (value: string): string | undefined => {
    const next = value.trim();
    return next ? next : undefined;
};

const numberOrUndefined = (value: string): number | undefined => {
    const next = value.trim();
    if (!next) return undefined;
    const parsed = Number(next);
    return Number.isFinite(parsed) ? parsed : undefined;
};

export const buildAgencyPayload = (values: AgencyFormValues): AgencyInput => {
    const billingPartial: AgencyBilling = {
        cardholderName: trimOrUndefined(values.cardholderName),
        cardLast4: last4(values.cardNumber),
        cardBrand: trimOrUndefined(values.cardBrand),
        expMonth: numberOrUndefined(values.expMonth),
        expYear: numberOrUndefined(values.expYear),
        postalCode: trimOrUndefined(values.postalCode),
        billingEmail: trimOrUndefined(values.billingEmail),
    };

    const hasBilling = Object.values(billingPartial).some(
        (v) => v !== undefined && v !== ''
    );

    return {
        name: values.name.trim(),
        type: values.type as AgencyType,
        sizeCategory: values.sizeCategory as AgencySize,
        primaryServiceJurisdiction: values.primaryServiceJurisdiction.trim(),
        coverageArea: Number(values.coverageArea),
        billing: hasBilling ? billingPartial : undefined,
    };
};

export const agencyToFormValues = (agency: Agency | undefined): AgencyFormValues => {
    if (!agency) return AGENCY_INITIAL_VALUES;
    const billing = agency.billing ?? {};
    return {
        name: agency.name ?? '',
        type: agency.type ?? '',
        sizeCategory: agency.sizeCategory ?? '',
        primaryServiceJurisdiction: agency.primaryServiceJurisdiction ?? '',
        coverageArea:
            agency.coverageArea !== undefined && agency.coverageArea !== null
                ? String(agency.coverageArea)
                : '',
        cardholderName: billing.cardholderName ?? '',
        // Card number itself is never returned by the backend (only last4); leave blank.
        cardNumber: '',
        cardBrand: billing.cardBrand ?? '',
        expMonth: billing.expMonth ? String(billing.expMonth) : '',
        expYear: billing.expYear ? String(billing.expYear) : '',
        postalCode: billing.postalCode ?? '',
        billingEmail: billing.billingEmail ?? '',
    };
};
