import { Schema, model, Document, Types } from 'mongoose';
import { EAgencyType, EAgencySize } from '../enums/agency.enum';

export interface IAgency extends Document {
    userId: Types.ObjectId;
    name: string;
    type: EAgencyType;
    sizeCategory: EAgencySize;
    primaryServiceJurisdiction: string;
    coverageArea: number;
    createdAt: Date;
    updatedAt: Date;
}

const AgencySchema = new Schema<IAgency>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: Object.values(EAgencyType),
            required: true,
        },
        sizeCategory: {
            type: String,
            enum: Object.values(EAgencySize),
            required: true,
        },
        primaryServiceJurisdiction: {
            type: String,
            trim: true,
        },
        coverageArea: {
            type: Number,
        },
    },
    {
        timestamps: true,
        collection: 'agencies',
    }
);

AgencySchema.index({ userId: 1 });

const Agency = model<IAgency>('Agency', AgencySchema);
export default Agency;
