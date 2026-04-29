# Fase 1 — Setup-instruksjoner

Dette dokumentet beskriver hva som må kjøres første gang du tar fase 1-endringene i bruk.

## 1. Miljøvariabler

Fra rotmappen:

```bash
cp .env.local.example .env.local
```

`.env.local` inneholder allerede de riktige verdiene for nåværende Supabase-prosjekt.
Hvis du senere bytter prosjekt eller deployer for en annen kunde, oppdater `NEXT_PUBLIC_SITE_SLUG`.

Restart dev-serveren etter at filen er på plass:

```bash
npm run dev -- -p 3005
```

## 2. Database-migrasjon

Kjør innholdet av `supabase/migrations/20260428000000_phase1_multi_tenant.sql`
i Supabase SQL Editor:

> Dashboard → SQL editor → New query → lim inn → Run

Migrasjonen er idempotent. Du kan kjøre den om igjen uten å miste data.

Etter at den har kjørt får du:

- 3 nye tabeller: `sites`, `site_users`, `super_admins`
- 3 nye SQL-funksjoner: `is_super_admin()`, `has_site_access()`, `has_site_role()`
- En `reolconsult`-rad i `sites`
- `site_id`-kolonner og oppdaterte RLS-policies på `chatbot_knowledge` og `chatbot_documents`

Verifiser i SQL Editor:

```sql
SELECT id, slug, name FROM sites;
SELECT * FROM site_users;
SELECT * FROM super_admins;
```

## 3. Opprett super-admin (første gang)

Du trenger én super-admin (deg). Dette gjøres i to steg.

**3.1 Opprett brukeren i Supabase Auth.** Dashboard → Authentication → Add user → fyll inn e-post + passord.

**3.2 Marker brukeren som super-admin.** Bytt e-posten under og kjør i SQL Editor:

```sql
INSERT INTO super_admins (user_id)
SELECT id FROM auth.users WHERE email = 'din.epost@example.com';
```

Verifiser:

```sql
SELECT u.email FROM super_admins sa
JOIN auth.users u ON u.id = sa.user_id;
```

## 4. Opprett kunde-bruker for Reolconsult

Eksempel: gi Agnete tilgang som `owner`.

**4.1 Opprett brukeren** i Supabase Auth (Dashboard → Authentication → Add user).

**4.2 Tildel rolle:**

```sql
INSERT INTO site_users (site_id, user_id, role)
SELECT
  (SELECT id FROM sites WHERE slug = 'reolconsult'),
  (SELECT id FROM auth.users WHERE email = 'agh@reolconsult.no'),
  'owner';
```

For en ekstra editor (uten owner-privilegier):

```sql
INSERT INTO site_users (site_id, user_id, role)
SELECT
  (SELECT id FROM sites WHERE slug = 'reolconsult'),
  (SELECT id FROM auth.users WHERE email = 'tk@reolconsult.no'),
  'editor';
```

## 5. Test tilgang

Gå til `http://localhost:3005/admin`:

- Login som super-admin → ser admin-panelet
- Login som `site_users`-bruker → ser admin-panelet
- Login som ny tilfeldig bruker uten rolle → ser «Ingen tilgang»-skjermen
- Last opp et dokument → det får automatisk `site_id = reolconsult`

## 6. Når kunde nr. 2 dukker opp (senere)

```sql
-- 1. Opprett site
INSERT INTO sites (slug, name, domain, org_number)
VALUES ('annenkunde', 'Annen Kunde AS', 'annenkunde.no', '999 999 999');

-- 2. Tildel bruker
INSERT INTO site_users (site_id, user_id, role)
SELECT
  (SELECT id FROM sites WHERE slug = 'annenkunde'),
  (SELECT id FROM auth.users WHERE email = 'kontakt@annenkunde.no'),
  'owner';
```

For ny kunde-deploy: kopier kodebasen, sett `NEXT_PUBLIC_SITE_SLUG=annenkunde` i `.env.local`. Multi-tenant-routing på samme deploy kommer i en senere fase.

## Feilsøking

**«Mangler NEXT_PUBLIC_SUPABASE_URL eller …»** — Du har ikke `.env.local`. Kopier fra `.env.local.example` og restart dev-serveren.

**«Ingen tilgang» når jeg logger inn som super-admin** — Brukeren må stå i `super_admins`-tabellen. Kjør INSERT-en i punkt 3.2.

**«Fant ikke aktiv site»** — `NEXT_PUBLIC_SITE_SLUG` matcher ikke noen rad i `sites`. Sjekk at du brukte `'reolconsult'`.

**RLS-feil ved opplasting av dokument** — Brukeren har ikke `site_users`-rad for sitt site_id. Kjør INSERT-en i punkt 4.2.
