import { LECTURE_SERIES, SERIES_OVERRIDES } from "./series";
import type { EventColumn, Feature, Milestone, SeriesDate, SiteEvent } from "./types";

/*
 * Alles, was davon abhängt, welcher Tag heute ist: was kommt, was vorbei ist,
 * was im Hero steht. Reine Funktionen über die Daten und ein Referenzdatum –
 * beim Build rechnet sie Astro mit dem Build-Datum, im Browser rechnen die
 * Inseln sie mit dem heutigen Datum nach. Dieselbe Funktion an beiden
 * Stellen, damit beide dasselbe meinen.
 */

/**
 * `new Date("2026-07-28")` wird als UTC-Mitternacht geparst und anschließend in
 * Lokalzeit formatiert – westlich von UTC ergibt das den Vortag. Die Datums-
 * angaben sind aber kalendarisch gemeint, also explizit lokal konstruieren.
 */
export function parseEventDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Ganze Kalendertage von `from` bis `iso`; heute ist 0, gestern -1. */
export function daysUntil(iso: string, from: Date): number {
  return Math.round((startOfDay(parseEventDate(iso)) - startOfDay(from)) / DAY_MS);
}

export function toIsoDate(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// ── Lebenszyklus ─────────────────────────────────────────────────────────────

export type EventPhase = "upcoming" | "today" | "past";

/**
 * Wo ein Event zeitlich steht. Ein mehrtägiges Event ist bis zu seinem
 * letzten Tag „heute“, nicht ab dem zweiten Tag schon vorbei.
 */
export function eventPhase(e: SiteEvent, ref: Date): EventPhase {
  if (daysUntil(e.date, ref) > 0) return "upcoming";
  if (daysUntil(e.endDate ?? e.date, ref) >= 0) return "today";
  return "past";
}

export function isPast(e: SiteEvent, ref: Date): boolean {
  return eventPhase(e, ref) === "past";
}

/** Ob es Material zum Ansehen gibt – Aufzeichnung, Fotos, Folien, Zahlen. */
export function hasAssets(e: SiteEvent): boolean {
  return Boolean(
    e.recording || e.short || e.slidesUrl || e.recapUrl || e.attendees || e.photos?.length || e.externalUrl,
  );
}

/** Ob ein Event mehr als nur Titel und Datum trägt. */
export function hasContent(e: SiteEvent): boolean {
  return Boolean(e.description || e.speaker || e.registrationUrl);
}

/**
 * Ob das Event eine eigene Seite bekommt. Fremde Konferenzen nur, wenn wir
 * eigenes Material haben (`ownPage`) – sonst wäre die Seite eine dünne Kopie
 * der Konferenz-Website. Leere Platzhalter nie.
 */
export function hasPage(e: SiteEvent): boolean {
  if (e.role === "external" && !e.ownPage) return false;
  return hasContent(e) || hasAssets(e);
}

/**
 * Ob „Zum Kalender hinzufügen“ angeboten wird. Nicht für Konferenzen, bei
 * denen wir nur zu Gast waren – dort gilt deren Kalender –, nicht ohne
 * feste Uhrzeit und nicht für abgesagte oder verschobene Termine.
 */
export function hasCalendar(e: SiteEvent): boolean {
  return e.role !== "external" && !e.timeTbd && e.status === "scheduled";
}

/** Ob die Anmeldung angeboten wird: kommend, stattfindend, mit offenem Link. */
export function canRegister(e: SiteEvent, ref: Date): boolean {
  return (
    Boolean(e.registrationUrl) &&
    e.status === "scheduled" &&
    e.registrationState === "open" &&
    !isPast(e, ref)
  );
}

// ── Listen ───────────────────────────────────────────────────────────────────

const byDateAsc = (a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date);
const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

export function getUpcomingEvents(events: SiteEvent[], ref: Date): SiteEvent[] {
  return events.filter((e) => !isPast(e, ref)).sort(byDateAsc);
}

/** Vergangene Events mit Material – neueste zuerst, wie man ein Archiv liest. */
export function getHighlightEvents(events: SiteEvent[], ref: Date): SiteEvent[] {
  return events.filter((e) => isPast(e, ref) && hasAssets(e)).sort(byDateDesc);
}

/**
 * Vergangene Events ohne Material, aber mit echtem Inhalt – etwa eine
 * gehaltene Lecture ohne Aufzeichnung. Reine Platzhalter bleiben unsichtbar.
 */
export function getPastPlainEvents(events: SiteEvent[], ref: Date): SiteEvent[] {
  return events.filter((e) => isPast(e, ref) && !hasAssets(e) && hasContent(e)).sort(byDateDesc);
}

/** Die Vorträge eines Abends, in der Reihenfolge, in der sie liefen. */
export function getChildEvents(events: SiteEvent[], slug: string): SiteEvent[] {
  return events.filter((e) => e.partOf === slug).sort(byDateAsc);
}

/**
 * Das jüngste vergangene Event mit Rückmeldung der Teilnehmenden – ein Beleg,
 * dass Veranstaltungen stattfinden und ankommen, ohne Zahlen zu erfinden.
 */
export function getLatestRatedEvent(events: SiteEvent[], ref: Date): SiteEvent | undefined {
  return getHighlightEvents(events, ref).find((e) => e.attendees && e.rating);
}

// ── Lecture-Reihe ────────────────────────────────────────────────────────────

/** Datum des n-ten `weekday` eines Monats. `month` ist 0-basiert wie bei `Date`. */
function nthWeekdayOfMonth(year: number, month: number, weekday: number, ordinal: number): Date {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (ordinal - 1) * 7);
}

