import { describe, expect, it } from "vitest";
import {
  HERO_RECAP_DAYS,
  HERO_WINDOW_DAYS,
  canRegister,
  eventPhase,
  getChildEvents,
  getHeroSlot,
  getHighlightEvents,
  getLatestRatedEvent,
  getPastPlainEvents,
  getTimelineEntries,
  getUpcomingAgenda,
  getUpcomingEvents,
  getUpcomingSeriesDates,
  hasAssets,
  hasCalendar,
  hasContent,
  hasPage,
} from "./schedule";
import { SERIES_OVERRIDES } from "./series";
import { bySlug, testEvents as events, testMilestones as milestones, withChanges } from "./testData";
import type { Feature } from "./types";

describe("getUpcomingEvents", () => {
  const ref = new Date(2026, 7, 11); // 11. August 2026, lokal

  it("includes an event happening today", () => {
    expect(getUpcomingEvents(events, ref).map((e) => e.slug)).toContain("lecture-torsten-passie");
  });

  it("excludes events that are already over", () => {
    expect(getUpcomingEvents(events, ref).map((e) => e.slug)).not.toContain("kickoff");
  });

  it("returns events in chronological order", () => {
    const dates = getUpcomingEvents(events, ref).map((e) => e.date);
    expect(dates).toEqual([...dates].sort());
  });

  it("keeps a multi-day conference upcoming until its last day", () => {
    // ALPS: 9.–10. Oktober. Am 10. ist sie nicht vorbei.
    expect(eventPhase(bySlug("alps-conference-2026"), new Date(2026, 9, 10))).toBe("today");
    expect(eventPhase(bySlug("alps-conference-2026"), new Date(2026, 9, 11))).toBe("past");
  });
});

