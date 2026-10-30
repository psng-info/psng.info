import type { EventColumn, SeriesLabelKey } from "./types";

/**
 * Die Lecture-Reihe hat einen festen Takt: jeder 2. Dienstag im Monat. Die
 * Termine stehen damit fest, lange bevor Thema und Speaker feststehen –
 * deshalb werden sie berechnet statt gepflegt. Als leere Platzhalter-Events
 * waren sie zweimal unbrauchbar: Sie verschwanden beim Verstreichen wieder,
 * und die Liste endete irgendwann dort, wo jemand aufgehört hat, sie zu
 * pflegen. Berechnet reißt der Takt nie ab.
 *
 * Bewusst TypeScript statt einer Content Collection: Das sind Regeln, kein
 * Inhalt. Sobald Thema oder Speaker feststehen, wird aus dem Termin ein
 * echtes Event in src/content/events – und der Platzhalter verschwindet.
 */
export const LECTURE_SERIES = {
  /** Wochentag nach `Date#getDay`: 2 = Dienstag. */
  weekday: 2,
  /** Der wievielte dieses Wochentags im Monat. */
  ordinal: 2,
  startTime: "19:00",
  endTime: "20:00",
  location: "Zoom",
  column: "vortraege" as EventColumn,
};

/** Ein Monat, in dem die Reihe bewusst vom Takt abweicht. */
export interface SeriesOverride {
  /** Gilt in seinem Monat anstelle des berechneten Termins. */
  date: string;
  /** Ersetzt das Standardlabel, wenn der Anlass einen eigenen Namen hat. */
  labelKey?: SeriesLabelKey;
}

/**
 * Ausnahmen vom Takt. Der Oktobertermin liegt eine Woche nach dem zweiten
 * Dienstag: Zum Semesterstart ist die Uni erst danach wieder voll da. Der
 * Novembertermin liegt eine Woche davor, auf einem Mittwoch, der
 * Dezembertermin auf dem 3., einem Donnerstag.
 *
 * Bewusst ein Override statt eines Events ohne Thema und Speaker – ein
 * abweichender Termin ist immer noch nur ein Termin, und als Event hätte er
 * eine Karte gefüllt, in der die Hälfte der Felder leer bleibt.
 */
export const SERIES_OVERRIDES: SeriesOverride[] = [
  { date: "2026-10-20", labelKey: "semesterStart" },
  { date: "2026-11-04" },
  { date: "2026-12-03" },
];
