"use server";

import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Invaliderer cache for hele den offentlige siden så endringer i admin
 * vises umiddelbart uten at brukeren må refreshe manuelt.
 *
 * Kalles fra admin-komponenter etter at en mutation har lykkes:
 *
 *   await supabase.from(...).update(...);
 *   await revalidatePublicSite();
 *
 * Bruker både revalidateTag (for evt. tag-basert cache senere) og
 * revalidatePath('/', 'layout') (som er en bredere invalidering — tar med
 * alle ruter under root layout).
 */
export async function revalidatePublicSite() {
  // Tag-basert: brukes hvis vi senere wrapper queries med unstable_cache + tags.
  revalidateTag("site-content");
  // Path-basert: invaliderer ALL public-rendering. Trygg fallback uavhengig
  // av om sidene rendres statisk eller dynamisk.
  revalidatePath("/", "layout");
}
