import { describe, it, expect } from "vitest";
import {
  formatEventDate,
  getEventById,
  parseTimeRange,
  formatRelativeToToday,
  getEventAnchor,
  getHighlightEvents,
  getPastPlainEvents,
  getLatestRatedEvent,
  getTimelineEntries,
  getUpcomingAgenda,
  getUpcomingEvents,
  getUpcomingSeriesDates,
  hasAssets,
  hasContent,
  events,
  SERIES_OVERRIDES,
} from "./events";

describe("formatEventDate", () => {
  it("renders the calendar date, not a timezone-shifted one", () => {
    // `new Date("2026-07-28")` ist UTC-Mitternacht; westlich von UTC in
    // Lokalzeit formatiert ergäbe das den 27. Juli.
    expect(formatEventDate("2026-07-28", "de")).toBe("28. Juli 2026");
    expect(formatEventDate("2026-01-01", "de")).toBe("01. Januar 2026");
    expect(formatEventDate("2026-12-31", "de")).toBe("31. Dezember 2026");
  });
});

describe("getUpcomingEvents", () => {
  const ref = new Date(2026, 7, 11); // 11. August 2026, lokal

  it("includes an event happening today", () => {
    const ids = getUpcomingEvents(ref).map((e) => e.id);
    expect(ids).toContain("lecture-5"); // 2026-08-11
  });

  it("excludes events that are already over", () => {
    const ids = getUpcomingEvents(ref).map((e) => e.id);
    expect(ids).not.toContain("kickoff-2026-03-03");
  });

  it("returns events in chronological order", () => {
    const dates = getUpcomingEvents(ref).map((e) => e.date);
    expect(dates).toEqual([...dates].sort());
  });

  it("honours the reference date it is given", () => {
    const later = getUpcomingEvents(new Date(2026, 8, 1)); // 1. September
    expect(later.map((e) => e.id)).not.toContain("lecture-5");
  });
});

