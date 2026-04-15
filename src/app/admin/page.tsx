"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Variant {
  name: string;
  price: string;
  stock: string;
  delivery: string;
}

interface Discount {
  min_quantity: string;
  price: string;
}

interface Category {
  id: string | null;
  category: string;
  category_type: "produkt" | "tjeneste" | "salg" | "bedriftsinfo";
  description: string;
  variants: Variant[];
  discounts: Discount[];
  extra_info: string;
  updated_at: string;
}

interface Document {
  id: string;
  filename: string;
  file_type: string;
  category: string;
  uploaded_at: string;
  uploaded_by: string;
}

type SidebarItem = "dokumenter" | "ekstra-info" | "statistikk" | "chatbot" | "innstillinger";

const SIDEBAR_ITEMS: { key: SidebarItem; label: string }[] = [
  { key: "dokumenter", label: "Dokumenter" },
  { key: "ekstra-info", label: "Ekstra info" },
  { key: "statistikk", label: "Statistikk" },
  { key: "chatbot", label: "Chatbot" },
  { key: "innstillinger", label: "Innstillinger" },
];

const DOC_SECTIONS: { key: string; label: string }[] = [
  { key: "produkt", label: "PRODUKTER" },
  { key: "tjeneste", label: "TJENESTER" },
  { key: "salg", label: "SALG" },
  { key: "bedriftsinfo", label: "BEDRIFTSINFO" },
];

