-- Neighbourly Luxembourg — initial schema
-- Idempotent (safe to re-run)

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "postgis";

-- ============== TYPES ==============
do $$ begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('senior', 'volunteer', 'family', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'request_status') then
    create type request_status as enum (
      'draft', 'pending', 'matched', 'accepted', 'in_progress',
      'completed', 'cancelled', 'reported', 'escalated'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'urgency') then
    create type urgency as enum ('low', 'normal', 'high', 'critical');
  end if;
  if not exists (select 1 from pg_type where typname = 'verification_status') then
    create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
  end if;
  if not exists (select 1 from pg_type where typname = 'locale_code') then
    create type locale_code as enum ('en', 'fr', 'de', 'lbs');
  end if;
  if not exists (select 1 from pg_type where typname = 'report_target') then
    create type report_target as enum ('user', 'request', 'message');
  end if;
  if not exists (select 1 from pg_type where typname = 'report_status') then
    create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
  end if;
end $$;

-- ============== TABLES ==============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  phone text,
  role user_role not null default 'senior',
  locale locale_code not null default 'en',
  avatar_url text,
  bio text,
  address text,
  city text,
  postal_code text,
  lat double precision,
  lng double precision,
  accessibility_notes text,
  emergency_phone text,
  suspended boolean not null default false,
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_locale_idx on public.profiles(locale);

create table if not exists public.volunteer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  skills text[] not null default '{}',
  languages locale_code[] not null default '{en}',
  service_radius_km int not null default 5,
  availability jsonb not null default '{}'::jsonb,
  verification_status verification_status not null default 'unverified',
  verification_notes text,
  rating_avg numeric(3,2) not null default 0,
  rating_count int not null default 0,
  completed_count int not null default 0,
  response_rate numeric(4,3) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.family_links (
  id uuid primary key default uuid_generate_v4(),
  senior_id uuid not null references public.profiles(id) on delete cascade,
  family_id uuid not null references public.profiles(id) on delete cascade,
  relationship text not null,
  can_create_requests boolean not null default false,
  can_message boolean not null default true,
  can_view_activity boolean not null default true,
  created_at timestamptz not null default now(),
  unique (senior_id, family_id)
);

create table if not exists public.emergency_contacts (
  id uuid primary key default uuid_generate_v4(),
  senior_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  relationship text not null,
  phone text not null,
  email text,
  notify_on_urgent boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.requests (
  id uuid primary key default uuid_generate_v4(),
  senior_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  description text not null check (char_length(description) between 8 and 2000),
  category text not null,
  urgency urgency not null default 'normal',
  status request_status not null default 'pending',
  address text not null,
  city text not null,
  postal_code text not null,
  lat double precision not null,
  lng double precision not null,
  preferred_time timestamptz,
  language locale_code not null default 'en',
  accessibility_notes text,
  attachments text[] not null default '{}',
  assigned_volunteer_id uuid references public.profiles(id) on delete set null,
  ai_summary text,
  ai_urgency urgency,
  ai_flags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  matched_at timestamptz,
  accepted_at timestamptz,
  completed_at timestamptz
);
create index if not exists requests_status_idx on public.requests(status);
create index if not exists requests_urgency_idx on public.requests(urgency);
create index if not exists requests_category_idx on public.requests(category);
create index if not exists requests_geo_idx on public.requests(lat, lng);
create index if not exists requests_senior_idx on public.requests(senior_id);

create table if not exists public.request_status_history (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references public.requests(id) on delete cascade,
  from_status request_status,
  to_status request_status not null,
  changed_by uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists rsh_request_idx on public.request_status_history(request_id);

create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references public.requests(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  original_locale locale_code,
  translated jsonb not null default '{}'::jsonb,
  read_by uuid[] not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists messages_request_idx on public.messages(request_id, created_at);

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  link text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

create table if not exists public.ratings (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references public.requests(id) on delete cascade,
  rater_id uuid not null references public.profiles(id) on delete cascade,
  ratee_id uuid not null references public.profiles(id) on delete cascade,
  score int not null check (score between 1 and 5),
  comment text check (char_length(coalesce(comment, '')) <= 500),
  created_at timestamptz not null default now(),
  unique (request_id, rater_id)
);

create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type report_target not null,
  target_id uuid not null,
  reason text not null check (char_length(reason) between 4 and 80),
  details text,
  status report_status not null default 'open',
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  resolution text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.verification_records (
  id uuid primary key default uuid_generate_v4(),
  volunteer_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('id', 'background', 'reference', 'training')),
  status text not null check (status in ('pending', 'approved', 'rejected')),
  document_url text,
  notes text,
  reviewer_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============== HELPERS ==============
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = uid and role = 'admin');
$$;

create or replace function public.has_family_access(senior uuid, family uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.family_links
    where senior_id = senior and family_id = family
  );
$$;

create or replace function public.haversine_km(lat1 double precision, lng1 double precision, lat2 double precision, lng2 double precision)
returns double precision language sql immutable as $$
  select 6371 * 2 * asin(sqrt(
    sin(radians((lat2 - lat1) / 2))^2 +
    cos(radians(lat1)) * cos(radians(lat2)) * sin(radians((lng2 - lng1) / 2))^2
  ));
$$;

-- ============== TRIGGERS ==============
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_profiles_touch') then
    create trigger trg_profiles_touch before update on public.profiles
      for each row execute function public.touch_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'trg_requests_touch') then
    create trigger trg_requests_touch before update on public.requests
      for each row execute function public.touch_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'trg_volunteer_touch') then
    create trigger trg_volunteer_touch before update on public.volunteer_profiles
      for each row execute function public.touch_updated_at();
  end if;
