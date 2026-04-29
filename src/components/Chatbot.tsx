"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabase";
import { useSite } from "@/components/SiteProvider";
import { fillPlaceholders } from "@/lib/site";

/* ───────────────────────── types ───────────────────────── */

type Lang = "nb" | "en";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface QuickOption {
  label: string;
  message: string;
}

interface KnowledgeEntry {
  triggers: string[];
  response: string;
  followUps: QuickOption[];
}

interface KnowledgeSection {
  title: string;
  body: string;
  keywords: string[];
  description?: string;
  variants?: Array<{ name: string; price: string; stock: string; delivery: string }>;
  discounts?: Array<{ min_quantity: string; price: string }>;
  extraInfo?: string;
  categoryType?: string;
}

/* ──────────────────── stopwords ──────────────────── */

const STOPWORDS_NB = new Set([
  "hva", "kan", "du", "jeg", "er", "det", "på", "til", "og", "i",
  "for", "med", "en", "et", "den", "har", "vil", "skal", "om", "av",
  "fra", "som", "seg", "dere", "vi", "de", "dem", "sin", "sitt",
  "sine", "min", "mitt", "mine", "din", "ditt", "dine", "så", "men",
  "eller", "at", "når", "da", "bare", "også", "meg", "deg", "oss",
  "noe", "noen", "alle", "dette", "denne", "disse", "ikke", "nei",
  "ja", "jo", "litt", "veldig", "mer", "mest", "mange", "mye",
  "hvor", "hvordan", "hvorfor", "hvilken", "hvilket", "hvilke",
  "være", "bli", "blir", "ble", "blitt", "gjøre", "gjør", "gjort",
  "si", "sier", "sa", "sagt", "vite", "vet", "visste", "trenger",
  "trenge", "trengte", "ville", "skulle", "kunne", "måtte",
]);

const STOPWORDS_EN = new Set([
  "what", "can", "you", "the", "is", "it", "to", "and", "in",
  "for", "with", "this", "that", "have", "has", "will", "about", "of",
  "from", "who", "they", "them", "your", "my", "our", "but",
  "or", "when", "then", "just", "also", "me", "some", "all",
  "these", "those", "not", "no", "yes", "little", "very", "more",
  "most", "many", "much", "where", "how", "why", "which",
  "be", "been", "being", "do", "does", "did", "done",
  "say", "says", "said", "know", "knew", "need", "would", "could", "should",
  "are", "was", "were", "a", "an", "the",
]);

const STOPWORDS: Record<Lang, Set<string>> = { nb: STOPWORDS_NB, en: STOPWORDS_EN };

/* ──────────── multi-word phrase patterns ──────────── */

interface PhraseMatch {
  phrases: string[];
  entryIndex: number;
}

const PHRASE_PATTERNS_NB: PhraseMatch[] = [
  { phrases: ["hva kan du", "hva kan jeg spørre", "hva vet du", "hva svarer du", "hva kan chatbot"], entryIndex: 0 },
  { phrases: ["ledig stilling", "ledige stillinger", "åpen søknad"], entryIndex: 2 },
  { phrases: ["hvordan bestille", "vil bestille", "kan jeg bestille", "jeg vil kjøpe"], entryIndex: 3 },
  { phrases: ["når er dere åpne", "er dere åpne", "når stenger", "når åpner", "åpningstidene"], entryIndex: 4 },
  { phrases: ["hvor ligger", "hvor holder", "hvordan komme", "hva er adressen"], entryIndex: 5 },
  { phrases: ["se utstillingen", "besøke utstillingen", "komme på besøk", "se produktene"], entryIndex: 6 },
  { phrases: ["brukte reoler", "brukt reol", "brukt innredning", "brukte pallreoler"], entryIndex: 14 },
  { phrases: ["hms kontroll", "hms sikkerhetskontroll", "sikkerhetskontroll", "reolkontroll"], entryIndex: 15 },
  { phrases: ["leveringstid", "når kan dere levere", "hvor lang leveringstid", "frakt og montering"], entryIndex: 16 },
  { phrases: ["hvem er reol", "om reol-consult", "om reolconsult", "firmaets historie"], entryIndex: 17 },
];

const PHRASE_PATTERNS_EN: PhraseMatch[] = [
  { phrases: ["what can you", "what do you know", "what can i ask", "what can chatbot"], entryIndex: 0 },
  { phrases: ["job opening", "job openings", "open application", "career opportunities"], entryIndex: 2 },
  { phrases: ["how to order", "want to order", "can i order", "i want to buy"], entryIndex: 3 },
  { phrases: ["when are you open", "are you open", "when do you close", "opening hours"], entryIndex: 4 },
  { phrases: ["where are you located", "where is your", "how to get there", "what is the address"], entryIndex: 5 },
  { phrases: ["visit the showroom", "visit showroom", "come visit", "see the products"], entryIndex: 6 },
  { phrases: ["used shelving", "used racking", "used pallet racking", "second hand"], entryIndex: 14 },
  { phrases: ["safety inspection", "hse inspection", "rack inspection", "shelf inspection"], entryIndex: 15 },
  { phrases: ["delivery time", "when can you deliver", "how long delivery", "shipping and assembly"], entryIndex: 16 },
  { phrases: ["who is reol", "about reol-consult", "about reolconsult", "company history"], entryIndex: 17 },
];

const PHRASE_PATTERNS: Record<Lang, PhraseMatch[]> = { nb: PHRASE_PATTERNS_NB, en: PHRASE_PATTERNS_EN };

/* ──────────────────── hardcoded knowledge base (fallback) ──────────────────── */

