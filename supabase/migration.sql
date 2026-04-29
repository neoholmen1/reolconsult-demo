-- ============================================================
-- Reolconsult Chatbot: Full migration
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Drop old chatbot_knowledge table (has wrong schema: only id, content, updated_at, updated_by)
DROP TABLE IF EXISTS chatbot_knowledge CASCADE;

-- 2. Create new structured knowledge table
CREATE TABLE chatbot_knowledge (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  category_type text NOT NULL CHECK (category_type IN ('produkt', 'tjeneste', 'salg', 'bedriftsinfo')),
  description text DEFAULT '',
  variants jsonb DEFAULT '[]'::jsonb,
  discounts jsonb DEFAULT '[]'::jsonb,
  extra_info text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- 3. RLS policies for chatbot_knowledge
ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON chatbot_knowledge
  FOR SELECT USING (true);

CREATE POLICY "Allow auth insert" ON chatbot_knowledge
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow auth update" ON chatbot_knowledge
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth delete" ON chatbot_knowledge
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Create chatbot_documents table
DROP TABLE IF EXISTS chatbot_documents CASCADE;

CREATE TABLE chatbot_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  file_type text NOT NULL DEFAULT 'txt',
  category text NOT NULL DEFAULT 'produkt',
  content text DEFAULT '',
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by text DEFAULT ''
);

-- 5. RLS policies for chatbot_documents
ALTER TABLE chatbot_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read docs" ON chatbot_documents
  FOR SELECT USING (true);

CREATE POLICY "Allow auth insert docs" ON chatbot_documents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow auth update docs" ON chatbot_documents
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth delete docs" ON chatbot_documents
  FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Seed data: PRODUKTER (16)
INSERT INTO chatbot_knowledge (category, category_type, description, variants, discounts, extra_info) VALUES
('Pallreoler', 'produkt',
 'Konvensjonelle pallreoler med ubegrenset tilgang til alle paller. Høyder opptil 30 meter. Passer alle palltyper.',
 '[{"name":"Standard 3m seksjon","price":"4500","stock":"85","delivery":"1-2 uker"},{"name":"Standard 6m seksjon","price":"7200","stock":"","delivery":"3-6 uker"}]'::jsonb,
 '[{"min_quantity":"50","price":"3800"}]'::jsonb,
 'Pulverlakkert stål. Justerbare bjelker.'),

('Småvarereoler', 'produkt',
 'Høykvalitets hyllereol i galvanisert stål. Justerbare hyller med 25mm deling. Enkel montering uten verktøy.',
 '[{"name":"600mm bred","price":"1500","stock":"","delivery":"1-2 uker"},{"name":"900mm bred","price":"2500","stock":"","delivery":"1-2 uker"},{"name":"1200mm bred","price":"4000","stock":"","delivery":"1-2 uker"}]'::jsonb,
 '[]'::jsonb, ''),

('Mesanin', 'produkt',
 'Doble gulvarealet ved å utnytte takhøyden. Bæreevne 250-1000 kg/m². Leveres med trapp, rekkverk og sikkerhetsutstyr.',
 '[{"name":"Pris etter prosjekt","price":"","stock":"","delivery":"4-8 uker"}]'::jsonb,
 '[]'::jsonb, 'Kan kombineres med reoler. Skreddersydd til lokalet.'),

('Grenreoler', 'produkt',
 'Konsolreoler for lange og tunge varer som rør, stenger, plater og trelast.',
 '[{"name":"Ensidig","price":"4990","stock":"","delivery":"3-6 uker"},{"name":"Dobbeltsidig","price":"6990","stock":"","delivery":"3-6 uker"}]'::jsonb,
 '[]'::jsonb, 'For langgods og plater.'),

('Universalreoler', 'produkt',
 'Allsidig stålreol for de fleste formål. Robust og fleksibel med justerbare hylleplan.',
 '[{"name":"Standard seksjon","price":"1990","stock":"","delivery":"1-2 uker"}]'::jsonb,
 '[{"min_quantity":"10","price":"1790"}]'::jsonb, ''),

('Spesialreoler (dekk, båt, trelast)', 'produkt',
 'Dekkreoler, trelastreoler, båtreoler og andre spesialløsninger for lagring.',
 '[{"name":"Dekkreol","price":"2490","stock":"","delivery":"1-2 uker"},{"name":"Trelastreol","price":"3990","stock":"","delivery":"3-6 uker"},{"name":"Båtreol","price":"4990","stock":"","delivery":"4-8 uker"}]'::jsonb,
 '[]'::jsonb, 'Optimert for bilverksteder og dekkhoteller.'),

('Gondoler & Veggsystemer', 'produkt',
 'Enkel- og dobbeltsidig med justerbare hyller. Grunnsystem utviklet etter svensk byggestandard.',
 '[{"name":"Enkeltsidig seksjon","price":"3000","stock":"","delivery":"3-6 uker"},{"name":"Dobbeltsidig seksjon","price":"4500","stock":"","delivery":"3-6 uker"}]'::jsonb,
 '[]'::jsonb, 'Mange tilbehør: kroker, hyller, kurver.'),

('Disker', 'produkt',
 'Robust, modulbasert disksystem fra Sverige. Standardfarger front: hvit, svart, grå. Kan leveres med skranketopp, skuffer, hyller, dører, LED-belysning.',
 '[{"name":"Pris etter mål og utførelse","price":"","stock":"","delivery":"6-8 uker"}]'::jsonb,
 '[]'::jsonb, 'Laminat eller ståloverflate. Tilpasset din kassaløsning.'),