end $$;

create or replace function public.on_new_request()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
begin
  insert into public.request_status_history(request_id, from_status, to_status, changed_by, note)
  values (new.id, null, new.status, new.senior_id, 'created')
  returning id into v_id;
  return new;
end $$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_requests_init_history') then
    create trigger trg_requests_init_history after insert on public.requests
      for each row execute function public.on_new_request();
  end if;
end $$;

-- ============== RLS ==============
alter table public.profiles enable row level security;
alter table public.volunteer_profiles enable row level security;
alter table public.family_links enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.requests enable row level security;
alter table public.request_status_history enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.ratings enable row level security;
alter table public.reports enable row level security;
alter table public.audit_logs enable row level security;
alter table public.verification_records enable row level security;
alter table public.system_settings enable row level security;

-- Helper: current user id
create or replace function public.current_user_id() returns uuid
language sql stable as $$
  select auth.uid();
$$;

-- PROFILES
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (
    id = public.current_user_id()
    or role in ('volunteer', 'admin')
    or id in (select senior_id from public.family_links where family_id = public.current_user_id())
    or exists (
      select 1 from public.requests r
      where (r.senior_id = public.profiles.id and r.assigned_volunteer_id = public.current_user_id())
         or (r.assigned_volunteer_id = public.profiles.id and r.senior_id = public.current_user_id())
    )
  );

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles for update
  using (id = public.current_user_id())
  with check (id = public.current_user_id());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles for all
  using (public.is_admin(public.current_user_id()))
  with check (public.is_admin(public.current_user_id()));

-- VOLUNTEER PROFILES
drop policy if exists "vp_select" on public.volunteer_profiles;
create policy "vp_select" on public.volunteer_profiles for select
  using (
    user_id = public.current_user_id()
    or verification_status = 'verified'
    or public.is_admin(public.current_user_id())
    or user_id in (select senior_id from public.requests where senior_id = public.current_user_id())
  );
drop policy if exists "vp_update_self" on public.volunteer_profiles;
create policy "vp_update_self" on public.volunteer_profiles for update
  using (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());
drop policy if exists "vp_insert_self" on public.volunteer_profiles;
create policy "vp_insert_self" on public.volunteer_profiles for insert
  with check (user_id = public.current_user_id());
drop policy if exists "vp_admin_all" on public.volunteer_profiles;
create policy "vp_admin_all" on public.volunteer_profiles for all
  using (public.is_admin(public.current_user_id()))
  with check (public.is_admin(public.current_user_id()));

-- FAMILY LINKS
drop policy if exists "fl_select" on public.family_links;
create policy "fl_select" on public.family_links for select
  using (senior_id = public.current_user_id() or family_id = public.current_user_id() or public.is_admin(public.current_user_id()));
drop policy if exists "fl_insert_senior" on public.family_links;
create policy "fl_insert_senior" on public.family_links for insert
  with check (senior_id = public.current_user_id() or public.is_admin(public.current_user_id()));
drop policy if exists "fl_delete" on public.family_links;
create policy "fl_delete" on public.family_links for delete
  using (senior_id = public.current_user_id() or family_id = public.current_user_id() or public.is_admin(public.current_user_id()));

-- EMERGENCY CONTACTS
drop policy if exists "ec_select" on public.emergency_contacts;
create policy "ec_select" on public.emergency_contacts for select
  using (senior_id = public.current_user_id() or public.has_family_access(senior_id, public.current_user_id()) or public.is_admin(public.current_user_id()));
drop policy if exists "ec_write" on public.emergency_contacts;
create policy "ec_write" on public.emergency_contacts for all
  using (senior_id = public.current_user_id() or public.is_admin(public.current_user_id()))
  with check (senior_id = public.current_user_id() or public.is_admin(public.current_user_id()));

-- REQUESTS
drop policy if exists "req_select" on public.requests;
create policy "req_select" on public.requests for select
  using (
    senior_id = public.current_user_id()
    or assigned_volunteer_id = public.current_user_id()
    or public.has_family_access(senior_id, public.current_user_id())
    or public.is_admin(public.current_user_id())
    or (status in ('pending', 'matched') and exists(
        select 1 from public.volunteer_profiles vp
        where vp.user_id = public.current_user_id()
          and vp.verification_status = 'verified'
          and public.haversine_km(vp.user_id::text::float, vp.user_id::text::float, lat, lng) <= vp.service_radius_km
      ))
  );
