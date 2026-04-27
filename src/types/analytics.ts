export interface WorkforceMetric {
  id: string;
  userId: string;
  date: string;
  category: string;
  region: string;
  value: number;
  createdAt: string;
}

export interface AnalyticsFilter {
  startDate?: string;
  endDate?: string;
  region?: string;
  category?: string;
}
