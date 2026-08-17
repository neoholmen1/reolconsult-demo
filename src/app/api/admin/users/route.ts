import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Brukeradministrasjon for admin-panelet.
 *
 * Service role-nøkkelen omgår RLS fullstendig — den gir uinnskrenket tilgang
 * til hele databasen. Derfor to absolutte regler i denne fila:
 *
 *   1. Nøkkelen leses kun her, server-side. Den skal aldri havne i en
 *      NEXT_PUBLIC_-variabel eller i noe som sendes til nettleseren.
 *   2. Ingen operasjon kjøres før kalleren er verifisert som innlogget
 *      administrator. Verifiseringen skjer FØRST, alltid.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Kaller = { id: string; email: string | null };

/**
 * Verifiserer at forespørselen kommer fra en innlogget administrator.
 * Returnerer enten kalleren og en service-klient, eller et ferdig feilsvar.
 */
async function verifiser(
  req: NextRequest,
): Promise<{ kaller: Kaller; admin: SupabaseClient } | { feil: NextResponse }> {
  if (!URL_ || !ANON) {
    return { feil: NextResponse.json({ error: "Supabase er ikke konfigurert." }, { status: 500 }) };
  }
  if (!SERVICE) {
    return {
      feil: NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY mangler på serveren. Se .env.local." },
        { status: 503 },
      ),
    };
  }

  // 1. Token fra Authorization-headeren.
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (!token) {
    return { feil: NextResponse.json({ error: "Ikke innlogget." }, { status: 401 }) };
  }

  // 2. Verifiser sesjonen mot Supabase. Et ugyldig eller utløpt token gir
  //    ingen bruker, og da stopper vi før service-nøkkelen tas i bruk.
  const brukerKlient = createClient(URL_, ANON, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: brukerData, error: brukerFeil } = await brukerKlient.auth.getUser();
  const bruker = brukerData?.user;
  if (brukerFeil || !bruker) {
    return { feil: NextResponse.json({ error: "Ugyldig eller utløpt sesjon." }, { status: 401 }) };
  }

  const admin = createClient(URL_, SERVICE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 3. Er brukeren faktisk administrator? Sjekkes med service-klienten så
  //    svaret ikke avhenger av hvordan RLS er satt opp.
  const { data: superAdmin } = await admin
    .from("super_admins")
    .select("user_id")
    .eq("user_id", bruker.id)
    .maybeSingle();

  let harTilgang = !!superAdmin;
  if (!harTilgang) {
    const { data: siteBruker } = await admin
      .from("site_users")
      .select("role")
      .eq("user_id", bruker.id)
      .in("role", ["owner"])
      .maybeSingle();
    harTilgang = !!siteBruker;
  }

  if (!harTilgang) {
    return {
      feil: NextResponse.json(
        { error: "Du har ikke rettigheter til å administrere brukere." },
        { status: 403 },
      ),
    };
  }

  return { kaller: { id: bruker.id, email: bruker.email ?? null }, admin };
}

// ── GET: list brukere ────────────────────────────────────────
export async function GET(req: NextRequest) {
  const v = await verifiser(req);
  if ("feil" in v) return v.feil;

  const { data, error } = await v.admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Kun feltene panelet trenger. Ingen tokens, ingen metadata.
  const brukere = data.users.map((u) => ({
    id: u.id,
    epost: u.email ?? "(ingen e-post)",
    opprettet: u.created_at,
    sistInnlogget: u.last_sign_in_at ?? null,
    erDegSelv: u.id === v.kaller.id,
  }));
  brukere.sort((a, b) => (a.opprettet < b.opprettet ? -1 : 1));

  return NextResponse.json({ brukere });
}

// ── POST: opprett bruker ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const v = await verifiser(req);
  if ("feil" in v) return v.feil;

  let kropp: { epost?: string; passord?: string };
  try {
    kropp = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 });
  }

  const epost = String(kropp.epost ?? "").trim().toLowerCase();
  const passord = String(kropp.passord ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(epost)) {
    return NextResponse.json({ error: "E-postadressen ser ikke riktig ut." }, { status: 400 });
  }
  if (passord.length < 8) {
    return NextResponse.json({ error: "Passordet må ha minst 8 tegn." }, { status: 400 });
  }

  const { data, error } = await v.admin.auth.admin.createUser({
    email: epost,
    password: passord,
    // Ingen bekreftelses-e-post: brukeren kan logge inn med én gang.
    email_confirm: true,
  });
  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Kunne ikke opprette brukeren." },
      { status: 400 },
    );
  }

  // En bruker uten rettigheter kommer inn i panelet og møter «Ingen tilgang».
  // Vi gir tilgang til denne siten — ikke super_admin, som ville gitt tilgang
  // til alle kunder i basen.
  const slug = process.env.NEXT_PUBLIC_SITE_SLUG ?? "reolconsult";
  const { data: site } = await v.admin.from("sites").select("id").eq("slug", slug).maybeSingle();
  let tilgangAdvarsel: string | null = null;
  if (site?.id) {
    const { error: tilgangFeil } = await v.admin
      .from("site_users")
      .insert({ site_id: site.id, user_id: data.user.id, role: "owner" });
    if (tilgangFeil) tilgangAdvarsel = `Brukeren ble opprettet, men fikk ikke tilgang: ${tilgangFeil.message}`;
  } else {
    tilgangAdvarsel = `Brukeren ble opprettet, men fant ingen site med slug «${slug}» å gi tilgang til.`;
  }

  // Passordet returneres aldri. Den som opprettet brukeren har det allerede.
  return NextResponse.json({
    bruker: {
      id: data.user.id,
      epost: data.user.email,
      opprettet: data.user.created_at,
      sistInnlogget: null,
      erDegSelv: false,
    },
    advarsel: tilgangAdvarsel,
  });
}

// ── DELETE: slett bruker ─────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const v = await verifiser(req);
  if ("feil" in v) return v.feil;

  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "Mangler bruker-id." }, { status: 400 });

  // Å slette seg selv låser deg ute av panelet uten vei tilbake.
  if (id === v.kaller.id) {
    return NextResponse.json(
      { error: "Du kan ikke slette din egen bruker." },
      { status: 400 },
    );
  }

  const { error } = await v.admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
