-- Create agencies table
create table public.agencies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('Law Enforcement', 'Fire Department', 'EMS / Emergency Medical', '911 Dispatch', 'Corrections', 'Government / Enterprise')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.agencies enable row level security;

create index idx_agencies_user_id on public.agencies(user_id);

create policy "Users can view their own agency"
  on public.agencies for select
  using (auth.uid() = user_id);

create policy "Users can update their own agency"
  on public.agencies for update
  using (auth.uid() = user_id);

-- Add full_name to users table
alter table public.users add column full_name text;
