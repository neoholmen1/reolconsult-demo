-- ============================================================
-- Fase 3b: Seed pages-rader og page_sections med dagens innhold
-- Idempotent. Forutsetter fase 3a (pages, page_sections).
-- Kopierer hardkodet innhold inn i DB så page-editoren har defaults å vise.
-- ============================================================

DO $$
DECLARE rc_id uuid;
BEGIN
  SELECT id INTO rc_id FROM sites WHERE slug = 'reolconsult';
  IF rc_id IS NULL THEN RETURN; END IF;

  -- ─── HERO + SEO på sider ───────────────────────────────────

  UPDATE pages SET
    hero_eyebrow = 'Siden 1984',
    hero_title = E'Alt til ditt\nlager, butikk\nog kontor',
    hero_subtitle = 'Vi leverer innredning til butikk, lager, verksted, kontor, arkiv og garderobe — fra første tegning til ferdig montert. Bredt sortiment, og 350 kvm utstilling i Tønsberg.',
    hero_cta_primary_label = 'Utforsk produkter',
    hero_cta_primary_href = '#kategorier',
    hero_cta_secondary_label = 'Ring oss',
    hero_image_url = 'https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg',
    meta_title = 'Reol-Consult AS – Lager- og butikkinnredning',
    meta_description = 'Reol-Consult leverer lager-, butikk-, verksted-, kontor- og garderobeinnredning. Kontakt oss for tilbud.'
  WHERE site_id = rc_id AND slug = 'home';

  UPDATE pages SET
    hero_image_url = 'https://reolconsult.no/wp-content/uploads/2022/11/Hekta-Pa-Tur-2-scaled.jpg',
    hero_title = 'Lagerinnredning',
    hero_subtitle = 'Robuste lagerreoler i galvanisert stål — pallreoler, hyllereoler, dekkreoler, hjørnereoler og mer. Konkurransedyktige priser.',
    meta_title = 'Lagerinnredning – Reol-Consult AS',
    meta_description = 'Pallreoler, småvarereoler, mesanin, grenreoler og spesialreoler i galvanisert stål. HMS sikkerhetskontroll.'
  WHERE site_id = rc_id AND slug = 'lager';

  UPDATE pages SET
    hero_image_url = 'https://reolconsult.no/wp-content/uploads/2022/11/Dagligvare-Foodora.jpg',
    hero_title = 'Butikkinnredning',
    hero_subtitle = 'Fra enkelte detaljer til komplette systemer for store butikkmiljøer. Grunnsystemet er utviklet etter svensk byggestandard og tåler hard daglig bruk i mange år.',
    meta_title = 'Butikkinnredning – Reol-Consult AS',
    meta_description = 'Gondoler, veggsystemer, kassedisker og tilbehør. Komplett butikkinnredning fra idé til ferdig montert.'
  WHERE site_id = rc_id AND slug = 'butikk';

  UPDATE pages SET
    hero_image_url = 'https://reolconsult.no/wp-content/uploads/2018/08/projectskrivebordv.jpg',
    hero_title = 'Kontor',
    hero_subtitle = 'Kontormøbler, oppbevaring, resepsjon, konferansemøbler og skjermvegger. Vi hjelper deg med planlegging av hele kontoret.',
    meta_title = 'Kontormøbler – Reol-Consult AS',
    meta_description = 'Skrivebord (hev/senk), kontorstoler, oppbevaring, resepsjonsdisker, konferansebord og skjermvegger.'
  WHERE site_id = rc_id AND slug = 'kontor';

  UPDATE pages SET
    hero_image_url = 'https://reolconsult.no/wp-content/uploads/2018/08/arbeidsbord500.jpg',
    hero_title = 'Verksted & Industri',
    hero_subtitle = 'Ingen arbeidsplass er lik. Vi har et bredt utvalg standardløsninger og lager spesialtilpasninger når det trengs.',
    meta_title = 'Verksted og industri – Reol-Consult AS',
    meta_description = 'Arbeidsbord, verktøyskap, transportløsninger, miljøsikring og løfteutstyr for verksted og industri.'
  WHERE site_id = rc_id AND slug = 'verksted';

  UPDATE pages SET
    hero_image_url = 'https://reolconsult.no/wp-content/uploads/2023/11/IMG_1148-scaled.jpg',
    hero_title = 'Garderobe',
    hero_subtitle = 'Garderoberom skal være praktiske, men også trivelige å være i. Med våre garderobeskap bestemmer du selv farger, materialer, lås og funksjoner.',
    meta_title = 'Garderobeskap – Reol-Consult AS',
    meta_description = 'Garderobeskap, skoleskap og ladeskap. Velg dørtype, farger, lås og funksjoner.'
  WHERE site_id = rc_id AND slug = 'garderobe';

  UPDATE pages SET
    hero_image_url = 'https://reolconsult.no/wp-content/uploads/2023/11/Skole-og-barnehage-1.jpg',
    hero_title = 'Skole & Barnehage',
    hero_subtitle = 'Holdbarhet er nøkkelordet. Vi har levert innredning til en rekke skoler og barnehager over hele landet, og mange kunder kommer tilbake år etter år. Produktene våre skal tåle hard slitasje og holde seg moderne i mange år.',
    meta_title = 'Skole og barnehage – Reol-Consult AS',
    meta_description = 'Pulter, stoler, tavler, elevskap, barnehagemøbler og oppbevaring for skole og barnehage.'
  WHERE site_id = rc_id AND slug = 'skole';

  -- ─── PAGE_SECTIONS ──────────────────────────────────────────

  -- Helper: en lokal funksjon for å sette inn (eller oppdatere ved konflikt)
  CREATE OR REPLACE FUNCTION _seed_section(p_site uuid, p_page text, p_section text, p_field text, p_value text)
  RETURNS void LANGUAGE plpgsql AS $f$
  BEGIN
    INSERT INTO page_sections (site_id, page_slug, section_key, field_key, value, sort_order)
    VALUES (p_site, p_page, p_section, p_field, p_value, 0)
    ON CONFLICT (site_id, page_slug, section_key, field_key, sort_order) DO NOTHING;
  END;
  $f$;

  -- HOME
  PERFORM _seed_section(rc_id, 'home', 'hva_trenger_du', 'eyebrow', 'Våre kategorier');
  PERFORM _seed_section(rc_id, 'home', 'hva_trenger_du', 'title', 'Hva trenger du?');
  PERFORM _seed_section(rc_id, 'home', 'hva_trenger_du', 'subtitle', 'Vi leverer komplette innredningsløsninger for alle typer virksomheter.');

  PERFORM _seed_section(rc_id, 'home', 'about_teaser', 'eyebrow', 'Snakk direkte med oss');
  PERFORM _seed_section(rc_id, 'home', 'about_teaser', 'title', 'Ring Agnete eller Tore');
  PERFORM _seed_section(rc_id, 'home', 'about_teaser', 'body', 'Vi gir uforpliktende tilbud, befaring og rådgivning. Reol-Consult har holdt til på Vear siden 1984.');
  PERFORM _seed_section(rc_id, 'home', 'about_teaser', 'image_url', 'https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg');

  PERFORM _seed_section(rc_id, 'home', 'used_sales_teaser', 'badge', 'Spar penger');
  PERFORM _seed_section(rc_id, 'home', 'used_sales_teaser', 'title', E'Brukte reoler til\ngode priser');
  PERFORM _seed_section(rc_id, 'home', 'used_sales_teaser', 'body', 'Vi har jevnlig inn brukte pallreoler, stålhyller og butikkinnredning i god stand. En rimelig løsning for deg som trenger innredning uten å sprenge budsjettet.');
  PERFORM _seed_section(rc_id, 'home', 'used_sales_teaser', 'image_url', 'https://reolconsult.no/wp-content/uploads/2022/11/Nettinghyller-4.jpg');
  PERFORM _seed_section(rc_id, 'home', 'used_sales_teaser', 'cta_label', 'Se brukte produkter');

  PERFORM _seed_section(rc_id, 'home', 'cta_final', 'title', 'Trenger du innredning?');
  PERFORM _seed_section(rc_id, 'home', 'cta_final', 'body', 'Ring oss eller fyll ut skjemaet, så lager vi et tilbud tilpasset ditt behov.');

  PERFORM _seed_section(rc_id, 'home', 'references_intro', 'eyebrow', 'Et utvalg av kunder vi har levert til');

  -- OM-OSS
  PERFORM _seed_section(rc_id, 'om-oss', 'intro', 'eyebrow', 'Om oss');
  PERFORM _seed_section(rc_id, 'om-oss', 'intro', 'title', 'Om Reol-Consult AS');
  PERFORM _seed_section(rc_id, 'om-oss', 'intro', 'body', E'Reol-Consult AS ble etablert i november 1984. Vi leverer innredning til butikk, lager, verksted, kontor, arkiv og garderobe — fra første tegning til ferdig montert.\n\nUnder årenes løp har vi skaffet oss unike kunnskaper om planlegging og innredningsdesign. Hos oss finnes alt på ett og samme sted og vi leverer til store og små bedrifter over hele landet. På grunn av nærhet til produksjon kan vi tilby skreddersydde løsninger ved behov.\n\nVi er fagfolk med lang erfaring og har gjennom årene levert innredning til en rekke store og små prosjekter. På Smiløkka 7 på Vear i Tønsberg finner du vår 350 kvm utstilling. Her viser vi et stort utvalg av produktene vi leverer — mye av utstyret er på lager.');
  PERFORM _seed_section(rc_id, 'om-oss', 'intro', 'image_url', 'https://reolconsult.no/wp-content/uploads/2022/11/Mesanin-6-scaled.jpeg');

  PERFORM _seed_section(rc_id, 'om-oss', 'showroom', 'eyebrow', 'Besøk oss');
  PERFORM _seed_section(rc_id, 'om-oss', 'showroom', 'title', 'Showroom på Vear');
  PERFORM _seed_section(rc_id, 'om-oss', 'showroom', 'body', 'Vi holder til i Smiløkka 7 på Vear, med 350 kvadratmeter utstilling. Her kan du se og oppleve produktene våre i praksis — og få råd fra våre erfarne konsulenter.');

  PERFORM _seed_section(rc_id, 'om-oss', 'nokkelfakta', 'title', 'Derfor velger kundene oss');

  -- KONTAKT
  PERFORM _seed_section(rc_id, 'kontakt', 'intro', 'eyebrow', 'Kontakt');
  PERFORM _seed_section(rc_id, 'kontakt', 'intro', 'title', 'Ta kontakt med oss');
  PERFORM _seed_section(rc_id, 'kontakt', 'intro', 'body', 'Har du spørsmål, trenger et tilbud, eller ønsker å besøke vårt showroom? Fyll ut skjemaet eller ta kontakt direkte med en av våre ansatte.');

  PERFORM _seed_section(rc_id, 'kontakt', 'form', 'title', 'Send oss en melding');
  PERFORM _seed_section(rc_id, 'kontakt', 'form', 'help', 'Når du trykker «Send melding» åpnes e-postklienten din med meldingen ferdig utfylt. Vi svarer som regel innen én virkedag.');

  -- BRUKTSALG
  PERFORM _seed_section(rc_id, 'bruktsalg', 'intro', 'badge', 'Spar penger');
  PERFORM _seed_section(rc_id, 'bruktsalg', 'intro', 'title', E'Brukte reoler og\ninnredning til gode priser');
  PERFORM _seed_section(rc_id, 'bruktsalg', 'intro', 'body', 'Vi har alltid et utvalg av brukte reoler, butikkinnredning, lagerinnredning og kontormøbler på lager. Alt er kvalitetskontrollert og klar for nytt bruk — til en brøkdel av nyprisen.');

  PERFORM _seed_section(rc_id, 'bruktsalg', 'fordeler', 'title', 'Hvorfor kjøpe brukt?');

  -- REFERANSER
  PERFORM _seed_section(rc_id, 'referanser', 'intro', 'eyebrow', 'Referanser');
  PERFORM _seed_section(rc_id, 'referanser', 'intro', 'title', 'Noen av våre kunder');
  PERFORM _seed_section(rc_id, 'referanser', 'intro', 'body', 'Vi har levert innredning til alt fra dagligvarebutikker til maritime butikker, lager og verksteder over hele landet. Her er et utvalg.');

  PERFORM _seed_section(rc_id, 'referanser', 'cases', 'title', 'Utvalgte prosjekter');
  PERFORM _seed_section(rc_id, 'referanser', 'logos', 'title', 'Et utvalg av kunder vi har levert til');

  PERFORM _seed_section(rc_id, 'referanser', 'cta_final', 'title', 'Vurderer du oss til ditt prosjekt?');
  PERFORM _seed_section(rc_id, 'referanser', 'cta_final', 'body', 'Uansett om du trenger innredning til butikk, lager, kontor eller verksted — vi finner løsningen for deg.');

  -- KATALOGER
  PERFORM _seed_section(rc_id, 'kataloger', 'intro', 'eyebrow', 'Dokumenter');
  PERFORM _seed_section(rc_id, 'kataloger', 'intro', 'title', 'Kataloger');
  PERFORM _seed_section(rc_id, 'kataloger', 'intro', 'body', 'Bla gjennom våre produktkataloger digitalt, eller kontakt oss for å få tilsendt trykte brosjyrer.');

  PERFORM _seed_section(rc_id, 'kataloger', 'cta_final', 'title', 'Ønsker du trykte brosjyrer?');
  PERFORM _seed_section(rc_id, 'kataloger', 'cta_final', 'body', 'Kontakt oss for å få tilsendt produktbrosjyrer i posten.');

  -- PRODUKTUNDERSIDER — bare cta_final (hero ligger på pages-tabellen)
  PERFORM _seed_section(rc_id, 'lager', 'cta_final', 'title', 'Skal du planlegge nytt lager?');
  PERFORM _seed_section(rc_id, 'lager', 'cta_final', 'body', 'Send oss tegninger eller mål, så lager vi et uforpliktende forslag. Vi leverer og monterer over hele landet.');

  PERFORM _seed_section(rc_id, 'butikk', 'cta_final', 'title', 'Skal du innrede ny butikk eller pusse opp?');
  PERFORM _seed_section(rc_id, 'butikk', 'cta_final', 'body', 'Vi tegner og leverer komplett innredning — fra disker og hyller til belysning og prislister. Ta kontakt for et uforpliktende tilbud.');

  PERFORM _seed_section(rc_id, 'kontor', 'cta_final', 'title', 'Flytter dere til nye lokaler?');
  PERFORM _seed_section(rc_id, 'kontor', 'cta_final', 'body', 'Vi planlegger hele kontoret — fra skrivebord og stoler til skjermvegger og resepsjonsdisk. Ta kontakt for et uforpliktende tilbud.');

  PERFORM _seed_section(rc_id, 'verksted', 'cta_final', 'title', 'Trenger dere arbeidsplasser tilpasset bedriften?');
  PERFORM _seed_section(rc_id, 'verksted', 'cta_final', 'body', 'Vi tilpasser arbeidsbord, verktøyskap og oppbevaring etter dine behov. Ta kontakt for et uforpliktende tilbud.');

  PERFORM _seed_section(rc_id, 'garderobe', 'cta_final', 'title', 'Skal dere innrede nye garderobeskap?');
  PERFORM _seed_section(rc_id, 'garderobe', 'cta_final', 'body', 'Velg dørtype, materialer, lås og farger. Vi hjelper deg med å finne riktig løsning. Ta kontakt for et uforpliktende tilbud.');

  PERFORM _seed_section(rc_id, 'skole', 'cta_final', 'title', 'Skal skolen eller barnehagen innredes?');
  PERFORM _seed_section(rc_id, 'skole', 'cta_final', 'body', 'Vi leverer holdbare møbler som tåler hard daglig bruk. Ta kontakt for et uforpliktende tilbud.');

  -- PRODUKTER (oversikt)
  PERFORM _seed_section(rc_id, 'produkter', 'intro', 'title', 'Vårt sortiment');
  PERFORM _seed_section(rc_id, 'produkter', 'intro', 'body', 'Vårt produktregister omfatter alt fra mindre detaljinnredninger til hele systemer for store miljøer. Utforsk våre kategorier og kontakt oss for et uforpliktende tilbud.');

  PERFORM _seed_section(rc_id, 'produkter', 'cta_final', 'title', 'Finner du ikke det du leter etter?');
  PERFORM _seed_section(rc_id, 'produkter', 'cta_final', 'body', 'Kontakt oss — vi har et bredt sortiment.');

  -- Rydd opp helper-funksjon
  DROP FUNCTION _seed_section(uuid, text, text, text, text);
END $$;
