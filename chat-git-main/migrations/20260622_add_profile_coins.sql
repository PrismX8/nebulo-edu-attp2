alter table public.profiles
  add column if not exists coins integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_coins_nonnegative'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_coins_nonnegative check (coins >= 0);
  end if;
end
$$;