const DEFAULTS: Omit<Category, "id">[] = [
  { category: "Pallreoler", category_type: "produkt", description: "Konvensjonelle pallreoler med ubegrenset tilgang til alle paller. Høyder opptil 30 meter. Passer alle palltyper.", variants: [{ name: "Standard 3m seksjon", price: "4500", stock: "85", delivery: "1-2 uker" }, { name: "Standard 6m seksjon", price: "7200", stock: "", delivery: "3-6 uker" }], discounts: [{ min_quantity: "50", price: "3800" }], extra_info: "Pulverlakkert stål. Justerbare bjelker.", updated_at: "" },
  { category: "Småvarereoler", category_type: "produkt", description: "Høykvalitets hyllereol i galvanisert stål. Justerbare hyller med 25mm deling. Enkel montering uten verktøy.", variants: [{ name: "600mm bred", price: "1500", stock: "", delivery: "1-2 uker" }, { name: "900mm bred", price: "2500", stock: "", delivery: "1-2 uker" }, { name: "1200mm bred", price: "4000", stock: "", delivery: "1-2 uker" }], discounts: [], extra_info: "", updated_at: "" },
  { category: "Mesanin", category_type: "produkt", description: "Doble gulvarealet ved å utnytte takhøyden. Bæreevne 250-1000 kg/m². Leveres med trapp, rekkverk og sikkerhetsutstyr.", variants: [{ name: "Pris etter prosjekt", price: "", stock: "", delivery: "4-8 uker" }], discounts: [], extra_info: "Kan kombineres med reoler. Skreddersydd til lokalet.", updated_at: "" },
  { category: "Grenreoler", category_type: "produkt", description: "Konsolreoler for lange og tunge varer som rør, stenger, plater og trelast.", variants: [{ name: "Ensidig", price: "4990", stock: "", delivery: "3-6 uker" }, { name: "Dobbeltsidig", price: "6990", stock: "", delivery: "3-6 uker" }], discounts: [], extra_info: "For langgods og plater.", updated_at: "" },
  { category: "Universalreoler", category_type: "produkt", description: "Allsidig stålreol for de fleste formål. Robust og fleksibel med justerbare hylleplan.", variants: [{ name: "Standard seksjon", price: "1990", stock: "", delivery: "1-2 uker" }], discounts: [{ min_quantity: "10", price: "1790" }], extra_info: "", updated_at: "" },
  { category: "Spesialreoler (dekk, båt, trelast)", category_type: "produkt", description: "Dekkreoler, trelastreoler, båtreoler og andre spesialløsninger for lagring.", variants: [{ name: "Dekkreol", price: "2490", stock: "", delivery: "1-2 uker" }, { name: "Trelastreol", price: "3990", stock: "", delivery: "3-6 uker" }, { name: "Båtreol", price: "4990", stock: "", delivery: "4-8 uker" }], discounts: [], extra_info: "Optimert for bilverksteder og dekkhoteller.", updated_at: "" },
  { category: "Gondoler & Veggsystemer", category_type: "produkt", description: "Enkel- og dobbeltsidig med justerbare hyller. Grunnsystem utviklet etter svensk byggestandard.", variants: [{ name: "Enkeltsidig seksjon", price: "3000", stock: "", delivery: "3-6 uker" }, { name: "Dobbeltsidig seksjon", price: "4500", stock: "", delivery: "3-6 uker" }], discounts: [], extra_info: "Mange tilbehør: kroker, hyller, kurver.", updated_at: "" },
  { category: "Disker", category_type: "produkt", description: "Robust, modulbasert disksystem fra Sverige. Standardfarger front: hvit, svart, grå. Kan leveres med skranketopp, skuffer, hyller, dører, LED-belysning.", variants: [{ name: "Pris etter mål og utførelse", price: "", stock: "", delivery: "6-8 uker" }], discounts: [], extra_info: "Laminat eller ståloverflate. Tilpasset din kassaløsning.", updated_at: "" },
  { category: "Butikktilbehør", category_type: "produkt", description: "Tilbehør og detaljinnredning for butikk. Prislistholdere, kroker, spydskinner og endedisplayer.", variants: [], discounts: [], extra_info: "", updated_at: "" },
  { category: "Arbeidsbord", category_type: "produkt", description: "Arbeidsplasser tilpasset ditt behov. Manuelt justerbare, elektrisk hev/senk, pakkebord og rullebord.", variants: [{ name: "Manuelt hev/senk", price: "4000", stock: "", delivery: "2-4 uker" }, { name: "Elektrisk hev/senk", price: "7500", stock: "", delivery: "2-4 uker" }, { name: "Pakkebord", price: "5500", stock: "", delivery: "2-4 uker" }], discounts: [], extra_info: "", updated_at: "" },
  { category: "Verktøyskap", category_type: "produkt", description: "Industrielle skap for oppbevaring av verktøy og deler. Skuffer med kulelagerføring.", variants: [{ name: "Standard skap", price: "2990", stock: "", delivery: "2-4 uker" }, { name: "Bredt skap", price: "3990", stock: "", delivery: "2-4 uker" }], discounts: [], extra_info: "", updated_at: "" },
  { category: "Transport & Løfteutstyr", category_type: "produkt", description: "Trucker, rullebord, transportvogner og løfteutstyr for lager og produksjon.", variants: [], discounts: [], extra_info: "", updated_at: "" },
  { category: "Miljøsikring", category_type: "produkt", description: "Oppsamlingskar, miljøstasjoner og spill-containere for trygg håndtering av farlige stoffer.", variants: [], discounts: [], extra_info: "", updated_at: "" },
  { category: "Kontormøbler", category_type: "produkt", description: "Skrivebord (hev/senk og faste), kontorstol, besøksstoler, oppbevaringsskap og arkivløsninger.", variants: [{ name: "Hev/senk skrivebord", price: "3990", stock: "", delivery: "1-2 uker" }, { name: "Kontorstol", price: "2490", stock: "", delivery: "1-2 uker" }], discounts: [], extra_info: "", updated_at: "" },
  { category: "Garderobeskap", category_type: "produkt", description: "Velg dørtype, materialer, farger, ventilasjon og lås. Ståldør, laminat, kryssfiner eller galvanisert stål.", variants: [{ name: "1-roms skap", price: "2500", stock: "begrenset", delivery: "4-6 uker" }, { name: "Z-skap", price: "3200", stock: "", delivery: "4-6 uker" }], discounts: [], extra_info: "", updated_at: "" },
  { category: "Skole & Barnehage", category_type: "produkt", description: "Stoler, pulter, bord, benker, tavler, elevskap for skole. Barnestoler, bord, åpen innredning, madrasser, stellebord for barnehage.", variants: [], discounts: [], extra_info: "", updated_at: "" },
  { category: "HMS Sikkerhetskontroll", category_type: "tjeneste", description: "Lovpålagt kontroll av pallreoler og lagerinnredning. Visuell inspeksjon, skaderapport med grønn/gul/rød merking.", variants: [], discounts: [], extra_info: "Fra 2.500 kr per inspeksjon. Vi dekker hele Østlandet.", updated_at: "" },
  { category: "Levering & Montering", category_type: "tjeneste", description: "Vi leverer over hele Norge. Lagerførte varer: 1-2 uker. Bestillingsvarer: 3-6 uker. Spesialtilpasset: 4-8 uker. Inkluderer prosjektering, levering og profesjonell montering.", variants: [], discounts: [], extra_info: "Frakt beregnes ut fra volum og distanse. Gratis befaring.", updated_at: "" },
  { category: "Prosjektering", category_type: "tjeneste", description: "Komplett prosjektering fra idé til ferdig sluttprodukt. Behovsanalyse, rådgivning, 3D-tegning og visualisering.", variants: [], discounts: [], extra_info: "Ta kontakt for uforpliktende prosjekteringsmøte.", updated_at: "" },
  { category: "Bruktsalg", category_type: "salg", description: "Brukte pallreoler og innredning i god stand. Varierende utvalg.", variants: [{ name: "Brukte pallreoler", price: "fra 2000", stock: "varierer", delivery: "straks" }], discounts: [], extra_info: "Utvalget varierer. Ring 333 65 580 for å høre hva vi har inne.", updated_at: "" },
  { category: "Om oss", category_type: "bedriftsinfo", description: "Reol-Consult AS ble etablert i november 1984. Vi holder til på Vear i Tønsberg med 350 kvm utstilling. Østlandets største leverandør innen butikk-, lager-, verksted-, kontor-, arkiv- og garderobeinnredning.", variants: [], discounts: [], extra_info: "", updated_at: "" },
  { category: "Åpningstider", category_type: "bedriftsinfo", description: "Mandag-fredag: 08:00-16:00. Besøk etter avtale. Ring 333 65 580.", variants: [], discounts: [], extra_info: "", updated_at: "" },
  { category: "Kontaktinfo", category_type: "bedriftsinfo", description: "Sentralbord: 333 65 580\nAgnete H. Bechmann: 450 07 322\nTore Aas-Kristiansen: 982 04 323\nE-post: mail@reolconsult.no\nBesøksadresse: Smiløkka 7, 3173 Vear", variants: [], discounts: [], extra_info: "", updated_at: "" },
  { category: "Utstilling/Showroom", category_type: "bedriftsinfo", description: "350 kvm showroom på Smiløkka 7, Vear. Se og ta på produktene. Ring for avtale.", variants: [], discounts: [], extra_info: "", updated_at: "" },
];

