import Analytics from '../models/analytics.model';

/**
 * Log new analytics data point
 */
export const createAnalytics = async (userId: string, data: any) => {
    return await Analytics.create({ ...data, userId });
};

/**
 * Fetch analytics history for the user
 */
export const getAnalyticsByUserId = async (userId: string) => {
    return await Analytics.find({ userId: userId as any }).sort({ createdAt: -1 });
};

/**
 * Get aggregated analytics (Optional - could be added if needed)
 */
export const getAnalyticsSummary = async (userId: string) => {
    return await Analytics.aggregate([
        { $match: { userId: userId as any } },
        { $group: { _id: "$category", totalValue: { $sum: "$value" }, count: { $sum: 1 } } }
    ]);
};
