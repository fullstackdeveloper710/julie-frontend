import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase';
import { Report, ReportGenerationRequest } from '@/types';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set');
}

const client = new Anthropic();

export async function generateReport(request: ReportGenerationRequest): Promise<Report> {
  const { userId, type, data } = request;

  // Build the prompt based on report type
  let prompt = '';

  if (type === 'analytics') {
    prompt = buildAnalyticsPrompt(data);
  } else if (type === 'scenario') {
    prompt = buildScenarioPrompt(data);
  }

  // Call Claude API
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract text content from response
  const content =
    message.content[0].type === 'text'
      ? message.content[0].text
      : 'Unable to generate report';

  // Store report in Supabase
  const { data: report, error } = await supabaseAdmin
    .from('reports')
    .insert([
      {
        user_id: userId,
        title: `${type === 'analytics' ? 'Analytics' : 'Scenario'} Report - ${new Date().toLocaleDateString()}`,
        content,
        type,
        metadata: data,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return report;
}

function buildAnalyticsPrompt(data: Record<string, unknown>): string {
  const {
    startDate = '',
    endDate = '',
    region = 'All',
    category = 'All',
    metrics = {},
  } = data;

  return `Generate a professional analytics report based on the following workforce data:

Period: ${startDate} to ${endDate}
Region: ${region}
Category: ${category}
Data: ${JSON.stringify(metrics, null, 2)}

Please provide:
1. Executive Summary (2-3 paragraphs)
2. Key Metrics Analysis
3. Trends and Insights
4. Recommendations
5. Conclusion

Use professional language and format the report in markdown.`;
}

function buildScenarioPrompt(data: Record<string, unknown>): string {
  const {
    scenario = 'Default Scenario',
    parameters = {},
    baselineMetrics = {},
  } = data;

  return `Generate a detailed scenario modeling report for the following workforce scenario:

Scenario Name: ${scenario}
Scenario Parameters: ${JSON.stringify(parameters, null, 2)}
Baseline Metrics: ${JSON.stringify(baselineMetrics, null, 2)}

Please provide:
1. Scenario Description
2. Expected Impact Analysis
3. Workforce Adjustments Needed
4. Resource Allocation Recommendations
5. Risk Assessment
6. Implementation Timeline
7. Success Metrics

Use professional language and format the report in markdown with clear sections and bullet points.`;
}

export async function getUserReports(userId: string, limit = 10) {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getReport(reportId: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteReport(reportId: string, userId: string) {
  const { error } = await supabaseAdmin
    .from('reports')
    .delete()
    .eq('id', reportId)
    .eq('user_id', userId);

  if (error) throw error;
}
