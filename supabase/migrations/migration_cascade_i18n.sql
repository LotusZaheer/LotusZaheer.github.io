-- MIGRATION: CASCADE DELETE I18N KEYS
-- When a project, skill, or skill_category is deleted,
-- automatically delete the related i18n keys (and their values via existing cascade).

-- 1. Trigger function for PROJECTS
-- Deletes i18n_keys matching the title, description, and role fields
CREATE OR REPLACE FUNCTION delete_project_i18n_keys()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM i18n_keys 
  WHERE key_name IN (OLD.title, OLD.description, OLD.role)
    AND key_name IS NOT NULL;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_project_i18n
BEFORE DELETE ON projects
FOR EACH ROW EXECUTE FUNCTION delete_project_i18n_keys();

-- 2. Trigger function for SKILLS
-- Deletes i18n_keys matching the skill name
CREATE OR REPLACE FUNCTION delete_skill_i18n_keys()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM i18n_keys 
  WHERE key_name = OLD.name
    AND key_name IS NOT NULL;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_skill_i18n
BEFORE DELETE ON skills
FOR EACH ROW EXECUTE FUNCTION delete_skill_i18n_keys();

-- 3. Trigger function for SKILL_CATEGORIES
-- Deletes i18n_keys matching the category name
CREATE OR REPLACE FUNCTION delete_skill_category_i18n_keys()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM i18n_keys 
  WHERE key_name = OLD.name
    AND key_name IS NOT NULL;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_skill_category_i18n
BEFORE DELETE ON skill_categories
FOR EACH ROW EXECUTE FUNCTION delete_skill_category_i18n_keys();
