-- ============================================================
-- Fase 5: Categories + products
-- Idempotent. Forutsetter fase 1+2+3a.
-- ============================================================

-- 1. CATEGORIES (produktkategorier)
CREATE TABLE IF NOT EXISTS categories (
  id              uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id         uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  slug            text          NOT NULL,
  title           text          NOT NULL,
  description     text          DEFAULT '' NOT NULL,
  hero_image_url  text,
  sort_order      integer       DEFAULT 0 NOT NULL,
  published       boolean       DEFAULT true NOT NULL,
  created_at      timestamptz   DEFAULT now() NOT NULL,
  updated_at      timestamptz   DEFAULT now() NOT NULL,
  UNIQUE(site_id, slug)
);

CREATE INDEX IF NOT EXISTS categories_site_id_idx ON categories(site_id, sort_order);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads categories" ON categories;
CREATE POLICY "Public reads categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site users write categories" ON categories;
CREATE POLICY "Site users write categories" ON categories FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP TRIGGER IF EXISTS categories_touch_updated_at ON categories;
CREATE TRIGGER categories_touch_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- 2. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id                  uuid          DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id             uuid          NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  category_slug       text          NOT NULL,
  slug                text          NOT NULL,
  title               text          NOT NULL,
  short_description   text          DEFAULT '' NOT NULL,
  long_description    text          DEFAULT '' NOT NULL,
  hero_image_url      text,
  gallery_images      jsonb         DEFAULT '[]'::jsonb NOT NULL,   -- [{url, alt}]
  specs               jsonb         DEFAULT '[]'::jsonb NOT NULL,   -- string[]
  variants            jsonb         DEFAULT '[]'::jsonb NOT NULL,
  price_from          numeric,
  price_unit          text          DEFAULT '' NOT NULL,
  sort_order          integer       DEFAULT 0 NOT NULL,
  published           boolean       DEFAULT true NOT NULL,
  created_at          timestamptz   DEFAULT now() NOT NULL,
  updated_at          timestamptz   DEFAULT now() NOT NULL,
  UNIQUE(site_id, slug)
);

CREATE INDEX IF NOT EXISTS products_site_cat_idx ON products(site_id, category_slug, sort_order);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads products" ON products;
CREATE POLICY "Public reads products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site users write products" ON products;
CREATE POLICY "Site users write products" ON products FOR ALL
  USING (has_site_access(site_id))
  WITH CHECK (has_site_access(site_id));

DROP TRIGGER IF EXISTS products_touch_updated_at ON products;
CREATE TRIGGER products_touch_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- 3. SEED categories (Reolconsult)
DO $$
DECLARE rc_id uuid;
BEGIN
  SELECT id INTO rc_id FROM sites WHERE slug = 'reolconsult';
  IF rc_id IS NULL THEN RETURN; END IF;

  INSERT INTO categories (site_id, slug, title, description, hero_image_url, sort_order) VALUES
    (rc_id, 'lager', 'Lagerinnredning', 'Pallreoler, stålhyller, mesanin og spesialreoler.', 'https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg', 0),
    (rc_id, 'butikk', 'Butikkinnredning', 'Gondoler, disker og komplett butikkinnredning.', 'https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg', 1),
    (rc_id, 'verksted', 'Verksted og industri', 'Arbeidsbord, verktøyskap og verkstedløsninger.', 'https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg', 2),
    (rc_id, 'kontor', 'Kontor', 'Skrivebord, stoler og kontorinnredning.', 'https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg', 3),
    (rc_id, 'garderobe', 'Garderobe', 'Garderobeskap, skoleskap og ladeskap.', 'https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg', 4),
    (rc_id, 'skole', 'Skole og barnehage', 'Pulter, stoler og innredning for alle aldre.', 'https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg', 5)
  ON CONFLICT (site_id, slug) DO NOTHING;
END $$;
