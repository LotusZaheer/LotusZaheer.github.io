-- 1. Enable UUID extension if not exists
create extension if not exists "uuid-ossp";

-- 2. Languages Table
create table if not exists languages (
  code text primary key,
  name text not null,
  is_default boolean default false
);

-- Seed Languages
insert into languages (code, name, is_default) values
('es', 'Español', true),
('en', 'English', false)
on conflict (code) do nothing;

-- 3. Keys Table
create table if not exists i18n_keys (
  id uuid default uuid_generate_v4() primary key,
  key_name text unique not null,
  page text,
  is_system boolean default false
);

-- 4. Values Table
create table if not exists i18n_values (
  id uuid default uuid_generate_v4() primary key,
  key_id uuid references i18n_keys(id) on delete cascade,
  lang_code text references languages(code) on delete cascade,
  value text,
  unique(key_id, lang_code)
);

-- 5. RLS Policies
alter table languages enable row level security;
alter table i18n_keys enable row level security;
alter table i18n_values enable row level security;

-- Public Read
create policy "Public read languages" on languages for select using (true);
create policy "Public read keys" on i18n_keys for select using (true);
create policy "Public read values" on i18n_values for select using (true);

-- Auth Write (CMS)
create policy "Auth insert languages" on languages for insert with check (auth.role() = 'authenticated');
create policy "Auth update languages" on languages for update using (auth.role() = 'authenticated');
create policy "Auth delete languages" on languages for delete using (auth.role() = 'authenticated');

create policy "Auth insert keys" on i18n_keys for insert with check (auth.role() = 'authenticated');
create policy "Auth update keys" on i18n_keys for update using (auth.role() = 'authenticated');
create policy "Auth delete keys" on i18n_keys for delete using (auth.role() = 'authenticated');

create policy "Auth insert values" on i18n_values for insert with check (auth.role() = 'authenticated');
create policy "Auth update values" on i18n_values for update using (auth.role() = 'authenticated');
create policy "Auth delete values" on i18n_values for delete using (auth.role() = 'authenticated');

-- 6. Seed Data (Generated from JSON)

DO $$
DECLARE
  k_id uuid;
