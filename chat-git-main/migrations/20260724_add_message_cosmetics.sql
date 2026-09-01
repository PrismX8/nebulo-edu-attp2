create table if not exists public.chat_message_cosmetics (
  room_id text not null,
  message_id text not null,
  user_id uuid null,
  message_effect text not null default 'none',
  avatar_effect text not null default 'none',
  tag_effect text not null default 'none',
  created_at timestamptz not null default now(),
  primary key (room_id, message_id)
);

create index if not exists chat_message_cosmetics_user_id_idx
  on public.chat_message_cosmetics (user_id);
