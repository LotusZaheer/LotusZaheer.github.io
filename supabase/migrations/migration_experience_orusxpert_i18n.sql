-- Seed i18n keys for the OrusXpert experience entry (ES + EN).
-- Idempotent: re-running updates the existing values.

CREATE OR REPLACE FUNCTION pg_temp.upsert_i18n(p_key text, p_page text, p_es text, p_en text)
RETURNS void AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO i18n_keys (key_name, page, is_system)
    VALUES (p_key, p_page, true)
    ON CONFLICT (key_name) DO UPDATE SET page = EXCLUDED.page
    RETURNING id INTO v_id;

  INSERT INTO i18n_values (key_id, lang_code, value)
    VALUES (v_id, 'es', p_es), (v_id, 'en', p_en)
    ON CONFLICT (key_id, lang_code) DO UPDATE SET value = EXCLUDED.value;
END;
$$ LANGUAGE plpgsql;

SELECT pg_temp.upsert_i18n(
  'experience.items.orusxpert.role',
  'experience',
  'Desarrollador de Software',
  'Software Developer'
);

SELECT pg_temp.upsert_i18n(
  'experience.items.orusxpert.duration',
  'experience',
  'Julio 2022 — Diciembre 2025',
  'July 2022 — December 2025'
);

SELECT pg_temp.upsert_i18n(
  'experience.items.orusxpert.location',
  'experience',
  'Bucaramanga, Colombia',
  'Bucaramanga, Colombia'
);

SELECT pg_temp.upsert_i18n(
  'experience.items.orusxpert.description',
  'experience',
  'Desarrollo de BeatRide, plataforma de optimización y visualización de rutas comerciales y logísticas.',
  'Development of BeatRide, a platform for optimization and visualization of commercial and logistics routes.'
);

SELECT pg_temp.upsert_i18n(
  'experience.items.orusxpert.bullet1',
  'experience',
  'Diseñé y definí la arquitectura frontend en Angular, tomando decisiones técnicas clave y construyendo una aplicación escalable con visualización geoespacial capaz de manejar miles de puntos en tiempo real.',
  'Designed and defined the frontend architecture in Angular, making key technical decisions and building a scalable application with geospatial visualization capable of handling thousands of points in real time.'
);

SELECT pg_temp.upsert_i18n(
  'experience.items.orusxpert.bullet2',
  'experience',
  'Desarrollé procesamiento y optimización de rutas en Python y C++ (GeoPandas, SciPy), implementando clustering para datasets >10.000 clientes bajo restricciones operativas.',
  'Built route processing and optimization in Python and C++ (GeoPandas, SciPy), implementing clustering for datasets of >10,000 clients under operational constraints.'
);

SELECT pg_temp.upsert_i18n(
  'experience.items.orusxpert.bullet3',
  'experience',
  'Mejoré el rendimiento del sistema logrando generación de rutas 10x más rápida, +11% efectividad de visitas, +12% productividad y -24% costos operativos.',
  'Improved system performance, achieving 10x faster route generation, +11% visit effectiveness, +12% productivity, and -24% operational costs.'
);

SELECT pg_temp.upsert_i18n(
  'experience.items.orusxpert.bullet4',
  'experience',
  'Construí la landing corporativa como SPA en React con SEO técnico y despliegue en Docker.',
  'Built the corporate landing as a SPA in React with technical SEO and Docker deployment.'
);
