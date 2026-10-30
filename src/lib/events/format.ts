import type { Locale } from "@/i18n/locale";
import { intlLocale, pick } from "@/i18n/localized";
import { daysUntil, parseEventDate } from "./schedule";
import type { SeriesDate, SiteEvent } from "./types";

export function formatEventDate(iso: string, locale: Locale, withWeekday = false): string {
  return parseEventDate(iso).toLocaleDateString(intlLocale(locale), {
    ...(withWeekday ? { weekday: "long" as const } : {}),
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatEventDateShort(iso: string, locale: Locale): string {
  return parseEventDate(iso).toLocaleDateString(intlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Datum, bei mehrtägigen Events bis zum letzten Tag. */
export function formatEventDateRange(e: SiteEvent, locale: Locale): string {
  const start = formatEventDate(e.date, locale, e.showWeekday);
  return e.endDate && e.endDate !== e.date ? `${start} – ${formatEventDate(e.endDate, locale)}` : start;
}

const TIME_LABELS = {
  allDay: { de: "ganztägig", en: "all day" },
  tbd: { de: "Uhrzeit folgt", en: "time to be announced" },
};

/**
 * Die Uhrzeit, wie sie auf der Seite steht: „19:00 – 20:30“, dazu der Zusatz
 * („Einlass ab 15:30“). Aus den strukturierten Feldern gebaut – derselbe Wert
 * landet im Kalender und in den strukturierten Daten, also kann die Anzeige
 * nicht mehr etwas anderes behaupten als der Eintrag.
 */
export function formatEventTime(e: SiteEvent, locale: Locale): string {
  const base = e.timeTbd
    ? TIME_LABELS.tbd[locale]
    : e.startTime
      ? e.endTime
        ? `${e.startTime} – ${e.endTime}`
        : e.startTime
      : TIME_LABELS.allDay[locale];
  const note = pick(e.timeNote, locale);
  return note ? `${base}, ${note}` : base;
}

export function formatSeriesTime(s: SeriesDate): string {
  return `${s.startTime} – ${s.endTime}`;
}

/**
 * Abstand zu heute, nur für kommende Termine. Macht „liegt noch weit weg"
 * lesbar statt bloß sichtbar.
 *
 * `Intl.RelativeTimeFormat` beugt und pluralisiert selbst – die Stufen (Tage,
 * Wochen, Monate) bleiben unsere, die Formulierung nicht.
 */
export function formatRelativeToToday(iso: string, locale: Locale, ref: Date): string {
  const days = daysUntil(iso, ref);
  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: "auto" });
  if (days <= 0) return rtf.format(0, "day");
  if (days === 1) return rtf.format(1, "day");
  if (days < 14) return rtf.format(days, "day");
  const weeks = Math.round(days / 7);
  if (weeks < 9) return rtf.format(weeks, "week");
  return rtf.format(Math.round(days / 30.44), "month");
}
