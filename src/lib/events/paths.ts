import type { Locale } from "@/i18n/locale";
import { pathFor } from "@/i18n/routes";

/** Pfad der Detailseite eines Events. */
export function eventPath(slug: string, locale: Locale): string {
  return `${pathFor("events", locale)}/${slug}`;
}

/**
 * Anker der Aufzeichnung auf der Detailseite. Wer über einen Link mit diesem
 * Anker kommt, hat „abspielen“ schon geklickt: Das Video startet sofort.
 */
export const RECORDING_ANCHOR = "video";
