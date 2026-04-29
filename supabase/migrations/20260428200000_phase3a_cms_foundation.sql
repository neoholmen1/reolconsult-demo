-- ============================================================
-- Fase 3a: CMS-grunnmur
-- Tabeller for innhold (pages, page_sections) og bildebibliotek (media)
-- + Storage-bucket og RLS.
-- Forutsetter at fase 1+2 er kjørt (bruker has_site_access og touch_updated_at).
-- Idempotent: kan kjøres på nytt.
-- ============================================================

-- 1. MEDIA — bildebibliotek
CREATE TABLE IF NOT EXISTS media (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id       uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  storage_path  text          NOT NULL,                -- "site-{id}/{category}/filename.ext"
  url           text          NOT NULL,                -- offentlig URL
  alt_text      text          DEFAULT '' NOT NULL,
  category      text          DEFAULT 'general' NOT NULL,  -- "hero", "product", "team", "blog", "general"
  mime_type     text,
  size_bytes    integer,
  width         integer,
  height        integer,
  uploaded_by   uuid          REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at   timestamptz   DEFAULT now() NOT NULL,
  UNIQUE(site_id, storage_path)
);

CREATE INDEX IF NOT EXISTS media_site_id_idx ON media(site_id);
CREATE INDEX IF NOT EXISTS media_site_id_category_idx ON media(site_id, category);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads media" ON media;
CREATE POLICY "Public reads media" ON media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site users insert media" ON media;
CREATE POLICY "Site users insert media" ON media FOR INSERT
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users update media" ON media;
CREATE POLICY "Site users update media" ON media FOR UPDATE
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users delete media" ON media;
CREATE POLICY "Site users delete media" ON media FOR DELETE
  USING (has_site_access(site_id));


-- 2. PAGES — én rad per side, med hero + SEO
CREATE TABLE IF NOT EXISTS pages (
  id                          uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id                     uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  slug                        text          NOT NULL,            -- "home", "lager", "om-oss", ...
  name                        text          NOT NULL,            -- vises i admin: "Forsiden", "Lager", ...

  -- Hero
  hero_image_url              text,
  hero_eyebrow                text,
  hero_title                  text,
  hero_subtitle               text,
  hero_cta_primary_label      text,
  hero_cta_primary_href       text,
  hero_cta_secondary_label    text,
  hero_cta_secondary_href     text,

  -- SEO
  meta_title                  text,
  meta_description            text,

  created_at                  timestamptz   DEFAULT now() NOT NULL,
  updated_at                  timestamptz   DEFAULT now() NOT NULL,
  UNIQUE(site_id, slug)
);

CREATE INDEX IF NOT EXISTS pages_site_id_slug_idx ON pages(site_id, slug);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads pages" ON pages;
CREATE POLICY "Public reads pages" ON pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site users insert pages" ON pages;
CREATE POLICY "Site users insert pages" ON pages FOR INSERT
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users update pages" ON pages;
CREATE POLICY "Site users update pages" ON pages FOR UPDATE
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users delete pages" ON pages;
CREATE POLICY "Site users delete pages" ON pages FOR DELETE
  USING (has_site_access(site_id));

DROP TRIGGER IF EXISTS pages_touch_updated_at ON pages;
CREATE TRIGGER pages_touch_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- 3. PAGE_SECTIONS — fleksible tekstblokker per side
CREATE TABLE IF NOT EXISTS page_sections (
  id            uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id       uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  page_slug     text          NOT NULL,                  -- matcher pages.slug
  section_key   text          NOT NULL,                  -- "about_teaser", "cta_final", ...
  field_key     text          NOT NULL,                  -- "title", "body", "image_url", "card", ...
  value         text          DEFAULT '' NOT NULL,       -- selve innholdet
  sort_order    integer       DEFAULT 0 NOT NULL,        -- for lister (gallery, kort osv.)
  updated_at    timestamptz   DEFAULT now() NOT NULL,
  UNIQUE(site_id, page_slug, section_key, field_key, sort_order)
);

CREATE INDEX IF NOT EXISTS page_sections_lookup_idx
  ON page_sections(site_id, page_slug);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads page_sections" ON page_sections;
CREATE POLICY "Public reads page_sections" ON page_sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site users insert page_sections" ON page_sections;
CREATE POLICY "Site users insert page_sections" ON page_sections FOR INSERT
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users update page_sections" ON page_sections;
CREATE POLICY "Site users update page_sections" ON page_sections FOR UPDATE
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP POLICY IF EXISTS "Site users delete page_sections" ON page_sections;
CREATE POLICY "Site users delete page_sections" ON page_sections FOR DELETE
  USING (has_site_access(site_id));

DROP TRIGGER IF EXISTS page_sections_touch_updated_at ON page_sections;
CREATE TRIGGER page_sections_touch_updated_at
  BEFORE UPDATE ON page_sections
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- 4. STORAGE BUCKET — for opplastede bilder
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,                                               -- offentlig lesbar
  10485760,                                           -- 10 MB maks
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;


-- 5. STORAGE RLS — kontroller hvem som kan laste opp/slette i media-bucketen
DROP POLICY IF EXISTS "Public reads media files" ON storage.objects;
CREATE POLICY "Public reads media files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Auth users upload media files" ON storage.objects;
CREATE POLICY "Auth users upload media files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Auth users update own media files" ON storage.objects;
CREATE POLICY "Auth users update own media files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Auth users delete own media files" ON storage.objects;
CREATE POLICY "Auth users delete own media files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND auth.role() = 'authenticated'
  );


-- 6. SEED PAGES for Reolconsult
INSERT INTO pages (site_id, slug, name)
SELECT s.id, p.slug, p.name
FROM sites s
CROSS JOIN (VALUES
  ('home', 'Forsiden'),
  ('produkter', 'Produkter (oversikt)'),
  ('lager', 'Lager'),
  ('butikk', 'Butikk'),
  ('kontor', 'Kontor'),
  ('verksted', 'Verksted og industri'),
  ('garderobe', 'Garderobe'),
  ('skole', 'Skole og barnehage'),
  ('bruktsalg', 'Bruktsalg'),
  ('referanser', 'Referanser'),
  ('om-oss', 'Om oss'),
  ('kontakt', 'Kontakt'),
  ('kataloger', 'Kataloger'),
  ('personvern', 'Personvern')
) AS p(slug, name)
WHERE s.slug = 'reolconsult'
ON CONFLICT (site_id, slug) DO NOTHING;