const knowledgeBase_nb: KnowledgeEntry[] = [
  // 0: HJELP / OVERSIKT
  {
    triggers: [
      "hjelp", "oversikt", "meny", "alternativ", "info", "informasjon",
      "fortell", "start", "guide", "veilede", "veiledning", "muligheter",
      "funksjoner", "tema", "emner", "spørre",
    ],
    response:
      "Jeg kan hjelpe deg med:\n\nProdukter — pallreoler, butikkinnredning, disker, garderobe, verksted, kontor, skole\nPriser — konkrete priser og mengderabatter\nLagerstatus — hva vi har på lager\nSpesifikasjoner — tekniske detaljer\nLevering — leveringstid, montering, frakt\nHMS — sikkerhetskontroll av reoler\nBruktsalg — brukte reoler til gode priser\nBesøk — utstilling, åpningstider, adresse\nKontakt — telefon, e-post, ansatte\nJobb — ledige stillinger\n\nBare spør om det du lurer på!",
    followUps: [
      { label: "Produkter", message: "Hva slags produkter har dere?" },
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Bruktsalg", message: "Har dere brukte reoler?" },
      { label: "Besøk utstilling", message: "Kan jeg besøke utstillingen?" },
    ],
  },
  // 1: PRISER / KOSTNADER
  {
    triggers: [
      "pris", "priser", "kost", "koster", "billig", "dyr", "tilbud",
      "rabatt", "budsjett", "prisoverslag", "estimat", "betale", "betaling",
      "faktura", "beløp", "kroner", "nok",
    ],
    response:
      "Prisene varierer etter behov og omfang. Vi gir gjerne et uforpliktende tilbud! Kontakt oss på {phone} eller {email} med dine ønsker, så sender vi et prisoverslag.",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Se produkter", message: "Hva slags produkter har dere?" },
    ],
  },
  // 2: JOBB / KARRIERE
  {
    triggers: [
      "jobb", "jobbe", "karriere", "stilling", "ansette", "ledig",
      "søke", "søknad", "cv", "rekruttere", "rekruttering", "medarbeider",
    ],
    response:
      "Vi er et lite, spesialisert team og har ikke alltid utlyste stillinger.\n\nSend gjerne en åpen søknad med CV til {email}! Vi ser etter folk med erfaring innen innredning, salg eller logistikk.",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Om oss", message: "Hvem er Reol-Consult?" },
    ],
  },
  // 3: BESTILLING / KJØP
  {
    triggers: [
      "bestille", "bestilling", "kjøpe", "kjøp", "ordre", "handle",
      "nettbutikk", "handlekurv",
    ],
    response:
      "Vi har ikke nettbutikk — alt skreddersys etter ditt behov.\n\nKontakt oss med dine behov (telefon eller e-post)\nVi gir uforpliktende tilbud\nVed aksept avtaler vi levering og montering\n\nRing {phone} eller send e-post til {email}.",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Levering", message: "Hvordan leverer dere?" },
    ],
  },
  // 4: ÅPNINGSTIDER
  {
    triggers: [
      "åpent", "åpningstid", "åpningstider", "åpen", "stengt", "lukket",
      "tidspunkt", "klokka",
    ],
    response:
      "⏰ Åpningstider:\n\nMandag–fredag: 08:00–16:00\nLørdag/søndag: Stengt\n\nVi tar imot besøk etter avtale. Ring {phone} for å avtale tid!\n\nVi har 350 kvm utstilling i {visit_address}.",
    followUps: [
      { label: "Besøk utstilling", message: "Kan jeg besøke utstillingen?" },
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
    ],
  },
  // 5: KONTAKTINFO
  {
    triggers: [
      "kontakt", "kontakte", "telefon", "ring", "nummer", "epost",
      "e-post", "mail", "adresse", "ligger", "finne", "veibeskrivelse",
      "kart", "vear", "tønsberg", "smiløkka", "postadresse",
    ],
    response:
      "Du kan nå oss slik:\n\nSentralbord: {phone}\nAgnete H. Bechmann: 450 07 322 — agh@reolconsult.no\nTore Aas-Kristiansen: 982 04 323 — tk@reolconsult.no\nGenerelt: {email}\nBesøksadresse: {visit_address} (Tønsberg)\nPostadresse: {postal_address}",
    followUps: [
      { label: "Besøk utstilling", message: "Kan jeg besøke utstillingen?" },
      { label: "Åpningstider", message: "Når er dere åpne?" },
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
    ],
  },
  // 6: UTSTILLING
  {
    triggers: [
      "utstilling", "showroom", "besøk", "besøke", "komme", "innom",
      "visning", "omvisning", "demonstrasjon", "vise",
    ],
    response:
      "Vi har 350 kvm showroom på {visit_address}!\n\nHer kan du se og ta på produktene. Vi viser deg rundt og hjelper med å finne riktig løsning.\n\nAvtale på forhånd: ring {phone}\n⏰ Mandag–fredag: 08:00–16:00",
    followUps: [
      { label: "Åpningstider", message: "Når er dere åpne?" },
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Se produkter", message: "Hva slags produkter har dere?" },
    ],
  },
  // 7: LAGER / PALLREOLER
  {
    triggers: [
      "lager", "pall", "pallreol", "pallreoler", "reol", "reoler",
      "hylle", "hyller", "stål", "galvanisert", "grenreol",
      "universalreol", "småvare", "dekkreol", "trelastreol", "båtreol",
      "mesanin", "lagerplass", "lagerinnredning", "lagring", "oppbevaring",
    ],
    response:
      "Vi har et komplett sortiment innen lagerinnredning:\n\n• Pallreoler — opptil 30 meter høyde\n• Småvarereoler og universalreoler\n• Grenreoler og trelastreoler\n• Dekkreoler og båtreoler\n• Mesaninløsninger\n\nAlt i galvanisert stål. Vi tilbyr også HMS sikkerhetskontroll.",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "HMS-kontroll", message: "Gjør dere HMS-kontroll?" },
      { label: "Brukte reoler", message: "Har dere brukte reoler?" },
    ],
  },
  // 8: BUTIKK
  {
    triggers: [
      "butikk", "butikkinnredning", "gondol", "gondoler",
      "veggsystem", "kassedisk", "retail", "dagligvare",
      "matbutikk", "klesbutikk",
    ],
    response:
      "Vi leverer komplette butikkinnredninger:\n\n• Gondoler og veggsystemer\n• Kassedisker og betjeningsdisker\n• Tilbehør og detaljinnredning\n\nGrunnsystemet er utviklet etter svensk byggestandard.",
    followUps: [
      { label: "Disker", message: "Hva slags disker har dere?" },
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
    ],
  },
  // 9: DISKER
  {
    triggers: [
      "disk", "disker", "skranke", "resepsjonsdisk", "kassareol",
      "betjeningsdisk",
    ],
    response:
      "Vi bygger skreddersydde disker etter dine mål og behov:\n\n• Kassedisker og kassereoler\n• Betjeningsdisker\n• Skranker og resepsjonsdisker\n\nSend oss dine mål og ønsker, så lager vi et forslag!",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Butikkinnredning", message: "Fortell om butikkinnredning" },
    ],
  },
  // 10: VERKSTED / INDUSTRI
  {
    triggers: [
      "verksted", "industri", "arbeidsbord", "verktøy", "verktøyskap",
      "pakkebord", "rullebord", "verkstedinnredning", "produksjon",
      "fabrikk", "arbeidsbenk",
    ],
    response:
      "Vi tilbyr verksted- og industriinnredning:\n\n• Arbeidsbord — manuelt justerbare, motordrevne, ESD-sikre\n• Pakkebord og rullebord\n• Verktøyskap og oppbevaringssystemer\n\nBåde standard og spesialløsninger.",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Lagerinnredning", message: "Fortell om lagerinnredning" },
    ],
  },
  // 11: KONTOR
  {
    triggers: [
      "kontor", "skrivebord", "stol", "stoler", "kontormøbler",
      "kontormøbel", "møbler", "resepsjon", "konferanse", "skjermvegg",
      "arbeidsplass",
    ],
    response:
      "Vi har et bredt utvalg kontorinnredning:\n\n• Skrivebord (hev/senk og faste)\n• Kontorstol og besøksstoler\n• Oppbevaringsskap og arkivløsninger\n• Resepsjonsdisker\n• Konferansemøbler og skjermvegger",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Garderobe", message: "Har dere garderobeskap?" },
    ],
  },
  // 12: GARDEROBE
  {
    triggers: [
      "garderobe", "garderobeskap", "skoleskap", "ladeskap",
      "oppbevaringsskap", "omkleding", "omkledning", "omkleidning",
    ],
    response:
      "Vi tilbyr garderobeskap med mange valgmuligheter:\n\n• Dørtyper: ståldører, laminat, kryssfiner, finér\n• Ventilasjon, lås og fargevalg\n• Skoleskap og oppbevaringsskap\n• Ladeskap for mobil og PC\n• Galvanisert stål for fuktige miljøer",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Skole", message: "Leverer dere til skoler?" },
    ],
  },
  // 13: SKOLE / BARNEHAGE
  {
    triggers: [
      "skole", "barnehage", "elev", "elevskap", "pult", "pulter",
      "tavle", "barnehagemøbler", "stellebord", "klasserom",
    ],
    response:
      "Vi leverer til skoler og barnehager:\n\nSkole: stoler, pulter, bord, benker, tavler, elevskap\nBarnehage: barnestoler, bord, åpen innredning, madrasser, stellebord\n\nHoldbare produkter som tåler hard slitasje.",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Garderobe", message: "Har dere garderobeskap?" },
    ],
  },
  // 14: BRUKT / BRUKTSALG
  {
    triggers: [
      "brukt", "bruktsalg", "brukte", "begagnat", "rimelig", "gjenbruk",
      "resirkuler", "bærekraft", "miljø", "grønn", "grønt", "billig",
    ],
    response:
      " Vi har jevnlig inn brukte pallreoler og innredning til gode priser!\n\n• Brukte pallreoler: fra ca 2.000 kr/seksjon\n• Utvalget varierer — ring for å høre hva vi har inne\n• God stand, kvalitetssikret\n• Rimelig alternativ for oppstart eller utvidelse\n\nRing {phone} eller send e-post til {email}.",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Lagerinnredning", message: "Fortell om lagerinnredning" },
    ],
  },
  // 15: HMS / SIKKERHET
  {
    triggers: [
      "hms", "sikkerhet", "kontroll", "sikkerhets", "inspeksjon",
      "forskrift", "godkjent", "godkjenning", "sertifikat", "sertifisert",
      "reolkontroll",
    ],
    response:
      " Vi utfører HMS sikkerhetskontroll av pallreoler og lagerreoler.\n\nLovpålagt for virksomheter med lagerreoler!\n\n• Visuell inspeksjon av alle reolkomponenter\n• Sjekk av stolper, bjelker, fotplater og bolter\n• Merking av skader: grønn (OK), gul (overvåk), rød (bytt ut)\n• Skriftlig rapport med anbefalinger\n• Vi dekker hele Østlandet\n\nTa kontakt på {phone} for å avtale inspeksjon!",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Lagerinnredning", message: "Fortell om lagerinnredning" },
    ],
  },
  // 16: LEVERING OG MONTERING
  {
    triggers: [
      "monter", "montere", "montering", "levering", "frakt",
      "transport", "installere", "installasjon", "nøkkelferdig",
      "leveringstid",
    ],
    response:
      "Vi leverer over hele Norge med nøkkelferdige løsninger:\n\n• Prosjektering og planlegging\n• Tegning og 3D-visualisering\n• Levering med egen transport\n• Profesjonell montering på stedet\n\n⏱ Leveringstid:\n• Lagerførte varer: 1–2 uker\n• Bestillingsvarer: 3–6 uker\n• Spesialtilpasset: 4–8 uker\n\nFrakt beregnes ut fra volum og distanse.",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Bestille", message: "Hvordan bestiller jeg?" },
    ],
  },
  // 17: HVEM / OM OSS
  {
    triggers: [
      "hvem", "historie", "etablert", "grunnlagt", "selskap", "firma",
      "bedrift", "erfaring", "kompetanse", "fagfolk", "ekspert",
      "reol-consult", "reolconsult",
    ],
    response:
      "Reol-Consult AS ble etablert i november 1984.\n\nHolder til på Vear i Tønsberg\n350 kvm utstilling\nLeverer til bedrifter over hele Norge\n\nVi leverer innredning til butikk, lager, verksted, kontor, arkiv og garderobe — fra første tegning til ferdig montert.\n\nOrg.nr: 955 273 117",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Se produkter", message: "Hva slags produkter har dere?" },
      { label: "Besøk utstilling", message: "Kan jeg besøke utstillingen?" },
    ],
  },
  // 18: PRODUKTER GENERELT
  {
    triggers: [
      "produkt", "produkter", "sortiment", "utvalg", "selger", "tilbyr",
      "kategori", "kategorier", "tjeneste", "tjenester", "innredning",
      "løsning", "løsninger",
    ],
    response:
      "Vi tilbyr innredningsløsninger innen:\n\nButikkinnredning — gondoler, veggsystemer, kassedisker\nLagerinnredning — pallreoler opptil 30m, småvarereoler, mesanin\nVerksted — arbeidsbord, verktøyskap, pakkebord\nKontor — skrivebord, stoler, skjermvegger\nGarderobe — garderobeskap, ladeskap, skoleskap\nSkole & barnehage — pulter, stoler, tavler, stellebord\n\nVi har også bruktsalg! Spør om en spesifikk kategori for mer detaljer.",
    followUps: [
      { label: "Butikk", message: "Fortell om butikkinnredning" },
      { label: "Lager", message: "Fortell om lagerinnredning" },
      { label: "Bruktsalg", message: "Har dere brukte reoler?" },
    ],
  },
  // 19: ANSATTE
  {
    triggers: [
      "agnete", "bechmann", "tore", "kristiansen", "ansatt", "ansatte",
      "rådgiver", "sentralbord",
    ],
    response:
      "Våre kontaktpersoner:\n\nAgnete H. Bechmann – Salg & rådgivning\nTlf: 450 07 322\nE-post: agh@reolconsult.no\n\nTore Aas-Kristiansen – Salg & rådgivning\nTlf: 982 04 323\nE-post: tk@reolconsult.no\n\nSentralbord: {phone}\nGenerelt: {email}",
    followUps: [
      { label: "Send melding", message: "Hva er e-postadressen?" },
      { label: "Besøk", message: "Kan jeg besøke utstillingen?" },
    ],
  },
  // 20: HILSEN
  {
    triggers: [
      "hei", "hallo", "heisann", "morn", "goddag", "yo", "hey",
      "heihei", "heia",
    ],
    response:
      "Hei! Velkommen til Reol-Consult. Hva kan jeg hjelpe deg med? Du kan spørre om produkter, priser, lagerstatus eller noe annet!",
    followUps: [
      { label: "Produkter", message: "Hva slags produkter har dere?" },
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Bruktsalg", message: "Har dere brukte reoler?" },
      { label: "Besøk utstilling", message: "Kan jeg besøke utstillingen?" },
    ],
  },
  // 21: TAKK
  {
    triggers: [
      "takk", "thanks", "flott", "supert", "fint", "topp", "perfekt",
    ],
    response:
      "Bare hyggelig! Har du flere spørsmål er det bare å spørre. Du kan også nå oss på {phone}.",
    followUps: [
      { label: "Produkter", message: "Hva slags produkter har dere?" },
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
    ],
  },
];

