import { describe, it, expect } from "vitest";
import { copy } from "./copy";
import { hasPage, isTranslated } from "@/lib/events/schedule";
import { testEvents } from "@/lib/events/testData";
import { indexablePages } from "@/lib/seo/pages";
import { sitemapXml } from "@/lib/seo/sitemap";
import { locales, localeFromPath } from "./locale";
import {
  alternatesFor,
  pathFor,
  routeKeys,
  routes,
  routeKeyOf,
  switchLocalePath,
} from "./routes";

/**
 * Der Typ `Copy` erzwingt, dass beide Sprachen dieselben Schlüssel tragen –
 * aber nicht, dass ihre Listen gleich lang sind. Ein Array mit einem Eintrag
 * weniger ist typkorrekt und fiele sonst erst im Browser auf.
 */
function listShapes(value: unknown, path = ""): Record<string, string> {
  const out: Record<string, string> = {};
  if (Array.isArray(value)) {
    out[path] = `length:${value.length}`;
    value.forEach((item, i) => {
      if (item && typeof item === "object" && "key" in item) {
        out[`${path}[${i}].key`] = String((item as { key: unknown }).key);
      }
      Object.assign(out, listShapes(item, `${path}[${i}]`));
    });
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      Object.assign(out, listShapes(v, path ? `${path}.${k}` : k));
    }
  }
  return out;
}

describe("copy", () => {
  it("has the same list lengths and keys in every language", () => {
    const reference = listShapes(copy.de);
    for (const locale of locales) {
      expect(listShapes(copy[locale]), `locale ${locale}`).toEqual(reference);
    }
  });

  it("leaves no string empty", () => {
    const empty: string[] = [];
    const walk = (value: unknown, path: string) => {
      if (typeof value === "string") {
        if (value.trim() === "") empty.push(path);
      } else if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
      }
    };
    for (const locale of locales) walk(copy[locale], locale);
    expect(empty).toEqual([]);
  });

  it("actually translates – German and English are not the same text", () => {
    // Einzelne Gleichstände sind richtig ("FAQ", "Instagram", Eigennamen).
    // Stimmt dagegen fast alles überein, wurde eine Sprache nur kopiert.
    const de = JSON.stringify(copy.de);
    const en = JSON.stringify(copy.en);
    expect(en).not.toBe(de);
    expect(copy.en.hero.tagline).not.toBe(copy.de.hero.tagline);
    expect(copy.en.about.intro).not.toBe(copy.de.about.intro);
  });
});

describe("localeFromPath", () => {
  it("reads English only from the /en prefix", () => {
    expect(localeFromPath("/")).toBe("de");
    expect(localeFromPath("/leitfaden")).toBe("de");
    expect(localeFromPath("/en")).toBe("en");
    expect(localeFromPath("/en/guide")).toBe("en");
  });

  it("does not mistake a German path that merely starts with 'en'", () => {
    // Ohne Trennzeichen wäre "/entwurf" englisch – das wäre still und falsch.
    expect(localeFromPath("/entwurf")).toBe("de");
    expect(localeFromPath("/energie")).toBe("de");
  });
});

describe("routes", () => {
  it("keeps the German paths that are already linked from elsewhere", () => {
    expect(pathFor("home", "de")).toBe("/");
    expect(pathFor("guide", "de")).toBe("/leitfaden");
    expect(pathFor("imprint", "de")).toBe("/impressum");
    expect(pathFor("privacy", "de")).toBe("/datenschutz");
    expect(pathFor("codeOfConduct", "de")).toBe("/code-of-conduct");
  });

  it("prefixes every English path with /en", () => {
    for (const key of routeKeys) {
      const path = routes[key].path.en;
      if (path === null) continue;
      expect(path === "/en" || path.startsWith("/en/")).toBe(true);
    }
  });

  it("resolves a path back to its page in both languages", () => {
    for (const key of routeKeys) {
      for (const locale of locales) {
        const path = routes[key].path[locale];
        if (path === null) continue;
        expect(routeKeyOf(path)).toBe(key);
      }
    }
  });

  it("falls back to German for pages that exist only in German", () => {
    expect(pathFor("imprint", "en")).toBe("/impressum");
    expect(alternatesFor("imprint").map((a) => a.locale)).toEqual(["de"]);
  });

  it("switches to the same page, not to the homepage", () => {
    expect(switchLocalePath("/leitfaden", "en")).toBe("/en/guide");
    expect(switchLocalePath("/en/guide", "de")).toBe("/leitfaden");
    expect(switchLocalePath("/", "en")).toBe("/en");
    expect(switchLocalePath("/en", "de")).toBe("/");
  });

  it("falls back to the homepage for an unknown path", () => {
    expect(switchLocalePath("/gibt-es-nicht", "en")).toBe("/en");
  });

  it("never points the switcher at the page you are already on", () => {
    // Impressum und Datenschutz gibt es nur auf Deutsch. Ohne diese Regel
    // zeigte "EN" dort auf denselben Pfad und täte beim Klick nichts.
    expect(switchLocalePath("/impressum", "en")).toBe("/en");
    expect(switchLocalePath("/datenschutz", "en")).toBe("/en");
    for (const key of routeKeys) {
      for (const locale of locales) {
        const from = routes[key].path[locale];
        if (from === null) continue;
        const to = locale === "de" ? "en" : "de";
        expect(switchLocalePath(from, to)).not.toBe(from);
      }
    }
  });
});

describe("sitemap.xml", () => {
  const xml = sitemapXml(indexablePages(testEvents));
  const listed = [...xml.matchAll(/<loc>https:\/\/psng\.info([^<]*)<\/loc>/g)].map((m) => m[1]);

  it("lists every page in every language it exists in", () => {
    const expected = routeKeys
      .flatMap((key) => locales.map((l) => routes[key].path[l]))
      .filter((p): p is string => p !== null);
    for (const path of expected) expect(listed, path).toContain(path);
  });

  it("lists every event page, the English one only when translated", () => {
    for (const e of testEvents.filter(hasPage)) {
      expect(listed, e.slug).toContain(`/events/${e.slug}`);
      expect(listed.includes(`/en/events/${e.slug}`), e.slug).toBe(isTranslated(e));
    }
  });

  it("lists nothing twice and no event without a page", () => {
    expect(new Set(listed).size).toBe(listed.length);
    for (const e of testEvents.filter((x) => !hasPage(x))) expect(listed).not.toContain(`/events/${e.slug}`);
  });

  it("gives every translated page its hreflang pair", () => {
    for (const key of routeKeys) {
      const alternates = alternatesFor(key);
      if (alternates.length < 2) continue;
      for (const alt of alternates) {
        expect(
          xml.includes(`hreflang="${alt.locale}" href="https://psng.info${alt.path}"`),
          `${key} → ${alt.locale}`,
        ).toBe(true);
      }
    }
  });
});
