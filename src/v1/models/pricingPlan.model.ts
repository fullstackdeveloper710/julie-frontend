import { Schema, model, Document } from 'mongoose';

export interface IPricingPlanDisplay {
    priceLabel: string;
    priceIntervalLabel: string;
    priceNote?: string;
    promo?: string;
    ctaLabel: string;
}

export interface IPricingPlanFeatures {
    maxUsers: number;
    maxReports: number;
    aiReportsPerMonth: number;
    scenarioModels: number;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    trialDays: number | null;
    adminSeats: number;
    viewerSeats: number;
    additionalAgencyAdminSeats?: number;
    additionalAgencyViewerSeats?: number;
}

export interface IPricingPlan extends Document {
    planKey: string;
    name: string;
    description: string;
    badge?: string;
    display: IPricingPlanDisplay;
    featureHighlights: string[];
    features: IPricingPlanFeatures;
    pricing: {
        monthly: number | null;
        annual: number | null;
    };
    sortOrder: number;
    isActive: boolean;
    foundingAgencyLimit?: number | null;
    hideWhenSoldOut: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PricingPlanDisplaySchema = new Schema<IPricingPlanDisplay>(
    {
        priceLabel: { type: String, required: true, trim: true },
        priceIntervalLabel: { type: String, required: true, trim: true },
        priceNote: { type: String, trim: true },
        promo: { type: String, trim: true },
        ctaLabel: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const PricingPlanFeaturesSchema = new Schema<IPricingPlanFeatures>(
    {
        maxUsers: { type: Number, required: true },
        maxReports: { type: Number, required: true },
        aiReportsPerMonth: { type: Number, required: true },
        scenarioModels: { type: Number, required: true },
        advancedAnalytics: { type: Boolean, required: true },
        apiAccess: { type: Boolean, required: true },
        trialDays: { type: Number, default: null },
        adminSeats: { type: Number, required: true },
        viewerSeats: { type: Number, required: true },
        additionalAgencyAdminSeats: { type: Number },
        additionalAgencyViewerSeats: { type: Number },
    },
    { _id: false }
);

const PricingPlanSchema = new Schema<IPricingPlan>(
    {
        planKey: { type: String, required: true, trim: true, unique: true, index: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        badge: { type: String, trim: true },
        display: { type: PricingPlanDisplaySchema, required: true },
        featureHighlights: { type: [String], default: [] },
        features: { type: PricingPlanFeaturesSchema, required: true },
        pricing: {
            monthly: { type: Number, default: null },
            annual: { type: Number, default: null },
        },
        sortOrder: { type: Number, required: true, default: 0 },
        isActive: { type: Boolean, default: true },
        foundingAgencyLimit: { type: Number, default: null },
        hideWhenSoldOut: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        collection: 'pricing_plans',
    }
);

const PricingPlan = model<IPricingPlan>('PricingPlan', PricingPlanSchema);

export default PricingPlan;