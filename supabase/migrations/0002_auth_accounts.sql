-- Persistent Neighbourly accounts
-- Creates a profile whenever Supabase Auth creates a user. Account role is set
-- only from the two public signup flows: senior (help finder) or volunteer (helper).

alter table public.volunteer_profiles
  add column if not exists pay_details text;

create or replace function public.handle_new_account()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  account_role public.user_role;
begin
  account_role := case new.raw_user_meta_data ->> 'role'
    when 'volunteer' then 'volunteer'::public.user_role
    else 'senior'::public.user_role
  end;

  insert into public.profiles (
    id, email, full_name, phone, role, address, bio, email_verified
  ) values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Neighbourly member'),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    account_role,
    nullif(trim(new.raw_user_meta_data ->> 'address'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'bio'), ''),
    new.email_confirmed_at is not null
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    phone = excluded.phone,
    address = excluded.address,
    bio = excluded.bio;

  if account_role = 'volunteer' then
    insert into public.volunteer_profiles (
      user_id, availability, pay_details, verification_status
    ) values (
      new.id,
      jsonb_build_object('time_available_for_work', coalesce(new.raw_user_meta_data ->> 'time_available_for_work', 'Not specified')),
      nullif(trim(new.raw_user_meta_data ->> 'pay_details'), ''),
      'pending'
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_account();

-- A helper is never publicly visible until their profile is verified. Their own
-- account, legitimate matches, family contacts, and administrators retain access.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (
    id = public.current_user_id()
    or (
      role = 'volunteer'
      and exists (
        select 1 from public.volunteer_profiles vp
        where vp.user_id = public.profiles.id and vp.verification_status = 'verified'
      )
    )
    or id in (select senior_id from public.family_links where family_id = public.current_user_id())
    or exists (
      select 1 from public.requests r
      where (r.senior_id = public.profiles.id and r.assigned_volunteer_id = public.current_user_id())
         or (r.assigned_volunteer_id = public.profiles.id and r.senior_id = public.current_user_id())
    )
    or public.is_admin(public.current_user_id())
  );
