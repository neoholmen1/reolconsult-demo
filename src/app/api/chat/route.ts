import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

// Tving denne ruten til å kjøre dynamisk — vi kaller en ekstern API
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type ChatMessage = { role: "user" | "assistant"; content: string };

// ─────────────────────────────────────────────────────────
// Henter all relevant kontekst fra Supabase og bygger en system-prompt
// ─────────────────────────────────────────────────────────
type Lang = "nb" | "en";

// ── Kostnadsvern ─────────────────────────────────────────────
// Endepunktet er offentlig og uautentisert. Uten disse kan hvem som helst
// kjøre opp Anthropic-regningen med en løkke.

const MAKS_TEGN_PER_MELDING = 2000;
const MAKS_MELDINGER = 20;

// Ratebegrensning per IP. In-memory er nok her: én serverprosess, og
// hensikten er å stoppe åpenbart misbruk, ikke å være vanntett.
const treff = new Map<string, number[]>();
const VINDU_MS = 60_000;
const MAKS_I_VINDU = 12;

function forRaskt(ip: string): boolean {
  const na = Date.now();
  const nylige = (treff.get(ip) ?? []).filter((t) => na - t < VINDU_MS);
  nylige.push(na);
  treff.set(ip, nylige);
  // Hindrer at Map-en vokser i det uendelige på en langtkjørende server.
  if (treff.size > 5000) {
    for (const [k, v] of treff) {
      if (v.every((t) => na - t >= VINDU_MS)) treff.delete(k);
    }
  }
  return nylige.length > MAKS_I_VINDU;
}

// Systemprompten bygges av ni Supabase-spørringer. Uten mellomlagring kjøres
// alle ni på hver eneste melding. 60 sekunder er kort nok til at en endring i
// admin slår gjennom nesten umiddelbart.
let promptCache: { nb?: string; en?: string; tid: number } = { tid: 0 };
const PROMPT_CACHE_MS = 60_000;

/**
 * Fallback-tekstene. Disse er ordrett det assistenten skal si når den ikke har
 * dekning i dataene — bedre å si «vet ikke» enn å gjette feil foran en kunde.
 */
const FALLBACK: Record<Lang, { ukjent: string; utenfor: string }> = {
  nb: {
    ukjent:
      "Det har jeg dessverre ikke informasjon om. Ring oss på 33 36 55 80 eller send e-post til mail@reolconsult.no, så hjelper vi deg!",
    utenfor:
      "Jeg er her for å hjelpe deg med spørsmål om Reol-Consult og våre produkter. Er det noe jeg kan hjelpe deg med?",
  },
  en: {
    ukjent:
      "I don't have information about that, unfortunately. Call us at +47 33 36 55 80 or email mail@reolconsult.no and we'll help you!",
    utenfor:
      "I'm here to help with questions about Reol-Consult and our products. Is there anything I can help you with?",
  },
};

