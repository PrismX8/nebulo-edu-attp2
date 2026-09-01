-- Run once in Beekeeper Studio as the database owner (postgres).

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
