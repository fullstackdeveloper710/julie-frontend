import { Schema, model, Document, Types } from 'mongoose';
import { EReportType } from '../enums/report.enum';
import { boolean } from 'joi';

export interface IReport extends Document {
    userId: Types.ObjectId;
    title: string;
    content: string;
    type: EReportType;
    isDeleted: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(EReportType),
            default: EReportType.Custom,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        collection: 'reports',
    }
);

ReportSchema.index({ userId: 1 });
ReportSchema.index({ createdAt: -1 });

const Report = model<IReport>('Report', ReportSchema);
export default Report;
