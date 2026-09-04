-- Nava Dishe dashboard schema — Neon Postgres.
-- Run once (idempotent): node db/migrate.js

-- Real users with roles, replacing the DASHBOARD_USERS env-var dictionary.
--   admin  — full access: both lists (all districts), the entry form, user management, sheet sync.
--   poc    — can only submit the New Registration form. Cannot edit or list past entries.
--   reader — read-only, scoped to the districts listed in `districts`.
create table if not exists app_users (
  id serial primary key,
  username text unique not null,
  password_hash text not null,
  password_salt text not null,
  role text not null check (role in ('admin', 'poc', 'reader')),
  districts text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Public quick-lead form (index.html): Name, District, Phone, Request Callback.
create table if not exists website_leads (
  id serial primary key,
  created_at timestamptz not null default now(),
  name text,
  district text,
  phone text,
  request_callback boolean not null default false
);
create index if not exists idx_website_leads_district on website_leads (district);
create index if not exists idx_website_leads_created_at on website_leads (created_at desc);

-- Dashboard's full form (dashboard.html), same field set as the Disha PDF.
create table if not exists school_registrations (
  id serial primary key,
  created_at timestamptz not null default now(),
  created_by text references app_users (username),
  school_name text,
  school_address text,
  city text,
  district text,
  state text,
  pincode text,
  board text,
  branch_name text,
  school_phone text,
  school_email text,
  principal_name text,
  principal_phone text,
  principal_email text,
  coordinator_name text,
  coordinator_phone text,
  coordinator_email text,
  students_1_9 integer,
  students_10 integer,
  students_11 integer,
  students_12 integer,
  news_first_poc_name text,
  news_first_poc_phone text,
  vendor_name text,
  vendor_phone text,
  test_date date,
  message text
);
create index if not exists idx_school_registrations_district on school_registrations (district);
create index if not exists idx_school_registrations_board on school_registrations (board);
create index if not exists idx_school_registrations_created_at on school_registrations (created_at desc);
