"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ───────────────────────── types ───────────────────────── */

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

/* ──────────────────── stopwords ──────────────────── */

const STOPWORDS = new Set([
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

/* ──────────── multi-word phrase patterns ──────────── */

interface PhraseMatch {
  phrases: string[];
  entryIndex: number;
  bonus: number;
}

// These are checked FIRST against the raw lowercased input
const PHRASE_PATTERNS: PhraseMatch[] = [
  { phrases: ["hva kan du", "hva kan jeg spørre", "hva vet du", "hva svarer du", "hva kan chatbot"], entryIndex: 0, bonus: 10 },
  { phrases: ["hva koster", "hvor mye koster", "hva vil det koste"], entryIndex: 1, bonus: 5 },
  { phrases: ["ledig stilling", "ledige stillinger", "åpen søknad"], entryIndex: 2, bonus: 5 },
  { phrases: ["hvor ligger", "hvor holder", "hvordan komme"], entryIndex: 5, bonus: 5 },
  { phrases: ["brukte reoler", "brukt reol", "brukt innredning"], entryIndex: 13, bonus: 5 },
  { phrases: ["hms kontroll", "hms sikkerhetskontroll", "sikkerhetskontroll"], entryIndex: 14, bonus: 5 },
];

/* ──────────────────── knowledge base ──────────────────── */

const knowledgeBase: KnowledgeEntry[] = [
  // 0: HJELP / OVERSIKT (highest priority)
  {
    triggers: [
      "hjelp", "oversikt", "meny", "alternativ", "info", "informasjon",
      "fortell", "start", "guide", "veilede", "veiledning", "muligheter",
      "funksjoner", "tema", "emner", "spørre",
    ],
    response:
      "Jeg kan hjelpe deg med:\n\n📦 Produkter — pallreoler, butikkinnredning, disker, garderobe, verksted, kontor, skole\n💰 Priser — omtrentlige priser på våre produkter\n🔧 Spesifikasjoner — tekniske detaljer om reoler, skap, mesanin osv.\n🚚 Levering — leveringstid, montering, frakt\n🛡️ HMS — sikkerhetskontroll av reoler\n♻️ Bruktsalg — brukte reoler til gode priser\n📍 Besøk — utstilling, åpningstider, adresse\n📞 Kontakt — telefon, e-post, ansatte\n💼 Jobb — ledige stillinger\n\nBare spør om det du lurer på!",
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
      "Prisene varierer etter behov og omfang. Vi gir gjerne et uforpliktende tilbud! Kontakt oss på 33 36 55 80 eller mail@reolconsult.no med dine ønsker, så sender vi et prisoverslag.",
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
      "Vi har ikke alltid utlyste stillinger, men send gjerne en åpen søknad til mail@reolconsult.no! Legg ved CV og en kort beskrivelse av deg selv.",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Om oss", message: "Hvem er Reol-Consult?" },
    ],
  },
  // 3: BESTILLING / KJØP
  {
    triggers: [
      "bestille", "bestilling", "kjøpe", "kjøp", "ordre", "handle",
      "leveranse", "leveringstid", "frist",
    ],
    response:
      "Vi tar imot bestillinger via telefon eller e-post. Ring 33 36 55 80 eller send en forespørsel til mail@reolconsult.no. Leveringstid avhenger av produkt og omfang — vi gir deg et estimat ved bestilling.",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Levering", message: "Hvordan leverer dere?" },
    ],
  },
  // 4: ÅPNINGSTIDER
  {
    triggers: [
      "åpent", "åpningstid", "åpningstider", "åpen", "stengt", "lukket",
      "besøk", "besøke", "komme", "innom", "utstilling", "visning",
      "omvisning", "demonstrasjon", "showroom",
    ],
    response:
      "Vi tar imot besøk etter avtale. Ring oss på 33 36 55 80 eller send e-post til mail@reolconsult.no for å avtale tidspunkt. Vi har 350 kvm utstilling i Smiløkka 7 på Vear!",
    followUps: [
      { label: "Adresse", message: "Hvor ligger dere?" },
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
      "Du kan nå oss slik:\n📞 Sentralbord: 33 36 55 80\n📞 Agnete: 45 00 73 22\n📞 Tore: 98 20 43 23\n📧 mail@reolconsult.no\n📍 Smiløkka 7, 3173 Vear (Tønsberg)\n📬 Postboks 1, 3108 Vear",
    followUps: [
      { label: "Besøk utstilling", message: "Kan jeg besøke utstillingen?" },
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
    ],
  },
  // 6: LAGER / PALLREOLER
  {
    triggers: [
      "lager", "pall", "pallreol", "pallreoler", "reol", "reoler",
      "hylle", "hyller", "stål", "galvanisert", "grenreol",
      "universalreol", "småvare", "dekkreol", "trelastreol", "båtreol",
      "mesanin", "lagerplass", "lagerinnredning", "lagring", "oppbevaring",
    ],
    response:
      "Vi har et komplett sortiment innen lagerinnredning:\n\n• Pallreoler — opptil 30 meter høyde, ulike bæreevner\n• Småvarereoler og universalreoler\n• Grenreoler og trelastreoler\n• Dekkreoler og båtreoler\n• Mesaninløsninger — utnytter høyden, gir ekstra etasje\n\nAlt i galvanisert stål til konkurransedyktige priser. Vi tilbyr også HMS sikkerhetskontroll av eksisterende lager.",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "HMS-kontroll", message: "Gjør dere HMS-kontroll?" },
      { label: "Brukte reoler", message: "Har dere brukte reoler?" },
    ],
  },
  // 7: BUTIKK
  {
    triggers: [
      "butikk", "butikkinnredning", "gondol", "gondoler",
      "veggsystem", "kassedisk", "retail", "dagligvare",
      "matbutikk", "klesbutikk",
    ],
    response:
      "Vi leverer komplette butikkinnredninger:\n\n• Gondoler og veggsystemer\n• Kassedisker og betjeningsdisker\n• Tilbehør og detaljinnredning\n\nGrunnsystemet er utviklet etter svensk byggestandard — enkelt å montere, bygge om og utvide. Vi har Østlandets største sortiment og leverer alt fra enkeltdeler til hele butikksystemer.",
    followUps: [
      { label: "Disker", message: "Hva slags disker har dere?" },
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
    ],
  },
  // 8: DISKER
  {
    triggers: [
      "disk", "disker", "skranke", "resepsjonsdisk", "kassareol",
      "betjeningsdisk",
    ],
    response:
      "Vi bygger skreddersydde disker etter dine mål og behov:\n\n• Kassedisker og kassereoler\n• Betjeningsdisker\n• Skranker og resepsjonsdisker\n\nSend oss dine mål og ønsker, så lager vi et forslag. Vi leverer til hele landet!",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Butikkinnredning", message: "Fortell om butikkinnredning" },
    ],
  },
  // 9: VERKSTED / INDUSTRI
  {
    triggers: [
      "verksted", "industri", "arbeidsbord", "verktøy", "verktøyskap",
      "pakkebord", "rullebord", "verkstedinnredning", "produksjon",
      "fabrikk", "arbeidsbenk",
    ],
    response:
      "Vi tilbyr verksted- og industriinnredning:\n\n• Arbeidsbord — manuelt justerbare, motordrevne, ESD-sikre\n• Pakkebord og rullebord\n• Verktøyskap og oppbevaringssystemer\n\nBåde standardløsninger og spesialløsninger tilpasset ditt behov. Alt kan kombineres med lagerinnredning.",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Lagerinnredning", message: "Fortell om lagerinnredning" },
    ],
  },
  // 10: KONTOR
  {
    triggers: [
      "kontor", "skrivebord", "stol", "stoler", "kontormøbler",
      "kontormøbel", "møbler", "resepsjon", "konferanse", "skjermvegg",
      "arbeidsplass",
    ],
    response:
      "Vi har et bredt utvalg kontorinnredning:\n\n• Skrivebord (hev/senk og faste)\n• Kontorstol og besøksstoler\n• Oppbevaringsskap og arkivløsninger\n• Resepsjonsdisker\n• Konferansemøbler og skjermvegger\n\nKontakt oss for å finne riktig løsning for din arbeidsplass!",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Garderobe", message: "Har dere garderobeskap?" },
    ],
  },
  // 11: GARDEROBE
  {
    triggers: [
      "garderobe", "garderobeskap", "skoleskap", "ladeskap",
      "oppbevaringsskap", "omkleding", "omkledning", "omkleidning",
    ],
    response:
      "Vi tilbyr garderobeskap med mange valgmuligheter:\n\n• Dørtyper: ståldører, laminat, kryssfiner, finér\n• Ventilasjon, lås og fargevalg\n• Skoleskap og oppbevaringsskap\n• Ladeskap for mobil og PC\n• Galvanisert stål for fuktige miljøer (svømmehall, garderobe)\n\nSkapene leveres i mange størrelser og konfigurasjoner.",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Skole", message: "Leverer dere til skoler?" },
    ],
  },
  // 12: SKOLE / BARNEHAGE
  {
    triggers: [
      "skole", "barnehage", "elev", "elevskap", "pult", "pulter",
      "tavle", "barnehagemøbler", "stellebord", "klasserom",
    ],
    response:
      "Vi leverer til skoler og barnehager:\n\n🏫 Skole: stoler, pulter, bord, paller og benker, tavler, elevskap\n👶 Barnehage: barnestoler, bord, åpen innredning, madrasser, stellebord\n\nAlle produktene er holdbare og tåler hard slitasje over mange år. Vi har også skoleskap og garderobeskap.",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Garderobe", message: "Har dere garderobeskap?" },
    ],
  },
  // 13: BRUKT / BRUKTSALG
  {
    triggers: [
      "brukt", "bruktsalg", "brukte", "begagnat", "rimelig", "gjenbruk",
      "resirkuler", "bærekraft", "miljø", "grønn", "grønt",
    ],
    response:
      "Vi selger brukte reoler og innredning til gode priser! Utvalget varierer — vi har ofte pallreoler, småvarereoler, butikkinnredning og kontormøbler inne.\n\nRing oss på 33 36 55 80 eller send e-post til mail@reolconsult.no for å høre hva vi har akkurat nå. Du kan også besøke vår bruktsalg-side.",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Lagerinnredning", message: "Fortell om lagerinnredning" },
    ],
  },
  // 14: HMS / SIKKERHET
  {
    triggers: [
      "hms", "sikkerhet", "kontroll", "sikkerhets", "inspeksjon",
      "forskrift", "godkjent", "godkjenning", "sertifikat", "sertifisert",
    ],
    response:
      "Vi gjennomfører HMS sikkerhetskontroll av pallreoler og lagerinnredning i henhold til gjeldende forskrifter. Kontrollen dekker:\n\n• Visuell inspeksjon av skader og deformasjoner\n• Sjekk av bæreevne og lastmerking\n• Dokumentasjon og rapport\n\nTa kontakt på 33 36 55 80 for å avtale inspeksjon!",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Lagerinnredning", message: "Fortell om lagerinnredning" },
    ],
  },
  // 15: MONTERING / LEVERING
  {
    triggers: [
      "monter", "montere", "montering", "levering", "frakt",
      "transport", "installere", "installasjon", "nøkkelferdig",
    ],
    response:
      "Vi tilbyr nøkkelferdige løsninger over hele Norge:\n\n• Prosjektering og planlegging\n• Tegning og 3D-visualisering\n• Levering med egen transport\n• Profesjonell montering på stedet\n\nVår nærhet til produksjon gir skreddersydde løsninger og konkurransedyktige priser.",
    followUps: [
      { label: "Få tilbud", message: "Jeg vil ha et tilbud" },
      { label: "Bestille", message: "Hvordan bestiller jeg?" },
    ],
  },
  // 16: HVEM / OM OSS
  {
    triggers: [
      "hvem", "historie", "etablert", "grunnlagt", "selskap", "firma",
      "bedrift", "erfaring", "kompetanse", "fagfolk", "ekspert",
      "reol-consult", "reolconsult",
    ],
    response:
      "Reol-Consult AS ble etablert i november 1984 og har over 40 års erfaring. Vi holder til i Smiløkka 7 på Vear (Tønsberg) med 350 kvm utstilling.\n\nVi er Østlandets største leverandør innen butikk-, lager-, verksted-, kontor-, arkiv- og garderobeinnredning. Vi leverer effektive og konkurransedyktige løsninger fra idé til ferdig sluttprodukt — til bedrifter over hele Norge.\n\nOrg.nr: 955 273 117",
    followUps: [
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Se produkter", message: "Hva slags produkter har dere?" },
    ],
  },
  // 17: PRODUKTER GENERELT
  {
    triggers: [
      "produkt", "produkter", "sortiment", "utvalg", "selger", "tilbyr",
      "kategori", "kategorier", "tjeneste", "tjenester", "innredning",
      "løsning", "løsninger",
    ],
    response:
      "Vi tilbyr innredningsløsninger innen:\n\n🏪 Butikkinnredning — gondoler, veggsystemer, kassedisker\n📦 Lagerinnredning — pallreoler opptil 30m, småvarereoler, mesanin\n🔧 Verksted — arbeidsbord, verktøyskap, pakkebord\n🏢 Kontor — skrivebord, stoler, skjermvegger\n🚿 Garderobe — garderobeskap, ladeskap, skoleskap\n🏫 Skole & barnehage — pulter, stoler, tavler, stellebord\n\nVi har også bruktsalg! Spør om en spesifikk kategori for mer detaljer.",
    followUps: [
      { label: "Butikk", message: "Fortell om butikkinnredning" },
      { label: "Lager", message: "Fortell om lagerinnredning" },
      { label: "Bruktsalg", message: "Har dere brukte reoler?" },
    ],
  },
  // 18: ANSATTE
  {
    triggers: [
      "agnete", "bechmann", "tore", "kristiansen", "ansatt", "ansatte",
      "rådgiver", "sentralbord",
    ],
    response:
      "Våre kontaktpersoner:\n\n👩 Agnete H. Bechmann – Salg & rådgivning\nTlf: 45 00 73 22\n\n👨 Tore Aas-Kristiansen – Salg & rådgivning\nTlf: 98 20 43 23\n\n📞 Sentralbord: 33 36 55 80\n📧 mail@reolconsult.no",
    followUps: [
      { label: "Send melding", message: "Hva er e-postadressen?" },
      { label: "Besøk", message: "Kan jeg besøke utstillingen?" },
    ],
  },
  // 19: HILSEN
  {
    triggers: [
      "hei", "hallo", "heisann", "morn", "goddag", "yo", "hey",
      "heihei", "heia",
    ],
    response:
      "Hei! 👋 Velkommen til Reol-Consult. Hva kan jeg hjelpe deg med? Du kan spørre om produkter, priser, bestilling, besøk eller noe annet!",
    followUps: [
      { label: "Produkter", message: "Hva slags produkter har dere?" },
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
      { label: "Bruktsalg", message: "Har dere brukte reoler?" },
      { label: "Besøk utstilling", message: "Kan jeg besøke utstillingen?" },
    ],
  },
  // 20: TAKK
  {
    triggers: [
      "takk", "thanks", "flott", "supert", "fint", "topp", "perfekt",
    ],
    response:
      "Bare hyggelig! Har du flere spørsmål er det bare å spørre. Du kan også nå oss på 33 36 55 80 😊",
    followUps: [
      { label: "Produkter", message: "Hva slags produkter har dere?" },
      { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
    ],
  },
];

