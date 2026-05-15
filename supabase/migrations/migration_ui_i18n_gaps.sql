-- Seed missing UI translation keys (ES + EN).
-- Idempotent — safe to re-run.
-- Covers section eyebrows/subtitles, footer, and home meta strings that
-- were referenced in templates but not yet seeded in i18n_values.

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

-- ----------------------------------------------------------------------------
-- SECTIONS
-- ----------------------------------------------------------------------------
select pg_temp.upsert_i18n(
  'sections.experience', 'sections',
  'Experiencia',
  'Experience'
);

-- ----------------------------------------------------------------------------
-- HOME / HERO META
-- ----------------------------------------------------------------------------
select pg_temp.upsert_i18n(
  'home.status', 'home',
  'Disponible para proyectos · Bucaramanga, CO',
  'Available for projects · Bucaramanga, CO'
);

select pg_temp.upsert_i18n(
  'home.metaYears', 'home',
  'Años de experiencia',
  'Years of experience'
);

select pg_temp.upsert_i18n(
  'home.metaProjects', 'home',
  'Proyectos entregados',
  'Projects delivered'
);

select pg_temp.upsert_i18n(
  'home.metaIndustries', 'home',
  'Industrias (logística, geo, edu)',
  'Industries (logistics, geo, edu)'
);

-- ----------------------------------------------------------------------------
-- SKILLS
-- ----------------------------------------------------------------------------
select pg_temp.upsert_i18n(
  'skills.eyebrow', 'skills',
  'Stack técnico',
  'Tech stack'
);

select pg_temp.upsert_i18n(
  'skills.subtitle', 'skills',
  'Las herramientas con las que trabajo a diario, agrupadas por dominio.',
  'The tools I work with daily, grouped by domain.'
);

-- ----------------------------------------------------------------------------
-- EXPERIENCE
-- ----------------------------------------------------------------------------
select pg_temp.upsert_i18n(
  'experience.eyebrow', 'experience',
  'Trayectoria',
  'Career'
);

select pg_temp.upsert_i18n(
  'experience.subtitle', 'experience',
  'Roles donde he construido producto real con equipos pequeños y entregando bajo restricción.',
  'Roles where I have built real product with small teams, delivering under constraint.'
);

select pg_temp.upsert_i18n(
  'experience.summaryLabel', 'experience',
  'Resumen',
  'Summary'
);

select pg_temp.upsert_i18n(
  'experience.yearsSub', 'experience',
  'años en producto',
  'years building product'
);

select pg_temp.upsert_i18n(
  'experience.summary', 'experience',
  'De optimización logística a plataformas geoespaciales. Roles full stack con énfasis en frontend Angular y servicios Python.',
  'From logistics optimization to geospatial platforms. Full-stack roles with emphasis on Angular frontend and Python services.'
);

-- ----------------------------------------------------------------------------
-- PROJECTS
-- ----------------------------------------------------------------------------
select pg_temp.upsert_i18n(
  'projects.eyebrow', 'projects',
  'Trabajo seleccionado',
  'Selected work'
);

select pg_temp.upsert_i18n(
  'projects.subtitle', 'projects',
  'Una selección de productos en los que he participado, desde landing pages hasta plataformas de gestión.',
  'A selection of products I have worked on, from landing pages to management platforms.'
);

select pg_temp.upsert_i18n(
  'projects.featured', 'projects',
  'Destacado',
  'Featured'
);

-- ----------------------------------------------------------------------------
-- CONTACT
-- ----------------------------------------------------------------------------
select pg_temp.upsert_i18n(
  'contact.eyebrow', 'contact',
  'Hablemos',
  'Let''s talk'
);

select pg_temp.upsert_i18n(
  'contact.subtitle', 'contact',
  '¿Tienes un proyecto en mente o simplemente quieres saludar? Cualquier canal funciona.',
  'Got a project in mind or just want to say hi? Any channel works.'
);

-- ----------------------------------------------------------------------------
-- FOOTER
-- ----------------------------------------------------------------------------
select pg_temp.upsert_i18n(
  'footer.tagline', 'footer',
  'Hecho con cuidado en Bucaramanga',
  'Made with care in Bucaramanga'
);

select pg_temp.upsert_i18n(
  'footer.backToTop', 'footer',
  'Volver arriba',
  'Back to top'
);
