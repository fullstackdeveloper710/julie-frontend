import { Schema, model } from 'mongoose';
import { IAnnualCheckin } from '../types/annualCheckin.type';

const AgencyIdentitySchema = new Schema(
    {
        agencyName: { type: String, required: true, trim: true },
        agencyType: {
            type: String,
            required: true,
            enum: ['Law enforcement', 'Fire', 'EMS', 'Dispatch', 'Combined'],
        },
        agencySizeCategory: {
            type: String,
            required: true,
            enum: ['Small (<25)', 'Medium (25-99)', 'Large (100-299)', 'Major (300+)'],
        },
        primaryServiceJurisdiction: { type: String, required: true, trim: true },
        geographicCoverageArea: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const StructuralStaffingProfileSchema = new Schema(
    {
        totalAuthorizedPositions: { type: Number, required: true, min: 0 },
        totalFundedPositions: { type: Number, required: true, min: 0 },
        minimumSafeStaffingLevel: { type: Number, required: true, min: 0 },
        specialtyUnitPositionsCount: { type: Number, required: true, min: 0 },
        supervisorToStaffRatio: {
            type: String,
            required: true,
            trim: true,
            match: /^\d+\s*:\s*\d+$/,
        },
    },
    { _id: false }
);

const OperationalInfrastructureSchema = new Schema(
    {
        standardShiftLengthHours: { type: Number, required: true, min: 0 },
        shiftScheduleType: {
            type: String,
            required: true,
            enum: ['8-hour', '10-hour', '12-hour', 'Mixed'],
        },
        minimumRestPeriodPolicyExists: {
            type: String,
            required: true,
            enum: ['Yes', 'No'],
        },
        activePeerSupportTeam: {
            type: String,
            required: true,
            enum: ['Yes', 'No', 'In development'],
        },
        hasEmployeeAssistanceProgram: {
            type: String,
            required: true,
            enum: ['Yes', 'No'],
        },
    },
    { _id: false }
);

const GoalsAndStrategicDirectionSchema = new Schema(
    {
        goal1PrimaryAnnualGoal: { type: String, required: true, trim: true, maxlength: 4000 },
        goal1TargetMetric: { type: String, trim: true, maxlength: 1000 },
        goal1Timeframe: {
            type: String,
            required: true,
            enum: ['Annual (Q1-Q4)', 'First half (Q1-Q2)', 'Second half (Q3-Q4)'],
        },
        goal2SecondaryAnnualGoal: { type: String, trim: true, maxlength: 4000 },
        goal2TargetMetric: { type: String, trim: true, maxlength: 1000 },
        goal2Timeframe: {
            type: String,
            enum: ['Annual', 'First half', 'Second half'],
        },
    },
    { _id: false }
);

const AnnualCheckinSchema = new Schema<IAnnualCheckin>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        baselineYear: { type: Date, required: true },
        agencyIdentity: { type: AgencyIdentitySchema, required: true },
        structuralStaffingProfile: { type: StructuralStaffingProfileSchema, required: true },
        operationalInfrastructure: { type: OperationalInfrastructureSchema, required: true },
        goalsAndStrategicDirection: { type: GoalsAndStrategicDirectionSchema, required: true },
        editCount: { type: Number, default: 0, min: 0 },
    },
    {
        timestamps: true,
        collection: 'annual_checkins',
    }
);

AnnualCheckinSchema.index({ userId: 1, baselineYear: 1 }, { unique: true });
AnnualCheckinSchema.index({ baselineYear: -1 });

const AnnualCheckin = model<IAnnualCheckin>('AnnualCheckin', AnnualCheckinSchema);
export default AnnualCheckin;
