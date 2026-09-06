create table if not exists public.chat_account_identifiers (
  user_id uuid not null references public.users(id) on delete cascade,
  identifier_type text not null check (identifier_type in ('network', 'device')),
  identifier_hash text not null check (length(identifier_hash) = 64),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (user_id, identifier_type, identifier_hash)
);

create index if not exists chat_account_identifiers_lookup_idx
  on public.chat_account_identifiers (identifier_type, identifier_hash, last_seen_at desc);

create table if not exists public.chat_ban_identifiers (
  id uuid primary key,
  identifier_type text not null check (identifier_type in ('network', 'device')),
  identifier_hash text not null check (length(identifier_hash) = 64),
  source_user_id uuid references public.users(id) on delete set null,
  reason text not null,
  active boolean not null default true,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  cleared_by uuid references public.users(id) on delete set null,
  cleared_at timestamptz
);

create unique index if not exists chat_ban_identifiers_active_idx
  on public.chat_ban_identifiers (identifier_type, identifier_hash)
  where active;

create index if not exists chat_ban_identifiers_source_idx
  on public.chat_ban_identifiers (source_user_id, active, created_at desc);

create table if not exists public.chat_registration_attempts (
  id uuid primary key,
  appeal_id uuid not null unique,
  network_hash text check (network_hash is null or length(network_hash) = 64),
  device_hash text check (device_hash is null or length(device_hash) = 64),
  email_hash text check (email_hash is null or length(email_hash) = 64),
  outcome text not null check (outcome in ('pending', 'created', 'rejected', 'blocked', 'rate_limited')),
  reason text,
  created_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  override_approved_by uuid references public.users(id) on delete set null,
  override_approved_at timestamptz,
  override_used_at timestamptz
);

create index if not exists chat_registration_attempts_network_idx
  on public.chat_registration_attempts (network_hash, created_at desc);

create index if not exists chat_registration_attempts_device_idx
  on public.chat_registration_attempts (device_hash, created_at desc);

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'nebulo_profile_app') then
    execute 'grant select, insert, update on table public.chat_account_identifiers to nebulo_profile_app';
    execute 'grant select, insert, update on table public.chat_ban_identifiers to nebulo_profile_app';
    execute 'grant select, insert, update on table public.chat_registration_attempts to nebulo_profile_app';
  end if;
end
$$;
