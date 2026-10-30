export const SITE_URL = "https://psng.info";

/** Absolute URL zu einem Pfad der Seite – für Canonical, hreflang, og:url und Vorschaubilder. */
export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}
