"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Database,
  BarChart3,
  Bot,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Upload,
  Trash2,
  ChevronDown,
  Plus,
  LayoutTemplate,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  getCurrentSite,
  getSiteAccessForCurrentUser,
  type Site,
  type SiteRole,
  type SiteSettings,
} from "@/lib/site";
import { revalidatePublicSite } from "@/app/actions/revalidate";
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

type SidebarItem = "innstillinger" | "dokumenter" | "ekstra-info" | "statistikk" | "chatbot";

const SIDEBAR_ITEMS: { key: SidebarItem; label: string; icon: LucideIcon }[] = [
  { key: "innstillinger", label: "Innstillinger", icon: SettingsIcon },
  { key: "dokumenter", label: "Dokumenter", icon: FileText },
  { key: "ekstra-info", label: "Ekstra info", icon: Database },
  { key: "statistikk", label: "Statistikk", icon: BarChart3 },
  { key: "chatbot", label: "AI-assistent", icon: Bot },
];

const ITEM_SUBTITLES: Record<SidebarItem, string> = {
  innstillinger: "Kontaktinfo, åpningstider og sosiale medier",
  dokumenter: "Last opp dokumenter AI-assistenten bruker for å svare kunder",
  "ekstra-info": "Informasjon AI-assistenten bruker for å svare på pris og leveringstid",
  statistikk: "Oversikt over kunnskapsbasen",
  chatbot: "Test at AI-assistenten finner riktig informasjon",
};

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
  { category: "Bruktsalg", category_type: "salg", description: "Brukte pallreoler og innredning i god stand. Varierende utvalg.", variants: [{ name: "Brukte pallreoler", price: "fra 2000", stock: "varierer", delivery: "straks" }], discounts: [], extra_info: "Utvalget varierer. Ring 33 36 55 80 for å høre hva vi har inne.", updated_at: "" },
  { category: "Om oss", category_type: "bedriftsinfo", description: "Reol-Consult AS ble etablert i november 1984. Vi holder til på Vear i Tønsberg med 350 kvm utstilling. Vi leverer innredning til butikk, lager, verksted, kontor, arkiv og garderobe — fra første tegning til ferdig montert.", variants: [], discounts: [], extra_info: "", updated_at: "" },
  { category: "Åpningstider", category_type: "bedriftsinfo", description: "Mandag-fredag: 08:00-16:00. Besøk etter avtale. Ring 33 36 55 80.", variants: [], discounts: [], extra_info: "", updated_at: "" },
  { category: "Kontaktinfo", category_type: "bedriftsinfo", description: "Sentralbord: 33 36 55 80\nAgnete H. Bechmann: 450 07 322\nTore Aas-Kristiansen: 982 04 323\nE-post: mail@reolconsult.no\nBesøksadresse: Smiløkka 7, 3173 Vear", variants: [], discounts: [], extra_info: "", updated_at: "" },
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

  // ── Brukeradministrasjon ──
  type AdminBruker = {
    id: string; epost: string; opprettet: string;
    sistInnlogget: string | null; erDegSelv: boolean;
  };
  const [brukere, setBrukere] = useState<AdminBruker[]>([]);
  const [brukereLaster, setBrukereLaster] = useState(false);
  const [brukereFeil, setBrukereFeil] = useState<string | null>(null);
  const [visBrukerSkjema, setVisBrukerSkjema] = useState(false);
  const [nyEpost, setNyEpost] = useState("");
  const [nyPassord, setNyPassord] = useState("");
  const [oppretter, setOppretter] = useState(false);
  const [slettBekreft, setSlettBekreft] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeItem, setActiveItem] = useState<SidebarItem>("innstillinger");

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

  // Site-settings (innstillinger-fanen)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const settingsFetchedRef = useRef(false);

  // Chatbot test
  const [testMessage, setTestMessage] = useState("");
  const [testMessages, setTestMessages] = useState<{ role: "user" | "bot"; text: string; followUps?: string[] }[]>([]);
  const [docContents, setDocContents] = useState<{ title: string; content: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeCat = openCategory ? categories.find((c) => c.category === openCategory) ?? null : null;

  // Site- og tilgangskontekst
  const [site, setSite] = useState<Site | null>(null);
  const [siteRole, setSiteRole] = useState<SiteRole | null>(null);
  const [accessChecking, setAccessChecking] = useState(false);

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Tilbakestill tilgang når brukeren bytter
      if (!session?.user) {
        setSiteRole(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Sjekk site-tilgang når bruker logger inn
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setAccessChecking(true);
    (async () => {
      const currentSite = await getCurrentSite();
      if (cancelled) return;
      if (!currentSite) {
        setSite(null);
        setSiteRole(null);
        setAccessChecking(false);
        return;
      }
      setSite(currentSite);
      const access = await getSiteAccessForCurrentUser(currentSite.id);
      if (cancelled) return;
      setSiteRole(access.role);
      setAccessChecking(false);

      // Hent site_settings én gang når vi har site
      if (access.role && !settingsFetchedRef.current) {
        settingsFetchedRef.current = true;
        setSettingsLoading(true);
        const { data } = await supabase
          .from("site_settings")
          .select("*")
          .eq("site_id", currentSite.id)
          .maybeSingle();
        if (cancelled) return;
        if (data) {
          setSiteSettings({
            ...data,
            social: (data.social ?? {}) as Record<string, string>,
          } as SiteSettings);
        } else {
          // Ingen rad ennå — start med tom rad knyttet til site
          setSiteSettings({
            site_id: currentSite.id,
            phone: "",
            email_general: "",
            visit_address: "",
            postal_address: "",
            opening_hours: "",
            social: {},
            updated_at: "",
          });
        }
        setSettingsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

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
    if (!site) {
      alert("Fant ikke hvilken side dette gjelder — last siden på nytt.");
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();
    const payload = {
      // site_id er NOT NULL på chatbot_knowledge, og RLS-policyen er
      // WITH CHECK (has_site_access(site_id)). Uten den feilet opprettelsen
      // av en ny kategori — og feilen ble aldri vist.
      site_id: site.id,
      category: activeCat.category,
      category_type: activeCat.category_type,
      description,
      variants,
      discounts,
      extra_info: extraInfo,
      updated_at: now,
    };
    let success = false;
    let feil: string | null = null;
    if (activeCat.id) {
      const { error } = await supabase.from("chatbot_knowledge").update(payload).eq("id", activeCat.id);
      success = !error;
      feil = error?.message ?? null;
    } else {
      const { data, error } = await supabase.from("chatbot_knowledge").insert(payload).select("id").single();
      feil = error?.message ?? null;
      if (!error && data) {
        success = true;
        setCategories((prev) => prev.map((c) => c.category === activeCat.category ? { ...c, id: data.id } : c));
      }
    }
    // Uten denne gikk en mislykket lagring helt stille: ingen «Lagret!», ingen
    // feilmelding, bare en knapp som sluttet å spinne.
    if (!success) {
      alert("Kunne ikke lagre: " + (feil ?? "ukjent feil"));
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
      await revalidatePublicSite();
    }
    setSaving(false);
  }

  // Save site_settings (innstillinger-fanen)
  async function saveSiteSettings() {
    if (!siteSettings || !site) return;
    setSettingsSaving(true);
    const payload = {
      site_id: site.id,
      phone: siteSettings.phone,
      email_general: siteSettings.email_general,
      visit_address: siteSettings.visit_address,
      postal_address: siteSettings.postal_address,
      opening_hours: siteSettings.opening_hours,
      show_prices: siteSettings.show_prices ?? false,
      social: siteSettings.social ?? {},
    };
    let { error } = await supabase
      .from("site_settings")
      .upsert(payload, { onConflict: "site_id" });

    // show_prices-kolonnen krever en migrasjon. Er den ikke kjørt, skal det
    // ikke blokkere lagring av kontaktinfo og sosiale medier — vi prøver på
    // nytt uten feltet og varsler i stedet.
    if (error && /show_prices/.test(error.message)) {
      const { show_prices: _utelatt, ...utenPris } = payload;
      const p2 = await supabase
        .from("site_settings")
        .upsert(utenPris, { onConflict: "site_id" });
      error = p2.error;
      if (!error) {
        alert(
          "Lagret — men prisvisning ble ikke lagret.\n\n" +
            "Kolonnen show_prices mangler i databasen. Kjør migrasjonen i " +
            "Supabase → SQL Editor:\n\n" +
            "alter table site_settings\n" +
            "  add column if not exists show_prices boolean not null default false;",
        );
      }
    }

    if (!error) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
      await revalidatePublicSite();
    } else {
      alert("Kunne ikke lagre: " + error.message);
    }
    setSettingsSaving(false);
  }

  function updateSettingField<K extends keyof SiteSettings>(field: K, value: SiteSettings[K]) {
    setSiteSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function updateSocial(key: string, value: string) {
    setSiteSettings((prev) => {
      if (!prev) return prev;
      const social = { ...(prev.social ?? {}) };
      if (value) social[key] = value;
      else delete social[key];
      return { ...prev, social };
    });
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
    if (error) {
      // Feilet sletting gikk stille før: raden ble liggende i lista, og
      // brukeren trodde klikket ikke registrerte seg.
      alert("Kunne ikke slette dokumentet: " + error.message);
      return;
    }
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }

  // ── Brukeradministrasjon ──
  // Alle kall går til /api/admin/users, som verifiserer sesjonen server-side
  // før service role-nøkkelen tas i bruk. Nøkkelen finnes aldri i klienten.
  async function medToken(): Promise<Record<string, string>> {
    const { data } = await supabase.auth.getSession();
    const t = data.session?.access_token;
    return t ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" } : {};
  }

  async function hentBrukere() {
    setBrukereLaster(true);
    setBrukereFeil(null);
    try {
      const res = await fetch("/api/admin/users", { headers: await medToken() });
      const json = await res.json();
      if (!res.ok) setBrukereFeil(json.error ?? "Kunne ikke hente brukere.");
      else setBrukere(json.brukere ?? []);
    } catch {
      setBrukereFeil("Nådde ikke serveren.");
    }
    setBrukereLaster(false);
  }

  function genererPassord() {
    const tegn = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#%*";
    const buf = new Uint32Array(16);
    crypto.getRandomValues(buf);
    setNyPassord(Array.from(buf, (n) => tegn[n % tegn.length]).join(""));
  }

  async function opprettBruker() {
    if (nyPassord.length < 8) {
      alert("Passordet må ha minst 8 tegn.");
      return;
    }
    setOppretter(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: await medToken(),
        body: JSON.stringify({ epost: nyEpost, passord: nyPassord }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Kunne ikke opprette brukeren.");
      } else {
        if (json.advarsel) alert(json.advarsel);
        setBrukere((f) => [...f, json.bruker]);
        setNyEpost("");
        setNyPassord("");
        setVisBrukerSkjema(false);
      }
    } catch {
      alert("Nådde ikke serveren.");
    }
    setOppretter(false);
  }

  async function slettBruker(id: string) {
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: await medToken(),
      });
      const json = await res.json();
      if (!res.ok) alert(json.error ?? "Kunne ikke slette brukeren.");
      else setBrukere((f) => f.filter((b) => b.id !== id));
    } catch {
      alert("Nådde ikke serveren.");
    }
    setSlettBekreft(null);
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
      if (bestDocMatch && bestDocScore >= 2) r += `\n\nFra «${bestDocMatch.title}»:\n${bestDocMatch.snippet}`;
      r += "\n\nKontakt oss på 33 36 55 80 for eksakt tilbud!";
      const f: string[] = bestCat.category_type === "produkt" ? ["Priser", "Levering", "Kontakt"] : bestCat.category_type === "tjeneste" ? ["Bestille", "Kontakt"] : ["Produkter", "Kontakt"];
      return { text: r, followUps: f };
    }
    if (bestDocMatch && bestDocScore >= 2) {
      return { text: `Fra «${bestDocMatch.title}»:\n\n${bestDocMatch.snippet}\n\nKontakt oss på 33 36 55 80 for mer info!`, followUps: ["Produkter", "Kontakt", "Bruktsalg"] };
    }
    return { text: "Beklager, jeg fant ikke noe relevant svar. Prøv f.eks. «pallreoler», «garderobeskap» eller «åpningstider».\n\nRing 33 36 55 80 eller mail@reolconsult.no.", followUps: ["Produkter", "Kontaktinfo", "Levering", "Bruktsalg"] };
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafaf9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#171717] border-t-transparent" />
      </div>
    );
  }

  // Login
  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafaf9]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-[#ececec] bg-white p-8 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] text-[14px] font-bold tracking-tight text-white shadow-[0_2px_8px_-2px_rgba(220,38,38,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]">
              R
            </div>
            <div>
              <h1 className="text-[16px] font-semibold tracking-tight text-[#171717]">Reol-Consult</h1>
              <p className="text-[11px] text-[#737373]">Admin-panel</p>
            </div>
          </div>
          {loginError && (
            <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{loginError}</p>
          )}
          <label className="mt-6 block">
            <span className="text-[12px] font-medium text-[#404040]">E-post</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="navn@reolconsult.no"
              required
              className="mt-1.5 w-full rounded-lg border border-[#ececec] bg-[#fafaf9] px-3.5 py-2.5 text-[13px] text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-[12px] font-medium text-[#404040]">Passord</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1.5 w-full rounded-lg border border-[#ececec] bg-[#fafaf9] px-3.5 py-2.5 text-[13px] text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
            />
          </label>
          <button
            type="submit"
            disabled={loggingIn}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#171717] py-3 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#e5e5e4] disabled:text-[#a3a3a3] disabled:shadow-none"
          >
            {loggingIn ? "Logger inn..." : "Logg inn"}
          </button>
        </form>
      </div>
    );
  }

  // Sjekker tilgang
  if (accessChecking) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafaf9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#171717] border-t-transparent" />
      </div>
    );
  }

  // Ingen tilgang
  if (!siteRole) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafaf9] p-6">
        <div className="w-full max-w-md rounded-2xl border border-[#ececec] bg-white p-8 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.08)]">
          <h1 className="text-[16px] font-semibold tracking-tight text-[#171717]">Ingen tilgang</h1>
          <p className="mt-3 text-[13px] leading-relaxed text-[#737373]">
            Brukeren <span className="font-medium text-[#404040]">{user.email}</span> har ikke
            tilgang til {site?.name ?? "denne siten"}. Kontakt en administrator for å få tilgang.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#171717] py-3 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          >
            Logg ut
          </button>
        </div>
      </div>
    );
  }

  // Stats
  const filledCategories = categories.filter((c) => c.id !== null).length;
  const latestUpdate = categories
    .filter((c) => c.updated_at)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  const activeItemDef = SIDEBAR_ITEMS.find((i) => i.key === activeItem)!;
  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#fafaf9]">
      {/* Sidebar — speil av AdminSidebar.tsx */}
      <aside className="relative flex w-[260px] shrink-0 flex-col border-r border-[#ececec] bg-gradient-to-b from-white to-[#fafaf9]">
        <div className="border-b border-[#ececec] px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#dc2626] to-[#7f1d1d] text-[15px] font-bold tracking-tight text-white shadow-[0_2px_8px_-2px_rgba(220,38,38,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]">
              R
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold tracking-tight text-[#171717]">Reol-Consult</p>
              <span className="mt-0.5 block truncate text-[11px] text-[#737373]">reolconsult.no</span>
            </div>
          </div>
        </div>

        <div className="px-3 pt-4">
          <Link
            href="/admin/nettside"
            className="group flex h-11 items-center gap-2.5 rounded-xl bg-gradient-to-br from-[#dc2626] to-[#b91c1c] px-3.5 text-[13px] font-semibold text-white shadow-[0_2px_8px_-2px_rgba(220,38,38,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] ring-1 ring-inset ring-white/10 transition duration-150 hover:from-[#ef4444] hover:to-[#dc2626] hover:shadow-[0_6px_16px_-2px_rgba(220,38,38,0.45),inset_0_1px_0_rgba(255,255,255,0.18)]"
          >
            <LayoutTemplate className="h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
            <span className="flex-1">Rediger nettside</span>
            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 text-white/70 transition duration-150 group-hover:translate-x-0.5 group-hover:text-white"
              strokeWidth={2}
            />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pt-5 pb-3">
          <p className="mb-2 px-2.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-[#a3a3a3]">
            Arbeidsområde
          </p>
          <div className="space-y-0.5">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = item.key === activeItem;
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveItem(item.key)}
                  className={`group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13.5px] transition duration-150 ease-out ${
                    isActive
                      ? "bg-white font-semibold text-[#171717] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]"
                      : "text-[#525252] hover:bg-white/60 hover:text-[#171717]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-r-full bg-[#dc2626]" />
                  )}
                  <Icon
                    className={`h-[17px] w-[17px] shrink-0 transition-colors duration-150 ${
                      isActive ? "text-[#dc2626]" : "text-[#a3a3a3] group-hover:text-[#525252]"
                    }`}
                    strokeWidth={1.75}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#ececec] bg-white p-3">
          <div className="group flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-150 hover:bg-[#fafaf9]">
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#262626] to-[#0a0a0a] text-[12.5px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]">
                {initial}
              </div>
              <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold leading-tight text-[#171717]">
                {user.email ?? "Innlogget"}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-[#a3a3a3]">Administrator</p>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              title="Logg ut"
              aria-label="Logg ut"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a3a3a3] transition duration-150 hover:bg-white hover:text-[#dc2626] hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Page header — speil av PageHeader.tsx */}
        <div className="sticky top-0 z-10 shrink-0 border-b border-[#ececec] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="flex h-[76px] items-center justify-between gap-4 px-8">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[11px] text-[#a3a3a3]">
                <Link
                  href="/admin/nettside"
                  className="font-medium text-[#737373] transition-colors duration-150 hover:text-[#171717]"
                >
                  Reolconsult AS
                </Link>
                <ChevronRight className="h-3 w-3" strokeWidth={2} />
                <span className="font-medium text-[#171717]">{activeItemDef.label}</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2.5">
                <h1 className="text-[18px] font-semibold tracking-tight text-[#171717]">
                  {activeItemDef.label}
                </h1>
                <span className="truncate text-[12.5px] text-[#737373]">
                  {ITEM_SUBTITLES[activeItem]}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {(saved || settingsSaved) && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Lagret
                </span>
              )}
              {activeItem === "ekstra-info" && openCategory && (
                <button
                  onClick={saveCategory}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#e5e5e4] disabled:text-[#a3a3a3] disabled:shadow-none"
                >
                  {saving ? "Lagrer..." : "Lagre"}
                </button>
              )}
              {activeItem === "innstillinger" && siteSettings && (
                <button
                  onClick={saveSiteSettings}
                  disabled={settingsSaving}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#e5e5e4] disabled:text-[#a3a3a3] disabled:shadow-none"
                >
                  {settingsSaving ? "Lagrer..." : "Lagre"}
                </button>
              )}
            </div>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#dc2626]/15 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#fafaf9]">
          {/* ─── DOKUMENTER ─── */}
          {activeItem === "dokumenter" && (
            <div className="p-8 lg:p-10">
              <div className="mx-auto max-w-3xl space-y-6">
                {DOC_SECTIONS.map((section) => {
                  const sectionDocs = documents.filter((d) => d.category === section.key);
                  const isDragOver = dragOverSection === section.key;
                  const isUploading = uploading === section.key;

                  return (
                    <div key={section.key} className="overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between border-b border-[#ececec] bg-[#fafaf9] px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
                          <h3 className="text-[13px] font-semibold tracking-tight text-[#171717]">
                            {section.label}
                          </h3>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-medium text-[#737373] ring-1 ring-[#ececec]">
                            {sectionDocs.length}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div
                          onDragOver={(e) => { e.preventDefault(); setDragOverSection(section.key); }}
                          onDragLeave={() => setDragOverSection(null)}
                          onDrop={(e) => handleDrop(e, section.key)}
                          className={`flex items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3.5 transition duration-150 ${
                            isDragOver
                              ? "border-[#171717]/40 bg-[#171717]/[0.03]"
                              : "border-[#d4d4d4] bg-[#fafaf9] hover:border-[#171717]/30 hover:bg-white"
                          }`}
                        >
                          <Upload className="h-4 w-4 shrink-0 text-[#737373]" strokeWidth={1.75} />
                          <p className="flex-1 text-[12.5px] text-[#737373]">
                            {isUploading ? "Laster opp..." : "Dra inn fil, eller klikk for å velge"}
                          </p>
                          <button
                            onClick={() => fileInputRefs.current[section.key]?.click()}
                            disabled={isUploading}
                            className="shrink-0 rounded-full border border-[#ececec] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
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

                        {sectionDocs.length > 0 ? (
                          <div className="mt-3 overflow-hidden rounded-xl border border-[#ececec]">
                            {sectionDocs.map((doc, i) => (
                              <div
                                key={doc.id}
                                className={`group flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-[#fafaf9] ${
                                  i < sectionDocs.length - 1 ? "border-b border-[#f5f5f4]" : ""
                                }`}
                              >
                                <FileText className="h-4 w-4 shrink-0 text-[#a3a3a3]" strokeWidth={1.75} />
                                <p className="flex-1 truncate text-[12.5px] text-[#171717]">{doc.filename}</p>
                                <span className="shrink-0 text-[11px] text-[#a3a3a3]">
                                  {new Date(doc.uploaded_at).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })}
                                </span>
                                <button
                                  onClick={() => deleteDocument(doc.id)}
                                  title="Slett"
                                  aria-label="Slett"
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a3a3a3] opacity-0 transition duration-150 hover:bg-red-50 hover:text-[#dc2626] group-hover:opacity-100"
                                >
                                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 px-1 text-[11.5px] text-[#a3a3a3]">Ingen dokumenter ennå</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── EKSTRA INFO (accordion) ─── */}
          {activeItem === "ekstra-info" && (
            <div className="p-8 lg:p-10">
              <div className="mx-auto max-w-3xl space-y-8">
                {CATEGORY_GROUPS.map((group) => (
                  <div key={group.label}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
                      <h3 className="text-[13px] font-semibold tracking-tight text-[#171717]">
                        {group.label.charAt(0) + group.label.slice(1).toLowerCase()}
                      </h3>
                      <span className="rounded-full bg-[#f5f5f4] px-2 py-0.5 text-[10.5px] font-medium text-[#737373]">
                        {group.items.length}
                      </span>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      {group.items.map((name, i) => {
                        const cat = categories.find((c) => c.category === name);
                        const isOpen = openCategory === name;
                        const hasData = cat?.id !== null;

                        return (
                          <div
                            key={name}
                            className={i < group.items.length - 1 ? "border-b border-[#f5f5f4]" : ""}
                          >
                            <button
                              onClick={() => toggleCategory(name)}
                              className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-150 ${
                                isOpen ? "bg-[#fafaf9]" : "hover:bg-[#fafaf9]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <ChevronDown
                                  className={`h-3.5 w-3.5 text-[#a3a3a3] transition-transform duration-150 ${isOpen ? "rotate-0" : "-rotate-90"}`}
                                  strokeWidth={2}
                                />
                                <span className="text-[13.5px] font-medium text-[#171717]">{name}</span>
                              </div>
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${
                                hasData
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-[#f5f5f4] text-[#737373]"
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${hasData ? "bg-emerald-500" : "bg-[#a3a3a3]"}`} />
                                {hasData ? "Har data" : "Mangler"}
                              </span>
                            </button>

                            {isOpen && cat && (
                              <div className="border-t border-[#f5f5f4] bg-[#fafaf9] px-5 py-5 space-y-4">
                                <label className="block">
                                  <span className="text-[12px] font-medium text-[#404040]">Beskrivelse</span>
                                  <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={cat.category_type === "bedriftsinfo" ? 6 : 2}
                                    className="mt-1.5 w-full resize-y rounded-lg border border-[#ececec] bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                                    placeholder="Skriv en beskrivelse..."
                                  />
                                </label>

                                {(cat.category_type === "produkt" || cat.category_type === "salg") && (
                                  <>
                                    {variants.length > 0 && (
                                      <div>
                                        <span className="text-[12px] font-medium text-[#404040]">Varianter</span>
                                        <div className="mt-1.5 overflow-x-auto rounded-lg border border-[#ececec] bg-white">
                                          <table className="w-full">
                                            <thead>
                                              <tr className="border-b border-[#ececec] bg-[#fafaf9]">
                                                <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Variant</th>
                                                <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Pris</th>
                                                <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Lager</th>
                                                <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Levering</th>
                                                <th className="w-8 px-1 py-1.5" />
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {variants.map((v, i) => (
                                                <tr key={i} className="border-t border-[#f5f5f4]">
                                                  <td className="px-2 py-1"><input value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#ececec] focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="Navn" /></td>
                                                  <td className="px-2 py-1"><input value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#ececec] focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="—" /></td>
                                                  <td className="px-2 py-1"><input value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#ececec] focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="—" /></td>
                                                  <td className="px-2 py-1"><input value={v.delivery} onChange={(e) => updateVariant(i, "delivery", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#ececec] focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="—" /></td>
                                                  <td className="px-1 py-1 text-center">
                                                    <button onClick={() => removeVariant(i)} title="Fjern" aria-label="Fjern" className="flex h-7 w-7 items-center justify-center rounded-md text-[#a3a3a3] transition-colors duration-150 hover:bg-red-50 hover:text-[#dc2626]"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} /></button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}
                                    <button onClick={addVariant} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#d4d4d4] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#737373] transition duration-150 hover:border-[#171717] hover:text-[#171717]">
                                      <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Legg til variant
                                    </button>

                                    {discounts.length > 0 && (
                                      <div>
                                        <span className="text-[12px] font-medium text-[#404040]">Mengderabatt</span>
                                        <div className="mt-1.5 overflow-x-auto rounded-lg border border-[#ececec] bg-white">
                                          <table className="w-full">
                                            <thead>
                                              <tr className="border-b border-[#ececec] bg-[#fafaf9]">
                                                <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Over antall</th>
                                                <th className="px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#a3a3a3]">Pris per stk</th>
                                                <th className="w-8 px-1 py-1.5" />
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {discounts.map((d, i) => (
                                                <tr key={i} className="border-t border-[#f5f5f4]">
                                                  <td className="px-2 py-1"><input value={d.min_quantity} onChange={(e) => updateDiscount(i, "min_quantity", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#ececec] focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="0" /></td>
                                                  <td className="px-2 py-1"><input value={d.price} onChange={(e) => updateDiscount(i, "price", e.target.value)} className="w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[#171717] hover:border-[#ececec] focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10" placeholder="0" /></td>
                                                  <td className="px-1 py-1 text-center">
                                                    <button onClick={() => removeDiscount(i)} title="Fjern" aria-label="Fjern" className="flex h-7 w-7 items-center justify-center rounded-md text-[#a3a3a3] transition-colors duration-150 hover:bg-red-50 hover:text-[#dc2626]"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} /></button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}
                                    <button onClick={addDiscount} className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#d4d4d4] bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#737373] transition duration-150 hover:border-[#171717] hover:text-[#171717]">
                                      <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Legg til rabatt
                                    </button>
                                  </>
                                )}

                                {cat.category_type !== "bedriftsinfo" && (
                                  <label className="block">
                                    <span className="text-[12px] font-medium text-[#404040]">
                                      {cat.category_type === "tjeneste" ? "Priser / info" : "Ekstra info"}
                                    </span>
                                    <textarea
                                      value={extraInfo}
                                      onChange={(e) => setExtraInfo(e.target.value)}
                                      rows={2}
                                      className="mt-1.5 w-full resize-y rounded-lg border border-[#ececec] bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                                      placeholder={cat.category_type === "tjeneste" ? "F.eks. priser, betingelser..." : "Tilleggsinformasjon..."}
                                    />
                                  </label>
                                )}

                                {cat.updated_at && (
                                  <p className="text-[11px] text-[#a3a3a3]">
                                    Sist oppdatert: {new Date(cat.updated_at).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" })}{" "}
                                    kl. {new Date(cat.updated_at).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                                  </p>
                                )}

                                <div className="flex justify-end pt-1">
                                  <button
                                    onClick={saveCategory}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:bg-[#e5e5e4] disabled:text-[#a3a3a3] disabled:shadow-none"
                                  >
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
          )}

          {/* ─── STATISTIKK ─── */}
          {activeItem === "statistikk" && (
            <div className="p-8 lg:p-10">
              <div className="mx-auto max-w-3xl space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { value: documents.length, label: "Dokumenter lastet opp", icon: FileText },
                    { value: needsMigration ? 1 : filledCategories, label: "Kategorier i database", icon: Database },
                    { value: 24, label: "Totalt kategorier", icon: BarChart3 },
                  ].map(({ value, label, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-[#ececec] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fef2f2] text-[#dc2626] ring-1 ring-rose-100">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <p className="mt-4 text-[28px] font-semibold tracking-tight text-[#171717]">{value}</p>
                      <p className="mt-0.5 text-[12.5px] text-[#737373]">{label}</p>
                    </div>
                  ))}
                </div>
                {latestUpdate?.updated_at && (
                  <p className="text-[12px] text-[#a3a3a3]">
                    Siste oppdatering: {new Date(latestUpdate.updated_at).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}{" "}
                    kl. {new Date(latestUpdate.updated_at).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ─── CHATBOT ─── */}
          {activeItem === "chatbot" && (
            <div className="p-8 lg:p-10">
              <div className="mx-auto max-w-2xl">
                <p className="text-[12.5px] text-[#737373]">
                  Søker i <span className="font-medium text-[#171717]">{categories.length}</span> kategorier og{" "}
                  <span className="font-medium text-[#171717]">{docContents.length}</span> dokumenter.
                </p>
                <div className="mt-4 flex h-[600px] flex-col overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {testMessages.length === 0 && (
                      <div className="pt-6 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fafaf9] to-[#f5f5f4] text-[#525252] ring-1 ring-inset ring-[#ececec]">
                          <Bot className="h-5 w-5" strokeWidth={1.75} />
                        </div>
                        <p className="mt-4 text-[13px] text-[#737373]">Skriv en melding for å teste AI-assistenten</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                          {["Pallreoler", "Kontaktinfo", "Levering", "Bruktsalg", "Garderobeskap", "Åpningstider"].map((q) => (
                            <button
                              key={q}
                              onClick={() => handleQuickReply(q)}
                              className="rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-[12px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {testMessages.map((msg, i) => (
                      <div key={i}>
                        <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-line ${
                            msg.role === "user"
                              ? "rounded-br-md bg-[#171717] text-white"
                              : "rounded-bl-md bg-[#fafaf9] text-[#171717] ring-1 ring-[#ececec]"
                          }`}>
                            {msg.text.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                              part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : <span key={j}>{part}</span>
                            )}
                          </div>
                        </div>
                        {msg.role === "bot" && msg.followUps && msg.followUps.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                            {msg.followUps.map((q) => (
                              <button
                                key={q}
                                onClick={() => handleQuickReply(q)}
                                className="rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-[11.5px] font-medium text-[#525252] transition duration-150 hover:border-[#d4d4d4] hover:text-[#171717]"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={sendTestMessage} className="border-t border-[#ececec] bg-[#fafaf9] p-3">
                    <div className="flex gap-2">
                      <input
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        placeholder="Skriv et spørsmål, f.eks. «pallreoler» eller «levering»..."
                        className="flex-1 rounded-full border border-[#ececec] bg-white px-4 py-2.5 text-[13px] text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition duration-150 hover:bg-[#000] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ─── INNSTILLINGER ─── */}
          {activeItem === "innstillinger" && (
            <div className="p-8 lg:p-10">
              <div className="mx-auto max-w-2xl space-y-5">
                {settingsLoading || !siteSettings ? (
                  <div className="rounded-2xl border border-[#ececec] bg-white p-6">
                    <p className="text-[13px] text-[#a3a3a3]">Laster innstillinger…</p>
                  </div>
                ) : (
                  <>
                    <SettingsCard title="Kontakt">
                      <SettingsField
                        label="Telefon"
                        value={siteSettings.phone ?? ""}
                        onChange={(v) => updateSettingField("phone", v)}
                        placeholder="33 36 55 80"
                        hint="Skriv uten landskode. tel:-lenker bygges automatisk med +47."
                      />
                      <SettingsField
                        label="E-post (generell)"
                        type="email"
                        value={siteSettings.email_general ?? ""}
                        onChange={(v) => updateSettingField("email_general", v)}
                        placeholder="mail@reolconsult.no"
                      />
                    </SettingsCard>

                    <SettingsCard title="Adresse">
                      <SettingsField
                        label="Besøksadresse"
                        value={siteSettings.visit_address ?? ""}
                        onChange={(v) => updateSettingField("visit_address", v)}
                        placeholder="Smiløkka 7, 3173 Vear"
                      />
                      <SettingsField
                        label="Postadresse"
                        value={siteSettings.postal_address ?? ""}
                        onChange={(v) => updateSettingField("postal_address", v)}
                        placeholder="Postboks 1, 3108 Vear"
                      />
                    </SettingsCard>

                    <SettingsCard title="Åpningstider" description="Én linje per rad. Vises ordrett på siden.">
                      <label className="block">
                        <textarea
                          value={siteSettings.opening_hours ?? ""}
                          onChange={(e) => updateSettingField("opening_hours", e.target.value)}
                          placeholder={"Mandag–fredag: 08:00–16:00\nLørdag/søndag: Stengt"}
                          rows={4}
                          className="w-full resize-y rounded-lg border border-[#ececec] bg-[#fafaf9] px-3.5 py-2.5 text-[13px] text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                        />
                      </label>
                    </SettingsCard>

                    <SettingsCard
                      title="Prisvisning i chatboten"
                      description="Priser legges inn eks. mva. Chatboten merker automatisk at mva tilkommer."
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={siteSettings.show_prices ?? false}
                          onChange={(e) => updateSettingField("show_prices", e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#dc2626]"
                        />
                        <span>
                          <span className="block text-[13px] font-medium text-[#171717]">
                            La chatboten oppgi priser
                          </span>
                          <span className="mt-0.5 block text-[11.5px] leading-relaxed text-[#737373]">
                            {siteSettings.show_prices
                              ? "Chatboten oppgir priser fra produktregisteret, alltid merket «eks. mva» og med oppfordring om å kontakte dere for eksakt tilbud."
                              : "Chatboten nevner ingen priser i det hele tatt, og henviser til telefon og e-post ved prisspørsmål."}
                          </span>
                        </span>
                      </label>
                    </SettingsCard>

                    <SettingsCard title="Sosiale medier" description="La feltet stå tomt hvis dere ikke har konto.">
                      {(["facebook", "instagram", "linkedin"] as const).map((key) => (
                        <SettingsField
                          key={key}
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          type="url"
                          value={siteSettings.social?.[key] ?? ""}
                          onChange={(v) => updateSocial(key, v)}
                          placeholder={`https://${key}.com/…`}
                        />
                      ))}
                    </SettingsCard>

                    <div className="overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <div className="border-b border-[#ececec] bg-[#fafaf9] px-6 py-3">
                        <h3 className="text-[13px] font-semibold tracking-tight text-[#171717]">Konto</h3>
                      </div>
                      <div className="p-6">
                        <p className="text-[13px] text-[#737373]">
                          Innlogget som <span className="font-medium text-[#171717]">{user.email}</span>
                        </p>
                        <p className="mt-1 text-[11.5px] text-[#a3a3a3]">Rolle: {siteRole}</p>
                      </div>
                    </div>

                    {/* Brukere — opprettes via /api/admin/users, som verifiserer
                        sesjonen server-side. Service role-nøkkelen er aldri her. */}
                    <div className="overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between border-b border-[#ececec] bg-[#fafaf9] px-6 py-3">
                        <h3 className="text-[13px] font-semibold tracking-tight text-[#171717]">Brukere</h3>
                        <button
                          onClick={() => { setVisBrukerSkjema((v) => !v); if (brukere.length === 0) hentBrukere(); }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#171717] px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#333]"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Legg til bruker
                        </button>
                      </div>

                      <div className="p-6">
                        {visBrukerSkjema && (
                          <div className="mb-5 rounded-xl border border-[#ececec] bg-[#fafaf9] p-4">
                            <label className="block text-[12px] font-medium text-[#171717]">E-post</label>
                            <input
                              type="email"
                              value={nyEpost}
                              onChange={(e) => setNyEpost(e.target.value)}
                              placeholder="navn@reolconsult.no"
                              className="mt-1 w-full rounded-lg border border-[#e5e5e5] px-3 py-2 text-[13px] outline-none focus:border-[#171717]"
                            />
                            <label className="mt-3 block text-[12px] font-medium text-[#171717]">
                              Passord <span className="font-normal text-[#a3a3a3]">(minst 8 tegn)</span>
                            </label>
                            <div className="mt-1 flex gap-2">
                              <input
                                type="text"
                                value={nyPassord}
                                onChange={(e) => setNyPassord(e.target.value)}
                                placeholder="Skriv inn, eller generer"
                                className="flex-1 rounded-lg border border-[#e5e5e5] px-3 py-2 font-mono text-[13px] outline-none focus:border-[#171717]"
                              />
                              <button
                                onClick={genererPassord}
                                type="button"
                                className="shrink-0 rounded-lg border border-[#e5e5e5] px-3 py-2 text-[12px] font-medium text-[#171717] transition hover:bg-white"
                              >
                                Generer
                              </button>
                            </div>
                            <p className="mt-2 text-[11.5px] text-[#a3a3a3]">
                              Passordet vises kun nå. Kopier det og gi det til brukeren — det kan ikke hentes fram igjen.
                            </p>
                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={opprettBruker}
                                disabled={oppretter || nyPassord.length < 8 || !nyEpost}
                                className="rounded-full bg-[#171717] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#333] disabled:opacity-40"
                              >
                                {oppretter ? "Oppretter…" : "Opprett bruker"}
                              </button>
                              <button
                                onClick={() => { setVisBrukerSkjema(false); setNyEpost(""); setNyPassord(""); }}
                                className="rounded-full border border-[#e5e5e5] px-5 py-2 text-[13px] font-medium text-[#171717] transition hover:bg-[#fafaf9]"
                              >
                                Avbryt
                              </button>
                            </div>
                          </div>
                        )}

                        {brukereFeil && (
                          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{brukereFeil}</p>
                        )}

                        {brukere.length === 0 && !brukereLaster ? (
                          <button
                            onClick={hentBrukere}
                            className="text-[13px] font-medium text-[#171717] underline underline-offset-2"
                          >
                            Vis brukere
                          </button>
                        ) : brukereLaster ? (
                          <p className="text-[13px] text-[#a3a3a3]">Laster brukere…</p>
                        ) : (
                          <ul className="divide-y divide-[#f0f0f0]">
                            {brukere.map((b) => (
                              <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                                <div className="min-w-0">
                                  <p className="truncate text-[13px] font-medium text-[#171717]">
                                    {b.epost}
                                    {b.erDegSelv && (
                                      <span className="ml-2 rounded bg-[#f0f0f0] px-1.5 py-0.5 text-[10.5px] font-semibold text-[#737373]">
                                        deg
                                      </span>
                                    )}
                                  </p>
                                  <p className="mt-0.5 text-[11.5px] text-[#a3a3a3]">
                                    Opprettet {new Date(b.opprettet).toLocaleDateString("nb-NO")}
                                    {b.sistInnlogget
                                      ? ` · sist innlogget ${new Date(b.sistInnlogget).toLocaleDateString("nb-NO")}`
                                      : " · aldri innlogget"}
                                  </p>
                                </div>
                                {b.erDegSelv ? (
                                  <span
                                    title="Du kan ikke slette din egen bruker — da mister du tilgangen til panelet."
                                    className="shrink-0 cursor-not-allowed rounded-lg border border-[#f0f0f0] p-1.5 text-[#d4d4d4]"
                                  >
                                    <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                                  </span>
                                ) : slettBekreft === b.id ? (
                                  <div className="flex shrink-0 items-center gap-2">
                                    <span className="text-[11.5px] text-[#737373]">Sikker? Kan ikke angres.</span>
                                    <button
                                      onClick={() => slettBruker(b.id)}
                                      className="rounded-lg bg-red-600 px-2.5 py-1.5 text-[12px] font-semibold text-white transition hover:bg-red-700"
                                    >
                                      Slett
                                    </button>
                                    <button
                                      onClick={() => setSlettBekreft(null)}
                                      className="rounded-lg border border-[#e5e5e5] px-2.5 py-1.5 text-[12px] text-[#171717]"
                                    >
                                      Avbryt
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setSlettBekreft(b.id)}
                                    title="Slett bruker"
                                    className="shrink-0 rounded-lg border border-[#f0f0f0] p-1.5 text-[#a3a3a3] transition hover:border-red-200 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="border-b border-[#ececec] bg-[#fafaf9] px-6 py-3">
        <h3 className="text-[13px] font-semibold tracking-tight text-[#171717]">{title}</h3>
        {description && <p className="mt-0.5 text-[11.5px] text-[#737373]">{description}</p>}
      </div>
      <div className="space-y-4 p-6">{children}</div>
    </section>
  );
}

function SettingsField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: "text" | "email" | "url" | "tel";
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-[#404040]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-[#ececec] bg-[#fafaf9] px-3.5 py-2.5 text-[13px] text-[#171717] placeholder:text-[#a3a3a3] transition duration-150 focus:border-[#171717] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
      />
      {hint && <span className="mt-1.5 block text-[11px] text-[#a3a3a3]">{hint}</span>}
    </label>
  );
}
