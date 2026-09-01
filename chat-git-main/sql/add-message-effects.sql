-- Run once in Beekeeper Studio as the database owner (postgres).

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

create table if not exists public.chat_user_tags (
  user_id uuid not null references public.users(id) on delete cascade,
  tag_id text not null,
  equipped boolean not null default false,
  purchased_at timestamptz not null default now(),
  primary key (user_id, tag_id)
);

create unique index if not exists chat_user_tags_one_equipped_idx
  on public.chat_user_tags (user_id) where equipped;

grant select, insert, update, delete on table public.chat_user_tags to nebulo_profile_app;
