create table public.reports (
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

create index idx_reports_user_id on public.reports(user_id);
create index idx_reports_created_at on public.reports(created_at);

create policy "Users can view their own reports"
  on public.reports for select
  using (auth.uid() = user_id);

create policy "Service role can manage reports"
  on public.reports for all
  using (auth.jwt() ->> 'role' = 'service_role');