const knowledgeBase_en: KnowledgeEntry[] = [
  // 0: HELP / OVERVIEW
  {
    triggers: [
      "help", "overview", "menu", "options", "info", "information",
      "tell", "start", "guide", "possibilities",
      "features", "topics", "ask",
    ],
    response:
      "I can help you with:\n\nProducts — pallet racking, shop fittings, counters, lockers, workshop, office, school\nPrices — specific prices and volume discounts\nStock status — what we have in stock\nSpecifications — technical details\nDelivery — delivery time, assembly, shipping\nHSE — safety inspections of racking\nUsed sales — used racking at great prices\nVisit — showroom, opening hours, address\nContact — phone, email, staff\nJobs — vacancies\n\nJust ask about anything!",
    followUps: [
      { label: "Products", message: "What products do you offer?" },
      { label: "Contact us", message: "How can I contact you?" },
      { label: "Used sales", message: "Do you have used racking?" },
      { label: "Visit showroom", message: "Can I visit the showroom?" },
    ],
  },
  // 1: PRICES
  {
    triggers: [
      "price", "prices", "cost", "costs", "cheap", "expensive", "offer",
      "discount", "budget", "estimate", "pay", "payment",
      "invoice", "amount", "nok", "quote",
    ],
    response:
      "Prices vary based on needs and scope. We're happy to provide a no-obligation quote! Contact us at {phone_intl} or {email} with your requirements, and we'll send you a price estimate.",
    followUps: [
      { label: "Contact us", message: "How can I contact you?" },
      { label: "See products", message: "What products do you offer?" },
    ],
  },
  // 2: JOBS / CAREERS
  {
    triggers: [
      "job", "jobs", "career", "position", "hiring", "vacancy",
      "apply", "application", "resume", "recruit", "recruitment", "employee",
    ],
    response:
      "We're a small, specialized team and don't always have open positions.\n\nFeel free to send an open application with your CV to {email}! We look for people with experience in interior fittings, sales, or logistics.",
    followUps: [
      { label: "Contact us", message: "How can I contact you?" },
      { label: "About us", message: "Who is Reol-Consult?" },
    ],
  },
  // 3: ORDERING
  {
    triggers: [
      "order", "ordering", "buy", "purchase", "shop",
      "webshop", "cart",
    ],
    response:
      "We don't have an online shop — everything is tailored to your needs.\n\nContact us with your requirements (phone or email)\nWe provide a no-obligation quote\nUpon acceptance, we arrange delivery and assembly\n\nCall {phone_intl} or email {email}.",
    followUps: [
      { label: "Contact us", message: "How can I contact you?" },
      { label: "Delivery", message: "How do you deliver?" },
    ],
  },
  // 4: OPENING HOURS
  {
    triggers: [
      "open", "opening", "hours", "closed",
      "time", "schedule",
    ],
    response:
      "⏰ Opening hours:\n\nMonday–Friday: 08:00–16:00\nSaturday/Sunday: Closed\n\nWe welcome visits by appointment. Call {phone_intl} to schedule!\n\nWe have a 350 sqm showroom at {visit_address}.",
    followUps: [
      { label: "Visit showroom", message: "Can I visit the showroom?" },
      { label: "Contact us", message: "How can I contact you?" },
    ],
  },
  // 5: CONTACT INFO
  {
    triggers: [
      "contact", "phone", "call", "number", "email",
      "mail", "address", "located", "find", "directions",
      "map", "vear", "tønsberg",
    ],
    response:
      "You can reach us here:\n\nMain line: {phone_intl}\nAgnete H. Bechmann: +47 450 07 322 — agh@reolconsult.no\nTore Aas-Kristiansen: +47 982 04 323 — tk@reolconsult.no\nGeneral: {email}\nVisiting address: {visit_address} (Tønsberg, Norway)\nPostal address: {postal_address}",
    followUps: [
      { label: "Visit showroom", message: "Can I visit the showroom?" },
      { label: "Opening hours", message: "When are you open?" },
      { label: "Get a quote", message: "I'd like a quote" },
    ],
  },
  // 6: SHOWROOM
  {
    triggers: [
      "showroom", "exhibition", "visit", "come", "demo",
      "demonstration", "show", "tour",
    ],
    response:
      "We have a 350 sqm showroom at {visit_address}!\n\nCome see and touch the products. We'll show you around and help find the right solution.\n\nBook in advance: call {phone_intl}\n⏰ Monday–Friday: 08:00–16:00",
    followUps: [
      { label: "Opening hours", message: "When are you open?" },
      { label: "Contact us", message: "How can I contact you?" },
      { label: "See products", message: "What products do you offer?" },
    ],
  },
  // 7: WAREHOUSE / PALLET RACKING
  {
    triggers: [
      "warehouse", "pallet", "racking", "rack", "racks",
      "shelf", "shelves", "shelving", "steel", "galvanized", "cantilever",
      "universal", "small parts", "tyre", "timber", "boat",
      "mezzanine", "storage", "store",
    ],
    response:
      "We have a complete range of warehouse fittings:\n\n• Pallet racking — up to 30 metres high\n• Small parts shelving and universal shelving\n• Cantilever racks and timber racks\n• Tyre racks and boat racks\n• Mezzanine solutions\n\nAll in galvanized steel. We also offer HSE safety inspections.",
    followUps: [
      { label: "Get a quote", message: "I'd like a quote" },
      { label: "HSE inspection", message: "Do you do safety inspections?" },
      { label: "Used racking", message: "Do you have used racking?" },
    ],
  },
  // 8: SHOP / RETAIL
  {
    triggers: [
      "shop", "retail", "store", "fittings", "gondola", "gondolas",
      "wall system", "checkout", "counter", "grocery",
    ],
    response:
      "We deliver complete shop fittings:\n\n• Gondolas and wall systems\n• Checkout counters and service counters\n• Accessories and detail fittings\n\nThe base system is developed according to Swedish building standards.",
    followUps: [
      { label: "Counters", message: "What kind of counters do you have?" },
      { label: "Get a quote", message: "I'd like a quote" },
    ],
  },
  // 9: COUNTERS
  {
    triggers: [
      "counter", "counters", "reception", "checkout counter",
      "service counter",
    ],
    response:
      "We build custom counters to your measurements and needs:\n\n• Checkout counters and checkout shelving\n• Service counters\n• Reception desks\n\nSend us your measurements and wishes, and we'll make a proposal!",
    followUps: [
      { label: "Contact us", message: "How can I contact you?" },
      { label: "Shop fittings", message: "Tell me about shop fittings" },
    ],
  },
  // 10: WORKSHOP / INDUSTRY
  {
    triggers: [
      "workshop", "industry", "industrial", "workbench", "tool", "tool cabinet",
      "packing table", "trolley", "production",
      "factory",
    ],
    response:
      "We offer workshop and industrial fittings:\n\n• Workbenches — manually adjustable, motorized, ESD-safe\n• Packing tables and trolleys\n• Tool cabinets and storage systems\n\nBoth standard and custom solutions.",
    followUps: [
      { label: "Get a quote", message: "I'd like a quote" },
      { label: "Warehouse", message: "Tell me about warehouse fittings" },
    ],
  },
  // 11: OFFICE
  {
    triggers: [
      "office", "desk", "chair", "chairs", "furniture",
      "reception", "conference", "partition",
      "workplace",
    ],
    response:
      "We have a wide range of office furniture:\n\n• Desks (sit/stand and fixed)\n• Office chairs and visitor chairs\n• Storage cabinets and archive solutions\n• Reception desks\n• Conference furniture and partition walls",
    followUps: [
      { label: "Get a quote", message: "I'd like a quote" },
      { label: "Lockers", message: "Do you have locker cabinets?" },
    ],
  },
  // 12: LOCKERS
  {
    triggers: [
      "locker", "lockers", "wardrobe", "changing room",
      "storage cabinet", "charging cabinet",
    ],
    response:
      "We offer locker cabinets with many options:\n\n• Door types: steel, laminate, plywood, veneer\n• Ventilation, locks, and colour choices\n• School lockers and storage cabinets\n• Charging cabinets for mobile and PC\n• Galvanized steel for humid environments",
    followUps: [
      { label: "Get a quote", message: "I'd like a quote" },
      { label: "School", message: "Do you supply to schools?" },
    ],
  },
  // 13: SCHOOL / KINDERGARTEN
  {
    triggers: [
      "school", "kindergarten", "nursery", "student", "pupil",
      "desk", "desks", "whiteboard", "classroom", "changing table",
    ],
    response:
      "We supply schools and kindergartens:\n\nSchool: chairs, desks, tables, benches, whiteboards, student lockers\nKindergarten: children's chairs, tables, open shelving, mattresses, changing tables\n\nDurable products built to withstand heavy use.",
    followUps: [
      { label: "Get a quote", message: "I'd like a quote" },
      { label: "Lockers", message: "Do you have locker cabinets?" },
    ],
  },
  // 14: USED SALES
  {
    triggers: [
      "used", "second-hand", "secondhand", "affordable", "recycle",
      "recycled", "sustainability", "green", "budget",
    ],
    response:
      " We regularly receive used pallet racking and fittings at great prices!\n\n• Used pallet racking: from approx. NOK 2,000/section\n• Selection varies — call to hear what we have in stock\n• Good condition, quality checked\n• Affordable option for startups or expansions\n\nCall {phone_intl} or email {email}.",
    followUps: [
      { label: "Contact us", message: "How can I contact you?" },
      { label: "Warehouse", message: "Tell me about warehouse fittings" },
    ],
  },
  // 15: HSE / SAFETY
  {
    triggers: [
      "hse", "safety", "inspection", "certified", "certificate",
      "regulation", "approved", "rack inspection",
    ],
    response:
      " We perform HSE safety inspections of pallet and warehouse racking.\n\nMandatory for businesses with warehouse racking!\n\n• Visual inspection of all rack components\n• Check of uprights, beams, base plates and bolts\n• Damage marking: green (OK), yellow (monitor), red (replace)\n• Written report with recommendations\n• We cover all of Eastern Norway\n\nContact us at {phone_intl} to schedule an inspection!",
    followUps: [
      { label: "Contact us", message: "How can I contact you?" },
      { label: "Warehouse", message: "Tell me about warehouse fittings" },
    ],
  },
  // 16: DELIVERY AND ASSEMBLY
  {
    triggers: [
      "assembly", "assemble", "delivery", "deliver", "shipping", "freight",
      "transport", "install", "installation", "turnkey",
      "delivery time",
    ],
    response:
      "We deliver across all of Norway with turnkey solutions:\n\n• Project planning and design\n• Drawings and 3D visualization\n• Delivery with our own transport\n• Professional on-site assembly\n\n⏱ Delivery time:\n• In-stock items: 1–2 weeks\n• Made-to-order: 3–6 weeks\n• Custom-made: 4–8 weeks\n\nShipping is calculated based on volume and distance.",
    followUps: [
      { label: "Get a quote", message: "I'd like a quote" },
      { label: "Order", message: "How do I place an order?" },
    ],
  },
  // 17: ABOUT US
  {
    triggers: [
      "who", "history", "established", "founded", "company", "firm",
      "business", "experience", "expertise", "specialists", "expert",
      "reol-consult", "reolconsult",
    ],
    response:
      "Reol-Consult AS was established in November 1984.\n\nLocated at Vear in Tønsberg, Norway\n350 sqm showroom\nSupplying businesses across Norway\n\nWe deliver fittings for shops, warehouses, workshops, offices, archives and locker rooms — from first drawing to fully installed.\n\nOrg. no.: 955 273 117",
    followUps: [
      { label: "Contact us", message: "How can I contact you?" },
      { label: "See products", message: "What products do you offer?" },
      { label: "Visit showroom", message: "Can I visit the showroom?" },
    ],
  },
  // 18: PRODUCTS GENERAL
  {
    triggers: [
      "product", "products", "range", "selection", "sell", "offer",
      "category", "categories", "service", "services", "fittings",
      "solution", "solutions",
    ],
    response:
      "We offer interior fitting solutions in:\n\nShop fittings — gondolas, wall systems, checkout counters\nWarehouse fittings — pallet racking up to 30m, small parts shelving, mezzanines\nWorkshop — workbenches, tool cabinets, packing tables\nOffice — desks, chairs, partition walls\nLockers — locker cabinets, charging cabinets, school lockers\nSchool & kindergarten — desks, chairs, whiteboards, changing tables\n\nWe also have used sales! Ask about a specific category for more details.",
    followUps: [
      { label: "Shop", message: "Tell me about shop fittings" },
      { label: "Warehouse", message: "Tell me about warehouse fittings" },
      { label: "Used sales", message: "Do you have used racking?" },
    ],
  },
  // 19: STAFF
  {
    triggers: [
      "agnete", "bechmann", "tore", "kristiansen", "staff", "employees",
      "advisor", "switchboard",
    ],
    response:
      "Our contact persons:\n\nAgnete H. Bechmann – Sales & advisory\nPhone: +47 450 07 322\nEmail: agh@reolconsult.no\n\nTore Aas-Kristiansen – Sales & advisory\nPhone: +47 982 04 323\nEmail: tk@reolconsult.no\n\nMain line: {phone_intl}\nGeneral: {email}",
    followUps: [
      { label: "Send message", message: "What is the email address?" },
      { label: "Visit", message: "Can I visit the showroom?" },
    ],
  },
  // 20: GREETING
  {
    triggers: [
      "hi", "hello", "hey", "good morning", "good day", "yo",
      "greetings",
    ],
    response:
      "Hi! Welcome to Reol-Consult. How can I help you? You can ask about products, prices, stock status, or anything else!",
    followUps: [
      { label: "Products", message: "What products do you offer?" },
      { label: "Contact us", message: "How can I contact you?" },
      { label: "Used sales", message: "Do you have used racking?" },
      { label: "Visit showroom", message: "Can I visit the showroom?" },
    ],
  },
  // 21: THANKS
  {
    triggers: [
      "thanks", "thank", "great", "awesome", "nice", "perfect", "wonderful",
    ],
    response:
      "You're welcome! If you have more questions, just ask. You can also reach us at {phone_intl}.",
    followUps: [
      { label: "Products", message: "What products do you offer?" },
      { label: "Contact us", message: "How can I contact you?" },
    ],
  },
];