BEGIN
  -- Helper to insert key and values
  -- HOME
  insert into i18n_keys (key_name, page, is_system) values ('home.greeting', 'home', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', '¡Hola! Soy'), (k_id, 'en', 'Hi! I''m');

  insert into i18n_keys (key_name, page, is_system) values ('home.name', 'home', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Andrés Uribe'), (k_id, 'en', 'Andres Uribe');

  insert into i18n_keys (key_name, page, is_system) values ('home.title', 'home', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Desarrollador Web'), (k_id, 'en', 'Web Developer');

  insert into i18n_keys (key_name, page, is_system) values ('home.description', 'home', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Soy ingeniero de sistemas con experiencia en análisis de datos y desarrollo de software...'), (k_id, 'en', 'I am a systems engineer with experience in data analysis...');

  insert into i18n_keys (key_name, page, is_system) values ('home.viewProjects', 'home', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Ver Proyectos'), (k_id, 'en', 'View Projects');

  insert into i18n_keys (key_name, page, is_system) values ('home.contact', 'home', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Contacto'), (k_id, 'en', 'Contact');

  -- SECTIONS
  insert into i18n_keys (key_name, page, is_system) values ('sections.about', 'sections', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Sobre mi'), (k_id, 'en', 'About me');

  insert into i18n_keys (key_name, page, is_system) values ('sections.skills', 'sections', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Habilidades'), (k_id, 'en', 'Skills');

  insert into i18n_keys (key_name, page, is_system) values ('sections.projects', 'sections', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Proyectos'), (k_id, 'en', 'Projects');

  insert into i18n_keys (key_name, page, is_system) values ('sections.contact', 'sections', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Contacto'), (k_id, 'en', 'Contact');

  -- SKILLS (Static labels)
  insert into i18n_keys (key_name, page, is_system) values ('skills.title', 'skills', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Habilidades'), (k_id, 'en', 'Skills');

  insert into i18n_keys (key_name, page, is_system) values ('skills.languages', 'skills', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Lenguajes'), (k_id, 'en', 'Languages');

  insert into i18n_keys (key_name, page, is_system) values ('skills.frameworks', 'skills', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Frameworks'), (k_id, 'en', 'Frameworks');

  insert into i18n_keys (key_name, page, is_system) values ('skills.markupStyles', 'skills', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Markup y Estilos'), (k_id, 'en', 'Markup & Styles');

  insert into i18n_keys (key_name, page, is_system) values ('skills.libraries', 'skills', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Librerías'), (k_id, 'en', 'Libraries');

  insert into i18n_keys (key_name, page, is_system) values ('skills.platforms', 'skills', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Plataformas'), (k_id, 'en', 'Platforms');

  insert into i18n_keys (key_name, page, is_system) values ('skills.apis', 'skills', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'APIs'), (k_id, 'en', 'APIs');

  -- OTHERS
  insert into i18n_keys (key_name, page, is_system) values ('others.company', 'others', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Compañía'), (k_id, 'en', 'Company');
  
  insert into i18n_keys (key_name, page, is_system) values ('others.role', 'others', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Rol'), (k_id, 'en', 'Role');

  insert into i18n_keys (key_name, page, is_system) values ('others.viewSite', 'others', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Ver sitio'), (k_id, 'en', 'View site');

  insert into i18n_keys (key_name, page, is_system) values ('others.viewCode', 'others', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Ver código'), (k_id, 'en', 'View code');

  -- CONTACT
  insert into i18n_keys (key_name, page, is_system) values ('contact.fullName', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Nombre completo'), (k_id, 'en', 'Full Name');

  insert into i18n_keys (key_name, page, is_system) values ('contact.email', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Correo electrónico'), (k_id, 'en', 'Email');

  insert into i18n_keys (key_name, page, is_system) values ('contact.company', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Empresa'), (k_id, 'en', 'Company');

  insert into i18n_keys (key_name, page, is_system) values ('contact.message', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Mensaje'), (k_id, 'en', 'Message');
  
  insert into i18n_keys (key_name, page, is_system) values ('contact.phone', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Teléfono'), (k_id, 'en', 'Phone');

  insert into i18n_keys (key_name, page, is_system) values ('contact.messagePlaceholder', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Escribe tu mensaje aquí...'), (k_id, 'en', 'Write your message here...');

  insert into i18n_keys (key_name, page, is_system) values ('contact.policy', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Acepto el tratamiento de mis datos personales de acuerdo con la política de privacidad.'), (k_id, 'en', 'I agree to the processing of my personal data in accordance with the privacy policy.');

  insert into i18n_keys (key_name, page, is_system) values ('contact.send', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Enviar mensaje'), (k_id, 'en', 'Send Message');

  insert into i18n_keys (key_name, page, is_system) values ('contact.socialTitle', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Medios de contacto'), (k_id, 'en', 'Connect with me');

  insert into i18n_keys (key_name, page, is_system) values ('contact.socialDescription', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Sígueme en mis redes sociales o contáctame directamente.'), (k_id, 'en', 'Follow me on social media or reach out directly.');

  insert into i18n_keys (key_name, page, is_system) values ('contact.searchCountry', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Buscar país'), (k_id, 'en', 'Search country');
  
  insert into i18n_keys (key_name, page, is_system) values ('contact.noResults', 'contact', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'No se encontraron resultados'), (k_id, 'en', 'No results found');

  -- ABOUT
  insert into i18n_keys (key_name, page, is_system) values ('about.downloadCV', 'about', true) returning id into k_id;
  insert into i18n_values (key_id, lang_code, value) values (k_id, 'es', 'Descargar CV'), (k_id, 'en', 'Download CV');

END $$;
