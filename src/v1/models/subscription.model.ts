import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
    userId: Types.ObjectId;
    stripeCustomerId: string;
    stripeSubscriptionId?: string;

    plan: 'founder' | 'essentials' | 'professional' | 'enterprise';
    billingInterval: 'monthly' | 'annual';

    status: 'active' | 'canceled' | 'past_due' | 'trialing';

    isFoundingRate: boolean;
    foundingRateLockedPrice: number | null;       
    billingPausedUntil: Date | null;              
    foundingRateActivatedAt: Date | null;         
    foundingRateCommitmentEndDate: Date | null;    
    consecutiveCheckins: number;                   
    foundingRateDowngradedAt: Date | null; 
    testimonialRequired: boolean;
    testimonialSubmitted: boolean;
    testimonialSubmittedAt: Date | null;
    pricingLocked: boolean;
    lockedPrice: number | null;
    lockedAt: Date | null;
    monthlyCheckinsCount: number;
    lastCheckinAt: Date | null;
    numberOfAgencies: number;
    adminSeats: number;
    viewerSeats: number;
    usedAdminSeats: number;
    usedViewerSeats: number;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        stripeCustomerId: { type: String, required: true },
        stripeSubscriptionId: { type: String },

        plan: {
            type: String,
            enum: ['founder', 'essentials', 'professional', 'enterprise'],
            default: 'essentials',
        },
        billingInterval: {
            type: String,
            enum: ['monthly', 'annual'],
            default: 'monthly',
        },
        status: {
            type: String,
            enum: ['active', 'canceled', 'past_due', 'trialing'],
            default: 'trialing',
        },

        isFoundingRate: { type: Boolean, default: false },
        foundingRateLockedPrice: { type: Number, default: null },
        billingPausedUntil: { type: Date, default: null },
        foundingRateActivatedAt: { type: Date, default: null },
        foundingRateCommitmentEndDate: { type: Date, default: null },
        consecutiveCheckins: { type: Number, default: 0, min: 0 },
        foundingRateDowngradedAt: { type: Date, default: null },
        testimonialRequired: { type: Boolean, default: false },
        testimonialSubmitted: { type: Boolean, default: false },
        testimonialSubmittedAt: { type: Date, default: null },
        pricingLocked: { type: Boolean, default: false },
        lockedPrice: { type: Number, default: null },
        lockedAt: { type: Date, default: null },
        monthlyCheckinsCount: { type: Number, default: 0 },
        lastCheckinAt: { type: Date, default: null },
        numberOfAgencies: { type: Number, default: 1 },
        adminSeats: { type: Number, default: 2 },
        viewerSeats: { type: Number, default: 1 },
        usedAdminSeats: { type: Number, default: 0 },
        usedViewerSeats: { type: Number, default: 0 },
        currentPeriodStart: { type: Date, required: true },
        currentPeriodEnd: { type: Date, required: true },
        cancelAtPeriodEnd: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        collection: 'subscriptions',
    }
);

SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ stripeCustomerId: 1 });
SubscriptionSchema.index({ isFoundingRate: 1, plan: 1 }); // for counting founding rate activations

const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);
export default Subscription;
