export type TSubscriptionPlan = 'basic' | 'pro' | 'enterprise';
export type TSubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export type TSubscriptionInput = {
    stripeCustomerId: string;
    stripeSubscriptionId?: string;
    plan: TSubscriptionPlan;
    status: TSubscriptionStatus;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd?: boolean;
};

export type TSubscription = TSubscriptionInput & {
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};
