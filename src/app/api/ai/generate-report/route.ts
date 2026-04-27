import { generateReport, getUserReports } from '@/services/anthropic';
import { getCurrentUserServer } from '@/services/auth-server';
import { supabase } from '@/lib/supabase';
import { PLAN_FEATURES } from '@/types';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUserServer();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { type, data } = await request.json();

    if (!type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
      });
    }

    // Check subscription plan limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (!subscription) {
      return new Response(JSON.stringify({ error: 'No subscription found' }), {
        status: 402,
      });
    }

    const planFeatures = PLAN_FEATURES[subscription.plan as keyof typeof PLAN_FEATURES];
    const reportsThisMonth = await countReportsThisMonth(user.id);

    if (
      planFeatures.aiReportsPerMonth !== -1 &&
      reportsThisMonth >= planFeatures.aiReportsPerMonth
    ) {
      return new Response(
        JSON.stringify({
          error: 'Report limit reached for this month',
          limit: planFeatures.aiReportsPerMonth,
          used: reportsThisMonth,
        }),
        { status: 429 }
      );
    }

    // Generate report
    const report = await generateReport({
      userId: user.id,
      type: type as 'scenario' | 'analytics',
      data,
    });

    return new Response(JSON.stringify(report), { status: 200 });
  } catch (error: any) {
    console.error('Report generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate report' }),
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserServer();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const reports = await getUserReports(user.id, limit);

    return new Response(JSON.stringify(reports), { status: 200 });
  } catch (error: any) {
    console.error('Get reports error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch reports' }),
      { status: 500 }
    );
  }
}

async function countReportsThisMonth(userId: string): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const { data, error } = await supabase
    .from('reports')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', `${startOfMonth}T00:00:00`)
    .lte('created_at', `${endOfMonth}T23:59:59`);

  if (error) {
    console.error('Count reports error:', error);
    return 0;
  }

  return data?.length || 0;
}
