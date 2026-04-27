import { Document, Schema, Types, model } from 'mongoose';

export enum EResponseMet {
    YES = 'Yes',
    PARTIALLY = 'Partially',
    NO = 'No',
}

export interface IMonthlyDataInput {
    agencyId: Types.ObjectId | string;
    month: string;
    filled?: number;
    authorized?: number;
    vacancies?: number;
    resignations?: number;
    hires?: number;
    timeToFill?: number;
    leadershipVacancies?: number;
    leadershipTotal?: number;
    overtimeHours?: number;
    shiftLength?: number;
    coverageShortages?: number;
    mandatoryOTPercent?: number;
    plannedOTPercent?: number;
    unplannedOTPercent?: number;
    callIns?: number;
    responseMet?: EResponseMet;
    sickLeaveDays?: number;
    fmla?: number;
    fmlaNew?: number;
    workersComp?: number;
    peerSupport?: number;
    incidents?: number;
    lodd?: {
        hasIncident?: boolean;
        count?: number;
    };
    leadershipMorale?: number;
    frontlineMorale?: number;
    discipline?: number;
    grievances?: number;
    promotions?: number;
    createdBy: Types.ObjectId | string;
}

export interface IMonthlyData extends Document, Omit<IMonthlyDataInput, 'agencyId' | 'createdBy'> {
    agencyId: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const nonNegativeNumberField = {
    type: Number,
    min: 0,
};

const LoddSchema = new Schema(
    {
        hasIncident: {
            type: Boolean,
            default: false,
        },
        count: {
            ...nonNegativeNumberField,
            default: 0,
        },
    },
    { _id: false }
);

const MonthlyDataSchema = new Schema<IMonthlyData>(
    {
        agencyId: {
            type: Schema.Types.ObjectId,
            ref: 'agencies',
            required: true,
        },
        month: {
            type: String,
            required: true,
            match: /^\d{4}-(0[1-9]|1[0-2])$/,
            trim: true,
        },
        filled: nonNegativeNumberField,
        authorized: nonNegativeNumberField,
        vacancies: nonNegativeNumberField,
        resignations: nonNegativeNumberField,
        hires: nonNegativeNumberField,
        timeToFill: nonNegativeNumberField,
        leadershipVacancies: nonNegativeNumberField,
        leadershipTotal: nonNegativeNumberField,
        overtimeHours: nonNegativeNumberField,
        shiftLength: nonNegativeNumberField,
        coverageShortages: nonNegativeNumberField,
        mandatoryOTPercent: nonNegativeNumberField,
        plannedOTPercent: nonNegativeNumberField,
        unplannedOTPercent: nonNegativeNumberField,
        callIns: nonNegativeNumberField,
        responseMet: {
            type: String,
            enum: Object.values(EResponseMet),
        },
        sickLeaveDays: nonNegativeNumberField,
        fmla: nonNegativeNumberField,
        fmlaNew: nonNegativeNumberField,
        workersComp: nonNegativeNumberField,
        peerSupport: nonNegativeNumberField,
        incidents: nonNegativeNumberField,
        lodd: {
            type: LoddSchema,
            default: () => ({
                hasIncident: false,
                count: 0,
            }),
        },
        leadershipMorale: {
            type: Number,
            min: 1,
            max: 10,
        },
        frontlineMorale: {
            type: Number,
            min: 1,
            max: 10,
        },
        discipline: nonNegativeNumberField,
        grievances: nonNegativeNumberField,
        promotions: nonNegativeNumberField,
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
    },
    {
        timestamps: true,
        collection: 'monthly_data',
    }
);

MonthlyDataSchema.index({ agencyId: 1, month: 1 }, { unique: true });

const MonthlyData = model<IMonthlyData>('MonthlyData', MonthlyDataSchema);

export default MonthlyData;
