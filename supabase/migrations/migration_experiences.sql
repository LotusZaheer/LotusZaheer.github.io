-- Experiences module: schema + bilingual seed (OrusXpert / BeatRide).
-- Idempotent — safe to re-run.
-- All textual content lives in i18n_values via translation keys referenced by *_key columns.

-- ============================================================================
-- 1. SCHEMA
-- ============================================================================

create table if not exists experiences (
  id bigserial primary key,
  company text not null,
  company_url text,
  role_key text,
  duration_key text,
  location_key text,
  description_key text,
  bullets_keys text[] default '{}',
  stack text[] default '{}',
  is_current boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_experiences_sort on experiences (sort_order asc, created_at desc);

-- RLS
alter table experiences enable row level security;

drop policy if exists "Public Read Experiences" on experiences;
drop policy if exists "Auth Write Experiences" on experiences;
drop policy if exists "Auth Update Experiences" on experiences;
drop policy if exists "Auth Delete Experiences" on experiences;

create policy "Public Read Experiences" on experiences for select using (true);
create policy "Auth Write Experiences" on experiences for insert with check (auth.role() = 'authenticated');
create policy "Auth Update Experiences" on experiences for update using (auth.role() = 'authenticated');
create policy "Auth Delete Experiences" on experiences for delete using (auth.role() = 'authenticated');

-- ============================================================================
-- 2. i18n SEED (ES + EN) — OrusXpert / BeatRide
-- ============================================================================

create or replace function pg_temp.upsert_i18n(p_key text, p_page text, p_es text, p_en text)
returns void as $$
declare
  v_id uuid;
begin
  insert into i18n_keys (key_name, page, is_system)
    values (p_key, p_page, true)
    on conflict (key_name) do update set page = excluded.page
    returning id into v_id;

  insert into i18n_values (key_id, lang_code, value)
    values (v_id, 'es', p_es), (v_id, 'en', p_en)
    on conflict (key_id, lang_code) do update set value = excluded.value;
end;
$$ language plpgsql;

select pg_temp.upsert_i18n(
  'experience.items.orusxpert.role', 'experience',
  'Desarrollador de Software',
  'Software Developer'
);

select pg_temp.upsert_i18n(
  'experience.items.orusxpert.duration', 'experience',
  'Julio 2022 — Diciembre 2025',
  'July 2022 — December 2025'
);

select pg_temp.upsert_i18n(
  'experience.items.orusxpert.location', 'experience',
  'Bucaramanga, Colombia',
  'Bucaramanga, Colombia'
);

select pg_temp.upsert_i18n(
  'experience.items.orusxpert.description', 'experience',
  'Desarrollo de BeatRide, plataforma de optimización y visualización de rutas comerciales y logísticas.',
  'Development of BeatRide, a platform for optimization and visualization of commercial and logistics routes.'
);

select pg_temp.upsert_i18n(
  'experience.items.orusxpert.bullet1', 'experience',
  'Diseñé y definí la arquitectura frontend en Angular, tomando decisiones técnicas clave y construyendo una aplicación escalable con visualización geoespacial capaz de manejar miles de puntos en tiempo real.',
  'Designed and defined the frontend architecture in Angular, making key technical decisions and building a scalable application with geospatial visualization capable of handling thousands of points in real time.'
);

select pg_temp.upsert_i18n(
  'experience.items.orusxpert.bullet2', 'experience',
  'Desarrollé procesamiento y optimización de rutas en Python y C++ (GeoPandas, SciPy), implementando clustering para datasets >10.000 clientes bajo restricciones operativas.',
  'Built route processing and optimization in Python and C++ (GeoPandas, SciPy), implementing clustering for datasets of >10,000 clients under operational constraints.'
);

select pg_temp.upsert_i18n(
  'experience.items.orusxpert.bullet3', 'experience',
  'Mejoré el rendimiento del sistema logrando generación de rutas 10x más rápida, +11% efectividad de visitas, +12% productividad y -24% costos operativos.',
  'Improved system performance, achieving 10x faster route generation, +11% visit effectiveness, +12% productivity, and -24% operational costs.'
);

select pg_temp.upsert_i18n(
  'experience.items.orusxpert.bullet4', 'experience',
  'Construí la landing corporativa como SPA en React con SEO técnico y despliegue en Docker.',
  'Built the corporate landing as a SPA in React with technical SEO and Docker deployment.'
);

-- ============================================================================
-- 3. EXPERIENCE ROW (idempotent — updates if exists, inserts otherwise)
-- ============================================================================

with payload as (
  select
    'OrusXpert SAS'::text                                    as company,
    null::text                                               as company_url,
    'experience.items.orusxpert.role'::text                  as role_key,
    'experience.items.orusxpert.duration'::text              as duration_key,
    'experience.items.orusxpert.location'::text              as location_key,
    'experience.items.orusxpert.description'::text           as description_key,
    array[
      'experience.items.orusxpert.bullet1',
      'experience.items.orusxpert.bullet2',
      'experience.items.orusxpert.bullet3',
      'experience.items.orusxpert.bullet4'
    ]::text[]                                                as bullets_keys,
    array['Angular','Python','C++','GeoPandas','SciPy','React','Docker']::text[] as stack,
    false                                                    as is_current,
    0                                                        as sort_order
),
upsert as (
  update experiences e set
    company_url     = p.company_url,
    role_key        = p.role_key,
    duration_key    = p.duration_key,
    location_key    = p.location_key,
    description_key = p.description_key,
    bullets_keys    = p.bullets_keys,
    stack           = p.stack,
    is_current      = p.is_current,
    sort_order      = p.sort_order,
    updated_at      = now()
  from payload p
  where e.company = p.company
  returning e.id
)
insert into experiences (
  company, company_url, role_key, duration_key, location_key, description_key,
  bullets_keys, stack, is_current, sort_order
)
select
  p.company, p.company_url, p.role_key, p.duration_key, p.location_key, p.description_key,
  p.bullets_keys, p.stack, p.is_current, p.sort_order
from payload p
where not exists (select 1 from upsert);
