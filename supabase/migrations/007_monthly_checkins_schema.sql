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
