import type { Locale } from "@/i18n/locale";
import { alternatesFor, type RouteKey } from "@/i18n/routes";

/** Die Sprachfassungen einer Seite aus dem Routenverzeichnis, als Prop für BaseLayout. */
export function alternatesOf(key: RouteKey): Partial<Record<Locale, string>> {
  return Object.fromEntries(alternatesFor(key).map((a) => [a.locale, a.path]));
}
