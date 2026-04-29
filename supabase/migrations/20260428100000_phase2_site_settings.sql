-- ============================================================
-- Fase 2: Site-settings
-- Globale innstillinger per site: kontakt, adresser, åpningstider, sosial.
-- Idempotent: kan kjøres på nytt.
-- Forutsetter at fase 1 (sites, has_site_access, touch_updated_at) er kjørt.
-- ============================================================

-- 1. SITE_SETTINGS — én rad per site
CREATE TABLE IF NOT EXISTS site_settings (
  site_id         uuid          PRIMARY KEY REFERENCES sites(id) ON DELETE CASCADE,

  -- Kontakt
  phone           text,
  email_general   text,

  -- Adresse
  visit_address   text,
  postal_address  text,

  -- Åpningstider (multilinje tekst, vises med whitespace-pre-line på frontend)
  opening_hours   text,

  -- Sosiale medier (jsonb objekt: { facebook, instagram, linkedin, ... })
  social          jsonb         DEFAULT '{}'::jsonb NOT NULL,

  updated_at      timestamptz   DEFAULT now() NOT NULL
);

-- 2. RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads site_settings" ON site_settings;
CREATE POLICY "Public reads site_settings"
  ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site users insert site_settings" ON site_settings;
CREATE POLICY "Site users insert site_settings"
  ON site_settings FOR INSERT
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users update site_settings" ON site_settings;
CREATE POLICY "Site users update site_settings"
  ON site_settings FOR UPDATE
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users delete site_settings" ON site_settings;
CREATE POLICY "Site users delete site_settings"
  ON site_settings FOR DELETE
  USING (has_site_access(site_id));

-- 3. Trigger: updated_at
DROP TRIGGER IF EXISTS site_settings_touch_updated_at ON site_settings;
CREATE TRIGGER site_settings_touch_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- 4. Seed Reolconsult
INSERT INTO site_settings (
  site_id,
  phone,
  email_general,
  visit_address,
  postal_address,
  opening_hours,
  social
)
SELECT
  id,
  '33 36 55 80',
  'mail@reolconsult.no',
  'Smiløkka 7, 3173 Vear',
  'Postboks 1, 3108 Vear',
  E'Mandag–fredag: 08:00–16:00\nLørdag/søndag: Stengt',
  '{}'::jsonb
FROM sites
WHERE slug = 'reolconsult'
ON CONFLICT (site_id) DO NOTHING;
