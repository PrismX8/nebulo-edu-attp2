\set ON_ERROR_STOP on

\if :{?app_user}
\else
  \echo 'Usage: psql "$PROFILE_DATABASE_URL" -v app_user=YOUR_APP_DB_ROLE -f scripts/postgres-chat-storage.sql'
  \quit
\endif

BEGIN;

CREATE TABLE IF NOT EXISTS public.nebulo_chat_groups (
  room TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  creator TEXT,
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  single_member_since BIGINT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint
);

ALTER TABLE public.nebulo_chat_groups ADD COLUMN IF NOT EXISTS members JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.nebulo_chat_groups ADD COLUMN IF NOT EXISTS single_member_since BIGINT;
ALTER TABLE public.nebulo_chat_groups ADD COLUMN IF NOT EXISTS updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint;
CREATE INDEX IF NOT EXISTS nebulo_chat_groups_members_idx ON public.nebulo_chat_groups USING GIN (members);

CREATE TABLE IF NOT EXISTS public.nebulo_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  room TEXT NOT NULL,
  site_id TEXT,
  message_id TEXT,
  user_id TEXT,
  username TEXT,
  nickname TEXT,
  body TEXT NOT NULL,
  avatar TEXT,
  role TEXT,
  client_nonce TEXT,
  raw JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS site_id TEXT;
ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS message_id TEXT;
ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS client_nonce TEXT;
ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS raw JSONB;
ALTER TABLE public.nebulo_chat_messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS nebulo_chat_messages_room_created_idx ON public.nebulo_chat_messages (room, created_at DESC);
CREATE INDEX IF NOT EXISTS nebulo_chat_messages_site_idx ON public.nebulo_chat_messages (site_id);
CREATE INDEX IF NOT EXISTS nebulo_chat_messages_nonce_idx ON public.nebulo_chat_messages (room, client_nonce);

GRANT USAGE ON SCHEMA public TO :"app_user";
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.nebulo_chat_groups, public.nebulo_chat_messages TO :"app_user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO :"app_user";

COMMIT;
