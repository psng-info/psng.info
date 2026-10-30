import { locales } from "@/i18n/locale";
import { routeKeys, routes } from "@/i18n/routes";
import { eventPath } from "@/lib/events/paths";
import { hasPage, isTranslated } from "@/lib/events/schedule";
import type { SiteEvent } from "@/lib/events/types";
import type { SitemapPage } from "./sitemap";

/** Alle indexierbaren Seiten: das Routenverzeichnis und jedes Event mit eigener Seite. */
export function indexablePages(events: SiteEvent[]): SitemapPage[] {
  const fixed = routeKeys.map((key) => ({
    paths: Object.fromEntries(locales.flatMap((l) => (routes[key].path[l] ? [[l, routes[key].path[l]]] : []))),
    changefreq: routes[key].changefreq,
    priority: routes[key].priority,
  }));
  const eventPages = events.filter(hasPage).map(
    (e): SitemapPage => ({
      paths: { de: eventPath(e.slug, "de"), ...(isTranslated(e) ? { en: eventPath(e.slug, "en") } : {}) },
      changefreq: "monthly",
      priority: "0.6",
    }),
  );
  return [...fixed, ...eventPages];
}
