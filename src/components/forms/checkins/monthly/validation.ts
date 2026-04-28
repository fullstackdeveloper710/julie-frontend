import * as Yup from 'yup';

const requiredNumberField = (label: string) =>
  Yup.number()
    .typeError(`${label} is required`)
    .required(`${label} is required`)
    .min(0, `${label} must be 0 or higher`);

const requiredPercentField = (label: string) =>
  requiredNumberField(label).max(100, `${label} must be 100 or less`);

const optionalNumberField = (label: string) =>
  Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null || typeof originalValue === 'undefined'
        ? undefined
        : value,
    )
    .typeError(`${label} must be a valid number`)
    .min(0, `${label} must be 0 or higher`)
    .notRequired();

export const monthlyValidationSchema = Yup.object().shape({
  currentlyFilledPositions: requiredNumberField('Currently filled positions'),
  currentVacancies: requiredNumberField('Current vacancies'),
  resignationsThisMonth: requiredNumberField('Resignations this month'),
  newHiresAndAcademyGraduates: requiredNumberField('New hires and academy graduates this month'),
  averageTimeToFillDays: requiredNumberField('Average time-to-fill (days)'),
  leadershipLevelVacancies: requiredNumberField('Leadership-level vacancies this month'),
  totalOvertimeHours: requiredNumberField('Total overtime hours this month'),
  averageShiftLengthHours: requiredNumberField('Average shift length this month'),
  shiftCoverageShortages: requiredNumberField('Shift coverage shortages this month'),
  mandatoryOvertimePercentage: requiredPercentField('Mandatory overtime percentage'),
  plannedOvertimePercentage: requiredPercentField('Planned overtime percentage').test(
    'planned-plus-unplanned-100',
    'Planned and unplanned overtime percentages must total 100',
    function (value) {
      const planned = Number(value);
      const unplanned = Number(
        (this.parent as Record<string, unknown>).unplannedOvertimePercentage,
      );
      if (!Number.isFinite(planned) || !Number.isFinite(unplanned)) {
        return true;
      }
      return Math.abs(planned + unplanned - 100) < 0.0001;
    },
  ),
  unplannedOvertimePercentage: requiredPercentField('Unplanned overtime percentage').test(
    'planned-plus-unplanned-100',
    'Planned and unplanned overtime percentages must total 100',
    function (value) {
      const unplanned = Number(value);
      const planned = Number((this.parent as Record<string, unknown>).plannedOvertimePercentage);
      if (!Number.isFinite(unplanned) || !Number.isFinite(planned)) {
        return true;
      }
      return Math.abs(planned + unplanned - 100) < 0.0001;
    },
  ),
  callInAndHoldoverIncidents: requiredNumberField('Call-in and holdover incidents this month'),
  totalSickLeaveDaysUsed: requiredNumberField('Total sick leave days used this month'),
  employeesOnFmlaLeave: requiredNumberField('Employees currently on FMLA leave'),
  newFmlaRequests: requiredNumberField('New FMLA requests this month'),
  workersCompClaimsFiled: requiredNumberField('Workers comp claims filed this month'),
  peerSupportActivations: requiredNumberField('Peer support activations this month'),
  criticalIncidentExposures: requiredNumberField('Critical incident exposures this month'),
  lineOfDutyDeathsOrSeriousInjuries: Yup.string()
    .oneOf(['Yes', 'No'], 'Please select Yes or No')
    .required('Line-of-duty deaths or serious injuries is required'),
  lineOfDutyDeathsOrSeriousInjuriesCount: Yup.number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null || typeof originalValue === 'undefined'
        ? undefined
        : value,
    )
    .typeError('Line-of-duty deaths or serious injuries count must be a valid number')
    .when('lineOfDutyDeathsOrSeriousInjuries', {
      is: 'Yes',
      then: (schema) =>
        schema
          .required('Count is required when line-of-duty deaths or serious injuries is Yes')
          .min(1, 'Count must be at least 1 when Yes is selected'),
      otherwise: (schema) => schema.notRequired().min(0, 'Count must be 0 or higher'),
    }),
  leadershipMoraleRating: Yup.number()
    .typeError('Leadership morale rating is required')
    .required('Leadership morale rating is required')
    .min(1, 'Leadership morale rating must be between 1 and 10')
    .max(10, 'Leadership morale rating must be between 1 and 10'),
  frontlineMoraleRating: Yup.number()
    .typeError('Frontline morale rating is required')
    .required('Frontline morale rating is required')
    .min(1, 'Frontline morale rating must be between 1 and 10')
    .max(10, 'Frontline morale rating must be between 1 and 10'),
  disciplinaryActions: requiredNumberField('Disciplinary actions this month'),
  formalGrievancesFiled: requiredNumberField('Formal grievances or complaints filed this month'),
  promotionsOrLeadershipDevelopmentCount: requiredNumberField(
    'Promotions or leadership development activity',
  ),
  dataConfidence: Yup.string()
    .oneOf(['High', 'Moderate', 'Low'], 'Please select a data confidence level')
    .required('Data confidence level is required'),
  overtimeBudgetUtilizationPercentage: optionalNumberField(
    'Overtime budget utilization percentage',
  ),
  hiringBudgetAvailability: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(['Full', 'Limited', 'Frozen'], 'Hiring budget availability is invalid')
    .notRequired(),
  staffingBudgetConstraint: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(['Yes', 'No', 'Under review'], 'Budget constraint value is invalid')
    .notRequired(),
  totalCallsOrIncidents: optionalNumberField('Total calls or incidents this month'),
  responseTimeStandardsMet: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(['Yes', 'No', 'Partially'], 'Response time standards value is invalid')
    .notRequired(),
  specialtyUnitVacancies: optionalNumberField('Specialty unit vacancies this month'),
  minimumRestPeriodRequirementMet: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(['Yes', 'No', 'No policy'], 'Minimum rest period requirement value is invalid')
    .notRequired(),
  ptoVacationAccrualBacklog: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(
      ['Yes', 'No', 'Some personnel affected'],
      'PTO and vacation accrual backlog value is invalid',
    )
    .notRequired(),
  returnToDutyIncidentsBeforeFullRecovery: optionalNumberField(
    'Return-to-duty incidents before full recovery',
  ),
  eapReferralsOrUtilizations: optionalNumberField('EAP referrals or utilizations this month'),
  topLeadershipConcern: Yup.string()
    .transform((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
    .oneOf(
      [
        'Staffing shortage',
        'Budget strain',
        'Burnout concerns',
        'Leadership turnover',
        'Morale',
        'Legal or compliance',
        'Other',
      ],
      'Top leadership concern is invalid',
    )
    .notRequired(),
  topLeadershipConcernOther: Yup.string().when('topLeadershipConcern', {
    is: 'Other',
    then: (schema) => schema.trim().required('Please specify the "Other" leadership concern'),
    otherwise: (schema) => schema.notRequired(),
  }),
  additionalContextOrNotes: Yup.string().max(4000, 'Additional context is too long').notRequired(),
});
