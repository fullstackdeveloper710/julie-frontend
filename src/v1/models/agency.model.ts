import { Schema, model, Document, Types } from 'mongoose';
import { EAgencyType, EAgencySize } from '../enums/agency.enum';

/**
 * Billing details are stored in plain fields for now. Stripe integration will
 * replace this subdocument with a customer/payment-method id + last4 metadata,
 * so we deliberately keep the shape narrow and PCI-friendly (no full PAN).
 */
export interface IAgencyBilling {
    cardholderName?: string;
    cardLast4?: string;
    cardBrand?: string;
    expMonth?: number;
    expYear?: number;
    postalCode?: string;
    billingEmail?: string;
}

export interface IAgency extends Document {
    userId: Types.ObjectId;
    name: string;
    type: EAgencyType;
    sizeCategory: EAgencySize;
    primaryServiceJurisdiction: string;
    coverageArea: number;
    billing?: IAgencyBilling;
    createdAt: Date;
    updatedAt: Date;
}

const BillingSchema = new Schema<IAgencyBilling>(
    {
        cardholderName: { type: String, trim: true, maxlength: 200 },
        cardLast4: { type: String, trim: true, match: /^\d{4}$/ },
        cardBrand: { type: String, trim: true, maxlength: 50 },
        expMonth: { type: Number, min: 1, max: 12 },
        expYear: { type: Number, min: 2024, max: 2100 },
        postalCode: { type: String, trim: true, maxlength: 20 },
        billingEmail: { type: String, trim: true, lowercase: true, maxlength: 200 },
    },
    { _id: false }
);

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
            maxlength: 200,
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
            required: true,
            maxlength: 200,
        },
        coverageArea: {
            type: Number,
            required: true,
            min: 0,
        },
        billing: { type: BillingSchema, default: undefined },
    },
    {
        timestamps: true,
        collection: 'agencies',
    }
);

AgencySchema.index({ userId: 1 });
AgencySchema.index({ userId: 1, name: 1 }, { unique: true });

const Agency = model<IAgency>('Agency', AgencySchema);
export default Agency;