describe("getHighlightEvents", () => {
  const ref = new Date(2026, 6, 28);

  it("lists past events newest first", () => {
    const dates = getHighlightEvents(ref).map((e) => e.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("only includes past events that have material to show", () => {
    for (const e of getHighlightEvents(ref)) {
      expect(e.date < "2026-07-28").toBe(true);
      expect(Boolean(e.assets)).toBe(true);
    }
  });
});

describe("getPastPlainEvents", () => {
  const ref = new Date(2026, 7, 13); // 13. August 2026

  it("only includes past events with real content but no material yet", () => {
    for (const e of getPastPlainEvents(ref)) {
      expect(e.date < "2026-08-13").toBe(true);
      expect(hasContent(e)).toBe(true);
      expect(hasAssets(e)).toBe(false);
    }
  });

  it("moves a lecture to the highlights once its recording is up", () => {
    // Torsten Passies Lecture (11.8.) hat inzwischen eine Aufzeichnung.
    expect(getPastPlainEvents(ref).map((e) => e.id)).not.toContain("lecture-5");
    expect(getHighlightEvents(ref).map((e) => e.id)).toContain("lecture-5");
  });

  it("excludes empty placeholder lectures", () => {
    expect(getPastPlainEvents(ref).map((e) => e.id)).not.toContain("lecture-1");
  });

  it("never overlaps with getHighlightEvents", () => {
    const plainIds = new Set(getPastPlainEvents(ref).map((e) => e.id));
    const highlightIds = new Set(getHighlightEvents(ref).map((e) => e.id));
    for (const id of plainIds) {
      expect(highlightIds.has(id)).toBe(false);
    }
  });
});

describe("hasContent", () => {
  it("is true for events with a description, speaker, or registration link", () => {
    expect(hasContent(events.find((e) => e.id === "lecture-5")!)).toBe(true);
  });

  it("is false for bare placeholder lectures", () => {
    expect(hasContent(events.find((e) => e.id === "lecture-1")!)).toBe(false);
  });
});

describe("gathering-2026-08-08", () => {
  it("carries a full photo gallery, with alt text for every photo", () => {
    const ev = events.find((e) => e.id === "gathering-2026-08-08")!;
    expect(ev.featuredLarge).toBe(true);
    expect(ev.assets?.photos?.length).toBeGreaterThan(0);
    expect(ev.assets?.photoAlts?.length).toBe(ev.assets?.photos?.length);
  });
});

describe("getEventAnchor", () => {
  it("derives a unique anchor for every event", () => {
    const anchors = events.map(getEventAnchor);
    expect(new Set(anchors).size).toBe(events.length);
  });

  it("uses the prefix the events section keys its tab on", () => {
    expect(getEventAnchor(events[0])).toMatch(/^event-/);
  });
});

describe("getUpcomingSeriesDates", () => {
  const ref = new Date(2026, 8, 1); // 1. September 2026

  it("computes the second Tuesday of each month", () => {
    // September bis November fehlen: Auf dem 08.09. steht lecture-6, auf dem
    // 20.10. die Lecture von Timo Schmidt, auf dem 03.11. (Override, erster
    // Dienstag) die Lecture von Tomislav Majić.
    expect(getUpcomingSeriesDates(3, ref).map((s) => s.date)).toEqual([
      "2026-12-08",
      "2027-01-12",
      "2027-02-09",
    ]);
  });

  it("lets an override replace its month's date instead of adding to it", () => {
    const dates = getUpcomingSeriesDates(6, ref).map((s) => s.date);
    for (const { date } of SERIES_OVERRIDES) {
      const month = dates.filter((d) => d.startsWith(date.slice(0, 7)));
      // Entweder der Termin aus dem Override – oder gar keiner, wenn dort
      // schon ein echtes Event steht. Der berechnete Termin desselben Monats
      // darf nie danebenstehen.
      expect(month.every((d) => d === date)).toBe(true);
      if (!events.some((e) => e.date === date)) expect(dates).toContain(date);
    }
  });

  it("keeps the computed date out even when the override date is taken", () => {
    // Der 13.10. wäre der zweite Dienstag. Er darf auch dann nicht erscheinen,
    // wenn der Oktobertermin selbst schon als Event ausgeschrieben ist –
    // sonst stünde im Zeitstrahl eine Lecture, die es nicht gibt.
    const dates = getUpcomingSeriesDates(6, ref).map((s) => s.date);
    expect(dates).not.toContain("2026-10-13");
    expect(events.some((e) => e.date === "2026-10-20")).toBe(true);
  });

  it("carries an override's own label", () => {
    const dates = getUpcomingSeriesDates(12, ref);
    for (const { date, labelKey } of SERIES_OVERRIDES) {
      // Steht auf dem Termin bereits ein Event, taucht er hier nicht auf –
      // dann gibt es auch kein Label zu prüfen.
      const entry = dates.find((s) => s.date === date);
      if (entry) expect(entry.labelKey).toBe(labelKey);
    }
  });

  it("skips dates that already carry a real event", () => {
    // Der 08.09. ist ein Reihentermin – dort steht aber schon lecture-6 mit
    // Thema und Speaker. Der Termin darf nicht doppelt im Zeitstrahl landen.
    expect(getUpcomingSeriesDates(3, ref).map((s) => s.date)).not.toContain(
      "2026-09-08",
    );
    expect(events.some((e) => e.date === "2026-09-08")).toBe(true);
  });

  it("never looks backwards", () => {
    // Mitten im Monat, nachdem der Oktobertermin durch ist.
    for (const s of getUpcomingSeriesDates(3, new Date(2026, 9, 21))) {
      expect(s.date > "2026-10-21").toBe(true);
    }
  });

  it("still lists a date that falls on the reference day", () => {
    // Eine Lecture heute Abend ist kein vergangener Termin.
    expect(getUpcomingSeriesDates(1, new Date(2026, 11, 8))[0]?.date).toBe(
      "2026-12-08",
    );
  });
});

describe("getTimelineEntries", () => {
  const ref = new Date(2026, 8, 1); // 1. September 2026

  it("orders the whole strand descending – furthest future on top", () => {
    const { upcoming, past } = getTimelineEntries(ref);
    const dates = [...upcoming, ...past].map((e) => e.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("pads the upcoming half with series dates, not just events", () => {
    const { upcoming } = getTimelineEntries(ref);
    expect(upcoming.filter((e) => e.kind === "event").length).toBeGreaterThan(0);
    expect(upcoming.filter((e) => e.kind === "series").length).toBeGreaterThan(0);
  });

  it("counts a milestone dated today as already past", () => {
    // Anders als ein Termin, der heute erst noch stattfindet.
    const { past } = getTimelineEntries(ref);
    expect(past.map((e) => e.id)).toContain("milestone-medien-blog-2026-09-01");
  });

  it("leaves empty placeholder lectures out entirely", () => {
    const { upcoming, past } = getTimelineEntries(ref);
    const ids = [...upcoming, ...past].map((e) => e.id);
    expect(ids).not.toContain(getEventAnchor(events.find((e) => e.id === "lecture-1")!));
  });

  it("gives every entry the column the filter matches on", () => {
    const { upcoming, past } = getTimelineEntries(ref);
    for (const entry of [...upcoming, ...past]) {
      expect(["vortraege", "community"]).toContain(entry.column);
    }
  });

  it("renders the gathering as the large feature card", () => {
    const entry = getTimelineEntries(ref).past.find(
      (e) => e.id === "event-gathering-2026-08-08",
    );
    expect(entry?.kind === "event" && entry.variant).toBe("feature");
  });
});

describe("formatRelativeToToday", () => {
  const ref = new Date(2026, 8, 1);

  it("names near dates in days and distant ones in weeks", () => {
    expect(formatRelativeToToday("2026-09-01", "de", ref)).toBe("heute");
    expect(formatRelativeToToday("2026-09-02", "de", ref)).toBe("morgen");
    expect(formatRelativeToToday("2026-09-08", "de", ref)).toBe("in 7 Tagen");
    expect(formatRelativeToToday("2026-10-13", "de", ref)).toBe("in 6 Wochen");
    expect(formatRelativeToToday("2026-12-08", "de", ref)).toBe("in 3 Monaten");
  });
});

describe("parseTimeRange", () => {
  it("reads start and end out of the display text", () => {
    expect(parseTimeRange("19:00 – 20:00")).toEqual({ start: "19:00", end: "20:00" });
  });

  it("ignores what comes after them", () => {
    // Der Einlass ist keine dritte Uhrzeit des Termins.
    expect(parseTimeRange("16:00 bis 20:00 Uhr (Einlass ab 15:30)")).toEqual({
      start: "16:00",
      end: "20:00",
    });
  });

  it("pads a single-digit hour", () => {
    expect(parseTimeRange("9:30 – 11:00").start).toBe("09:30");
  });

  it("guesses nothing when there is no time", () => {
    expect(parseTimeRange("ganztägig")).toEqual({});
    expect(parseTimeRange(undefined)).toEqual({});
  });
});

describe("noCalendar", () => {
  it("keeps the conferences we were only guests at out of the calendar", () => {
    // Ein Ganztagsblock über drei Tage Funkhaus sagt nichts darüber, wann wir
    // uns dort treffen – für diese gilt der Kalender der Konferenz.
    for (const id of ["presence-tryp-expo-2026", "presence-icpr-2026", "presence-alps-2026"]) {
      expect(getEventById(id)?.noCalendar, id).toBe(true);
    }
  });

  it("leaves it off everything else", () => {
    const flagged = events.filter((e) => e.noCalendar).map((e) => e.id);
    // Dazu die Majić-Lecture, solange die Uhrzeit fehlt.
    expect(flagged).toHaveLength(4);
  });
});

describe("getUpcomingAgenda", () => {
  const ref = new Date(2026, 9, 8); // 8. Oktober 2026, lokal

  it("lists the nearest date first, never a later one above an earlier one", () => {
    const dates = getUpcomingAgenda(ref).map((e) => e.date);
    expect(dates.length).toBeGreaterThan(0);
    expect(dates).toEqual([...dates].sort());
  });

  it("contains nothing that is already over", () => {
    for (const entry of getUpcomingAgenda(ref)) {
      expect(entry.date >= "2026-10-08").toBe(true);
    }
  });

  it("puts the conference tomorrow ahead of the lecture on 20 October", () => {
    const ids = getUpcomingAgenda(ref).map((e) => e.id);
    expect(ids.indexOf("event-presence-alps-2026")).toBeLessThan(
      ids.indexOf("event-lecture-schmidt-2026-10-20"),
    );
  });
});

describe("getLatestRatedEvent", () => {
  it("returns a past event that carries both attendance and rating", () => {
    const event = getLatestRatedEvent(new Date(2026, 9, 8));
    expect(event?.assets?.attendees).toBeGreaterThan(0);
    expect(event?.assets?.rating).toBeTruthy();
    expect(event!.date < "2026-10-08").toBe(true);
  });
});
