import type { CalendarEvent } from "@/lib/calendar";
import type { Copy } from "@/i18n/copy";
import type { Locale } from "@/i18n/locale";
import { pick } from "@/i18n/localized";
import { pathFor } from "@/i18n/routes";
import { absoluteUrl } from "@/lib/seo/site";
import { eventPath } from "./paths";
import { hasCalendar, hasPage } from "./schedule";
import type { SeriesDate, SiteEvent } from "./types";

/**
 * Was von einem Event in den Kalender wandert – derselbe Eintrag, egal ob von
 * der Startseite, von /events oder aus dem abonnierten Kalender.
 *
 * Nichts wird dafür neu erfunden: Titel, Ort und Beschreibung stehen so im
 * Eintrag wie auf der Seite. Dazu die Adresse der Detailseite – in zwei Wochen
 * weiß sonst niemand mehr, woher der Termin kam.
 *
 * Ohne Rückgabe für Termine, die keinen Eintrag bekommen (siehe `hasCalendar`).
 */
export function calendarEntry(e: SiteEvent, locale: Locale, c: Copy): CalendarEvent | undefined {
  if (!hasCalendar(e)) return undefined;
  const registration = e.registrationUrl
    ? `${pick(e.registrationLabel, locale) ?? c.events.register}: ${e.registrationUrl}`
    : undefined;
  return {
    id: e.slug,
    title: pick(e.title, locale),
    date: e.date,
    endDate: e.endDate,
    startTime: e.startTime,
    endTime: e.endTime,
    location: pick(e.location, locale),
    description: [pick(e.description, locale), registration].filter(Boolean).join("\n\n") || undefined,
    url: absoluteUrl(hasPage(e) ? eventPath(e.slug, locale) : pathFor("events", locale)),
  };
}

/**
 * Dasselbe für einen Reihentermin. Thema und Speaker fehlen hier noch – der
 * Eintrag hält den Abend frei, und der Hinweis dazu sagt, was noch kommt.
 */
export function seriesCalendarEntry(series: SeriesDate, locale: Locale, c: Copy): CalendarEvent {
  return {
    id: series.id,
    title: series.labelKey === "semesterStart" ? c.events.seriesSemesterLabel : c.events.seriesLabel,
    date: series.date,
    startTime: series.startTime,
    endTime: series.endTime,
    location: series.location,
    description: c.events.seriesNote,
    url: absoluteUrl(pathFor("events", locale)),
  };
}
