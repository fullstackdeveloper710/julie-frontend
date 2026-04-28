import * as Yup from 'yup';

export const agencyValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Agency name is required').max(200),
  type: Yup.string()
    .oneOf(['Law enforcement', 'Fire', 'EMS', 'Dispatch', 'Combined'], 'Agency type is invalid')
    .required('Agency type is required'),
  sizeCategory: Yup.string()
    .oneOf(
      ['Small (<25)', 'Medium (25-99)', 'Large (100-299)', 'Major (300+)'],
      'Agency size category is invalid',
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
});
