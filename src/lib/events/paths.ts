import type { Locale } from "@/i18n/locale";
import { pathFor } from "@/i18n/routes";

/** Pfad der Detailseite eines Events. */
export function eventPath(slug: string, locale: Locale): string {
  return `${pathFor("events", locale)}/${slug}`;
}
