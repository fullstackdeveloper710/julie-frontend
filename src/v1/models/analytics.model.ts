import { Schema, model, Document, Types } from 'mongoose';

export interface IAnalytics extends Document {
    userId: Types.ObjectId;
    date: string;
    category: string;
    region: string;
    value: number;
    createdAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        region: {
            type: String,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: 'analytics_data',
    }
);

AnalyticsSchema.index({ userId: 1, date: 1 });
AnalyticsSchema.index({ userId: 1, region: 1 });
AnalyticsSchema.index({ userId: 1, category: 1 });

const Analytics = model<IAnalytics>('Analytics', AnalyticsSchema);
export default Analytics;