const FALLBACK_RESPONSE =
  "Beklager, det har jeg ikke nok info om ennå. Men teamet vårt hjelper deg gjerne! Ring 33 36 55 80 eller send e-post til mail@reolconsult.no.";

const FALLBACK_FOLLOWUPS: QuickOption[] = [
  { label: "Hva kan du hjelpe med?", message: "Hva kan du hjelpe meg med?" },
  { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
  { label: "Produkter", message: "Hva slags produkter har dere?" },
];

const INITIAL_OPTIONS: QuickOption[] = [
  { label: "Produkter", message: "Hva slags produkter har dere?" },
  { label: "Kontakt oss", message: "Hvordan kontakter jeg dere?" },
  { label: "Bruktsalg", message: "Har dere brukte reoler?" },
  { label: "Besøk utstilling", message: "Kan jeg besøke utstillingen?" },
];

/* ───────────────── matching logic ─────────────────── */

function findResponse(input: string): {
  text: string;
  followUps: QuickOption[];
} {
  const lower = input.toLowerCase().replace(/[?!.,;:]/g, "");

  // 1. Check multi-word phrases first (highest confidence)
  for (const pm of PHRASE_PATTERNS) {
    for (const phrase of pm.phrases) {
      if (lower.includes(phrase)) {
        const entry = knowledgeBase[pm.entryIndex];
        return { text: entry.response, followUps: entry.followUps };
      }
    }
  }

  // 2. Split into words and remove stopwords
  const words = lower
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w));

  // If all words were stopwords, return fallback
  if (words.length === 0) {
    return { text: FALLBACK_RESPONSE, followUps: FALLBACK_FOLLOWUPS };
  }

  // 3. Score each entry by counting trigger matches
  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
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

  return { text: FALLBACK_RESPONSE, followUps: FALLBACK_FOLLOWUPS };
}

