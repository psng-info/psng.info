import { SITE_URL } from "@/lib/seo/site";
import { localeTags, locales, type Locale } from "@/i18n/locale";

/** Eine Seite mit ihren Sprachfassungen – nur die, die es wirklich gibt. */
export interface SitemapPage {
  paths: Partial<Record<Locale, string>>;
  changefreq: "weekly" | "monthly" | "yearly";
  priority: string;
}

/**
 * Jede Fassung einer Seite als eigener Eintrag, jede mit Verweisen auf alle
 * Fassungen samt x-default (Deutsch). Eine Seite in nur einer Sprache bekommt
 * keine hreflang-Angaben – ein Verweis auf sich selbst allein sagt nichts.
 */
export function sitemapXml(pages: SitemapPage[]): string {
  const urls = pages.flatMap((page) => {
    const versions = locales
      .filter((l) => page.paths[l])
      .map((l) => ({ locale: l, href: `${SITE_URL}${page.paths[l]}` }));
    const links =
      versions.length < 2
        ? []
        : [
            ...versions.map((v) => `<xhtml:link rel="alternate" hreflang="${localeTags[v.locale]}" href="${v.href}" />`),
            `<xhtml:link rel="alternate" hreflang="x-default" href="${versions[0].href}" />`,
          ];
    return versions.map((v) =>
      [
        "  <url>",
        `    <loc>${v.href}</loc>`,
        ...links.map((l) => `    ${l}`),
        `    <changefreq>${page.changefreq}</changefreq>`,
        `    <priority>${page.priority}</priority>`,
        "  </url>",
      ].join("\n"),
    );
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
