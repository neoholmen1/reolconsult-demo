-- ============================================================
-- Fase 4: Team, testimonials, case studies, client logos
-- Idempotent. Forutsetter fase 1+2+3a.
-- ============================================================

-- 1. TEAM_MEMBERS
CREATE TABLE IF NOT EXISTS team_members (
  id          uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id     uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name        text          NOT NULL,
  role        text          DEFAULT '' NOT NULL,
  phone       text          DEFAULT '' NOT NULL,
  email       text          DEFAULT '' NOT NULL,
  photo_url   text,
  bio         text          DEFAULT '' NOT NULL,
  sort_order  integer       DEFAULT 0 NOT NULL,
  active      boolean       DEFAULT true NOT NULL,
  created_at  timestamptz   DEFAULT now() NOT NULL,
  updated_at  timestamptz   DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS team_members_site_id_idx ON team_members(site_id, sort_order);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads team_members" ON team_members;
CREATE POLICY "Public reads team_members" ON team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site users write team_members" ON team_members;
CREATE POLICY "Site users write team_members" ON team_members FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP TRIGGER IF EXISTS team_members_touch_updated_at ON team_members;
CREATE TRIGGER team_members_touch_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- 2. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id              uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id         uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  author_name     text          NOT NULL,
  author_role     text          DEFAULT '' NOT NULL,
  author_company  text          DEFAULT '' NOT NULL,
  quote           text          NOT NULL,
  rating          integer,
  sort_order      integer       DEFAULT 0 NOT NULL,
  published       boolean       DEFAULT true NOT NULL,
  created_at      timestamptz   DEFAULT now() NOT NULL,
  updated_at      timestamptz   DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS testimonials_site_id_idx ON testimonials(site_id, sort_order);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads testimonials" ON testimonials;
CREATE POLICY "Public reads testimonials" ON testimonials FOR SELECT USING (published);

DROP POLICY IF EXISTS "Site users write testimonials" ON testimonials;
CREATE POLICY "Site users write testimonials" ON testimonials FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP TRIGGER IF EXISTS testimonials_touch_updated_at ON testimonials;
CREATE TRIGGER testimonials_touch_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- 3. CASE_STUDIES (referanseprosjekter)
CREATE TABLE IF NOT EXISTS case_studies (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id       uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  customer_name text          NOT NULL,
  project_type  text          DEFAULT '' NOT NULL,
  description   text          DEFAULT '' NOT NULL,
  image_url     text,
  year          text          DEFAULT '' NOT NULL,
  sort_order    integer       DEFAULT 0 NOT NULL,
  published     boolean       DEFAULT true NOT NULL,
  created_at    timestamptz   DEFAULT now() NOT NULL,
  updated_at    timestamptz   DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS case_studies_site_id_idx ON case_studies(site_id, sort_order);
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads case_studies" ON case_studies;
CREATE POLICY "Public reads case_studies" ON case_studies FOR SELECT USING (published);

DROP POLICY IF EXISTS "Site users write case_studies" ON case_studies;
CREATE POLICY "Site users write case_studies" ON case_studies FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP TRIGGER IF EXISTS case_studies_touch_updated_at ON case_studies;
CREATE TRIGGER case_studies_touch_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- 4. CLIENT_LOGOS
CREATE TABLE IF NOT EXISTS client_logos (
  id          uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id     uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name        text          NOT NULL,
  logo_url    text          NOT NULL,
  sort_order  integer       DEFAULT 0 NOT NULL,
  created_at  timestamptz   DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS client_logos_site_id_idx ON client_logos(site_id, sort_order);
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads client_logos" ON client_logos;
CREATE POLICY "Public reads client_logos" ON client_logos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site users write client_logos" ON client_logos;
CREATE POLICY "Site users write client_logos" ON client_logos FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));


-- 5. SEED for Reolconsult
DO $$
DECLARE rc_id uuid;
BEGIN
  SELECT id INTO rc_id FROM sites WHERE slug = 'reolconsult';
  IF rc_id IS NULL THEN RETURN; END IF;

  -- Team
  INSERT INTO team_members (site_id, name, role, phone, email, sort_order)
  VALUES
    (rc_id, 'Agnete H. Bechmann', 'Salg & rådgivning', '450 07 322', 'agh@reolconsult.no', 0),
    (rc_id, 'Tore Aas-Kristiansen', 'Salg & rådgivning', '982 04 323', 'tk@reolconsult.no', 1)
  ON CONFLICT DO NOTHING;

  -- Case studies
  INSERT INTO case_studies (site_id, customer_name, project_type, image_url, sort_order)
  VALUES
    (rc_id, 'Hekta På Tur', 'Pallreoler', 'https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg', 0),
    (rc_id, 'Foodora Market', 'Butikk- og lagerinnredning', 'https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg', 1),
    (rc_id, 'Vrengen Maritime', 'Disk og butikkinnredning', 'https://reolconsult.no/wp-content/uploads/2022/11/Disk-Vrengen-Maritime-1-1-scaled.jpg', 2),
    (rc_id, 'Floyd by Smith', 'Mesaninløsning', 'https://reolconsult.no/wp-content/uploads/2022/11/Floyd-april-2022-3.jpg', 3),
    (rc_id, 'TESS Elverum', 'Disk og butikkinnredning', 'https://reolconsult.no/wp-content/uploads/2022/11/Disk-TESS-Elverum.jpg', 4),
    (rc_id, 'Mandal Maritime', 'Disk og butikkinnredning', 'https://reolconsult.no/wp-content/uploads/2022/11/Disk-Mandal-Maritime-1-002-scaled.jpg', 5)
  ON CONFLICT DO NOTHING;

  -- Client logos
  INSERT INTO client_logos (site_id, name, logo_url, sort_order)
  VALUES
    (rc_id, 'Nortura', 'https://reolconsult.no/wp-content/uploads/2018/08/23226ae2_d07d_451c_abd1_fa5e50fef0f6-380x126-resize.jpg', 0),
    (rc_id, 'Floyd by Smith', 'https://reolconsult.no/wp-content/uploads/2018/08/552fb566_6481_410d_b76c_e37af2eb5884-380x83-resize.png', 1),
    (rc_id, 'Foodora Market', 'https://reolconsult.no/wp-content/uploads/2022/11/Foodora.png', 2),
    (rc_id, 'Nordisk Aviation Products', 'https://reolconsult.no/wp-content/uploads/2018/08/3ad43556_013c_425e_86c0_f2fd844cde45-358x56-resize.jpg', 3),
    (rc_id, 'Tilbords', 'https://reolconsult.no/wp-content/uploads/2018/08/4dcb4aa1_91b1_4d43_8df3_3d2f998838d2.jpg', 4),
    (rc_id, 'Rheinmetall Defence', 'https://reolconsult.no/wp-content/uploads/2018/08/93c39b25_6a32_4f9b_98f3_1886fc4dbffe-380x65-resize.jpg', 5),
    (rc_id, 'Cemo Gourmet', 'https://reolconsult.no/wp-content/uploads/2018/08/cemogourmet_cmyk-380x89-resize.jpg', 6),
    (rc_id, 'TESS', 'https://reolconsult.no/wp-content/uploads/2018/08/ff3538c2_96c8_4082_9668_40d1f8f952bb-380x41-resize.png', 7),
    (rc_id, 'ASKO', 'https://reolconsult.no/wp-content/uploads/2018/08/97ae76fb-60c7-4702-9d28-d4eeced6cd31-380x53-resize.jpg', 8),
    (rc_id, 'Diplomat', 'https://reolconsult.no/wp-content/uploads/2018/08/4598e373_77ac_4336_bfba_85d17a33b1ad-380x80-resize.jpg', 9),
    (rc_id, 'Findus', 'https://reolconsult.no/wp-content/uploads/2018/08/0aea0788-8358-4cc5-8041-8ad3e331a2ea-380x163-resize.png', 10),
    (rc_id, 'Solar', 'https://reolconsult.no/wp-content/uploads/2018/08/f39f4f7a_bfdc_492e_9d0c_b57f5cb2847b-380x127-resize.jpg', 11)
  ON CONFLICT DO NOTHING;
END $$;