/* ───────────────── component ─────────────────────── */

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hei! 👋 Jeg er Reol-Consults digitale assistent. Hva kan jeg hjelpe deg med?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [quickOptions, setQuickOptions] = useState<QuickOption[]>(INITIAL_OPTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, quickOptions]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

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
        const result = findResponse(msg);
        const botId = idCounter.current++;
        const botMsg: Message = {
          id: botId,
          text: result.text,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
        setQuickOptions(result.followUps);
      }, 400);
    },
    [input],
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
            className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_30px_rgba(212,32,39,0.35)] transition-all duration-300 hover:bg-accent-hover hover:shadow-[0_8px_30px_rgba(212,32,39,0.5)] sm:right-6 sm:bottom-6"
            aria-label="Åpne chat"
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
                    Reol-Consult Hjelp
                  </p>
                  <p className="text-xs text-white/60">
                    Vi svarer på det meste!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Lukk chat"
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[#faf8f6] px-4 py-4">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === "user"
                          ? "rounded-br-md bg-accent text-white"
                          : "rounded-bl-md border border-black/[0.04] bg-white text-text-dark"
                      }`}
                    >
                      {msg.text}
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
                      className="rounded-full border border-accent/20 bg-white px-4 py-2 text-sm font-medium text-accent transition-all duration-200 hover:bg-accent/10"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-black/[0.04] bg-white px-4 py-3">
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
                  placeholder="Skriv en melding..."
                  className="flex-1 rounded-xl border border-black/[0.04] bg-[#faf8f6] px-4 py-2.5 text-sm text-text-dark placeholder:text-text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-all duration-200 hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent"
                  aria-label="Send melding"
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
