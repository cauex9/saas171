create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric not null default 0,
  currency text not null default 'BRL',
  limits jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id),
  status text not null default 'trial',
  started_at timestamptz default now(),
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  product text,
  country text,
  objective text,
  status text not null default 'draft',
  payload jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.analysis_scores (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid references public.analyses(id) on delete cascade,
  overall_score integer not null default 0,
  breakdown jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ad_variations (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid references public.analyses(id) on delete cascade,
  version text not null,
  headline text,
  primary_text text,
  description text,
  cta text,
  angle text,
  rationale text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'draft',
  objective text,
  budget numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.campaign_results (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  impressions bigint,
  clicks bigint,
  ctr numeric,
  cpc numeric,
  cpm numeric,
  leads bigint,
  purchases bigint,
  conversions bigint,
  spend numeric,
  revenue numeric,
  cpa numeric,
  roas numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.predictions (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid references public.analyses(id) on delete cascade,
  ctr_estimate text,
  cpc_estimate text,
  conversion_estimate text,
  cpa_estimate text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.optimization_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  analysis_id uuid references public.analyses(id) on delete cascade,
  output jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.usage (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  action text not null,
  used_count integer not null default 0,
  period_start timestamptz default now(),
  period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.payment_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  external_id text,
  plan_id uuid references public.plans(id),
  amount numeric,
  currency text default 'BRL',
  status text not null default 'pending',
  raw_event jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.webhook_events (
  id uuid primary key default uuid_generate_v4(),
  source text,
  event_id text,
  payload jsonb not null default '{}',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.analyses enable row level security;
alter table public.analysis_scores enable row level security;
alter table public.ad_variations enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_results enable row level security;
alter table public.predictions enable row level security;
alter table public.optimization_results enable row level security;
alter table public.usage enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.webhook_events enable row level security;

create policy "profiles_access_own" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "plans_read_public" on public.plans for select using (true);
create policy "subscriptions_access_own" on public.subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "analyses_access_own" on public.analyses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "analysis_scores_access_own" on public.analysis_scores for all using (exists (select 1 from public.analyses a where a.id = analysis_id and a.user_id = auth.uid())) with check (exists (select 1 from public.analyses a where a.id = analysis_id and a.user_id = auth.uid()));
create policy "campaigns_access_own" on public.campaigns for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "results_access_own" on public.campaign_results for all using (exists (select 1 from public.campaigns c where c.id = campaign_id and c.user_id = auth.uid())) with check (exists (select 1 from public.campaigns c where c.id = campaign_id and c.user_id = auth.uid()));
create policy "payments_access_own" on public.payment_transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "webhook_events_internal" on public.webhook_events for all using (auth.role() = 'service_role');
