import { supabase } from '@/lib/supabase';
import { User } from '@/types';

export async function getCurrentUserServer(): Promise<User | null> {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return null;

        // Fetch user profile from database to get role and updatedAt
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Failed to fetch user profile:', profileError);
            return null;
        }

        return {
            id: user.id,
            email: user.email || '',
            fullName: userProfile?.full_name || '',
            role: userProfile?.role || 'user',
            createdAt: user.created_at,
            updatedAt: profileError ? user.created_at : (userProfile?.updated_at || user.created_at),
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

export async function getCurrentSessionServer() {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        return session;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}
