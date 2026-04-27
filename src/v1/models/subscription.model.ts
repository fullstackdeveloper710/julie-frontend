import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
    userId: Types.ObjectId;
    stripeCustomerId: string;
    stripeSubscriptionId?: string;
    plan: 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        stripeCustomerId: {
            type: String,
            required: true,
        },
        stripeSubscriptionId: {
            type: String,
        },
        plan: {
            type: String,
            enum: ['basic', 'pro', 'enterprise'],
            default: 'basic',
        },
        status: {
            type: String,
            enum: ['active', 'canceled', 'past_due', 'trialing'],
            default: 'trialing',
        },
        currentPeriodStart: {
            type: Date,
            required: true,
        },
        currentPeriodEnd: {
            type: Date,
            required: true,
        },
        cancelAtPeriodEnd: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: 'subscriptions',
    }
);

SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ stripeCustomerId: 1 });

const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);
export default Subscription;
