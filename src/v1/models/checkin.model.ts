import { Schema, model } from 'mongoose';
import { IMonthlyCheckin } from '../types/checkin.type';

const requiredNonNegative = { type: Number, required: true, min: 0 };
const optionalNonNegative = { type: Number, min: 0 };

const OrganizationalStabilitySchema = new Schema(
    {
        currentlyFilledPositions: requiredNonNegative,
        currentVacancies: requiredNonNegative,
        resignationsThisMonth: requiredNonNegative,
        newHiresAndAcademyGraduates: requiredNonNegative,
        averageTimeToFillDays: requiredNonNegative,
        leadershipLevelVacancies: requiredNonNegative,
    },
    { _id: false }
);

const OperationalResilienceSchema = new Schema(
    {
        totalOvertimeHours: requiredNonNegative,
        averageShiftLengthHours: requiredNonNegative,
        shiftCoverageShortages: requiredNonNegative,
        mandatoryOvertimePercentage: { type: Number, required: true, min: 0, max: 100 },
        plannedOvertimePercentage: { type: Number, required: true, min: 0, max: 100 },
        unplannedOvertimePercentage: { type: Number, required: true, min: 0, max: 100 },
        callInAndHoldoverIncidents: requiredNonNegative,
    },
    { _id: false }
);

const FatigueResistanceSchema = new Schema(
    {
        totalSickLeaveDaysUsed: requiredNonNegative,
    },
    { _id: false }
);

const PeerSupportReadinessSchema = new Schema(
    {
        employeesOnFmlaLeave: requiredNonNegative,
        newFmlaRequests: requiredNonNegative,
        workersCompClaimsFiled: requiredNonNegative,
        peerSupportActivations: requiredNonNegative,
        criticalIncidentExposures: requiredNonNegative,
        lineOfDutyDeathsOrSeriousInjuries: {
            type: String,
            required: true,
            enum: ['Yes', 'No'],
        },
        lineOfDutyDeathsOrSeriousInjuriesCount: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const LeadershipSustainabilitySchema = new Schema(
    {
        leadershipMoraleRating: { type: Number, required: true, min: 1, max: 10 },
        frontlineMoraleRating: { type: Number, required: true, min: 1, max: 10 },
        disciplinaryActions: requiredNonNegative,
        formalGrievancesFiled: requiredNonNegative,
        promotionsOrLeadershipDevelopmentCount: requiredNonNegative,
    },
    { _id: false }
);

const BudgetAndFiscalContextSchema = new Schema(
    {
        overtimeBudgetUtilizationPercentage: optionalNonNegative,
        hiringBudgetAvailability: { type: String, enum: ['Full', 'Limited', 'Frozen'] },
        staffingBudgetConstraint: { type: String, enum: ['Yes', 'No', 'Under review'] },
    },
    { _id: false }
);

const OperationalDemandContextSchema = new Schema(
    {
        totalCallsOrIncidents: optionalNonNegative,
        responseTimeStandardsMet: { type: String, enum: ['Yes', 'No', 'Partially'] },
        specialtyUnitVacancies: optionalNonNegative,
    },
    { _id: false }
);

const FatiguePrecisionInputsSchema = new Schema(
    {
        minimumRestPeriodRequirementMet: { type: String, enum: ['Yes', 'No', 'No policy'] },
        ptoVacationAccrualBacklog: { type: String, enum: ['Yes', 'No', 'Some personnel affected'] },
        returnToDutyIncidentsBeforeFullRecovery: optionalNonNegative,
    },
    { _id: false }
);

const PeerSupportDepthInputsSchema = new Schema(
    {
        eapReferralsOrUtilizations: optionalNonNegative,
        topLeadershipConcern: {
            type: String,
            enum: [
                'Staffing shortage',
                'Budget strain',
                'Burnout concerns',
                'Leadership turnover',
                'Morale',
                'Legal or compliance',
                'Other',
            ],
        },
        topLeadershipConcernOther: { type: String, trim: true, maxlength: 500 },
        additionalContextOrNotes: { type: String, trim: true, maxlength: 4000 },
    },
    { _id: false }
);

const MonthlyOptionalSchema = new Schema(
    {
        budgetAndFiscalContext: BudgetAndFiscalContextSchema,
        operationalDemandContext: OperationalDemandContextSchema,
        fatiguePrecisionInputs: FatiguePrecisionInputsSchema,
        peerSupportDepthInputs: PeerSupportDepthInputsSchema,
    },
    { _id: false }
);

const MonthlyCheckinSchema = new Schema<IMonthlyCheckin>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        checkinMonth: {
            type: Date,
            required: true,
        },
        organizationalStability: { type: OrganizationalStabilitySchema, required: true },
        operationalResilience: { type: OperationalResilienceSchema, required: true },
        fatigueResistance: { type: FatigueResistanceSchema, required: true },
        peerSupportReadiness: { type: PeerSupportReadinessSchema, required: true },
        leadershipSustainability: { type: LeadershipSustainabilitySchema, required: true },
        dataConfidence: {
            type: String,
            required: true,
            enum: ['High', 'Moderate', 'Low'],
        },
        optional: MonthlyOptionalSchema,
    },
    {
        timestamps: true,
        collection: 'monthly_checkins',
    }
);

MonthlyCheckinSchema.index({ userId: 1, checkinMonth: 1 }, { unique: true });
MonthlyCheckinSchema.index({ checkinMonth: -1 });

const MonthlyCheckin = model<IMonthlyCheckin>('MonthlyCheckin', MonthlyCheckinSchema);
export default MonthlyCheckin;
