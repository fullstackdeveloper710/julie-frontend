import { getCurrentUserServer } from '@/services/auth-server';
import {
  getAnalyticsDataServer,
  getDashboardMetricsServer,
  getAvailableRegionsServer,
  getAvailableCategoriesServer,
  getMetricsSummaryServer,
} from '@/services/analytics-server';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUserServer();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'data'; // 'data', 'dashboard', 'regions', 'categories', 'summary'
    const startDate = searchParams.get('startDate') ?? undefined;
    const endDate = searchParams.get('endDate') ?? undefined;
    const region = searchParams.get('region') ?? undefined;
    const category = searchParams.get('category') ?? undefined;

    let result;

    switch (type) {
      case 'dashboard':
        result = await getDashboardMetricsServer(user.id);
        break;

      case 'regions':
        result = await getAvailableRegionsServer(user.id);
        break;

      case 'categories':
        result = await getAvailableCategoriesServer(user.id);
        break;

      case 'summary':
        if (!startDate || !endDate) {
          return new Response(
            JSON.stringify({ error: 'Missing startDate or endDate for summary' }),
            { status: 400 }
          );
        }
        result = await getMetricsSummaryServer(user.id, startDate, endDate);
        break;

      case 'data':
      default:
        result = await getAnalyticsDataServer(user.id, {
          startDate,
          endDate,
          region,
          category,
        });
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch analytics' }),
      { status: 500 }
    );
  }
}