drop policy if exists "req_insert" on public.requests;
create policy "req_insert" on public.requests for insert
  with check (
    senior_id = public.current_user_id()
    or exists(select 1 from public.family_links where family_id = public.current_user_id() and senior_id = senior_id and can_create_requests)
    or public.is_admin(public.current_user_id())
  );
drop policy if exists "req_update_owner" on public.requests;
create policy "req_update_owner" on public.requests for update
  using (
    senior_id = public.current_user_id()
    or assigned_volunteer_id = public.current_user_id()
    or public.is_admin(public.current_user_id())
  )
  with check (
    senior_id = public.current_user_id()
    or assigned_volunteer_id = public.current_user_id()
    or public.is_admin(public.current_user_id())
  );

-- REQUEST STATUS HISTORY
drop policy if exists "rsh_select" on public.request_status_history;
create policy "rsh_select" on public.request_status_history for select
  using (
    exists(select 1 from public.requests r where r.id = request_id and (
      r.senior_id = public.current_user_id()
      or r.assigned_volunteer_id = public.current_user_id()
      or public.has_family_access(r.senior_id, public.current_user_id())
      or public.is_admin(public.current_user_id())
    ))
  );

-- MESSAGES
drop policy if exists "msg_select" on public.messages;
create policy "msg_select" on public.messages for select
  using (
    sender_id = public.current_user_id()
    or exists(select 1 from public.requests r where r.id = request_id and (
      r.senior_id = public.current_user_id()
      or r.assigned_volunteer_id = public.current_user_id()
      or public.has_family_access(r.senior_id, public.current_user_id())
      or public.is_admin(public.current_user_id())
    ))
  );
drop policy if exists "msg_insert" on public.messages;
create policy "msg_insert" on public.messages for insert
  with check (
    sender_id = public.current_user_id()
    and exists(select 1 from public.requests r where r.id = request_id and (
      r.senior_id = public.current_user_id()
      or r.assigned_volunteer_id = public.current_user_id()
      or public.has_family_access(r.senior_id, public.current_user_id())
    ))
  );

-- NOTIFICATIONS
drop policy if exists "notif_select" on public.notifications;
create policy "notif_select" on public.notifications for select using (user_id = public.current_user_id() or public.is_admin(public.current_user_id()));
drop policy if exists "notif_update_self" on public.notifications;
create policy "notif_update_self" on public.notifications for update using (user_id = public.current_user_id()) with check (user_id = public.current_user_id());

-- RATINGS
drop policy if exists "ratings_select" on public.ratings;
create policy "ratings_select" on public.ratings for select
  using (rater_id = public.current_user_id() or ratee_id = public.current_user_id() or public.is_admin(public.current_user_id()));
drop policy if exists "ratings_insert" on public.ratings;
create policy "ratings_insert" on public.ratings for insert with check (rater_id = public.current_user_id());

-- REPORTS
drop policy if exists "rep_select" on public.reports;
create policy "rep_select" on public.reports for select using (reporter_id = public.current_user_id() or public.is_admin(public.current_user_id()));
drop policy if exists "rep_insert" on public.reports;
create policy "rep_insert" on public.reports for insert with check (reporter_id = public.current_user_id());
drop policy if exists "rep_admin" on public.reports;
create policy "rep_admin" on public.reports for update using (public.is_admin(public.current_user_id())) with check (public.is_admin(public.current_user_id()));

-- AUDIT LOGS
drop policy if exists "audit_select_admin" on public.audit_logs;
create policy "audit_select_admin" on public.audit_logs for select using (public.is_admin(public.current_user_id()));

-- VERIFICATION RECORDS
drop policy if exists "vr_select" on public.verification_records;
create policy "vr_select" on public.verification_records for select
  using (volunteer_id = public.current_user_id() or public.is_admin(public.current_user_id()));
drop policy if exists "vr_insert" on public.verification_records;
create policy "vr_insert" on public.verification_records for insert with check (volunteer_id = public.current_user_id());
drop policy if exists "vr_admin" on public.verification_records;
create policy "vr_admin" on public.verification_records for update using (public.is_admin(public.current_user_id())) with check (public.is_admin(public.current_user_id()));

-- SYSTEM SETTINGS
drop policy if exists "ss_select" on public.system_settings;
create policy "ss_select" on public.system_settings for select using (public.is_admin(public.current_user_id()));

-- ============== REALTIME ==============
do $$ begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

do $$
declare t text;
begin
  for t in select unnest(array['requests','messages','notifications','request_status_history','ratings','reports','verification_records'])
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- ============== STORAGE ==============
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false), ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Seed default settings
insert into public.system_settings (key, value) values
  ('matching', '{"max_distance_km": 25, "language_weight": 0.35, "rating_weight": 0.25, "radius_weight": 0.25, "availability_weight": 0.15}'),
  ('urgent', '{"auto_notify_admins": true, "auto_notify_emergency_contacts": true}')
on conflict (key) do nothing;
