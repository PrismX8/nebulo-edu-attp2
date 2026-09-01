-- Run once in Beekeeper Studio as the database owner (postgres).

create table if not exists public.chat_user_banners (
  user_id uuid not null references public.users(id) on delete cascade,
  banner_id text not null,
  equipped boolean not null default false,
  purchased_at timestamptz not null default now(),
  primary key (user_id, banner_id)
);

create unique index if not exists chat_user_banners_one_equipped_idx
  on public.chat_user_banners (user_id) where equipped;

grant select, insert, update, delete on table public.chat_user_banners to nebulo_profile_app;
