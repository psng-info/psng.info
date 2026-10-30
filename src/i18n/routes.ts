import { DEFAULT_LOCALE, type Locale, localeFromPath } from "./locale";

/**
 * Jede Seite unter einem Schlüssel, mit ihrem Pfad je Sprache. Ein zentrales
 * Verzeichnis statt Pfaden im Quelltext verstreut: Daraus kommen die Routen,
 * die Links, der Sprachumschalter, die hreflang-Angaben und der Test gegen die
 * sitemap.xml. Käme jedes davon aus einer eigenen Liste, liefen sie
 * auseinander, sobald eine Seite dazukommt.
 *
 * `null` heißt: Diese Seite gibt es in der Sprache nicht. Impressum und
 * Datenschutzerklärung stehen bewusst nur auf Deutsch – sie haben rechtliche
 * Wirkung, und eine Übersetzung, die vom deutschen Text abweicht, ist
 * schlechter als gar keine.
 */
export type RouteKey =
  | "home"
  | "events"
  | "about"
  | "guide"
  | "codeOfConduct"
  | "imprint"
  | "privacy";

export interface RouteDefinition {
  /** Pfad je Sprache, `null` wo es die Seite nicht gibt. */
  path: Record<Locale, string | null>;
  /** Gewichtung in der sitemap.xml. */
  priority: string;
  changefreq: "weekly" | "monthly" | "yearly";
}

export const routes: Record<RouteKey, RouteDefinition> = {
  home: {
    path: { de: "/", en: "/en" },
    priority: "1.0",
    changefreq: "weekly",
  },
  events: {
    path: { de: "/events", en: "/en/events" },
    priority: "0.9",
    changefreq: "weekly",
  },
  about: {
    path: { de: "/ueber-uns", en: "/en/about" },
    priority: "0.7",
    changefreq: "monthly",
  },
  guide: {
    path: { de: "/leitfaden", en: "/en/guide" },
    priority: "0.8",
    changefreq: "monthly",
  },
  codeOfConduct: {
    path: { de: "/code-of-conduct", en: "/en/code-of-conduct" },
    priority: "0.3",
    changefreq: "yearly",
  },
  imprint: {
    path: { de: "/impressum", en: null },
    priority: "0.3",
    changefreq: "yearly",
  },
  privacy: {
    path: { de: "/datenschutz", en: null },
    priority: "0.3",
    changefreq: "yearly",
  },
};

export const routeKeys = Object.keys(routes) as RouteKey[];

/**
 * Der Pfad einer Seite in einer Sprache. Gibt es sie dort nicht, fällt er auf
 * Deutsch zurück – ein englischer Footer soll zum Impressum führen können,
 * auch wenn das Impressum nur auf Deutsch existiert.
 */
export function pathFor(key: RouteKey, locale: Locale): string {
  return routes[key].path[locale] ?? routes[key].path[DEFAULT_LOCALE]!;
}

/** Ob es die Seite in dieser Sprache überhaupt gibt. */
export function existsIn(key: RouteKey, locale: Locale): boolean {
  return routes[key].path[locale] !== null;
}

/** Zu welcher Seite ein Pfad gehört – ohne Query und Hash. */
export function routeKeyOf(pathname: string): RouteKey | undefined {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return routeKeys.find((key) =>
    Object.values(routes[key].path).some((p) => p === clean),
  );
}

/**
 * Derselbe Inhalt in der anderen Sprache.
 *
 * Kennt der Umschalter die Seite nicht – etwa auf der 404-Seite –, führt er
 * zur Startseite der Zielsprache, statt einen Pfad zu raten, den es nicht
 * gibt. Dasselbe gilt für Seiten, die es nur auf Deutsch gibt: `pathFor` fiele
 * dort auf den deutschen Pfad zurück, und der Umschalter zeigte auf die Seite,
 * auf der man schon steht. Wer auf „EN" klickt, bekommt lieber eine englische
 * Seite als gar keine Reaktion.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const key = routeKeyOf(pathname);
  if (!key || !existsIn(key, target)) return pathFor("home", target);
  return pathFor(key, target);
}

/** Die Sprachfassungen einer Seite, für die hreflang-Angaben im Head. */
export function alternatesFor(key: RouteKey): { locale: Locale; path: string }[] {
  return (Object.entries(routes[key].path) as [Locale, string | null][])
    .filter((entry): entry is [Locale, string] => entry[1] !== null)
    .map(([locale, path]) => ({ locale, path }));
}

export { localeFromPath };