('Butikktilbehør', 'produkt',
 'Tilbehør og detaljinnredning for butikk. Prislistholdere, kroker, spydskinner og endedisplayer.',
 '[]'::jsonb, '[]'::jsonb, ''),

('Arbeidsbord', 'produkt',
 'Arbeidsplasser tilpasset ditt behov. Manuelt justerbare, elektrisk hev/senk, pakkebord og rullebord.',
 '[{"name":"Manuelt hev/senk","price":"4000","stock":"","delivery":"2-4 uker"},{"name":"Elektrisk hev/senk","price":"7500","stock":"","delivery":"2-4 uker"},{"name":"Pakkebord","price":"5500","stock":"","delivery":"2-4 uker"}]'::jsonb,
 '[]'::jsonb, ''),

('Verktøyskap', 'produkt',
 'Industrielle skap for oppbevaring av verktøy og deler. Skuffer med kulelagerføring.',
 '[{"name":"Standard skap","price":"2990","stock":"","delivery":"2-4 uker"},{"name":"Bredt skap","price":"3990","stock":"","delivery":"2-4 uker"}]'::jsonb,
 '[]'::jsonb, ''),

('Transport & Løfteutstyr', 'produkt',
 'Trucker, rullebord, transportvogner og løfteutstyr for lager og produksjon.',
 '[]'::jsonb, '[]'::jsonb, ''),

('Miljøsikring', 'produkt',
 'Oppsamlingskar, miljøstasjoner og spill-containere for trygg håndtering av farlige stoffer.',
 '[]'::jsonb, '[]'::jsonb, ''),

('Kontormøbler', 'produkt',
 'Skrivebord (hev/senk og faste), kontorstol, besøksstoler, oppbevaringsskap og arkivløsninger.',
 '[{"name":"Hev/senk skrivebord","price":"3990","stock":"","delivery":"1-2 uker"},{"name":"Kontorstol","price":"2490","stock":"","delivery":"1-2 uker"}]'::jsonb,
 '[]'::jsonb, ''),

('Garderobeskap', 'produkt',
 'Velg dørtype, materialer, farger, ventilasjon og lås. Ståldør, laminat, kryssfiner eller galvanisert stål.',
 '[{"name":"1-roms skap","price":"2500","stock":"begrenset","delivery":"4-6 uker"},{"name":"Z-skap","price":"3200","stock":"","delivery":"4-6 uker"}]'::jsonb,
 '[]'::jsonb, ''),

('Skole & Barnehage', 'produkt',
 'Stoler, pulter, bord, benker, tavler, elevskap for skole. Barnestoler, bord, åpen innredning, madrasser, stellebord for barnehage.',
 '[]'::jsonb, '[]'::jsonb, '');

-- 7. Seed data: TJENESTER (3)
INSERT INTO chatbot_knowledge (category, category_type, description, extra_info) VALUES
('HMS Sikkerhetskontroll', 'tjeneste',
 'Lovpålagt kontroll av pallreoler og lagerinnredning. Visuell inspeksjon, skaderapport med grønn/gul/rød merking.',
 'Fra 2.500 kr per inspeksjon. Vi dekker hele Østlandet.'),

('Levering & Montering', 'tjeneste',
 'Vi leverer over hele Norge. Lagerførte varer: 1-2 uker. Bestillingsvarer: 3-6 uker. Spesialtilpasset: 4-8 uker. Inkluderer prosjektering, levering og profesjonell montering.',
 'Frakt beregnes ut fra volum og distanse. Gratis befaring.'),

('Prosjektering', 'tjeneste',
 'Komplett prosjektering fra idé til ferdig sluttprodukt. Behovsanalyse, rådgivning, 3D-tegning og visualisering.',
 'Ta kontakt for uforpliktende prosjekteringsmøte.');

-- 8. Seed data: SALG (1)
INSERT INTO chatbot_knowledge (category, category_type, description, variants, extra_info) VALUES
('Bruktsalg', 'salg',
 'Brukte pallreoler og innredning i god stand. Varierende utvalg.',
 '[{"name":"Brukte pallreoler","price":"fra 2000","stock":"varierer","delivery":"straks"}]'::jsonb,
 'Utvalget varierer. Ring 333 65 580 for å høre hva vi har inne.');

-- 9. Seed data: BEDRIFTSINFO (4)
INSERT INTO chatbot_knowledge (category, category_type, description) VALUES
('Om oss', 'bedriftsinfo',
 'Reol-Consult AS ble etablert i november 1984. Vi holder til på Vear i Tønsberg med 350 kvm utstilling. Østlandets største leverandør innen butikk-, lager-, verksted-, kontor-, arkiv- og garderobeinnredning.'),

('Åpningstider', 'bedriftsinfo',
 'Mandag-fredag: 08:00-16:00. Besøk etter avtale. Ring 333 65 580.'),

('Kontaktinfo', 'bedriftsinfo',
 E'Sentralbord: 333 65 580\nAgnete H. Bechmann: 450 07 322\nTore Aas-Kristiansen: 982 04 323\nE-post: mail@reolconsult.no\nBesøksadresse: Smiløkka 7, 3173 Vear'),

('Utstilling/Showroom', 'bedriftsinfo',
 '350 kvm showroom på Smiløkka 7, Vear. Se og ta på produktene. Ring for avtale.');
