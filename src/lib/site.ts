import { cache } from "react";
import { supabase } from "./supabase";

export const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG ?? "reolconsult";

export type Site = {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  org_number: string | null;
  theme: Record<string, unknown>;
};

export type SiteSettings = {
  site_id: string;
  phone: string | null;
  email_general: string | null;
  visit_address: string | null;
  postal_address: string | null;
  opening_hours: string | null;
  social: Record<string, string>;
  updated_at: string;
};

export type SiteRole = "owner" | "editor" | "super_admin";

export type SiteAccess = {
  hasAccess: boolean;
  role: SiteRole | null;
};

/**
 * Fallback-verdier som brukes hvis DB ikke svarer eller mangler rad.
 * Holder hardkodet sannhet ett sted, så vi ikke får tom UI under migrering.
 */
export const SITE_SETTINGS_FALLBACK: SiteSettings = {
  site_id: "",
  phone: "33 36 55 80",
  email_general: "mail@reolconsult.no",
  visit_address: "Smiløkka 7, 3173 Vear",
  postal_address: "Postboks 1, 3108 Vear",
  opening_hours: "Mandag–fredag: 08:00–16:00\nLørdag/søndag: Stengt",
  social: {},
  updated_at: "",
};

/**
 * Hent siten denne deployen tilhører (basert på NEXT_PUBLIC_SITE_SLUG).
 * Cachet per request via React cache().
 */
export const getCurrentSite = cache(async (): Promise<Site | null> => {
  const { data, error } = await supabase
    .from("sites")
    .select("id, slug, name, domain, org_number, theme")
    .eq("slug", SITE_SLUG)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Site;
});

/**
 * Hent site_settings for en gitt site. Returnerer null hvis raden ikke finnes.
 * Bruk getSiteSettingsOrFallback() når du vil rendere UI uavhengig.
 */
export const getSiteSettings = cache(async (siteId: string): Promise<SiteSettings | null> => {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("site_id", siteId)
    .maybeSingle();

  if (error || !data) return null;
  return {
    ...data,
    social: (data.social ?? {}) as Record<string, string>,
  } as SiteSettings;
});

/**
 * Hent settings med fallback-verdier hvis DB-raden mangler.
 * Brukes av komponenter som alltid trenger noe å vise.
 */
export async function getSiteSettingsOrFallback(siteId: string | null): Promise<SiteSettings> {
  if (!siteId) return SITE_SETTINGS_FALLBACK;
  const settings = await getSiteSettings(siteId);
  return settings ?? { ...SITE_SETTINGS_FALLBACK, site_id: siteId };
}

/**
 * Sjekk hvilken rolle (om noen) den innloggede brukeren har på en site.
 */
export async function getSiteAccessForCurrentUser(siteId: string): Promise<SiteAccess> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { hasAccess: false, role: null };

  const [{ data: superAdmin }, { data: siteUser }] = await Promise.all([
    supabase.from("super_admins").select("user_id").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("site_users")
      .select("role")
      .eq("user_id", user.id)
      .eq("site_id", siteId)
      .maybeSingle(),
  ]);

  if (superAdmin) return { hasAccess: true, role: "super_admin" };
  if (siteUser) return { hasAccess: true, role: siteUser.role as "owner" | "editor" };
  return { hasAccess: false, role: null };
}

// ────────────────────────────────────────────────────────────
// Hjelpere for UI-render
// ────────────────────────────────────────────────────────────

/**
 * Bygg en `tel:`-href med +47-prefiks. Stripper mellomrom fra nummeret.
 * Faller tilbake til Reolconsult-nummeret hvis input mangler.
 */
export function formatPhoneLink(phone?: string | null): string {
  const digits = (phone ?? SITE_SETTINGS_FALLBACK.phone ?? "").replace(/\s/g, "");
  if (!digits) return "";
  // Hvis det allerede har landskode, ikke legg til en til.
  if (digits.startsWith("+")) return `tel:${digits}`;
  return `tel:+47${digits}`;
}

/**
 * Internasjonal visning av et norsk nummer: "+47 33 36 55 80".
 */
export function formatPhoneIntl(phone?: string | null): string {
  if (!phone) return "";
  if (phone.startsWith("+")) return phone;
  return `+47 ${phone}`;
}

/**
 * Erstatt placeholders i en tekst med verdier fra site_settings.
 * Støttede placeholders:
 *   {phone}, {phone_intl}, {email}, {visit_address}, {postal_address}, {opening_hours}
 */
export function fillPlaceholders(text: string, settings: SiteSettings): string {
  return text
    .replace(/\{phone_intl\}/g, formatPhoneIntl(settings.phone))
    .replace(/\{phone\}/g, settings.phone ?? "")
    .replace(/\{email\}/g, settings.email_general ?? "")
    .replace(/\{visit_address\}/g, settings.visit_address ?? "")
    .replace(/\{postal_address\}/g, settings.postal_address ?? "")
    .replace(/\{opening_hours\}/g, settings.opening_hours ?? "");
}
