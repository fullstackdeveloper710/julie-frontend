create table public.analytics_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date text not null,
  category text not null,
  region text not null,
  value numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.analytics_data enable row level security;

create index idx_analytics_data_user_date on public.analytics_data(user_id, date);
create index idx_analytics_data_user_region on public.analytics_data(user_id, region);
create index idx_analytics_data_user_category on public.analytics_data(user_id, category);

create policy "Users can view their own analytics"
  on public.analytics_data for select
  using (auth.uid() = user_id);

create policy "Service role can insert analytics data"
  on public.analytics_data for insert
  with check (auth.jwt() ->> 'role' = 'service_role');
