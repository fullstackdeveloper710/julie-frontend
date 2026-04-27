export interface Report {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'scenario' | 'analytics' | 'custom';
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ReportGenerationRequest {
  userId: string;
  type: 'scenario' | 'analytics';
  data: Record<string, unknown>;
}
