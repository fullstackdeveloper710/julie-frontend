import { supabase, supabaseAdmin } from '@/lib/supabase';
import { WorkforceMetric, AnalyticsFilter } from '@/types';

export async function insertAnalyticsDataServer(
    userId: string,
    metrics: WorkforceMetric[]
) {
    try {
        const data = metrics.map((m) => ({
            user_id: userId,
            date: m.date,
            category: m.category,
            region: m.region,
            value: m.value,
        }));

        const { error } = await supabaseAdmin.from('analytics_data').insert(data);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error inserting analytics data:', error);
        throw error;
    }
}

export async function getAnalyticsDataServer(
    userId: string,
    filters: AnalyticsFilter = {}
) {
    try {
        let query = supabase
            .from('analytics_data')
            .select('*')
            .eq('user_id', userId);

        if (filters.startDate) {
            query = query.gte('date', filters.startDate);
        }

        if (filters.endDate) {
            query = query.lte('date', filters.endDate);
        }

        if (filters.region) {
            query = query.eq('region', filters.region);
        }

        if (filters.category) {
            query = query.eq('category', filters.category);
        }

        const { data, error } = await query.order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        throw error;
    }
}

export async function getDashboardMetricsServer(userId: string) {
    try {
        const { data, error } = await supabase.rpc('get_dashboard_metrics', {
            p_user_id: userId,
        });

        if (error) {
            // Fallback if RPC doesn't exist yet
            console.warn('RPC function not available, returning basic data');
            const rawData = await supabase
                .from('analytics_data')
                .select('category, region, value')
                .eq('user_id', userId)
                .order('date', { ascending: false })
                .limit(100);

            if (rawData.error) throw rawData.error;

            // Group by category
            const grouped: Record<string, number> = {};
            rawData.data?.forEach((item: any) => {
                grouped[item.category] = (grouped[item.category] || 0) + item.value;
            });

            return {
                byCategory: grouped,
                byRegion: {},
                total: Object.values(grouped).reduce((a, b) => a + b, 0),
            };
        }

        return data;
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        throw error;
    }
}

export async function getAvailableRegionsServer(userId: string) {
    try {
        const { data, error } = await supabase
            .from('analytics_data')
            .select('region')
            .eq('user_id', userId)
            .order('region');

        if (error) throw error;

        // Remove duplicates
        const regions = [...new Set(data?.map((d) => d.region) || [])];
        return regions;
    } catch (error) {
        console.error('Error fetching regions:', error);
        throw error;
    }
}

export async function getAvailableCategoriesServer(userId: string) {
    try {
        const { data, error } = await supabase
            .from('analytics_data')
            .select('category')
            .eq('user_id', userId)
            .order('category');

        if (error) throw error;

        // Remove duplicates
        const categories = [...new Set(data?.map((d) => d.category) || [])];
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export async function getMetricsSummaryServer(
    userId: string,
    startDate: string,
    endDate: string
) {
    try {
        const { data, error } = await supabase
            .from('analytics_data')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate)
            .lte('date', endDate);

        if (error) throw error;

        // Calculate summary statistics
        const summary = {
            totalRecords: data?.length || 0,
            averageValue: 0,
            maxValue: 0,
            minValue: 0,
            byCategory: {} as Record<string, number>,
            byRegion: {} as Record<string, number>,
        };

        if (data && data.length > 0) {
            const values = data.map((d) => d.value);
            summary.averageValue = values.reduce((a, b) => a + b, 0) / values.length;
            summary.maxValue = Math.max(...values);
            summary.minValue = Math.min(...values);

            // Group by category and region
            data.forEach((item: any) => {
                summary.byCategory[item.category] = (summary.byCategory[item.category] || 0) + 1;
                summary.byRegion[item.region] = (summary.byRegion[item.region] || 0) + 1;
            });
        }

        return summary;
    } catch (error) {
        console.error('Error fetching metrics summary:', error);
        throw error;
    }
}
