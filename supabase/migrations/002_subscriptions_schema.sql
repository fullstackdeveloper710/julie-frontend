create table public.subscriptions (
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

create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);

create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on public.subscriptions for all
  using (auth.jwt() ->> 'role' = 'service_role');
  using (auth.jwt() ->> 'role' = 'service_role');
