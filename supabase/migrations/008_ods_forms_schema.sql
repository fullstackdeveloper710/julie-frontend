alter table public.monthly_checkins
  add column if not exists core_payload jsonb,
  add column if not exists optional_payload jsonb,
  add column if not exists data_confidence text;

alter table public.monthly_checkins
  drop constraint if exists monthly_checkins_data_confidence_check;

alter table public.monthly_checkins
  add constraint monthly_checkins_data_confidence_check
  check (data_confidence in ('High', 'Moderate', 'Low') or data_confidence is null);

create table if not exists public.annual_baselines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  baseline_year date not null,
  agency_identity jsonb not null,
  structural_staffing_profile jsonb not null,
  operational_infrastructure jsonb not null,
  goals_and_strategic_direction jsonb not null,
  baseline_payload jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique (user_id, baseline_year)
);

create index if not exists idx_annual_baselines_user_id
  on public.annual_baselines(user_id);

create index if not exists idx_annual_baselines_baseline_year
  on public.annual_baselines(baseline_year desc);

alter table public.annual_baselines enable row level security;

drop policy if exists "Users can view their own annual baselines" on public.annual_baselines;
drop policy if exists "Users can insert their own annual baselines" on public.annual_baselines;
drop policy if exists "Users can update their own annual baselines" on public.annual_baselines;
drop policy if exists "Service role can manage annual baselines" on public.annual_baselines;

create policy "Users can view their own annual baselines"
  on public.annual_baselines for select
  using (auth.uid() = user_id);

create policy "Users can insert their own annual baselines"
  on public.annual_baselines for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own annual baselines"
  on public.annual_baselines for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Service role can manage annual baselines"
  on public.annual_baselines for all
  using (auth.jwt() ->> 'role' = 'service_role')
  with check (auth.jwt() ->> 'role' = 'service_role');