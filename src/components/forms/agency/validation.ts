import * as Yup from 'yup';

export const agencyValidationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Agency name is required').max(200),
    type: Yup.string()
        .oneOf(
            ['Law enforcement', 'Fire', 'EMS', 'Dispatch', 'Combined'],
            'Agency type is invalid'
        )
        .required('Agency type is required'),
    sizeCategory: Yup.string()
        .oneOf(
            ['Small (<25)', 'Medium (25-99)', 'Large (100-299)', 'Major (300+)'],
            'Agency size category is invalid'
        )
        .required('Agency size category is required'),
    primaryServiceJurisdiction: Yup.string()
        .trim()
        .required('Primary service jurisdiction is required')
        .max(200),
    coverageArea: Yup.number()
        .typeError('Geographic coverage area is required')
        .required('Geographic coverage area is required')
        .min(0, 'Geographic coverage area must be 0 or higher'),
    // Billing — entirely optional placeholder fields. Stripe will replace this
    // section later. We validate shape only when the user types something so
    // partial entries do not block submission.
    cardholderName: Yup.string().trim().max(200).notRequired(),
    cardNumber: Yup.string()
        .transform((value) => (typeof value === 'string' ? value.replace(/\s+/g, '') : value))
        .matches(/^\d{12,19}$/, {
            message: 'Card number must be 12-19 digits',
            excludeEmptyString: true,
        })
        .notRequired(),
    cardBrand: Yup.string()
        .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
        .oneOf(
            ['Visa', 'Mastercard', 'American Express', 'Discover', 'Other'],
            'Card brand is invalid'
        )
        .notRequired(),
    expMonth: Yup.number()
        .transform((value, originalValue) =>
            originalValue === '' || originalValue == null ? undefined : value
        )
        .typeError('Expiry month must be a number')
        .min(1, 'Expiry month must be 1-12')
        .max(12, 'Expiry month must be 1-12')
        .notRequired(),
    expYear: Yup.number()
        .transform((value, originalValue) =>
            originalValue === '' || originalValue == null ? undefined : value
        )
        .typeError('Expiry year must be a number')
        .min(new Date().getFullYear(), 'Expiry year cannot be in the past')
        .max(2100, 'Expiry year is too far in the future')
        .notRequired(),
    postalCode: Yup.string().trim().max(20).notRequired(),
    billingEmail: Yup.string()
        .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
        .email('Billing email must be a valid email')
        .notRequired(),
});
