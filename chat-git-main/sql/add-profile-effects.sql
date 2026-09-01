create table if not exists public.chat_user_profile_effects (
  user_id uuid not null references public.profiles(id) on delete cascade,
  effect_id text not null,
  equipped boolean not null default false,
  purchased_at timestamptz not null default now(),
  primary key (user_id, effect_id)
);

create unique index if not exists chat_user_profile_effects_one_equipped_idx
  on public.chat_user_profile_effects (user_id)
  where equipped = true;

create index if not exists chat_user_profile_effects_user_idx
  on public.chat_user_profile_effects (user_id, purchased_at);

grant select, insert, update, delete on public.chat_user_profile_effects to authenticated;
grant select, insert, update, delete on public.chat_user_profile_effects to service_role;
