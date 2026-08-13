/**
 * Rydder brødtekst som kommer fra CMS-et.
 *
 * Feltene rendres med `whitespace-pre-line` så redaktører kan lage
 * avsnittsskift. Bieffekten er at linjeskift som ligger igjen fra kopiert
 * tekst også blir stående, og da brekker setninger midt i — «… uforpliktende
 * \n tilbud.» ga et enslig «tilbud.» på egen linje.
 *
 * Enkle linjeskift blir mellomrom; doble beholdes som avsnittsskift.
 * Bruk IKKE på felter der hvert linjeskift betyr noe (åpningstider o.l.).
 */
export function ryddTekst(verdi?: string | null): string {
  if (!verdi) return "";
  return verdi
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/(^|[^\n])\n(?!\n)/g, "$1 ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
