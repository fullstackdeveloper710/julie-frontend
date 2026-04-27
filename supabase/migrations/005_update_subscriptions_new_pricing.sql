-- Backup existing data (optional, for safety)
CREATE TABLE IF NOT EXISTS public.subscriptions_backup AS SELECT * FROM public.subscriptions;

-- Drop existing constraints and recreate table
ALTER TABLE public.subscriptions DROP POLICY IF EXISTS "Users can view their own subscription";
ALTER TABLE public.subscriptions DROP POLICY IF EXISTS "Service role can manage subscriptions";

-- Rename old table
ALTER TABLE public.subscriptions RENAME TO subscriptions_old;

-- Create new subscriptions table with updated schema
CREATE TABLE public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  agency_id uuid,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  
  -- Pricing tier
  plan text not null check (plan in ('founding', 'early_adopter', 'standard', 'enterprise')) default 'founding',
  
  -- Status
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')) default 'trialing',
  billing_interval text not null check (billing_interval in ('monthly', 'annual')) default 'monthly',
  
  -- Trial tracking (for founding tier)
  trial_start_date timestamp with time zone,
  trial_end_date timestamp with time zone,
  trial_days_remaining integer,
  is_trial_ended boolean default false,
  
  -- Testimonial tracking
  testimonial_required boolean default false,
  testimonial_submitted boolean default false,
  testimonial_submitted_at timestamp with time zone,
  
  -- Founding tier pricing lock
  pricing_locked boolean default false,
  locked_price integer,
  locked_at timestamp with time zone,
  
  -- Check-in tracking
  monthly_checkins_count integer default 0,
  last_checkin_at timestamp with time zone,
  
  -- Enterprise multi-agency
  number_of_agencies integer default 1,
  
  -- Seats allocation
  admin_seats integer default 2,
  viewer_seats integer default 1,
  used_admin_seats integer default 0,
  used_viewer_seats integer default 0,
  
  -- Billing period
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at_period_end boolean default false,
  
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_plan ON public.subscriptions(plan);
CREATE INDEX idx_subscriptions_trial_end_date ON public.subscriptions(trial_end_date);
CREATE INDEX idx_subscriptions_testimonial ON public.subscriptions(testimonial_required, testimonial_submitted);

-- Row-level security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Migrate data from old table (set founding tier with trial)
INSERT INTO public.subscriptions (
  id, user_id, stripe_customer_id, stripe_subscription_id, 
  plan, status, billing_interval, current_period_start, current_period_end,
  cancel_at_period_end, created_at, updated_at,
  trial_start_date, trial_end_date, is_trial_ended
)
SELECT 
  id, user_id, stripe_customer_id, stripe_subscription_id,
  'founding', status, 'monthly', current_period_start, current_period_end,
  cancel_at_period_end, created_at, updated_at,
  created_at, (created_at + interval '90 days'), 
  CASE WHEN current_timestamp > (created_at + interval '90 days') THEN true ELSE false END
FROM public.subscriptions_old
ON CONFLICT DO NOTHING;

-- Drop old table
DROP TABLE IF EXISTS public.subscriptions_old;
