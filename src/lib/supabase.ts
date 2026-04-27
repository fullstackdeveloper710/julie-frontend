import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for browser and server (uses session from context)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Service role client - only use server-side with proper validation
// Use the anon key as fallback if service key is not available
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseKey
);

// Type helpers for database tables
export type Tables = {
  users: {
    Row: {
      id: string;
      email: string;
      role: 'admin' | 'user';
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      email: string;
      role?: 'admin' | 'user';
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      email?: string;
      role?: 'admin' | 'user';
      updated_at?: string;
    };
  };
  organizations: {
    Row: {
      id: string;
      name: string;
      slug: string;
      owner_id: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      slug: string;
      owner_id: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      name?: string;
      slug?: string;
      updated_at?: string;
    };
  };
  memberships: {
    Row: {
      id: string;
      organization_id: string;
      user_id: string;
      role: 'admin' | 'member';
      created_at: string;
    };
    Insert: {
      id?: string;
      organization_id: string;
      user_id: string;
      role: 'admin' | 'member';
      created_at?: string;
    };
    Update: {
      role?: 'admin' | 'member';
    };
  };
  subscriptions: {
    Row: {
      id: string;
      user_id: string;
      stripe_customer_id: string;
      stripe_subscription_id: string | null;
      plan: 'basic' | 'pro' | 'enterprise';
      status: 'active' | 'canceled' | 'past_due' | 'trialing';
      current_period_start: string;
      current_period_end: string;
      cancel_at_period_end: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      stripe_customer_id: string;
      stripe_subscription_id?: string | null;
      plan: 'basic' | 'pro' | 'enterprise';
      status: 'active' | 'canceled' | 'past_due' | 'trialing';
      current_period_start: string;
      current_period_end: string;
      cancel_at_period_end?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      plan?: 'basic' | 'pro' | 'enterprise';
      status?: 'active' | 'canceled' | 'past_due' | 'trialing';
      stripe_subscription_id?: string | null;
      current_period_end?: string;
      cancel_at_period_end?: boolean;
      updated_at?: string;
    };
  };
  analytics_data: {
    Row: {
      id: string;
      user_id: string;
      date: string;
      category: string;
      region: string;
      value: number;
      created_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      date: string;
      category: string;
      region: string;
      value: number;
      created_at?: string;
    };
    Update: {
      value?: number;
    };
  };
  reports: {
    Row: {
      id: string;
      user_id: string;
      title: string;
      content: string;
      type: 'scenario' | 'analytics' | 'custom';
      metadata: Record<string, unknown>;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      title: string;
      content: string;
      type: 'scenario' | 'analytics' | 'custom';
      metadata?: Record<string, unknown>;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      title?: string;
      content?: string;
      metadata?: Record<string, unknown>;
      updated_at?: string;
    };
  };
};
