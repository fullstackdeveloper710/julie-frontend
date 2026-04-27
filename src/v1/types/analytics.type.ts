export type TAnalyticsInput = {
    date: string;
    category: string;
    region: string;
    value: number;
};

export type TAnalytics = TAnalyticsInput & {
    userId: string;
    createdAt: Date;
};
