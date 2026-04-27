import Subscription from '../models/subscription.model';

export const getSubscriptionByUserId = async (userId: string) => {
    return await Subscription.findOne({ userId: userId as any });
};

export const createOrUpdateSubscription = async (userId: string, data: any) => {
    return await Subscription.findOneAndUpdate({ userId: userId as any }, data, { upsert: true, new: true });
};
