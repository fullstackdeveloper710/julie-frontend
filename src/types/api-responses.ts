export interface ApiSuccess<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface AnalyticsData {
  id: string;
  date: string;
  metric: string;
  value: number;
  category?: string;
  region?: string;
  reportId?: string;
  scenarioId?: string;
  scenario?: string;
  [key: string]: any;
}

export interface AnalyticsResponse {
  data: AnalyticsData[];
  summary?: Record<string, any>;
}

export interface MonthlyCheckInResponse {
  success: boolean;
  created: boolean;
  checkIn: Record<string, any>;
}

export interface AnnualBaselineResponse {
  success: boolean;
  created: boolean;
  baseline: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