/**
 * Die nächsten Termine der Lecture-Reihe, aufsteigend. Termine, für die schon
 * ein echtes Event steht, fallen raus – sonst stünde derselbe Abend zweimal
 * da, einmal mit Thema und einmal ohne. Weicht ein Monat vom Takt ab, gilt
 * sein Eintrag aus `SERIES_OVERRIDES` statt des berechneten Datums.
 */
export function getUpcomingSeriesDates(events: SiteEvent[], count: number, ref: Date): SeriesDate[] {
  const today = startOfDay(ref);
  const booked = new Set(events.map((e) => e.date));
  const overrides = new Map(SERIES_OVERRIDES.map((o) => [o.date.slice(0, 7), o] as const));
  const out: SeriesDate[] = [];

  for (let i = 0; out.length < count && i < count + 12; i++) {
    const d = nthWeekdayOfMonth(ref.getFullYear(), ref.getMonth() + i, LECTURE_SERIES.weekday, LECTURE_SERIES.ordinal);
    const override = overrides.get(toIsoDate(d).slice(0, 7));
    const iso = override?.date ?? toIsoDate(d);
    if (startOfDay(parseEventDate(iso)) < today || booked.has(iso)) continue;
    out.push({
      id: `series-${iso}`,
      date: iso,
      startTime: LECTURE_SERIES.startTime,
      endTime: LECTURE_SERIES.endTime,
      location: LECTURE_SERIES.location,
      column: LECTURE_SERIES.column,
      labelKey: override?.labelKey,
    });
  }
  return out;
}

// ── Zeitstrahl ───────────────────────────────────────────────────────────────

/** Wie eine vergangene Veranstaltung im Archiv gerendert wird. */
export type EventVariant = "feature" | "highlight" | "plain";

export type TimelineEntry =
  | { kind: "event"; id: string; date: string; column: EventColumn; variant: EventVariant; event: SiteEvent }
  | { kind: "series"; id: string; date: string; column: EventColumn; series: SeriesDate }
  | { kind: "milestone"; id: string; date: string; column: EventColumn; milestone: Milestone };

export type AgendaEntry = Extract<TimelineEntry, { kind: "event" | "series" }>;

function toEventEntry(event: SiteEvent): TimelineEntry {
  return {
    kind: "event",
    id: event.slug,
    date: event.date,
    column: event.column,
    variant: event.featuredLarge ? "feature" : hasAssets(event) ? "highlight" : "plain",
    event,
  };
}

function toSeriesEntry(series: SeriesDate): TimelineEntry {
  return { kind: "series", id: series.id, date: series.date, column: series.column, series };
}

/**
 * Der Zeitstrahl in zwei Hälften, beide absteigend sortiert. Aneinandergehängt
 * ergeben sie einen durchgehend chronologischen Strang: der am weitesten
 * entfernte Termin oben, dann heute, dann rückwärts durch alles Gewesene.
 */
