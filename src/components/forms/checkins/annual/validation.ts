import * as Yup from 'yup';

const requiredNumberField = (label: string) =>
  Yup.number()
    .typeError(`${label} is required`)
    .required(`${label} is required`)
    .min(0, `${label} must be 0 or higher`);

export const annualValidationSchema = Yup.object()
  .shape({
    agencyName: Yup.string().trim().required('Agency name is required'),
    agencyType: Yup.string()
      .oneOf(['Law enforcement', 'Fire', 'EMS', 'Dispatch', 'Combined'], 'Agency type is invalid')
      .required('Agency type is required'),
    agencySizeCategory: Yup.string()
      .oneOf(
        ['Small (<25)', 'Medium (25-99)', 'Large (100-299)', 'Major (300+)'],
        'Agency size category is invalid',
      )
      .required('Agency size category is required'),
    primaryServiceJurisdiction: Yup.string()
      .trim()
      .required('Primary service jurisdiction is required'),
    geographicCoverageArea: requiredNumberField('Geographic coverage area'),
    totalAuthorizedPositions: requiredNumberField('Total authorized positions'),
    totalFundedPositions: requiredNumberField('Total funded positions').test(
      'funded-not-greater-than-authorized',
      'Total funded positions cannot exceed total authorized positions',
      function (value) {
        const funded = Number(value);
        const authorized = Number(
          (this.parent as Record<string, unknown>).totalAuthorizedPositions,
        );
        if (!Number.isFinite(funded) || !Number.isFinite(authorized)) {
          return true;
        }
        return funded <= authorized;
      },
    ),
    minimumSafeStaffingLevel: requiredNumberField('Minimum safe staffing level'),
    specialtyUnitPositionsCount: requiredNumberField('Specialty unit positions count'),
    supervisorToStaffRatio: Yup.string()
      .trim()
      .required('Supervisor-to-staff ratio is required')
      .matches(/^\d+\s*:\s*\d+$/, 'Supervisor-to-staff ratio must be in the format 1:8'),
    standardShiftLengthHours: requiredNumberField('Standard shift length').max(
      24,
      'Standard shift length cannot exceed 24',
    ),
    shiftScheduleType: Yup.string()
      .oneOf(['8-hour', '10-hour', '12-hour', 'Mixed'], 'Shift schedule type is invalid')
      .required('Shift schedule type is required'),
    minimumRestPeriodPolicyExists: Yup.string()
      .oneOf(['Yes', 'No'], 'Minimum rest period policy value is invalid')
      .required('Minimum rest period policy value is required'),
    activePeerSupportTeam: Yup.string()
      .oneOf(['Yes', 'No', 'In development'], 'Active peer support team value is invalid')
      .required('Active peer support team value is required'),
    hasEmployeeAssistanceProgram: Yup.string()
      .oneOf(['Yes', 'No'], 'Employee Assistance Program value is invalid')
      .required('Employee Assistance Program value is required'),
    goal1PrimaryAnnualGoal: Yup.string()
      .trim()
      .required('Primary annual goal is required')
      .max(4000, 'Description is too long'),
    goal1TargetMetric: Yup.string()
      .trim()
      .max(1000, 'Target metric is too long')
      .notRequired(),
    goal1Timeframe: Yup.string()
      .oneOf(
        ['Annual (Q1-Q4)', 'First half (Q1-Q2)', 'Second half (Q3-Q4)'],
        'Timeframe is invalid',
      )
      .required('Timeframe is required'),
    goal2SecondaryAnnualGoal: Yup.string()
      .trim()
      .max(4000, 'Goal 2 description is too long')
      .notRequired(),
    goal2TargetMetric: Yup.string()
      .trim()
      .max(1000, 'Goal 2 target metric is too long')
      .notRequired(),
    goal2Timeframe: Yup.string()
      .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
      .oneOf(['Annual', 'First half', 'Second half'], 'Goal 2 timeframe is invalid')
      .notRequired(),
  })
  .test(
    'goal-metric-required',
    'At least one goal must include a measurable target (percentage, number, or threshold) so the system can track progress and generate accurate recommendations.',
    (values) => {
      if (!values) return false;
      const goal1Metric =
        typeof values.goal1TargetMetric === 'string' ? values.goal1TargetMetric.trim() : '';
      const goal2Metric =
        typeof values.goal2TargetMetric === 'string' ? values.goal2TargetMetric.trim() : '';
      return Boolean(goal1Metric || goal2Metric);
    },
  );