const knowledgeBases: Record<Lang, KnowledgeEntry[]> = { nb: knowledgeBase_nb, en: knowledgeBase_en };

/* ──────────────────── UI strings ──────────────────── */

const UI: Record<Lang, {
  headerTitle: string;
  headerSubConnected: string;
  headerSubDefault: string;
  inputPlaceholder: string;
  initialMessage: string;
  fallbackResponse: string;
  fallbackFollowUps: QuickOption[];
  initialOptions: QuickOption[];
  ctaFooter: string;
  openChat: string;
  closeChat: string;
  sendMessage: string;
  stockOverviewIntro: string;
  stockFallback: string;
}> = {
  nb: {
    headerTitle: "Spør oss",
    headerSubConnected: "Tilkoblet produktdatabase",
    headerSubDefault: "Vi svarer på det meste",
    inputPlaceholder: "Skriv en melding...",
    initialMessage: "Hei! Jeg er Reol-Consults digitale assistent. Spør meg om produkter, priser, lagerstatus eller noe annet!",
    fallbackResponse: "Beklager, det har jeg ikke nok info om ennå. Men teamet vårt hjelper deg gjerne! Ring {phone} eller send e-post til {email}.",
    fallbackFollowUps: [
      { label: "Hva kan du hjelpe med?", message: "Hva kan du hjelpe meg med?" },
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Produkter", message: "Hva slags produkter har dere?" },
    ],
    initialOptions: [
      { label: "Produkter", message: "Hva slags produkter har dere?" },
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Bruktsalg", message: "Har dere brukte reoler?" },
      { label: "Besøk utstilling", message: "Kan jeg besøke utstillingen?" },
    ],
    ctaFooter: "\n\nKontakt oss på {phone} for eksakt tilbud!",
    openChat: "Åpne chat",
    closeChat: "Lukk chat",
    sendMessage: "Send melding",
    stockOverviewIntro: "Her er lagerstatus for produktene våre:\n\n",
    stockFallback: "Ring oss på {phone} for oppdatert lagerstatus!",
  },
  en: {
    headerTitle: "Ask us",
    headerSubConnected: "Connected to product database",
    headerSubDefault: "We answer most questions",
    inputPlaceholder: "Type a message...",
    initialMessage: "Hi! I'm Reol-Consult's digital assistant. Ask me about products, prices, stock status, or anything else!",
    fallbackResponse: "Sorry, I don't have enough info about that yet. But our team is happy to help! Call {phone_intl} or email {email}.",
    fallbackFollowUps: [
      { label: "What can you help with?", message: "What can you help me with?" },
      { label: "Contact us", message: "How can I contact you?" },
      { label: "Products", message: "What products do you offer?" },
    ],
    initialOptions: [
      { label: "Products", message: "What products do you offer?" },
      { label: "Contact us", message: "How can I contact you?" },
      { label: "Used sales", message: "Do you have used racking?" },
      { label: "Visit showroom", message: "Can I visit the showroom?" },
    ],
    ctaFooter: "\n\nContact us at {phone_intl} for an exact quote!",
    openChat: "Open chat",
    closeChat: "Close chat",
    sendMessage: "Send message",
    stockOverviewIntro: "Here's the current stock status:\n\n",
    stockFallback: "Call us at {phone_intl} for updated stock status!",
  },
};