async function buildSystemPrompt(lang: Lang): Promise<string> {
  // Finn site (alle data er knyttet til site_id). Vi tar første aktive site —
  // for Reol-Consult er det kun én site.
  const { data: siteRow } = await supabase.from("sites").select("id, name").limit(1).single();
  const siteId = siteRow?.id;
  const siteName = siteRow?.name ?? "Reol-Consult AS";

  const [
    settings,
    products,
    categories,
    team,
    sections,
    caseStudies,
    testimonials,
    knowledge,
    documents,
  ] = await Promise.all([
    siteId
      ? supabase.from("site_settings").select("*").eq("site_id", siteId).maybeSingle()
      : Promise.resolve({ data: null }),
    siteId
      ? supabase
          .from("products")
          .select("category_slug, title, short_description, long_description, specs, price_from, price_unit, published")
          .eq("site_id", siteId)
          .eq("published", true)
          .order("title")
      : Promise.resolve({ data: [] }),
    siteId
      ? supabase.from("categories").select("slug, title, description").eq("site_id", siteId).order("slug")
      : Promise.resolve({ data: [] }),
    siteId
      ? supabase
          .from("team_members")
          .select("name, role, phone, email")
          .eq("site_id", siteId)
          .eq("active", true)
          .order("sort_order")
      : Promise.resolve({ data: [] }),
    siteId
      ? supabase.from("page_sections").select("page_slug, section_key, field_key, value").eq("site_id", siteId).order("page_slug").order("section_key").order("field_key")
      : Promise.resolve({ data: [] }),
    siteId
      ? supabase
          .from("case_studies")
          .select("customer_name, project_type, description, year")
          .eq("site_id", siteId)
          .eq("published", true)
          .order("sort_order")
      : Promise.resolve({ data: [] }),
    siteId
      ? supabase
          .from("testimonials")
          .select("author_name, author_role, author_company, quote")
          .eq("site_id", siteId)
          .eq("published", true)
          .order("author_name")
      : Promise.resolve({ data: [] }),
    // site_id-filter: uten det plukket spørringen opp kunnskap og dokumenter
    // fra ALLE kunder i basen, ikke bare denne siten.
    siteId
      ? supabase
          .from("chatbot_knowledge")
          .select("category, category_type, description, variants, discounts, extra_info")
          .eq("site_id", siteId)
          .order("category")
      : Promise.resolve({ data: [] }),
    siteId
      ? supabase
          .from("chatbot_documents")
          .select("filename, category, content")
          .eq("site_id", siteId)
          .order("filename")
      : Promise.resolve({ data: [] }),
  ]);

  // ── Bygg seksjoner ──
  const sectionsByPage: Record<string, Record<string, Record<string, string>>> = {};
  for (const row of sections.data ?? []) {
    if (!sectionsByPage[row.page_slug]) sectionsByPage[row.page_slug] = {};
    if (!sectionsByPage[row.page_slug][row.section_key]) sectionsByPage[row.page_slug][row.section_key] = {};
    sectionsByPage[row.page_slug][row.section_key][row.field_key] = row.value;
  }

  // ── Format prompt ──
  const s = (settings as { data: Record<string, unknown> | null }).data ?? {};
  const sg = s as Record<string, unknown>;
  const phone = (sg.phone as string) ?? "33 36 55 80";
  const email = (sg.email_general as string) ?? "mail@reolconsult.no";
  const address = (sg.visit_address as string) ?? "Smiløkka 7, 3173 Vear";
  const hours = (sg.opening_hours as string) ?? "Mandag–fredag: 08:00–16:00";

  let prompt = `Du er kundeservice-assistenten til ${siteName}, en norsk innredningsbedrift som leverer reoler, hyller og innredning til lager, butikk, kontor, verksted, garderobe og skole/barnehage. Etablert 1984. Holder til på Vear i Tønsberg.

SPRÅK:
• ${lang === "en" ? "Svar ALLTID på engelsk, uansett hvilket språk kunden skriver på." : "Svar ALLTID på norsk (bokmål), uansett hvilket språk kunden skriver på."}
• Kort og konkret. Maks 4 setninger med mindre kunden ber om mer detalj.

ABSOLUTTE REGLER — disse går foran alt annet:

1. DU SVARER KUN FRA DATAENE UNDER.
   Alt du sier om produkter, priser, leveringstider, tjenester, mål, kapasitet
   eller vilkår MÅ stå ordrett i seksjonene nedenfor. Står det ikke der,
   finnes det ikke for deg. Din egen kunnskap om reoler og lagerinnredning
   generelt er IKKE en gyldig kilde.

2. NÅR DU IKKE VET — svar nøyaktig dette, ordrett:
   "${FALLBACK[lang].ukjent}"
   Dette gjelder også når du bare er delvis usikker. Det er MYE bedre å si at
   du ikke vet enn å gjette. Ikke pynt på det, ikke legg til antagelser, ikke
   si "vanligvis" eller "som regel".

3. ALDRI LOV NOE PÅ VEGNE AV BEDRIFTEN.
   Forbudte formuleringer: "vi garanterer", "vi lover", "helt sikkert",
   "selvfølgelig kan vi", "det går fint", "vi rekker det".
   Spør kunden om levering, frister, garanti eller holdbarhet: si at det må
   bekreftes av oss, og henvis til ${phone} eller ${email}.

4. PRISER ER ALLTID VEILEDENDE.
   Oppgi kun priser som står nedenfor, og alltid som "fra X kr" eller
   "ca. X kr". Avslutt alltid med "Kontakt oss for eksakt tilbud".
   Står det ingen pris: bruk fallback-svaret i regel 2. Aldri estimer,
   aldri regn ut totalpriser, aldri antyd et prisnivå.

5. ALDRI OMTAL KONKURRENTER.
   Ikke sammenlign oss med andre leverandører, ikke vurder dem, ikke si om vi
   er billigere, bedre eller dårligere. Svar: "Det kan jeg ikke uttale meg om,
   men jeg hjelper deg gjerne med å finne riktig løsning hos oss."

6. UTENFOR VÅRT OMRÅDE — svar nøyaktig dette, ordrett:
   "${FALLBACK[lang].utenfor}"
   Gjelder alt som ikke handler om Reol-Consult og vår innredning: vitser,
   politikk, vær, generelle spørsmål, andre bransjer, koding, oppskrifter,
   sanger, dikt. Ikke svar «litt» på slikt først. Ikke vær morsom.

7. Du jobber FOR Reol-Consult — bruk "vi" og "oss", ikke "de".

8. Nevn gjerne at vi tilbyr gratis befaring og uforpliktende tilbud, men kun
   når det er relevant for det kunden faktisk spurte om.

KONTAKTINFO:
• Telefon: ${phone}
• E-post: ${email}
• Adresse: ${address}
• Åpningstider: ${hours}
`;

  // Team
  const teamArr = (team.data ?? []) as Array<{ name: string; role: string; phone: string; email: string }>;
  if (teamArr.length > 0) {
    prompt += `\nANSATTE Å SNAKKE MED:\n`;
    for (const t of teamArr) {
      prompt += `• ${t.name}${t.role ? ` (${t.role})` : ""}${t.phone ? ` — tlf ${t.phone}` : ""}${t.email ? ` — ${t.email}` : ""}\n`;
    }
  }

  // Kategorier
  const catsArr = (categories.data ?? []) as Array<{ slug: string; title: string; description: string }>;
  if (catsArr.length > 0) {
    prompt += `\nVÅRE KATEGORIER:\n`;
    for (const c of catsArr) {
      prompt += `• ${c.title}${c.description ? ` — ${c.description}` : ""}\n`;
    }
  }

  // Produkter (mest kontekst — opptil ~50 stk)
  const prodsArr = (products.data ?? []) as Array<{
    category_slug: string;
    title: string;
    short_description: string;
    long_description: string;
    specs: string[] | null;
    price_from: number | null;
    price_unit: string;
  }>;
  if (prodsArr.length > 0) {
    prompt += `\nPRODUKTER (Reol-Consults sortiment):\n`;
    for (const p of prodsArr) {
      const priceInfo = p.price_from != null ? ` — Fra ${p.price_from} kr${p.price_unit ? " " + p.price_unit : ""}` : "";
      const specs = Array.isArray(p.specs) && p.specs.length > 0 ? ` [${p.specs.slice(0, 6).join(", ")}]` : "";
      prompt += `• ${p.title} (${p.category_slug})${priceInfo}: ${p.short_description}${specs}\n`;
      if (p.long_description && p.long_description.length > 0 && p.long_description !== p.short_description) {
        prompt += `  Mer info: ${p.long_description.slice(0, 400)}\n`;
      }
    }
  }

  // Cases / referanser
  const casesArr = (caseStudies.data ?? []) as Array<{ customer_name: string; project_type: string; description: string; year: string }>;
  if (casesArr.length > 0) {
    prompt += `\nREFERANSEPROSJEKTER:\n`;
    for (const c of casesArr.slice(0, 10)) {
      prompt += `• ${c.customer_name}${c.year ? ` (${c.year})` : ""}: ${c.project_type}${c.description ? ` — ${c.description}` : ""}\n`;
    }
  }

  // Testimonials
  const testArr = (testimonials.data ?? []) as Array<{ author_name: string; author_company: string; quote: string }>;
  if (testArr.length > 0) {
    prompt += `\nKUNDESITATER:\n`;
    for (const t of testArr.slice(0, 5)) {
      prompt += `• "${t.quote}" — ${t.author_name}${t.author_company ? `, ${t.author_company}` : ""}\n`;
    }
  }

  // Legacy chatbot_knowledge — for ekstra info kunden har lagt inn
  const knowArr = (knowledge.data ?? []) as Array<{
    category: string;
    category_type: string;
    description: string;
    variants: { name?: string; price?: string; stock?: string; delivery?: string }[] | null;
    discounts: { min_quantity?: string; price?: string }[] | null;
    extra_info: string;
  }>;
  if (knowArr.length > 0) {
    prompt += `\nEKSTRA KUNNSKAPSBASE (priser, varianter, leveringstid, fakta):\n`;
    for (const k of knowArr) {
      prompt += `\n[${k.category}]\n${k.description}\n`;
      if (Array.isArray(k.variants) && k.variants.length > 0) {
        prompt += `Varianter:\n`;
        for (const v of k.variants) {
          const parts: string[] = [];
          if (v.name) parts.push(v.name);
          if (v.price) parts.push(`pris: ${v.price} kr`);
          if (v.stock) parts.push(`lager: ${v.stock}`);
          if (v.delivery) parts.push(`leveringstid: ${v.delivery}`);
          if (parts.length > 0) prompt += `  • ${parts.join(", ")}\n`;
        }
      }
      if (Array.isArray(k.discounts) && k.discounts.length > 0) {
        prompt += `Mengderabatt:\n`;
        for (const d of k.discounts) {
          if (d.min_quantity && d.price) prompt += `  • Over ${d.min_quantity} stk: ${d.price} kr per stk\n`;
        }
      }
      if (k.extra_info) prompt += `Ekstra: ${k.extra_info}\n`;
    }
  }

  // Dokumenter — innhold lagt opp av admin
  const docsArr = (documents.data ?? []) as Array<{ filename: string; category: string; content: string }>;
  if (docsArr.length > 0) {
    prompt += `\nOPPLASTEDE DOKUMENTER:\n`;
    // Tak på samlet dokumentmengde. Hvert dokument var begrenset til 2000 tegn,
    // men antallet var ubegrenset — 40 opplastede PDF-er ga en prompt som
    // sprengte kontekstvinduet og fikk hele chatten til å feile.
    let budsjett = 24000;
    for (const d of docsArr) {
      if (!d.content) continue;
      if (budsjett <= 0) {
        prompt += `\n(Flere dokumenter er utelatt av plasshensyn.)\n`;
        break;
      }
      const bit = d.content.slice(0, Math.min(2000, budsjett));
      budsjett -= bit.length;
      prompt += `\n--- ${d.filename} (${d.category}) ---\n${bit}\n`;
    }
  }

  // Section-tekster fra forsiden — gir kontekst om hvordan vi snakker om oss
  if (sectionsByPage["home"]) {
    prompt += `\nINFO FRA FORSIDEN:\n`;
    for (const [secKey, fields] of Object.entries(sectionsByPage["home"])) {
      for (const [field, value] of Object.entries(fields)) {
        if (value && (field === "title" || field === "body" || field === "subtitle")) {
          prompt += `• [${secKey}/${field}]: ${value.slice(0, 300)}\n`;
        }
      }
    }
  }

  prompt += `\nHvis kunden vil ha tilbud, råd, befaring eller priser på spesifikke leveranser — anbefal å sende en henvendelse via kontaktskjemaet på /kontakt, eller ringe ${phone} direkte.`;

  return prompt;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI-assistenten er ikke konfigurert. Ring oss på 33 36 55 80 i mellomtiden." },
      { status: 503 },
    );
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "ukjent";
    if (forRaskt(ip)) {
      return NextResponse.json(
        { error: "Litt for mange meldinger på kort tid. Vent et øyeblikk og prøv igjen." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) {
      return NextResponse.json({ error: "Ingen melding" }, { status: 400 });
    }

    // Kapp historie og lengde. Uten dette kan én klient sende vilkårlig mye
    // tekst inn i hver forespørsel og drive opp input-kostnaden.
    const trimmed = messages.slice(-MAKS_MELDINGER).map((m) => ({
      role: m.role,
      content: String(m.content ?? "").slice(0, MAKS_TEGN_PER_MELDING),
    }));

    // Klienten har alltid sendt `lang`, men ruten ignorerte den og hardkodet
    // norsk. Engelsk modus svarte derfor på norsk.
    const lang: Lang = body.lang === "en" ? "en" : "nb";

    // Gjenbruk prompten i 60 sekunder i stedet for ni databasespørringer per melding.
    const na = Date.now();
    if (na - promptCache.tid > PROMPT_CACHE_MS) promptCache = { tid: na };
    let systemPrompt = promptCache[lang];
    if (!systemPrompt) {
      systemPrompt = await buildSystemPrompt(lang);
      promptCache[lang] = systemPrompt;
      promptCache.tid = na;
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      // Prompt caching: systemprompten er identisk mellom kall, så etter første
      // melding leses den til ~10 % av vanlig input-pris. Merk at Haiku 4.5
      // krever minst 4096 tokens før caching slår inn i det hele tatt — under
      // det skjer ingenting, og uten feilmelding.
      system: [
        { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
      ],
      messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
    });

    const bruk = response.usage;
    console.log(
      `[chat] input=${bruk.input_tokens} cache_les=${bruk.cache_read_input_tokens ?? 0} ` +
        `cache_skriv=${bruk.cache_creation_input_tokens ?? 0} ut=${bruk.output_tokens}`,
    );

    let text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    // Etterkontroll. Prompten er hovedvernet, men en modell kan glippe, og et
    // løfte om levering eller garanti kan binde bedriften. Fanger vi et slikt
    // uttrykk, legger vi på forbeholdet og logger det så det kan følges opp.
    const LOVNADER = [
      /\bvi garanterer\b/i,
      /\bvi lover\b/i,
      /\bhelt sikkert\b/i,
      /\bwe guarantee\b/i,
      /\bwe promise\b/i,
      /\bdefinitely\b/i,
    ];
    const traff = LOVNADER.find((r) => r.test(text));
    if (traff) {
      console.warn("chat-api: lovnadsformulering fanget i svar —", traff.source);
      text +=
        lang === "en"
          ? "\n\nPlease note: this needs to be confirmed by us. Contact us at 33 36 55 80 or mail@reolconsult.no."
          : "\n\nMerk: dette må bekreftes av oss. Ta kontakt på 33 36 55 80 eller mail@reolconsult.no.";
    }

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Ukjent feil";
    console.error("chat-api:", message);
    return NextResponse.json(
      { error: "Beklager, noe gikk galt. Prøv igjen, eller ring oss på 33 36 55 80." },
      { status: 500 },
    );
  }
}
