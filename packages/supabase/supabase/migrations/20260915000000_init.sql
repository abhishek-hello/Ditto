-- Ditto Pay — initial schema
-- Money is stored as integer pence. Currency is GBP only (UK-only platform).

create extension if not exists "pgcrypto";

-- ── profiles ────────────────────────────────────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  handle       text not null unique check (handle ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null check (char_length(display_name) between 1 and 70),
  created_at   timestamptz not null default now()
);

-- ── wallets ─────────────────────────────────────────────────────────────────
create table public.wallets (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles (id) on delete cascade,
  currency      text not null default 'GBP' check (currency = 'GBP'),
  balance_pence bigint not null default 0 check (balance_pence >= 0),
  created_at    timestamptz not null default now(),
  unique (owner_id, currency)
);

-- ── transactions ────────────────────────────────────────────────────────────
create table public.transactions (
  id             uuid primary key default gen_random_uuid(),
  kind           text not null check (kind in ('p2p', 'top_up', 'withdrawal', 'merchant')),
  status         text not null default 'pending'
                 check (status in ('pending', 'completed', 'failed', 'reversed')),
  currency       text not null default 'GBP' check (currency = 'GBP'),
  amount_pence   bigint not null check (amount_pence > 0),
  from_wallet_id uuid references public.wallets (id),
  to_wallet_id   uuid references public.wallets (id),
  reference      text check (char_length(reference) <= 35),
  created_at     timestamptz not null default now(),
  check (from_wallet_id is not null or to_wallet_id is not null)
);

create index transactions_from_wallet_idx on public.transactions (from_wallet_id, created_at desc);
create index transactions_to_wallet_idx   on public.transactions (to_wallet_id, created_at desc);

-- ── row level security ──────────────────────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.wallets      enable row level security;
alter table public.transactions enable row level security;

create policy "profiles are readable by any signed-in user"
  on public.profiles for select to authenticated using (true);

create policy "users manage their own profile"
  on public.profiles for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy "users read their own wallets"
  on public.wallets for select to authenticated using (owner_id = auth.uid());

create policy "users read transactions touching their wallets"
  on public.transactions for select to authenticated
  using (
    exists (select 1 from public.wallets w
            where w.owner_id = auth.uid()
              and (w.id = from_wallet_id or w.id = to_wallet_id))
  );

-- Writes to wallets/transactions happen only through apps/api (service role),
-- which runs balance changes inside a single Postgres transaction.

-- ── auto-create a profile + GBP wallet on signup ────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, handle, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'handle', 'user_' || substr(replace(new.id::text, '-', ''), 1, 12)),
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Ditto user')
  );
  insert into public.wallets (owner_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
