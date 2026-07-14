-- Seed minimal demo data. Idempotent.

insert into auth.users (id, email, raw_user_meta_data, email_confirmed_at, created_at, updated_at, instance_id, aud, role)
values
  ('00000000-0000-0000-0000-000000000001','admin@neighbourly.lu','{"full_name":"Admin Demo"}', now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002','senior@neighbourly.lu','{"full_name":"Marie Dupont"}', now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000003','volunteer@neighbourly.lu','{"full_name":"Jean Weber"}', now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000004','family@neighbourly.lu','{"full_name":"Sophie Dupont"}', now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated')
on conflict (id) do nothing;

insert into public.profiles (id, email, full_name, role, locale, city, postal_code, lat, lng, address, phone, emergency_phone, email_verified)
values
  ('00000000-0000-0000-0000-000000000001','admin@neighbourly.lu','Admin Demo','admin','en','Luxembourg City','1411',49.6116,6.1319,'1 Rue de la Gare','+352000001',null,true),
  ('00000000-0000-0000-0000-000000000002','senior@neighbourly.lu','Marie Dupont','senior','fr','Luxembourg City','1411',49.6116,6.1319,'1 Rue de la Gare','+352000002','+352000999',true),
  ('00000000-0000-0000-0000-000000000003','volunteer@neighbourly.lu','Jean Weber','volunteer','en','Luxembourg City','1411',49.6116,6.1319,'1 Rue de la Gare','+352000003',null,true),
  ('00000000-0000-0000-0000-000000000004','family@neighbourly.lu','Sophie Dupont','family','en','Luxembourg City','1411',49.6116,6.1319,'1 Rue de la Gare','+352000004',null,true)
on conflict (id) do update set full_name = excluded.full_name, role = excluded.role;

insert into public.volunteer_profiles (user_id, skills, languages, service_radius_km, verification_status, rating_avg, rating_count, completed_count)
values
  ('00000000-0000-0000-0000-000000000003', array['groceries','translation','tech_support'], array['en','fr','de']::locale_code[], 10, 'verified', 4.8, 12, 12)
on conflict (user_id) do nothing;

insert into public.family_links (senior_id, family_id, relationship, can_create_requests, can_message, can_view_activity)
values ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000004','daughter', true, true, true)
on conflict do nothing;

insert into public.emergency_contacts (senior_id, name, relationship, phone, email, notify_on_urgent)
values ('00000000-0000-0000-0000-000000000002','Dr. Muller','doctor','+352111','doctor@example.lu',true)
on conflict do nothing;