/* ────────────── parse DB document into sections ────────────── */

function parseSections(content: string, lang: Lang): KnowledgeSection[] {
  const lines = content.split("\n");
  const sections: KnowledgeSection[] = [];
  let currentTitle = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeader =
      (trimmed.length >= 3 &&
        trimmed === trimmed.toUpperCase() &&
        /[A-ZÆØÅ]/.test(trimmed) &&
        !/^\d+\.?\s/.test(trimmed) &&
        !trimmed.startsWith("•") &&
        !trimmed.startsWith("-")) ||
      /^#{2,3}\s/.test(trimmed);

    if (isHeader) {
      if (currentTitle && currentLines.length > 0) {
        const body = currentLines.join("\n").trim();
        sections.push({
          title: currentTitle,
          body,
          keywords: extractKeywords(currentTitle + " " + body, lang),
        });
      }
      currentTitle = trimmed.replace(/^#{2,3}\s*/, "").replace(/:$/, "");
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentTitle && currentLines.length > 0) {
    const body = currentLines.join("\n").trim();
    sections.push({
      title: currentTitle,
      body,
      keywords: extractKeywords(currentTitle + " " + body, lang),
    });
  }

  return sections;
}

/* ────────────── parse old content blob into structured sections ────────────── */

function parseKnowledgeBlob(content: string, lang: Lang): KnowledgeSection[] {
  const sections: KnowledgeSection[] = [];
  const blocks = content.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 2) continue;

    // First line should be header: "PALLREOLER:" or "BRUKT:"
    const headerLine = lines[0].trim().replace(/:$/, "");
    if (!headerLine || headerLine !== headerLine.toUpperCase() || !/[A-ZÆØÅ]/.test(headerLine)) continue;

    // Normalize: "PALLREOLER" → "Pallreoler", "GONDOLER (BUTIKK)" → "Gondoler (butikk)"
    const title = headerLine.charAt(0).toUpperCase() + headerLine.slice(1).toLowerCase();

    const variants: Array<{ name: string; price: string; stock: string; delivery: string }> = [];
    const discounts: Array<{ min_quantity: string; price: string }> = [];
    let stockText = "";
    let deliveryText = "";
    const descriptionParts: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const raw = lines[i].trim().replace(/^-\s*/, "");
      if (!raw) continue;
      const lower = raw.toLowerCase();

      // Stock: "På lager: ca 85 seksjoner"
      if (lower.startsWith("på lager:")) {
        const rest = raw.replace(/^[Pp]å lager:\s*/i, "");
        const numMatch = rest.match(/(\d+)/);
        stockText = numMatch ? numMatch[1] : rest;
        continue;
      }

      // Discount: "Ved kjøp over 50 stk: 3.800 kr/stk"
      const discMatch = raw.match(/[Vv]ed kjøp over (\d+)\s*stk[^0-9]*([\d.]+)\s*kr/i);
      if (discMatch) {
        discounts.push({
          min_quantity: discMatch[1],
          price: discMatch[2].replace(/\./g, ""),
        });
        continue;
      }

      // Delivery: "Leveringstid: 1-2 uker"
      if (lower.startsWith("leveringstid:")) {
        deliveryText = raw.replace(/^[Ll]everingstid:\s*/i, "").trim();
        continue;
      }

      // Variant with price: "Standard 3m seksjon: 4.500 kr/stk" or "Enkeltsidig: fra 3.000 kr/seksjon"
      const varMatch = raw.match(/^(.+?):\s*(fra\s+)?([\d.]+)\s*(?:-\s*([\d.]+)\s*)?kr/i);
      if (varMatch) {
        const name = varMatch[1].trim();
        let price: string;
        if (varMatch[2]) {
          price = "fra " + varMatch[3].replace(/\./g, "");
        } else if (varMatch[4]) {
          price = varMatch[3].replace(/\./g, "") + "-" + varMatch[4].replace(/\./g, "");
        } else {
          price = varMatch[3].replace(/\./g, "");
        }
        variants.push({ name, price, stock: "", delivery: "" });
        continue;
      }

      // Everything else → description
      descriptionParts.push(raw);
    }

    // Assign stock/delivery to first variant
    if (variants.length > 0) {
      if (stockText) variants[0].stock = stockText;
      if (deliveryText) variants[0].delivery = deliveryText;
    }

    // Build description from non-price lines
    let description = descriptionParts.join(". ");

    // For sections with no variants, include delivery/stock in description
    if (variants.length === 0) {
      if (deliveryText) description += (description ? "\n\n" : "") + `Leveringstid: ${deliveryText}.`;
      if (stockText) description = `Lagerstatus: ${stockText}.\n\n` + description;
    }

    // Determine category type
    let categoryType = "produkt";
    if (title.toLowerCase().includes("brukt")) categoryType = "salg";

    const body = block.trim();

    sections.push({
      title,
      body,
      keywords: extractKeywords(title + " " + body, lang),
      description: description || title,
      variants,
      discounts,
      extraInfo: "",
      categoryType,
    });
  }

  return sections;
}