export function getTimelineEntries(
  events: SiteEvent[],
  milestones: Milestone[],
  ref: Date,
): { upcoming: TimelineEntry[]; past: TimelineEntry[] } {
  const upcoming = [
    ...getUpcomingEvents(events, ref).map(toEventEntry),
    ...getUpcomingSeriesDates(events, 1, ref).map(toSeriesEntry),
  ].sort(byDateDesc);

  const past = [
    ...getHighlightEvents(events, ref).map(toEventEntry),
    ...getPastPlainEvents(events, ref).map(toEventEntry),
    ...milestones
      .filter((m) => daysUntil(m.date, ref) <= 0)
      .map((milestone): TimelineEntry => ({
        kind: "milestone",
        id: milestone.id,
        date: milestone.date,
        column: milestone.column,
        milestone,
      })),
  ].sort(byDateDesc);

  return { upcoming, past };
}

/**
 * Was als Nächstes ansteht, aufsteigend. Dieselben Einträge wie die obere
 * Hälfte des Zeitstrahls, nur von heute aus nach vorn gelesen – welche
 * Termine als kommend gelten, wird an genau einer Stelle entschieden.
 * Abgesagte und verschobene Termine stehen im Archiv, nicht in der Vorschau.
 */
export function getUpcomingAgenda(events: SiteEvent[], ref: Date): AgendaEntry[] {
  return getTimelineEntries(events, [], ref)
    .upcoming.filter(
      (entry): entry is AgendaEntry =>
        entry.kind === "series" || (entry.kind === "event" && entry.event.status === "scheduled"),
    )
    .sort(byDateAsc);
}

// ── Hero ─────────────────────────────────────────────────────────────────────

/** Wie weit ein Termin höchstens entfernt sein darf, um im Hero zu stehen. */
export const HERO_WINDOW_DAYS = 42;
/** Wie alt ein Rückblick höchstens sein darf, um im Hero zu stehen. */
export const HERO_RECAP_DAYS = 120;

export type HeroSlot =
  | { kind: "event"; event: SiteEvent }
  | { kind: "series"; series: SeriesDate }
  | { kind: "feature"; feature: Feature }
  | { kind: "recap"; event: SiteEvent }
  | { kind: "none" };

/**
 * Was die eine Karte im Hero zeigt – nie mehrere im Wechsel. Die Reihenfolge:
 *
 * 1. das nächste stattfindende Event in den nächsten 42 Tagen (inklusive),
 * 2. sonst der aktive Hinweis mit der höchsten Priorität,
 * 3. sonst der nächste Termin der Lecture-Reihe im selben Fenster,
 * 4. sonst der jüngste Rückblick mit Fotos, höchstens 120 Tage alt,
 * 5. sonst nichts.
 *
 * Der Hinweis steht vor dem Reihentermin, weil die Reihe jeden Monat einen
 * hat: Andersherum käme ein Hinweis nie zum Zug. Ein Hinweis ist eine
 * bewusste Entscheidung mit festem Zeitraum, ein Reihentermin ohne Thema nur
 * ein freigehaltener Abend. Weder er noch ein Termin jenseits der 42 Tage
 * geht verloren: Die Liste „Nächste Termine“ direkt darunter zeigt beide.
 *
 * `series` ist nur für Tests offen – ohne den Parameter rechnet die Funktion
 * die Reihe selbst aus.
 */
export function getHeroSlot(
  events: SiteEvent[],
  features: Feature[],
  ref: Date,
  series: SeriesDate[] = getUpcomingSeriesDates(events, 1, ref),
): HeroSlot {
  const inWindow = (iso: string) => {
    const days = daysUntil(iso, ref);
    return days >= 0 && days <= HERO_WINDOW_DAYS;
  };

  // Fremde Konferenzen werben nicht für sich selbst im Hero – sie stehen in
  // der Terminliste darunter.
  const event = getUpcomingEvents(events, ref).find(
    (e) =>
      e.role !== "external" &&
      e.status === "scheduled" &&
      (eventPhase(e, ref) === "today" || inWindow(e.date)),
  );
  if (event) return { kind: "event", event };

  const feature = features
    .map((f, index) => ({ f, index }))
    .filter(({ f }) => daysUntil(f.from, ref) <= 0 && daysUntil(f.until, ref) >= 0)
    .sort((a, b) => b.f.priority - a.f.priority || b.f.from.localeCompare(a.f.from) || a.index - b.index)[0]?.f;
  if (feature) return { kind: "feature", feature };

  const next = series[0];
  if (next && inWindow(next.date)) return { kind: "series", series: next };

  const recap = getHighlightEvents(events, ref).find(
    (e) => e.photos?.length && -daysUntil(e.endDate ?? e.date, ref) <= HERO_RECAP_DAYS,
  );
  if (recap) return { kind: "recap", event: recap };

  return { kind: "none" };
}
