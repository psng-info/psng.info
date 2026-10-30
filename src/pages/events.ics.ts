import type { APIRoute } from "astro";
import { copy } from "@/i18n/copy";
import { toIcsCalendar } from "@/lib/calendar";
import { calendarEntry, seriesCalendarEntry } from "@/lib/events/calendarEntry";
import { loadEvents } from "@/lib/events/load";
import { getUpcomingSeriesDates } from "@/lib/events/schedule";

/**
 * Der abonnierbare Kalender: alle eigenen und gemeinsamen Termine mit fester
 * Uhrzeit, dazu die nächsten Daten der Lecture-Reihe. Vergangene bleiben
 * drin – wer abonniert, will seinen Kalender nicht nachträglich leeren sehen.
 * Die tägliche Neuerstellung hält ihn aktuell.
 */
export const GET: APIRoute = async () => {
  const events = await loadEvents();
  const c = copy.de;
  const entries = [
    ...events.flatMap((e) => calendarEntry(e, "de", c) ?? []),
    ...getUpcomingSeriesDates(events, 3, new Date()).map((s) => seriesCalendarEntry(s, "de", c)),
  ];
  return new Response(toIcsCalendar(entries, new Date(), "PSNG"), {
    headers: { "Content-Type": "text/calendar; charset=utf-8" },
  });
};
