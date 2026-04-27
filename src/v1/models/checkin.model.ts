import { Schema, model, Document, Types } from 'mongoose';
import { TMonthlyCheckin } from '../types/checkin.type';

const MonthlyCheckinSchema = new Schema<TMonthlyCheckin>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        checkinMonth: {
            type: Date,
            default: Date.now,
            required: true,
        },
        staffingLevel: {
            type: Number,
            required: true,
            min: 0,
        },
        openPositions: {
            type: Number,
            required: true,
            min: 0,
        },
        newHires: {
            type: Number,
            required: true,
            min: 0,
        },
        overtimeHours: {
            type: Number,
            required: true,
            min: 0,
        },
        avgOvertimePerEmployee: {
            type: Number,
            required: true,
            min: 0,
        },
        fmlaHours: {
            type: Number,
            required: true,
            min: 0,
        },
        totalLeaveHours: {
            type: Number,
            required: true,
            min: 0,
        },
        separations: {
            type: Number,
            required: true,
            min: 0,
        },
        turnoverRate: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        morale: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },
        topConcern: {
            type: String,
            required: true,
        },
        disciplinaryActions: {
            type: Number,
            required: true,
            min: 0,
        },
        additionalContext: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: 'monthly_checkins',
    }
);

MonthlyCheckinSchema.index({ userId: 1, checkinMonth: 1 }, { unique: true });
MonthlyCheckinSchema.index({ checkinMonth: -1 });

const MonthlyCheckin = model<TMonthlyCheckin>('MonthlyCheckin', MonthlyCheckinSchema);
export default MonthlyCheckin;