function extractKeywords(text: string, lang: Lang): string[] {
  const sw = STOPWORDS[lang];
  return text
    .toLowerCase()
    .replace(/[^a-zæøå0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !sw.has(w))
    .filter((w, i, arr) => arr.indexOf(w) === i);
}

/* ────────────── format numbers Norwegian style ────────────── */

function formatNOK(amount: number | string): string {
  if (typeof amount === "number") {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return amount.replace(/\d+/g, (m) =>
    parseInt(m, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

/* ────────────── extract quantity from user input ────────────── */

function extractQuantity(input: string): number | null {
  const match = input.match(/(\d+)\s*(stk|stykk|stykker|enheter|seksjoner|sett|pcs|pieces|units|sections)?/i);
  if (match) return parseInt(match[1], 10);
  return null;
}

/* ────────────── extract price info from section ────────────── */

function extractPriceInfo(sectionBody: string): {
  unitPrice: number | null;
  bulkPrice: number | null;
  bulkThreshold: number | null;
  stock: string | null;
} {
  let unitPrice: number | null = null;
  let bulkPrice: number | null = null;
  let bulkThreshold: number | null = null;
  let stock: string | null = null;

  const lines = sectionBody.split("\n");
  for (const line of lines) {
    const lower = line.toLowerCase();

    const priceMatch = line.match(/(\d[\d.]*)\s*kr\s*\/\s*stk/i)
      || line.match(/(\d[\d.]*)\s*kr\s*per\s*(?:stk|enhet|seksjon)/i)
      || line.match(/(?:pris|standard)[^0-9]*(\d[\d.]*)\s*kr/i);
    if (priceMatch && !unitPrice) {
      unitPrice = parseInt(priceMatch[1].replace(/\./g, ""), 10);
    }

    const bulkMatch = line.match(/over\s+(\d+)\s*(?:stk|enheter|seksjoner)[^0-9]*(\d[\d.]*)\s*kr/i);
    if (bulkMatch) {
      bulkThreshold = parseInt(bulkMatch[1], 10);
      bulkPrice = parseInt(bulkMatch[2].replace(/\./g, ""), 10);
    }

    if (lower.includes("på lager") || lower.includes("in stock") || (lower.includes("lager") && /\d+/.test(line))) {
      stock = line.trim().replace(/^-\s*/, "");
    }
  }

  return { unitPrice, bulkPrice, bulkThreshold, stock };
}

/* ────────────── format DB response conversationally ────────────── */

function formatDbResponse(
  section: KnowledgeSection,
  quantity: number | null,
  lang: Lang
): string {
  const cta = UI[lang].ctaFooter;
  const vars = section.variants || [];
  const discs = section.discounts || [];
  const desc = section.description || "";
  const extra = section.extraInfo || "";
  const catType = section.categoryType || "";

  // No structured data (old schema / parsed docs): use body as-is
  if (!section.description && vars.length === 0) {
    return section.body + cta;
  }

  // Bedriftsinfo: just description + extra, no sales CTA
  if (catType === "bedriftsinfo") {
    let text = desc;
    if (extra) text += "\n\n" + extra;
    return text;
  }

  // Tjeneste: description + extra + CTA
  if (catType === "tjeneste") {
    let text = desc;
    if (extra) text += "\n\n" + extra;
    return text + cta;
  }

  // Products and salg
  const pricedVars = vars.filter(v => v.price);
  const parts: string[] = [];

  if (pricedVars.length > 1) {
    // Multiple priced variants: conversational intro
    const name = section.title.toLowerCase();
    parts.push(lang === "nb"
      ? `Vi har ${name} i flere varianter:`
      : `We have ${name} in several variants:`
    );
  } else if (desc) {
    // Single or no priced variant: use description
    parts.push(desc);
  }

  // Variant lines (no bullets, dash-separated)
  if (pricedVars.length > 0) {
    const lines = pricedVars.map(v => `${v.name} — ${formatNOK(v.price)} kr`);
    parts.push(lines.join("\n"));
  }

  // Stock, delivery, discounts — combined into one natural sentence
  const stockVar = vars.find(v => v.stock);
  const deliveryVar = vars.find(v => v.delivery);
  let infoLine = "";

  if (lang === "nb") {
    if (stockVar?.stock) {
      const n = parseInt(stockVar.stock, 10);
      if (!isNaN(n)) {
        infoLine = `Vi har ca. ${n} på lager`;
      } else if (stockVar.stock.toLowerCase() === "varierer") {
        infoLine = "Utvalget varierer";
      } else if (stockVar.stock.toLowerCase() === "begrenset") {
        infoLine = "Begrenset antall på lager";
      } else {
        infoLine = `Lagerstatus: ${stockVar.stock}`;
      }
    }
    if (deliveryVar?.delivery) {
      const del = deliveryVar.delivery;
      if (infoLine) {
        if (del === "straks") {
          infoLine += " med umiddelbar levering";
        } else if (del.includes(",") || del.includes(" og ")) {
          infoLine += `. Leveringstid: ${del}`;
        } else {
          infoLine += ` med ${del}s leveringstid`;
        }
      } else {
        infoLine = del === "straks" ? "Leveres umiddelbart" : `Leveringstid: ${del}`;
      }
    }
  } else {
    if (stockVar?.stock) {
      const n = parseInt(stockVar.stock, 10);
      if (!isNaN(n)) {
        infoLine = `We have approx. ${n} in stock`;
      } else if (stockVar.stock.toLowerCase() === "varierer") {
        infoLine = "Selection varies";
      } else if (stockVar.stock.toLowerCase() === "begrenset") {
        infoLine = "Limited stock available";
      } else {
        infoLine = `Stock: ${stockVar.stock}`;
      }
    }
    if (deliveryVar?.delivery) {
      const del = deliveryVar.delivery;
      if (infoLine) {
        infoLine += del === "straks" ? " with immediate delivery" : ` with ${del} delivery`;
      } else {
        infoLine = del === "straks" ? "Available immediately" : `Delivery: ${del}`;
      }
    }
  }

  if (infoLine) infoLine += ".";

  // Append discount naturally to the info line
  if (discs.length > 0) {
    const d = discs[0];
    if (lang === "nb") {
      infoLine += ` Ved kjøp over ${d.min_quantity} stk: ${formatNOK(d.price)} kr/stk.`;
    } else {
      infoLine += ` Orders over ${d.min_quantity} pcs: ${formatNOK(d.price)} NOK/pc.`;
    }
  }

  if (infoLine.trim()) parts.push(infoLine.trim());

  // Quantity calculation
  if (quantity && pricedVars.length > 0) {
    const unitStr = pricedVars[0].price.replace(/[^\d]/g, "");
    const unitPrice = parseInt(unitStr, 10);
    if (!isNaN(unitPrice)) {
      let effective = unitPrice;
      if (discs.length > 0) {
        const thresh = parseInt(discs[0].min_quantity, 10);
        const discP = parseInt(discs[0].price.replace(/[^\d]/g, ""), 10);
        if (!isNaN(thresh) && !isNaN(discP) && quantity >= thresh) {
          effective = discP;
        }
      }
      const total = effective * quantity;
      parts.push(lang === "nb"
        ? `${quantity} stk blir ca. ${formatNOK(total)} kr.`
        : `${quantity} pcs comes to approx. ${formatNOK(total)} NOK.`
      );
    }
  }

  // Extra info
  if (extra) parts.push(extra);

  return parts.join("\n\n") + cta;
}

/* ────────────── search DB sections ────────────── */

function searchSections(
  sections: KnowledgeSection[],
  input: string,
  lang: Lang
): KnowledgeSection | null {
  const sw = STOPWORDS[lang];
  const lower = input.toLowerCase().replace(/[?!.,;:]/g, "");
  const words = lower
    .split(/\s+/)
    .filter((w) => w.length > 2 && !sw.has(w));

  if (words.length === 0) return null;

  let bestSection: KnowledgeSection | null = null;
  let bestScore = 0;

  for (const section of sections) {
    let score = 0;
    for (const word of words) {
      if (section.title.toLowerCase().includes(word)) {
        score += 3;
      }
      for (const kw of section.keywords) {
        if (
          word === kw ||
          (word.length >= 4 && kw.startsWith(word)) ||
          (word.length >= 4 && word.startsWith(kw))
        ) {
          score += 1;
          break;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestSection = section;
    }
  }

  return bestScore >= 2 ? bestSection : null;
}

/* ────────────── check if user asks about stock ────────────── */

function isStockQuery(input: string): boolean {
  const lower = input.toLowerCase();
  return (
    lower.includes("på lager") ||
    lower.includes("lagerstatus") ||
    lower.includes("hva har dere på lager") ||
    lower.includes("lager status") ||
    lower.includes("in stock") ||
    lower.includes("stock status") ||
    lower.includes("what do you have in stock") ||
    (lower.includes("lager") && (lower.includes("hva") || lower.includes("har"))) ||
    (lower.includes("stock") && (lower.includes("what") || lower.includes("have")))
  );
}

function getStockOverview(sections: KnowledgeSection[], lang: Lang): string {
  const ui = UI[lang];
  const stockLines: string[] = [];
  for (const section of sections) {
    if (section.variants && section.variants.length > 0) {
      const sv = section.variants.find(v => v.stock);
      if (sv?.stock) {
        const n = parseInt(sv.stock, 10);
        if (lang === "nb") {
          stockLines.push(!isNaN(n)
            ? `${section.title} — ca. ${n} på lager`
            : `${section.title} — ${sv.stock}`
          );
        } else {
          stockLines.push(!isNaN(n)
            ? `${section.title} — approx. ${n} in stock`
            : `${section.title} — ${sv.stock}`
          );
        }
      }
    } else {
      const { stock } = extractPriceInfo(section.body);
      if (stock) {
        stockLines.push(`${section.title} — ${stock}`);
      }
    }
  }
  if (stockLines.length > 0) {
    return ui.stockOverviewIntro + stockLines.join("\n") + ui.ctaFooter;
  }
  return ui.stockFallback + ui.ctaFooter;
}

/* ───────────────── matching logic ─────────────────── */

function findHardcodedResponse(input: string, lang: Lang): {
  text: string;
  followUps: QuickOption[];
} | null {
  const lower = input.toLowerCase().replace(/[?!.,;:]/g, "");
  const kb = knowledgeBases[lang];
  const pp = PHRASE_PATTERNS[lang];
  const sw = STOPWORDS[lang];

  // 1. Check multi-word phrases first
  for (const pm of pp) {
    for (const phrase of pm.phrases) {
      if (lower.includes(phrase)) {
        const entry = kb[pm.entryIndex];
        return { text: entry.response, followUps: entry.followUps };
      }
    }
  }

  // 2. Split into words and remove stopwords
  const words = lower
    .split(/\s+/)
    .filter((w) => w.length > 0 && !sw.has(w));

  if (words.length === 0) {
    return null;
  }

  // 3. Score each entry
  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of kb) {
    let score = 0;
    for (const word of words) {
      for (const trigger of entry.triggers) {
        if (
          word === trigger ||
          (word.length >= 4 && word.startsWith(trigger)) ||
          (word.length >= 4 && trigger.startsWith(word))
        ) {
          score++;
          break;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore > 0) {
    return { text: bestEntry.response, followUps: bestEntry.followUps };
  }

  return null;
}

/* ───────────────── component ─────────────────────── */

export default function Chatbot() {
  const { settings } = useSite();
  const [lang, setLang] = useState<Lang>("nb");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [quickOptions, setQuickOptions] = useState<QuickOption[]>([]);
  const [dbSections, setDbSections] = useState<KnowledgeSection[]>([]);
  const [dbLoaded, setDbLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(1);

  // Initialize messages & options when lang changes
  useEffect(() => {
    const ui = UI[lang];
    setMessages([{ id: 0, text: ui.initialMessage, sender: "bot" }]);
    setQuickOptions(ui.initialOptions);
  }, [lang]);

  // Fetch knowledge from Supabase
  useEffect(() => {
    async function fetchKnowledge() {
      try {
        const allSections: KnowledgeSection[] = [];

        // Try new schema first (structured columns)
        const { data: categories, error: catError } = await supabase
          .from("chatbot_knowledge")
          .select("category, category_type, description, variants, discounts, extra_info");

        if (!catError && categories && categories.length > 0) {
          for (const cat of categories) {
            let body = cat.description || "";

            const vars = (Array.isArray(cat.variants) ? cat.variants : []) as Array<{
              name: string; price: string; stock: string; delivery: string;
            }>;
            if (vars.length > 0) {
              body += "\n\nVarianter:";
              for (const v of vars) {
                if (v.price) body += `\n- ${v.name}: ${v.price} kr/stk`;
                else body += `\n- ${v.name}`;
                if (v.stock) body += ` — ${v.stock}`;
                if (v.delivery) body += ` (levering: ${v.delivery})`;
              }
            }

            const discs = (Array.isArray(cat.discounts) ? cat.discounts : []) as Array<{
              min_quantity: string; price: string;
            }>;
            if (discs.length > 0) {
              body += "\n\nMengderabatt:";
              for (const d of discs) {
                body += `\n- Over ${d.min_quantity} stk: ${d.price} kr/stk`;
              }
            }

            if (cat.extra_info) body += "\n\n" + cat.extra_info;

            allSections.push({
              title: cat.category,
              body: body.trim(),
              keywords: extractKeywords(cat.category + " " + body, lang),
              description: cat.description || "",
              variants: vars,
              discounts: discs,
              extraInfo: cat.extra_info || "",
              categoryType: cat.category_type || "",
            });
          }
        } else {
          // Fallback: old schema (single content blob) — parse into structured sections
          const { data: legacy } = await supabase
            .from("chatbot_knowledge")
            .select("content");
          if (legacy) {
            for (const row of legacy) {
              if (row.content) {
                const parsed = parseKnowledgeBlob(row.content, lang);
                allSections.push(...parsed);
              }
            }
          }
        }

        // Try fetching documents (table may not exist yet)
        const { data: docs, error: docError } = await supabase
          .from("chatbot_documents")
          .select("content");
        if (!docError && docs) {
          for (const doc of docs) {
            if (doc.content) {
              const docSections = parseSections(doc.content, lang);
              allSections.push(...docSections);
            }
          }
        }

        if (allSections.length > 0) {
          setDbSections(allSections);
          setDbLoaded(true);
        }
      } catch {
        console.warn("Could not connect to Supabase, using fallback knowledge base.");
      }
    }

    fetchKnowledge();
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, quickOptions]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const ui = UI[lang];

  const handleSend = useCallback(
    (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg) return;

      const userId = idCounter.current++;
      const userMsg: Message = { id: userId, text: msg, sender: "user" };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setQuickOptions([]);

      setTimeout(() => {
        let responseText: string;
        let followUps: QuickOption[];

        const quantity = extractQuantity(msg);
        const currentUi = UI[lang];

        if (dbLoaded && isStockQuery(msg)) {
          responseText = getStockOverview(dbSections, lang);
          followUps = lang === "nb"
            ? [{ label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" }, { label: "Produkter", message: "Hva slags produkter har dere?" }]
            : [{ label: "Contact us", message: "How can I contact you?" }, { label: "Products", message: "What products do you offer?" }];
        } else if (dbLoaded) {
          const dbMatch = searchSections(dbSections, msg, lang);
          if (dbMatch) {
            responseText = formatDbResponse(dbMatch, quantity, lang);
            followUps = lang === "nb"
              ? [{ label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" }, { label: "Lagerstatus", message: "Hva har dere på lager?" }]
              : [{ label: "Contact us", message: "How can I contact you?" }, { label: "Stock status", message: "What do you have in stock?" }];
          } else {
            const hardcoded = findHardcodedResponse(msg, lang);
            if (hardcoded) {
              responseText = hardcoded.text;
              followUps = hardcoded.followUps;
            } else {
              responseText = currentUi.fallbackResponse;
              followUps = currentUi.fallbackFollowUps;
            }
          }
        } else {
          const hardcoded = findHardcodedResponse(msg, lang);
          if (hardcoded) {
            responseText = hardcoded.text;
            followUps = hardcoded.followUps;
          } else {
            responseText = currentUi.fallbackResponse;
            followUps = currentUi.fallbackFollowUps;
          }
        }

        const botId = idCounter.current++;
        const botMsg: Message = {
          id: botId,
          text: responseText,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
        setQuickOptions(followUps);
      }, 400);
    },
    [input, dbLoaded, dbSections, lang],
  );

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            onClick={() => setOpen(true)}
            className="fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_30px_rgba(220,38,38,0.3)] transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_8px_30px_rgba(220,38,38,0.45)] sm:right-6 sm:bottom-6"
            style={{ bottom: "max(20px, env(safe-area-inset-bottom, 20px))" }}
            aria-label={ui.openChat}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[500px] sm:w-[380px] sm:max-h-[calc(100vh-6rem)] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between bg-primary px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {ui.headerTitle}
                  </p>
                  <p className="text-xs text-white/60">
                    {dbLoaded ? ui.headerSubConnected : ui.headerSubDefault}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Language toggle */}
                <button
                  onClick={() => setLang(lang === "nb" ? "en" : "nb")}
                  className="flex h-7 items-center rounded-full bg-white/15 px-2.5 text-[11px] font-bold tracking-wide text-white transition-colors hover:bg-white/25"
                  aria-label="Switch language"
                >
                  {lang === "nb" ? "EN" : "NO"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                  aria-label={ui.closeChat}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-bg-light px-4 py-4">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === "user"
                          ? "rounded-br-md bg-primary text-white"
                          : "rounded-bl-md border border-border bg-white text-text-dark"
                      }`}
                    >
                      {fillPlaceholders(msg.text, settings)
                        .split(/(\*\*[^*]+\*\*)/)
                        .map((part, i) =>
                          part.startsWith("**") && part.endsWith("**") ? (
                            <strong key={i}>{part.slice(2, -2)}</strong>
                          ) : (
                            <span key={i}>{part}</span>
                          ),
                        )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick options */}
              {quickOptions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {quickOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleSend(opt.message)}
                      className="rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/5"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-border bg-white px-4 py-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={ui.inputPlaceholder}
                  className="flex-1 rounded-xl border border-border bg-bg-light px-4 py-3 text-sm text-text-dark placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-all duration-200 hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent"
                  aria-label={ui.sendMessage}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
