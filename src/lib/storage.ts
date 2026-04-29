import { supabase } from "./supabase";

const BUCKET = "media";

export type UploadResult = {
  storagePath: string;
  url: string;
  width: number;
  height: number;
  size: number;
  mime: string;
};

/**
 * Last opp et bilde til Supabase Storage og hent dimensjoner.
 * Path: site-{siteId}/{category}/{timestamp}-{slug}.{ext}
 */
export async function uploadImage(
  siteId: string,
  category: string,
  file: File,
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Filen er ikke et bilde.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Bildet er over 10 MB. Komprimer det før opplasting.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "image";
  const timestamp = Date.now();
  const storagePath = `site-${siteId}/${category}/${timestamp}-${baseName}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw new Error(`Opplasting feilet: ${uploadError.message}`);

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const url = publicData.publicUrl;

  const { width, height } = await readImageDimensions(file);

  return {
    storagePath,
    url,
    width,
    height,
    size: file.size,
    mime: file.type,
  };
}

/**
 * Slett en fil fra Storage. Sletter ikke media-raden — det er kallerens ansvar.
 */
export async function deleteFromStorage(storagePath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw new Error(`Sletting feilet: ${error.message}`);
}

/**
 * Les bredde/høyde fra et image-File via en midlertidig <img>-element.
 */
function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error("Kunne ikke lese bildet"));
      img.src = String(e.target?.result ?? "");
    };
    reader.onerror = () => reject(new Error("Kunne ikke lese filen"));
    reader.readAsDataURL(file);
  });
}
