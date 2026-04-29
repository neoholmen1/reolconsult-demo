-- ============================================================
-- Fase 6: Blog posts
-- Idempotent. Forutsetter fase 1+2+3a.
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id                uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id           uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  slug              text          NOT NULL,
  title             text          NOT NULL,
  excerpt           text          DEFAULT '' NOT NULL,
  body              text          DEFAULT '' NOT NULL,           -- markdown
  cover_image_url   text,
  author_name       text          DEFAULT '' NOT NULL,
  published_at      timestamptz,
  status            text          DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'published')),
  created_at        timestamptz   DEFAULT now() NOT NULL,
  updated_at        timestamptz   DEFAULT now() NOT NULL,
  UNIQUE(site_id, slug)
);

CREATE INDEX IF NOT EXISTS blog_posts_site_status_idx ON blog_posts(site_id, status, published_at DESC);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads published blog_posts" ON blog_posts;
CREATE POLICY "Public reads published blog_posts" ON blog_posts FOR SELECT
  USING (status = 'published' OR has_site_access(site_id));

DROP POLICY IF EXISTS "Site users write blog_posts" ON blog_posts;
CREATE POLICY "Site users write blog_posts" ON blog_posts FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP TRIGGER IF EXISTS blog_posts_touch_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_touch_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
