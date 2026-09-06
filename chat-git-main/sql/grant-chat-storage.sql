-- Run once in Beekeeper Studio as the database owner (postgres).
-- UBG Chat then stores all direct messages in chat_dms and dm_messages.

grant select, insert on table public.chat_dms to nebulo_profile_app;
grant select, insert, delete on table public.dm_messages to nebulo_profile_app;
grant usage, select on sequence public.dm_messages_id_seq to nebulo_profile_app;

create table if not exists public.chat_reports (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  message_id text not null,
  category text not null default 'other',
  reason text not null,
  reporter_id uuid not null references public.users(id) on delete cascade,
  target_user_id uuid references public.users(id) on delete set null,
  target_username text,
  target_token text,
  quote text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  reviewer_id uuid references public.users(id) on delete set null,
  mod_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists chat_reports_status_created_idx
  on public.chat_reports (status, created_at desc);

create table if not exists public.chat_warnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  moderator_id uuid not null references public.users(id) on delete cascade,
  reason text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  cleared_at timestamptz,
  cleared_by uuid references public.users(id) on delete set null
);

create index if not exists chat_warnings_user_active_idx
  on public.chat_warnings (user_id, active, created_at desc);

grant select, insert, update on table public.chat_reports to nebulo_profile_app;
grant select, insert, update on table public.chat_warnings to nebulo_profile_app;

create table if not exists public.chat_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null default 'info',
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  dedupe_key text unique,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists chat_notifications_unread_idx
  on public.chat_notifications (user_id, created_at) where read_at is null;

grant select, insert, update on table public.chat_notifications to nebulo_profile_app;

create table if not exists public.chat_user_effects (
  user_id uuid not null references public.users(id) on delete cascade,
  effect_id text not null,
  equipped boolean not null default false,
  purchased_at timestamptz not null default now(),
  primary key (user_id, effect_id)
);

create unique index if not exists chat_user_effects_one_equipped_idx
  on public.chat_user_effects (user_id) where equipped;

grant select, insert, update, delete on table public.chat_user_effects to nebulo_profile_app;

create table if not exists public.chat_user_avatar_effects (
  user_id uuid not null references public.users(id) on delete cascade,
  effect_id text not null,
  equipped boolean not null default false,
  purchased_at timestamptz not null default now(),
  primary key (user_id, effect_id)
);

create unique index if not exists chat_user_avatar_effects_one_equipped_idx
  on public.chat_user_avatar_effects (user_id) where equipped;

grant select, insert, update, delete on table public.chat_user_avatar_effects to nebulo_profile_app;
