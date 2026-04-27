-- ============================================
-- 1. Users Table
-- ============================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('admin', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.users enable row level security;

drop policy if exists "Users can view their own profile" on public.users;
drop policy if exists "Users can update their own profile" on public.users;

create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- Add full_name column to users table if it doesn't exist
alter table public.users add column if not exists full_name text;

-- ============================================
-- 2. Subscriptions Table
-- ============================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  plan text not null check (plan in ('basic', 'pro', 'enterprise')) default 'basic',
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')) default 'trialing',
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.subscriptions enable row level security;

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);

drop policy if exists "Users can view their own subscription" on public.subscriptions;
drop policy if exists "Service role can manage subscriptions" on public.subscriptions;

create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on public.subscriptions for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- Add monthly check-ins tracking columns
alter table public.subscriptions add column if not exists monthly_checkins_count integer default 0;
alter table public.subscriptions add column if not exists last_checkin_at timestamp with time zone;

-- ============================================
-- 3. Analytics Data Table
-- ============================================
create table if not exists public.analytics_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date text not null,
  category text not null,
  region text not null,
  value numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.analytics_data enable row level security;

create index if not exists idx_analytics_data_user_date on public.analytics_data(user_id, date);
create index if not exists idx_analytics_data_user_region on public.analytics_data(user_id, region);
create index if not exists idx_analytics_data_user_category on public.analytics_data(user_id, category);

drop policy if exists "Users can view their own analytics" on public.analytics_data;
drop policy if exists "Service role can insert analytics data" on public.analytics_data;

create policy "Users can view their own analytics"
  on public.analytics_data for select
  using (auth.uid() = user_id);

create policy "Service role can insert analytics data"
  on public.analytics_data for insert
  with check (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 4. Reports Table
-- ============================================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  content text not null,
  type text not null check (type in ('scenario', 'analytics', 'custom')) default 'custom',
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.reports enable row level security;

create index if not exists idx_reports_user_id on public.reports(user_id);
create index if not exists idx_reports_created_at on public.reports(created_at);

drop policy if exists "Users can view their own reports" on public.reports;
drop policy if exists "Service role can manage reports" on public.reports;

create policy "Users can view their own reports"
  on public.reports for select
  using (auth.uid() = user_id);

create policy "Service role can manage reports"
  on public.reports for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 5. Alerts Table
-- ============================================
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  severity text not null check (severity in ('critical', 'warning', 'info')),
  department text,
  region text,
  message text not null,
  resolved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  resolved_at timestamp with time zone
);

alter table public.alerts enable row level security;

create index if not exists idx_alerts_user_id on public.alerts(user_id);
create index if not exists idx_alerts_created_at on public.alerts(created_at);
create index if not exists idx_alerts_severity on public.alerts(severity);

drop policy if exists "Users can view their own alerts" on public.alerts;
drop policy if exists "Service role can manage alerts" on public.alerts;

create policy "Users can view their own alerts"
  on public.alerts for select
  using (auth.uid() = user_id);

create policy "Service role can manage alerts"
  on public.alerts for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 6. Agencies Table
-- ============================================
create table if not exists public.agencies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('Law Enforcement', 'Fire Department', 'EMS / Emergency Medical', '911 Dispatch', 'Corrections', 'Government / Enterprise')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.agencies enable row level security;

create index if not exists idx_agencies_user_id on public.agencies(user_id);

drop policy if exists "Users can view their own agency" on public.agencies;
drop policy if exists "Users can update their own agency" on public.agencies;

create policy "Users can view their own agency"
  on public.agencies for select
  using (auth.uid() = user_id);

create policy "Users can update their own agency"
  on public.agencies for update
  using (auth.uid() = user_id);

-- ============================================
-- 7. Monthly Check-ins Table
-- ============================================
create table if not exists public.monthly_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  checkin_month date not null,
  staffing_level integer not null check (staffing_level >= 0),
  open_positions integer not null check (open_positions >= 0),
  new_hires integer not null check (new_hires >= 0),
  overtime_hours numeric not null check (overtime_hours >= 0),
  avg_overtime_per_employee numeric not null check (avg_overtime_per_employee >= 0),
  fmla_hours numeric not null check (fmla_hours >= 0),
  total_leave_hours numeric not null check (total_leave_hours >= 0),
  separations integer not null check (separations >= 0),
  turnover_rate numeric not null check (turnover_rate >= 0 and turnover_rate <= 100),
  morale integer not null check (morale >= 1 and morale <= 10),
  top_concern text not null,
  disciplinary_actions integer not null check (disciplinary_actions >= 0),
  additional_context text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique (user_id, checkin_month)
);

create index if not exists idx_monthly_checkins_user_id
  on public.monthly_checkins(user_id);

create index if not exists idx_monthly_checkins_checkin_month
  on public.monthly_checkins(checkin_month desc);

alter table public.monthly_checkins enable row level security;

drop policy if exists "Users can view their own monthly check-ins" on public.monthly_checkins;
drop policy if exists "Users can insert their own monthly check-ins" on public.monthly_checkins;
drop policy if exists "Users can update their own monthly check-ins" on public.monthly_checkins;
drop policy if exists "Service role can manage monthly check-ins" on public.monthly_checkins;

create policy "Users can view their own monthly check-ins"
  on public.monthly_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert their own monthly check-ins"
  on public.monthly_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own monthly check-ins"
  on public.monthly_checkins for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Service role can manage monthly check-ins"
  on public.monthly_checkins for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');
