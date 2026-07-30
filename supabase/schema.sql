-- ============================================================
-- SHE ID Card System — Supabase schema
-- Mirrors the original PHP/MySQL logic:
--   - applications: public can INSERT (apply form, no login)
--   - admin & approver (authenticated, via profiles.role): can SELECT/UPDATE
--   - audit_logs: written on status change / edit
-- Run this once in Supabase SQL editor (or `supabase db push`).
-- ============================================================

-- ---------- profiles (extends auth.users with a role) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null check (role in ('admin','approver')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Each staff member can read their own profile (needed client-side to route by role)
create policy "profiles: read own"
  on public.profiles for select
  using (id = auth.uid());

-- Helper: current user's role, bypasses RLS recursion via security definer
create or replace function public.current_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------- applications ----------
create table if not exists public.applications (
  id bigint generated always as identity primary key,
  full_name text not null,
  employee_id text not null,
  company text,
  position text,
  department text not null,
  birth_place text,
  birth_date date,
  address text,
  permit_type text not null check (permit_type in ('Mine Permit','Work Permit','Kimper')),
  kimper_zone text,
  sim_no text,
  sim_type text,
  sim_issue date,
  sim_expiry date,
  cert_type text,
  cert_no text,
  u1 text, u2 text, u3 text, u4 text, u5 text,
  u6 text, u7 text, u8 text, u9 text, u10 text,
  s1 text, s2 text, s3 text, s4 text, s5 text,
  s6 text, s7 text, s8 text, s9 text, s10 text,
  notes text,
  photo_path text,
  id_issue_date date,
  expiry_date date not null,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  decided_by uuid references public.profiles(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists applications_status_idx on public.applications(status);
create index if not exists applications_department_idx on public.applications(department);
create index if not exists applications_created_idx on public.applications(created_at desc);

alter table public.applications enable row level security;

-- Public (anon) can submit a new application — no login required, matches apply.php
create policy "applications: public insert"
  on public.applications for insert
  to anon, authenticated
  with check (true);

-- Staff (admin/approver) can read all applications
create policy "applications: staff select"
  on public.applications for select
  to authenticated
  using (public.current_role() in ('admin','approver'));

-- Staff (admin/approver) can update status / edit fields
create policy "applications: staff update"
  on public.applications for update
  to authenticated
  using (public.current_role() in ('admin','approver'))
  with check (public.current_role() in ('admin','approver'));

-- No delete policy for anyone — matches original (no delete feature)

-- ---------- audit_logs ----------
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  application_id bigint not null references public.applications(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

create policy "audit_logs: staff select"
  on public.audit_logs for select
  to authenticated
  using (public.current_role() in ('admin','approver'));

create policy "audit_logs: staff insert"
  on public.audit_logs for insert
  to authenticated
  with check (public.current_role() in ('admin','approver'));

-- ============================================================
-- Storage bucket for ID photos (public read, so cards/print can show them)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "photos: public read"
  on storage.objects for select
  to public
  using (bucket_id = 'photos');

create policy "photos: anyone can upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'photos');

-- ============================================================
-- Seed staff accounts
-- 1) Create the two users in Supabase Dashboard -> Authentication -> Users
--    (e.g. admin@she.local / atasan@she.local with a password you choose)
-- 2) Copy their UUID and insert their profile row here, e.g.:
--
--    insert into public.profiles (id, name, role) values
--      ('00000000-0000-0000-0000-000000000001', 'Admin SHE', 'admin'),
--      ('00000000-0000-0000-0000-000000000002', 'Atasan SHE', 'approver');
-- ============================================================