describe("getHighlightEvents and getPastPlainEvents", () => {
  const ref = new Date(2026, 7, 13); // 13. August 2026

  it("lists past events newest first", () => {
    const dates = getHighlightEvents(events, ref).map((e) => e.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("moves a lecture to the highlights once its recording is up", () => {
    expect(getPastPlainEvents(events, ref).map((e) => e.slug)).not.toContain("lecture-torsten-passie");
    expect(getHighlightEvents(events, ref).map((e) => e.slug)).toContain("lecture-torsten-passie");
  });

  it("excludes empty placeholder lectures", () => {
    expect(getPastPlainEvents(events, ref).map((e) => e.slug)).not.toContain("lecture-1");
  });

  it("never overlaps", () => {
    const plain = new Set(getPastPlainEvents(events, ref).map((e) => e.slug));
    for (const e of getHighlightEvents(events, ref)) expect(plain.has(e.slug)).toBe(false);
  });
});

describe("hasContent, hasPage, hasCalendar", () => {
  it("gives empty placeholder lectures no page", () => {
    expect(hasContent(bySlug("lecture-1"))).toBe(false);
    expect(hasPage(bySlug("lecture-1"))).toBe(false);
  });

  it("gives conferences we only attended no page of their own – except ALPS", () => {
    expect(hasPage(bySlug("tryp-expo-2026"))).toBe(false);
    expect(hasPage(bySlug("icpr-2026"))).toBe(false);
    expect(hasPage(bySlug("alps-conference-2026"))).toBe(true);
  });

  it("gives every own and co-hosted event with content a page", () => {
    for (const e of events.filter((x) => x.role !== "external" && (hasContent(x) || hasAssets(x)))) {
      expect(hasPage(e), e.slug).toBe(true);
    }
  });

  it("keeps the conferences we were only guests at out of the calendar", () => {
    expect(events.filter((e) => !hasCalendar(e)).map((e) => e.slug).sort()).toEqual(
      ["alps-conference-2026", "icpr-2026", "tryp-expo-2026"],
    );
  });

  it("offers no calendar entry without a fixed time, or once cancelled", () => {
    expect(hasCalendar(withChanges("lecture-tomislav-majic", { timeTbd: true, startTime: undefined }))).toBe(false);
    expect(hasCalendar(withChanges("lecture-tomislav-majic", { status: "cancelled" }))).toBe(false);
  });

  it("stops registration when the event is over, full or cancelled", () => {
    const before = new Date(2026, 10, 1);
    expect(canRegister(bySlug("lecture-tomislav-majic"), before)).toBe(true);
    expect(canRegister(bySlug("lecture-tomislav-majic"), new Date(2026, 10, 5))).toBe(false);
    expect(canRegister(withChanges("lecture-tomislav-majic", { registrationState: "full" }), before)).toBe(false);
    expect(canRegister(withChanges("lecture-tomislav-majic", { status: "cancelled" }), before)).toBe(false);
  });
});

describe("getChildEvents", () => {
  it("collects the talks of an evening from the talks themselves", () => {
    expect(getChildEvents(events, "abend-rund-um-psychedelika").map((e) => e.slug)).toEqual([
      "talk-prateep-beed",
    ]);
  });
});

describe("getUpcomingSeriesDates", () => {
  const ref = new Date(2026, 8, 1); // 1. September 2026

  it("computes the second Tuesday, skipping months that carry a real event", () => {
    // September (Miguel), Oktober (Override 20.10., Timo Schmidt) und
    // November (Override 4.11., Majić) sind schon belegt; Dezember per Override am 3.
    expect(getUpcomingSeriesDates(events, 3, ref).map((s) => s.date)).toEqual([
      "2026-12-03",
      "2027-01-12",
      "2027-02-09",
    ]);
  });

  it("lets an override replace its month's date instead of adding to it", () => {
    const dates = getUpcomingSeriesDates(events, 6, ref).map((s) => s.date);
    for (const { date } of SERIES_OVERRIDES) {
      expect(dates.filter((d) => d.startsWith(date.slice(0, 7))).every((d) => d === date)).toBe(true);
    }
    expect(dates).not.toContain("2026-10-13");
  });

  it("still lists a date that falls on the reference day", () => {
    expect(getUpcomingSeriesDates(events, 1, new Date(2027, 0, 12))[0]?.date).toBe("2027-01-12");
  });
});

describe("getTimelineEntries", () => {
  const ref = new Date(2026, 8, 1);

  it("orders the whole strand descending – furthest future on top", () => {
    const { upcoming, past } = getTimelineEntries(events, milestones, ref);
    const dates = [...upcoming, ...past].map((e) => e.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("counts a milestone dated today as already past", () => {
    expect(getTimelineEntries(events, milestones, ref).past.map((e) => e.id)).toContain("medien-blog");
  });

  it("renders the evening as the large feature card", () => {
    const entry = getTimelineEntries(events, milestones, ref).past.find((e) => e.id === "abend-rund-um-psychedelika");
    expect(entry?.kind === "event" && entry.variant).toBe("feature");
  });
});

describe("getUpcomingAgenda", () => {
  const ref = new Date(2026, 9, 8); // 8. Oktober 2026

  it("lists the nearest date first and nothing that is over", () => {
    const dates = getUpcomingAgenda(events, ref).map((e) => e.date);
    expect(dates.length).toBeGreaterThan(0);
    expect(dates).toEqual([...dates].sort());
    expect(dates.every((d) => d >= "2026-10-08")).toBe(true);
  });

  it("leaves cancelled events out of the preview", () => {
    const changed = events.map((e) => (e.slug === "lecture-timo-schmidt" ? { ...e, status: "cancelled" as const } : e));
    expect(getUpcomingAgenda(changed, ref).map((e) => e.id)).not.toContain("lecture-timo-schmidt");
  });
});

describe("getLatestRatedEvent", () => {
  it("returns a past event that carries both attendance and rating", () => {
    const e = getLatestRatedEvent(events, new Date(2026, 9, 8));
    expect(e?.attendees).toBeGreaterThan(0);
    expect(e?.rating).toBeTruthy();
  });
});

describe("getHeroSlot", () => {
  const feature = (changes: Partial<Feature> = {}): Feature => ({
    id: "f",
    title: "Orga-Team gesucht",
    text: "…",
    cta: { label: "Mitmachen", url: "https://example.org" },
    from: "2026-12-10",
    until: "2027-01-31",
    priority: 1,
    ...changes,
  });
  const dayBefore = (iso: string, days: number) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d - days);
  };

  it("shows the next event, also on its own day", () => {
    const slot = getHeroSlot(events, [], new Date(2026, 10, 4));
    expect(slot.kind === "event" && slot.event.slug).toBe("lecture-tomislav-majic");
  });

  it(`takes an event exactly ${HERO_WINDOW_DAYS} days ahead, but not one day more`, () => {
    // Nur die Majić-Lecture, damit kein früheres Event die Grenze verdeckt.
    const only = [bySlug("lecture-tomislav-majic")];
    const at = getHeroSlot(only, [], dayBefore("2026-11-04", HERO_WINDOW_DAYS), []);
    expect(at.kind === "event" && at.event.slug).toBe("lecture-tomislav-majic");
    expect(getHeroSlot(only, [], dayBefore("2026-11-04", HERO_WINDOW_DAYS + 1), []).kind).toBe("none");
  });

  it("never gives the hero to a conference we only attend", () => {
    const slot = getHeroSlot(events, [], new Date(2026, 9, 5)); // ALPS am 9.10.
    expect(slot.kind === "event" && slot.event.role).not.toBe("external");
  });

  it("skips a cancelled event and falls through to what comes next", () => {
    const changed = events.map((e) => (e.slug === "lecture-tomislav-majic" ? { ...e, status: "cancelled" as const } : e));
    expect(getHeroSlot(changed, [], new Date(2026, 10, 1)).kind).not.toBe("event");
  });

  it("puts an active feature above a lecture date without topic", () => {
    const slot = getHeroSlot(events, [feature({ from: "2026-11-10", until: "2026-11-30" })], new Date(2026, 10, 20));
    expect(slot.kind).toBe("feature");
  });

  it("falls back to the next lecture date when no event is near", () => {
    const slot = getHeroSlot(events, [], new Date(2026, 10, 20));
    expect(slot.kind === "series" && slot.series.date).toBe("2026-12-03");
  });

  it("shows the active feature with the highest priority when nothing is scheduled", () => {
    const slot = getHeroSlot(events, [feature({ id: "low" }), feature({ id: "high", priority: 2 })], new Date(2026, 11, 20));
    expect(slot.kind === "feature" && slot.feature.id).toBe("high");
  });

  it("ignores features outside their window, both ends inclusive", () => {
    const f = feature({ from: "2026-12-10", until: "2026-12-12" });
    expect(getHeroSlot(events, [f], new Date(2026, 11, 12)).kind).toBe("feature");
    expect(getHeroSlot(events, [f], new Date(2026, 11, 13)).kind).not.toBe("feature");
  });

  it(`falls back to a recap no older than ${HERO_RECAP_DAYS} days, then to nothing`, () => {
    // Ohne kommende Termine: nur vergangene Events.
    // Ohne Reihentermine – die Reihe hat sonst jeden Monat einen.
    const past = events.filter((e) => e.date < "2026-11-01");
    const slot = getHeroSlot(past, [], new Date(2027, 0, 20), []);
    expect(slot.kind).toBe("recap");
    expect(getHeroSlot(past, [], new Date(2027, 5, 1), []).kind).toBe("none");
  });
});