const CATEGORY_GROUPS = [
  { label: "PRODUKTER", items: ["Pallreoler", "Småvarereoler", "Mesanin", "Grenreoler", "Universalreoler", "Spesialreoler (dekk, båt, trelast)", "Gondoler & Veggsystemer", "Disker", "Butikktilbehør", "Arbeidsbord", "Verktøyskap", "Transport & Løfteutstyr", "Miljøsikring", "Kontormøbler", "Garderobeskap", "Skole & Barnehage"] },
  { label: "TJENESTER", items: ["HMS Sikkerhetskontroll", "Levering & Montering", "Prosjektering"] },
  { label: "SALG", items: ["Bruktsalg"] },
  { label: "BEDRIFTSINFO", items: ["Om oss", "Åpningstider", "Kontaktinfo", "Utstilling/Showroom"] },
];

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeItem, setActiveItem] = useState<SidebarItem>("dokumenter");

  // Ekstra info: accordion open category (null = all closed)
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // Knowledge categories
  const [categories, setCategories] = useState<Category[]>(() =>
    DEFAULTS.map((d) => ({ ...d, id: null }))
  );

  // Form state — tracks the currently open accordion item
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [extraInfo, setExtraInfo] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const hasFetched = useRef(false);

  // Documents
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Database migration state
  const [needsMigration, setNeedsMigration] = useState(false);

  // Chatbot test
  const [testMessage, setTestMessage] = useState("");
  const [testMessages, setTestMessages] = useState<{ role: "user" | "bot"; text: string; followUps?: string[] }[]>([]);
  const [docContents, setDocContents] = useState<{ title: string; content: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeCat = openCategory ? categories.find((c) => c.category === openCategory) ?? null : null;

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch knowledge
  useEffect(() => {
    if (!user || hasFetched.current) return;
    hasFetched.current = true;
    (async () => {
      try {
        const { data, error } = await supabase.from("chatbot_knowledge").select("*");
        if (error || !data || data.length === 0) {
          setNeedsMigration(true);
          return;
        }
        // Detect old schema: has 'content' column but no 'category' column
        if (!data[0].category) {
          setNeedsMigration(true);
          return;
        }
        // New schema — merge DB data into defaults
        setNeedsMigration(false);
        setCategories((prev) =>
          prev.map((local) => {
            const db = data.find((d: Record<string, unknown>) => d.category === local.category);
            if (db) {
              return {
                id: db.id as string,
                category: db.category as string,
                category_type: db.category_type as Category["category_type"],
                description: (db.description as string) ?? local.description,
                variants: Array.isArray(db.variants) ? (db.variants as Variant[]) : local.variants,
                discounts: Array.isArray(db.discounts) ? (db.discounts as Discount[]) : local.discounts,
                extra_info: (db.extra_info as string) ?? local.extra_info,
                updated_at: (db.updated_at as string) ?? "",
              };
            }
            return local;
          })
        );
      } catch {
        setNeedsMigration(true);
      }
    })();
  }, [user]);

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("chatbot_documents")
        .select("id, filename, file_type, category, uploaded_at, uploaded_by")
        .order("uploaded_at", { ascending: false });
      if (!error && data) {
        setDocuments(data as Document[]);
      }
      // Table doesn't exist error is handled silently
    } catch { /* ignore — table may not exist yet */ }
  }, []);

  useEffect(() => {
    if (user) fetchDocuments();
  }, [user, fetchDocuments]);

  // Populate form when accordion opens a category
  useEffect(() => {
    if (!openCategory) return;
    const cat = categories.find((c) => c.category === openCategory);
    if (cat) {
      setDescription(cat.description);
      setVariants([...cat.variants]);
      setDiscounts([...cat.discounts]);
      setExtraInfo(cat.extra_info);
    }
  }, [openCategory, categories]);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [testMessages]);

  // Save category
  async function saveCategory() {
    if (!activeCat) return;
    if (needsMigration) {
      alert("Databasen er ikke satt opp ennå. Kjør migrasjon-SQL i Supabase SQL Editor først (se varsel øverst).");
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();
    const payload = {
      category: activeCat.category,
      category_type: activeCat.category_type,
      description,
      variants,
      discounts,
      extra_info: extraInfo,
      updated_at: now,
    };
    let success = false;
    if (activeCat.id) {
      const { error } = await supabase.from("chatbot_knowledge").update(payload).eq("id", activeCat.id);
      success = !error;
    } else {
      const { data, error } = await supabase.from("chatbot_knowledge").insert(payload).select("id").single();
      if (!error && data) {
        success = true;
        setCategories((prev) => prev.map((c) => c.category === activeCat.category ? { ...c, id: data.id } : c));
      }
    }
    if (success) {
      setCategories((prev) =>
        prev.map((c) =>
          c.category === activeCat.category
            ? { ...c, description, variants, discounts, extra_info: extraInfo, updated_at: now }
            : c
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  // Upload
  async function uploadFile(file: File, sectionKey: string) {
    setUploading(sectionKey);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", sectionKey);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        await fetchDocuments();
      } else {
        alert(result.error || "Opplasting feilet");
      }
    } catch {
      alert("Opplasting feilet");
    }
    setUploading(null);
  }

  // Delete document
  async function deleteDocument(id: string) {
    const { error } = await supabase.from("chatbot_documents").delete().eq("id", id);
    if (!error) setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  // Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError("Feil e-post eller passord");
    setLoggingIn(false);
  }

  // Variant helpers
  function addVariant() { setVariants([...variants, { name: "", price: "", stock: "", delivery: "" }]); }
  function removeVariant(i: number) { setVariants(variants.filter((_, idx) => idx !== i)); }
  function updateVariant(i: number, field: keyof Variant, value: string) { setVariants(variants.map((v, idx) => idx === i ? { ...v, [field]: value } : v)); }

  // Discount helpers
  function addDiscount() { setDiscounts([...discounts, { min_quantity: "", price: "" }]); }
  function removeDiscount(i: number) { setDiscounts(discounts.filter((_, idx) => idx !== i)); }
  function updateDiscount(i: number, field: keyof Discount, value: string) { setDiscounts(discounts.map((d, idx) => idx === i ? { ...d, [field]: value } : d)); }

  // Drop handler
  function handleDrop(e: React.DragEvent, sectionKey: string) {
    e.preventDefault();
    setDragOverSection(null);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file, sectionKey);
  }

  // Fetch document contents for chatbot search
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase.from("chatbot_documents").select("filename, content");
        if (data) {
          setDocContents(
            data.filter((d: Record<string, unknown>) => d.content).map((d: Record<string, unknown>) => ({ title: d.filename as string, content: d.content as string }))
          );
        }
      } catch { /* ignore */ }
    })();
  }, [user, documents]);

  // Stopwords for keyword extraction
  const STOPWORDS = new Set([
    "hva", "kan", "du", "jeg", "er", "det", "på", "til", "og", "i",
    "for", "med", "en", "et", "den", "har", "vil", "skal", "om", "av",
    "fra", "som", "seg", "dere", "vi", "de", "dem", "sin", "sitt",
    "så", "men", "eller", "at", "når", "da", "bare", "også", "meg",
    "noe", "noen", "alle", "dette", "denne", "disse", "ikke", "nei",
    "ja", "litt", "veldig", "mer", "mest", "mange", "mye",
    "hvor", "hvordan", "hvorfor", "hvilken", "hvilket", "hvilke",
    "trenger", "ville", "skulle", "kunne", "måtte",
    "what", "can", "you", "the", "is", "it", "to", "and", "in",
    "for", "with", "this", "that", "have", "has", "will", "about",
    "how", "where", "why", "which", "are", "was", "were", "a", "an",
    "do", "does", "did", "your", "my", "our",
  ]);

  function extractWords(text: string): string[] {
    return text.toLowerCase().replace(/[?!.,;:()"/\\]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w));
  }

  function findBestMatch(input: string): { text: string; followUps: string[] } {
    const words = extractWords(input);
    if (words.length === 0) {
      return { text: "Skriv et spørsmål, f.eks. «pallreoler», «levering», «priser» eller «kontaktinfo».", followUps: ["Produkter", "Kontaktinfo", "Levering", "Bruktsalg"] };
    }
    let bestCat: Category | null = null;
    let bestScore = 0;
    for (const cat of categories) {
      let score = 0;
      const catWords = extractWords(cat.category + " " + cat.description + " " + cat.extra_info);
      for (const word of words) {
        if (cat.category.toLowerCase().includes(word)) score += 5;
        for (const cw of catWords) {
          if (word === cw || (word.length >= 4 && cw.startsWith(word)) || (word.length >= 4 && word.startsWith(cw))) { score += 1; break; }
        }
      }
      for (const v of cat.variants) {
        if (words.some((w) => v.name.toLowerCase().includes(w))) score += 2;
      }
      if (score > bestScore) { bestScore = score; bestCat = cat; }
    }
    let bestDocMatch: { title: string; snippet: string } | null = null;
    let bestDocScore = 0;
    for (const doc of docContents) {
      const docWords = extractWords(doc.content);
      let score = 0;
      for (const word of words) {
        for (const dw of docWords) {
          if (word === dw || (word.length >= 4 && dw.startsWith(word)) || (word.length >= 4 && word.startsWith(dw))) { score += 1; break; }
        }
      }
      if (score > bestDocScore) {
        bestDocScore = score;
        const lines = doc.content.split("\n").filter((l) => l.trim());
        const matchingLine = lines.find((l) => words.some((w) => l.toLowerCase().includes(w)));
        const idx = matchingLine ? lines.indexOf(matchingLine) : 0;
        bestDocMatch = { title: doc.title, snippet: lines.slice(Math.max(0, idx - 1), idx + 4).join("\n").trim() };
      }
    }
    if (bestCat && bestScore >= 2) {
      let r = `**${bestCat.category}**\n\n${bestCat.description}`;
      if (bestCat.variants.length > 0) { r += "\n\n**Varianter:**"; for (const v of bestCat.variants) { r += `\n• ${v.name}`; if (v.price) r += ` — ${v.price} kr`; if (v.stock) r += ` (${v.stock})`; if (v.delivery) r += ` [${v.delivery}]`; } }
      if (bestCat.discounts.length > 0) { r += "\n\n**Mengderabatt:**"; for (const d of bestCat.discounts) r += `\n• Over ${d.min_quantity} stk: ${d.price} kr/stk`; }
      if (bestCat.extra_info) r += `\n\n${bestCat.extra_info}`;
      if (bestDocMatch && bestDocScore >= 2) r += `\n\n📄 Fra «${bestDocMatch.title}»:\n${bestDocMatch.snippet}`;
      r += "\n\n📞 Kontakt oss på 333 65 580 for eksakt tilbud!";
      const f: string[] = bestCat.category_type === "produkt" ? ["Priser", "Levering", "Kontakt"] : bestCat.category_type === "tjeneste" ? ["Bestille", "Kontakt"] : ["Produkter", "Kontakt"];
      return { text: r, followUps: f };
    }
    if (bestDocMatch && bestDocScore >= 2) {
      return { text: `📄 Fra «${bestDocMatch.title}»:\n\n${bestDocMatch.snippet}\n\n📞 Kontakt oss på 333 65 580 for mer info!`, followUps: ["Produkter", "Kontakt", "Bruktsalg"] };
    }
    return { text: "Beklager, jeg fant ikke noe relevant svar. Prøv f.eks. «pallreoler», «garderobeskap» eller «åpningstider».\n\n📞 Ring 333 65 580 eller mail@reolconsult.no.", followUps: ["Produkter", "Kontaktinfo", "Levering", "Bruktsalg"] };
  }

  function sendTestMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!testMessage.trim()) return;
    const msg = testMessage.trim();
    setTestMessages((prev) => [...prev, { role: "user", text: msg }]);
    setTestMessage("");
    setTimeout(() => { const r = findBestMatch(msg); setTestMessages((prev) => [...prev, { role: "bot", text: r.text, followUps: r.followUps }]); }, 400);
  }

  function handleQuickReply(label: string) {
    setTestMessages((prev) => [...prev, { role: "user", text: label }]);
    setTimeout(() => { const r = findBestMatch(label); setTestMessages((prev) => [...prev, { role: "bot", text: r.text, followUps: r.followUps }]); }, 400);
  }

  // Accordion toggle
  function toggleCategory(name: string) {
    setOpenCategory((prev) => prev === name ? null : name);
  }

  // Loading
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dc2626] border-t-transparent" />
      </div>
    );
  }

  // Login
  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa]">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <h1 className="text-2xl font-bold text-[#171717]">Admin</h1>
          <p className="mt-1 text-sm text-[#737373]">Logg inn for å administrere</p>
          {loginError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{loginError}</p>}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-post" required className="mt-6 w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-3 text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passord" required className="mt-3 w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-3 text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
          <button type="submit" disabled={loggingIn} className="mt-6 w-full rounded-full bg-[#dc2626] py-3.5 font-semibold text-white transition-colors hover:bg-[#b91c1c] disabled:opacity-50">
            {loggingIn ? "Logger inn..." : "Logg inn"}
          </button>
        </form>
      </div>
    );
  }

  // Stats
  const filledCategories = categories.filter((c) => c.id !== null).length;
  const latestUpdate = categories
    .filter((c) => c.updated_at)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#fafafa]">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <h1 className="text-lg font-bold text-[#171717]">Reolconsult Admin</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-600">Lagret!</span>}
          {activeItem === "ekstra-info" && openCategory && (
            <button onClick={saveCategory} disabled={saving} className="rounded-full bg-[#dc2626] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b91c1c] disabled:opacity-50">
              {saving ? "Lagrer..." : "Lagre"}
            </button>
          )}
          <button onClick={() => supabase.auth.signOut()} className="rounded-full border border-[#e5e5e5] px-4 py-2 text-sm text-[#737373] transition-colors hover:bg-[#f5f5f5]">
            Logg ut
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[220px] shrink-0 border-r border-[#e5e5e5] bg-[#fafafa] p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = item.key === activeItem;
            return (
              <button
                key={item.key}
                onClick={() => setActiveItem(item.key)}
                className={`flex h-10 w-full cursor-pointer items-center rounded-lg px-3 text-[14px] transition-all ${
                  isActive ? "bg-[#dc2626] font-medium text-white shadow-sm" : "text-[#404040] hover:bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Migration notice */}
          {needsMigration && (
            <div className="border-b border-blue-200 bg-blue-50 px-6 py-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-blue-500">&#9432;</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Gammel databasestruktur</p>
                  <p className="mt-0.5 text-xs text-blue-700">
                    Chatboten fungerer, men bruker enkel tekstformat. For å aktivere redigering av kategorier, kjør migrasjon-SQL i{" "}
                    <a href="https://supabase.com/dashboard/project/pwkdqyczahdlsragcoep/sql/new" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-blue-900">
                      Supabase SQL Editor
                    </a>.
                  </p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-medium text-amber-700 hover:text-amber-900">Vis SQL</summary>
                    <div className="mt-2 relative">
                      <pre className="max-h-[200px] overflow-auto rounded-lg bg-amber-100/50 p-3 text-[11px] text-amber-900 font-mono leading-relaxed">{`-- Kjør dette i Supabase SQL Editor
DROP TABLE IF EXISTS chatbot_knowledge CASCADE;
DROP TABLE IF EXISTS chatbot_documents CASCADE;

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

ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON chatbot_knowledge FOR SELECT USING (true);
CREATE POLICY "Allow auth insert" ON chatbot_knowledge FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON chatbot_knowledge FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON chatbot_knowledge FOR DELETE USING (auth.role() = 'authenticated');

CREATE TABLE chatbot_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  file_type text NOT NULL DEFAULT 'txt',
  category text NOT NULL DEFAULT 'produkt',
  content text DEFAULT '',
  uploaded_at timestamptz DEFAULT now(),
  uploaded_by text DEFAULT ''
);

ALTER TABLE chatbot_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read docs" ON chatbot_documents FOR SELECT USING (true);
CREATE POLICY "Allow auth insert docs" ON chatbot_documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update docs" ON chatbot_documents FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete docs" ON chatbot_documents FOR DELETE USING (auth.role() = 'authenticated');`}</pre>
                      <button
                        onClick={(e) => {
                          const pre = (e.target as HTMLElement).closest(".relative")?.querySelector("pre");
                          if (pre) navigator.clipboard.writeText(pre.textContent || "");
                        }}
                        className="absolute top-2 right-2 rounded bg-amber-200 px-2 py-1 text-[10px] font-medium text-amber-800 hover:bg-amber-300"
                      >
                        Kopier
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] text-amber-600">Etter å ha kjørt SQL, last siden på nytt.</p>
                  </details>
                </div>
              </div>
            </div>
          )}

          {/* ─── DOKUMENTER (compact) ─── */}
          {activeItem === "dokumenter" && (
            <div className="p-6 lg:p-8">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-2xl font-bold text-[#171717]">Dokumenter</h2>
                <p className="mt-1 text-sm text-[#a3a3a3]">Last opp dokumenter som chatboten bruker for å svare kunder</p>

                <div className="mt-6 space-y-5">
                  {DOC_SECTIONS.map((section) => {
                    const sectionDocs = documents.filter((d) => d.category === section.key);
                    const isDragOver = dragOverSection === section.key;
                    const isUploading = uploading === section.key;

                    return (
                      <div key={section.key}>
                        <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#a3a3a3]">
                          {section.label} <span className="font-normal">({sectionDocs.length} {sectionDocs.length === 1 ? "dokument" : "dokumenter"})</span>
                        </h3>

                        {/* Compact drop zone */}
                        <div
                          onDragOver={(e) => { e.preventDefault(); setDragOverSection(section.key); }}
                          onDragLeave={() => setDragOverSection(null)}
                          onDrop={(e) => handleDrop(e, section.key)}
                          className={`flex h-[52px] items-center gap-3 rounded-lg border-2 border-dashed px-4 transition-colors ${
                            isDragOver ? "border-[#3b82f6] bg-blue-50/50" : "border-[#d4d4d4] bg-[#fafafa] hover:border-[#a3a3a3]"
                          }`}
                        >
                          <svg className="h-4 w-4 shrink-0 text-[#a3a3a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                          </svg>
                          <p className="flex-1 text-sm text-[#737373]">
                            {isUploading ? "Laster opp..." : "Dra og slipp fil, eller"}
                          </p>
                          <button
                            onClick={() => fileInputRefs.current[section.key]?.click()}
                            className="shrink-0 rounded-lg border border-[#e5e5e5] bg-white px-3 py-1.5 text-xs font-medium text-[#404040] transition-colors hover:bg-[#f5f5f5]"
                          >
                            Velg fil
                          </button>
                          <input
                            ref={(el) => { fileInputRefs.current[section.key] = el; }}
                            type="file"
                            accept=".pdf,.docx,.txt,.xlsx,.csv"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) uploadFile(file, section.key);
                              e.target.value = "";
                            }}
                          />
                        </div>

                        {/* File list */}
                        {sectionDocs.length > 0 ? (
                          <div className="mt-1.5 space-y-1">
                            {sectionDocs.map((doc) => (
                              <div key={doc.id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 border border-[#f0f0f0]">
                                <svg className="h-4 w-4 shrink-0 text-[#a3a3a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <p className="flex-1 truncate text-sm text-[#404040]">{doc.filename}</p>
                                <span className="shrink-0 text-[11px] text-[#a3a3a3]">
                                  {new Date(doc.uploaded_at).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}
                                </span>
                                <button onClick={() => deleteDocument(doc.id)} className="shrink-0 rounded p-1 text-[#dc2626]/30 transition-colors hover:bg-red-50 hover:text-[#dc2626]" title="Slett">
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1.5 px-1 text-[11px] text-[#c0c0c0]">Ingen dokumenter ennå</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── EKSTRA INFO (accordion) ─── */}
          {activeItem === "ekstra-info" && (
            <div className="p-6 lg:p-8">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-2xl font-bold text-[#171717]">Ekstra info</h2>
                <p className="mt-1 text-sm text-[#a3a3a3]">Rediger informasjon som chatboten bruker for å svare kunder</p>

                <div className="mt-6 space-y-6">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b0b0b0]">
                        {group.label}
                      </p>
                      <div className="space-y-1">
                        {group.items.map((name) => {
                          const cat = categories.find((c) => c.category === name);
                          const isOpen = openCategory === name;
                          const hasData = cat?.id !== null;

                          return (
                            <div key={name} className="rounded-lg border border-[#e5e5e5] bg-white overflow-hidden">
                              {/* Accordion header */}
                              <button
                                onClick={() => toggleCategory(name)}
                                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[#fafafa]"
                              >
                                <div className="flex items-center gap-2">
                                  <svg className={`h-3.5 w-3.5 text-[#a3a3a3] transition-transform ${isOpen ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                  </svg>
                                  <span className="text-[13px] font-medium text-[#171717]">{name}</span>
                                </div>
                                <span className={`text-[11px] font-medium ${hasData ? "text-emerald-500" : "text-[#c0c0c0]"}`}>
                                  {hasData ? "Har data" : "Mangler data"}
                                </span>
                              </button>

                              {/* Accordion content */}
                              {isOpen && cat && (
                                <div className="border-t border-[#f0f0f0] px-4 py-4 space-y-4">
                                  {/* Description */}
                                  <div>
                                    <label className="mb-1 block text-xs font-semibold text-[#737373] uppercase tracking-wide">Beskrivelse</label>
                                    <textarea
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value)}
                                      rows={cat.category_type === "bedriftsinfo" ? 6 : 2}
                                      className="w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 text-sm leading-relaxed text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20"
                                      placeholder="Skriv en beskrivelse..."
                                    />
                                  </div>

                                  {/* Variants */}
                                  {(cat.category_type === "produkt" || cat.category_type === "salg") && (
                                    <>
                                      {variants.length > 0 && (
                                        <div>
                                          <label className="mb-1 block text-xs font-semibold text-[#737373] uppercase tracking-wide">Varianter</label>
                                          <div className="overflow-x-auto rounded-lg border border-[#e5e5e5] bg-white">
                                            <table className="w-full">
                                              <thead>
                                                <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                                                  <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Variant</th>
                                                  <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Pris</th>
                                                  <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Lager</th>
                                                  <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Levering</th>
                                                  <th className="w-8 px-1 py-1.5" />
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {variants.map((v, i) => (
                                                  <tr key={i} className="border-t border-[#f0f0f0]">
                                                    <td className="px-2 py-1"><input value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#e5e5e5] focus:border-[#dc2626] focus:bg-white focus:outline-none" placeholder="Navn" /></td>
                                                    <td className="px-2 py-1"><input value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#e5e5e5] focus:border-[#dc2626] focus:bg-white focus:outline-none" placeholder="—" /></td>
                                                    <td className="px-2 py-1"><input value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#e5e5e5] focus:border-[#dc2626] focus:bg-white focus:outline-none" placeholder="—" /></td>
                                                    <td className="px-2 py-1"><input value={v.delivery} onChange={(e) => updateVariant(i, "delivery", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#e5e5e5] focus:border-[#dc2626] focus:bg-white focus:outline-none" placeholder="—" /></td>
                                                    <td className="px-1 py-1 text-center">
                                                      <button onClick={() => removeVariant(i)} className="rounded p-1 text-[#dc2626]/30 transition-colors hover:bg-red-50 hover:text-[#dc2626]" title="Fjern"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      )}
                                      <button onClick={addVariant} className="rounded-lg border border-dashed border-[#d4d4d4] px-3 py-1.5 text-[12px] font-medium text-[#737373] transition-colors hover:border-[#dc2626] hover:text-[#dc2626]">
                                        + Legg til variant
                                      </button>

                                      {/* Discounts */}
                                      {discounts.length > 0 && (
                                        <div>
                                          <label className="mb-1 block text-xs font-semibold text-[#737373] uppercase tracking-wide">Mengderabatt</label>
                                          <div className="overflow-x-auto rounded-lg border border-[#e5e5e5] bg-white">
                                            <table className="w-full">
                                              <thead>
                                                <tr className="border-b border-[#e5e5e5] bg-[#fafafa]">
                                                  <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Over antall</th>
                                                  <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Pris per stk</th>
                                                  <th className="w-8 px-1 py-1.5" />
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {discounts.map((d, i) => (
                                                  <tr key={i} className="border-t border-[#f0f0f0]">
                                                    <td className="px-2 py-1"><input value={d.min_quantity} onChange={(e) => updateDiscount(i, "min_quantity", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#e5e5e5] focus:border-[#dc2626] focus:bg-white focus:outline-none" placeholder="0" /></td>
                                                    <td className="px-2 py-1"><input value={d.price} onChange={(e) => updateDiscount(i, "price", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#e5e5e5] focus:border-[#dc2626] focus:bg-white focus:outline-none" placeholder="0" /></td>
                                                    <td className="px-1 py-1 text-center">
                                                      <button onClick={() => removeDiscount(i)} className="rounded p-1 text-[#dc2626]/30 transition-colors hover:bg-red-50 hover:text-[#dc2626]" title="Fjern"><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      )}
                                      <button onClick={addDiscount} className="rounded-lg border border-dashed border-[#d4d4d4] px-3 py-1.5 text-[12px] font-medium text-[#737373] transition-colors hover:border-[#dc2626] hover:text-[#dc2626]">
                                        + Legg til rabatt
                                      </button>
                                    </>
                                  )}

                                  {/* Extra info */}
                                  {cat.category_type !== "bedriftsinfo" && (
                                    <div>
                                      <label className="mb-1 block text-xs font-semibold text-[#737373] uppercase tracking-wide">
                                        {cat.category_type === "tjeneste" ? "Priser/Info" : "Ekstra info"}
                                      </label>
                                      <textarea
                                        value={extraInfo}
                                        onChange={(e) => setExtraInfo(e.target.value)}
                                        rows={2}
                                        className="w-full rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 text-sm leading-relaxed text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#dc2626] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20"
                                        placeholder={cat.category_type === "tjeneste" ? "F.eks. priser, betingelser..." : "Tilleggsinformasjon..."}
                                      />
                                    </div>
                                  )}

                                  {cat.updated_at && (
                                    <p className="text-[11px] text-[#a3a3a3]">
                                      Sist oppdatert: {new Date(cat.updated_at).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" })}{" "}
                                      kl. {new Date(cat.updated_at).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                  )}

                                  <div className="flex justify-end pt-1">
                                    <button onClick={saveCategory} disabled={saving} className="rounded-full bg-[#dc2626] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b91c1c] disabled:opacity-50">
                                      {saving ? "Lagrer..." : "Lagre"}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── STATISTIKK ─── */}
          {activeItem === "statistikk" && (
            <div className="p-8 lg:p-12">
              <div className="mx-auto max-w-3xl">
                <h2 className="text-2xl font-bold text-[#171717]">Statistikk</h2>
                <p className="mt-1 text-sm text-[#a3a3a3]">Oversikt over kunnskapsbasen</p>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
                    <p className="text-3xl font-bold text-[#171717]">{documents.length}</p>
                    <p className="mt-1 text-sm text-[#737373]">Dokumenter lastet opp</p>
                  </div>
                  <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
                    <p className="text-3xl font-bold text-[#171717]">{needsMigration ? "1" : filledCategories}</p>
                    <p className="mt-1 text-sm text-[#737373]">Kategorier i database{needsMigration ? " (tekstformat)" : ""}</p>
                  </div>
                  <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
                    <p className="text-3xl font-bold text-[#171717]">24</p>
                    <p className="mt-1 text-sm text-[#737373]">Totalt kategorier</p>
                  </div>
                </div>
                {latestUpdate?.updated_at && (
                  <p className="mt-6 text-sm text-[#a3a3a3]">
                    Siste oppdatering: {new Date(latestUpdate.updated_at).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}{" "}
                    kl. {new Date(latestUpdate.updated_at).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ─── CHATBOT ─── */}
          {activeItem === "chatbot" && (
            <div className="p-8 lg:p-12">
              <div className="mx-auto max-w-2xl">
                <h2 className="text-2xl font-bold text-[#171717]">Test chatbot</h2>
                <p className="mt-1 text-sm text-[#a3a3a3]">
                  Test at chatboten finner riktig informasjon.
                  Søker i {categories.length} kategorier og {docContents.length} dokumenter.
                </p>
                <div className="mt-8 flex h-[600px] flex-col rounded-2xl border border-[#e5e5e5] bg-white">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {testMessages.length === 0 && (
                      <div className="pt-6 text-center">
                        <p className="text-sm text-[#a3a3a3]">Skriv en melding for å teste chatboten</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                          {["Pallreoler", "Kontaktinfo", "Levering", "Bruktsalg", "Garderobeskap", "Åpningstider"].map((q) => (
                            <button key={q} onClick={() => handleQuickReply(q)} className="rounded-full border border-[#e5e5e5] px-3 py-1.5 text-xs font-medium text-[#737373] transition-colors hover:border-[#dc2626] hover:text-[#dc2626]">{q}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    {testMessages.map((msg, i) => (
                      <div key={i}>
                        <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "rounded-br-md bg-[#dc2626] text-white" : "rounded-bl-md bg-[#f5f5f5] text-[#171717]"}`}>
                            {msg.text.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                              part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : <span key={j}>{part}</span>
                            )}
                          </div>
                        </div>
                        {msg.role === "bot" && msg.followUps && msg.followUps.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                            {msg.followUps.map((q) => (
                              <button key={q} onClick={() => handleQuickReply(q)} className="rounded-full border border-[#e5e5e5] px-3 py-1.5 text-xs font-medium text-[#737373] transition-colors hover:border-[#dc2626] hover:text-[#dc2626]">{q}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={sendTestMessage} className="border-t border-[#e5e5e5] p-4">
                    <div className="flex gap-2">
                      <input value={testMessage} onChange={(e) => setTestMessage(e.target.value)} placeholder="Skriv et spørsmål, f.eks. «pallreoler» eller «levering»..." className="flex-1 rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-2.5 text-sm text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#dc2626]/20" />
                      <button type="submit" className="rounded-xl bg-[#dc2626] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b91c1c]">Send</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ─── INNSTILLINGER ─── */}
          {activeItem === "innstillinger" && (
            <div className="p-8 lg:p-12">
              <div className="mx-auto max-w-2xl space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#171717]">Innstillinger</h2>
                  <p className="mt-1 text-sm text-[#a3a3a3]">Administrer konto og innstillinger</p>
                </div>
                <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
                  <h3 className="text-sm font-semibold text-[#171717]">Innlogget som</h3>
                  <p className="mt-2 text-sm text-[#737373]">{user.email}</p>
                </div>
                <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
                  <h3 className="text-sm font-semibold text-[#171717]">Bytt passord</h3>
                  <p className="mt-2 text-sm text-[#a3a3a3]">Kontakt administrator for å endre passord.</p>
                </div>
                <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
                  <h3 className="text-sm font-semibold text-[#171717]">Chatbot</h3>
                  <p className="mt-2 text-sm text-[#a3a3a3]">Chatboten er aktiv og synlig for alle besøkende.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
