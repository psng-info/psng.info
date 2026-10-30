import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { copy } from "@/i18n/copy";
import { formatEventDate, formatEventTime, formatRelativeToToday } from "./format";
import { bySlug, testEvents as events, withChanges } from "./testData";
import { cardAction } from "./view";

/*
 * Was das Schema in content.config.ts nicht prüfen kann, weil es über einen
 * einzelnen Eintrag hinausgeht oder Dateien außerhalb der Collection betrifft.
 */
describe("Inhalte", () => {
  it("vergibt jeden Slug und jeden früheren Slug nur einmal", () => {
    const all = events.flatMap((e) => [e.slug, ...(e.previousSlugs ?? [])]);
    expect(new Set(all).size).toBe(all.length);
  });

  it("hält Slugs URL-tauglich", () => {
    for (const e of events) expect(e.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("leitet jeden früheren Slug per 301 weiter", () => {
    // Ein geteilter Link auf eine umbenannte Seite darf nicht ins Leere laufen.
    const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8")) as {
      redirects?: { source: string; destination: string; permanent?: boolean }[];
    };
    for (const e of events) {
      for (const old of e.previousSlugs ?? []) {
        const r = vercel.redirects?.find((x) => x.source === `/events/${old}`);
        expect(r?.destination, old).toBe(`/events/${e.slug}`);
        expect(r?.permanent, old).toBe(true);
      }
    }
  });

  it("gibt jedem Foto einen Alt-Text", () => {
    for (const e of events) {
      for (const [i, photo] of (e.photos ?? []).entries()) {
        expect(photo.alt, `${e.slug}, Foto ${i + 1}`).toBeTruthy();
      }
    }
  });

  it("verweist mit partOf nur auf Events, die es gibt", () => {
    const slugs = new Set(events.map((e) => e.slug));
    for (const e of events.filter((x) => x.partOf)) expect(slugs.has(e.partOf!), e.slug).toBe(true);
  });
});

describe("formatEventTime", () => {
  it("baut die Uhrzeit aus Anfang, Ende und Zusatz", () => {
    expect(formatEventTime(bySlug("abend-rund-um-psychedelika"), "de")).toBe("16:00 – 20:00, Einlass ab 15:30");
    expect(formatEventTime(bySlug("abend-rund-um-psychedelika"), "en")).toBe("16:00 – 20:00, doors from 15:30");
  });

  it("nennt ganztägige Events ganztägig", () => {
    expect(formatEventTime(bySlug("alps-conference-2026"), "de")).toBe("ganztägig");
  });

  it("sagt, wenn die Uhrzeit noch fehlt, statt eine zu erfinden", () => {
    const e = withChanges("lecture-tomislav-majic", { timeTbd: true, startTime: undefined, endTime: undefined });
    expect(formatEventTime(e, "de")).toBe("Uhrzeit folgt");
  });
});

describe("formatEventDate", () => {
  it("renders the calendar date, not a timezone-shifted one", () => {
    expect(formatEventDate("2026-07-28", "de")).toBe("28. Juli 2026");
    expect(formatEventDate("2026-01-01", "de")).toBe("01. Januar 2026");
  });
});

describe("formatRelativeToToday", () => {
  it("names near dates in days and distant ones in weeks", () => {
    const ref = new Date(2026, 8, 1);
    expect(formatRelativeToToday("2026-09-01", "de", ref)).toBe("heute");
    expect(formatRelativeToToday("2026-09-02", "de", ref)).toBe("morgen");
    expect(formatRelativeToToday("2026-09-08", "de", ref)).toBe("in 7 Tagen");
    expect(formatRelativeToToday("2026-10-13", "de", ref)).toBe("in 6 Wochen");
    expect(formatRelativeToToday("2026-12-08", "de", ref)).toBe("in 3 Monaten");
  });
});

describe("cardAction", () => {
  const before = new Date(2026, 10, 1);
  const after = new Date(2026, 10, 20);

  it("führt vor dem Termin zur Seite, mit Anmeldung im Namen", () => {
    expect(cardAction(bySlug("lecture-tomislav-majic"), "de", copy.de, before)).toEqual({
      href: "/events/lecture-tomislav-majic",
      label: copy.de.eventPage.detailsAndRegister,
      external: false,
    });
  });

  it("führt nachher zum Rückblick, wenn es Material gibt", () => {
    expect(cardAction(bySlug("lecture-torsten-passie"), "en", copy.en, after)?.label).toBe(copy.en.eventPage.toRecap);
    expect(cardAction(bySlug("lecture-torsten-passie"), "en", copy.en, after)?.href).toBe(
      "/en/events/lecture-torsten-passie",
    );
  });

  it("schickt Konferenzen ohne eigene Seite nach außen", () => {
    const action = cardAction(bySlug("icpr-2026"), "de", copy.de, after);
    expect(action?.external).toBe(true);
    expect(action?.href).toMatch(/^https:\/\//);
  });
});
