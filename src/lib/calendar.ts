/**
 * „Zum Kalender hinzufügen“ – ein Termin dieser Seite als Kalendereintrag.
 *
 * Zwei Wege, dieselben Angaben: ein Link, der den Termin im Google-Kalender
 * vorausgefüllt öffnet, und eine ICS-Datei für alles andere – Apple Kalender,
 * iCloud, Outlook, Thunderbird.
 *
 * Bewusst ohne Bibliothek: Ein Kalendereintrag ist ein Dutzend Zeilen Text
 * nach RFC 5545. Die fertigen Pakete bringen entweder ihr eigenes Aussehen
 * mit, das neben den Karten hier fremd wirkt, oder eine Datumsbibliothek, die
 * wir sonst nirgends brauchen. Die drei Fallstricke – Zeitzone, Escaping,
 * Zeilenlänge – stehen unten benannt und in calendar.test.ts festgehalten.
 *
 * Nichts davon lädt beim Betrachten der Seite etwas nach: Der Google-Link
 * wird erst durch einen Klick aufgerufen, die ICS-Datei entsteht im Browser.
 * Dieselbe Linie wie bei den lokal gehosteten YouTube-Vorschaubildern.
 */

/** Alle unsere Termine laufen in deutscher Ortszeit. */
const TIME_ZONE = "Europe/Berlin";

/**
 * Ein Termin, so wie ein Kalender ihn braucht: Datum und Uhrzeit getrennt,
 * nicht als Anzeigetext. Was auf der Karte steht („19:00 – 20:00“), liest
 * die Event-Daten aus (startTime/endTime) – hier wird nicht mehr geraten.
 */
export interface CalendarEvent {
  /** Stabile Kennung, wird zur UID. Über sie erkennt ein Kalender ein Update. */
  id: string;
  title: string;
  /** Kalendarisches Datum, `yyyy-mm-dd`, in Ortszeit gemeint. */
  date: string;
  /** Letzter Tag eines mehrtägigen Termins, einschließlich. */
  endDate?: string;
  /** `HH:MM`. Fehlt sie, wird der Eintrag ganztägig. */
  startTime?: string;
  /** `HH:MM`. Fehlt sie, dauert der Termin eine Stunde. */
  endTime?: string;
  location?: string;
  description?: string;
  /** Link zurück auf die Seite oder zur Anmeldung; steht im Eintrag. */
  url?: string;
}

/** Wie lange ein Termin dauert, wenn nur seine Anfangszeit bekannt ist. */
const DEFAULT_DURATION_MINUTES = 60;

/**
 * Anfang und Ende in der Schreibweise, die ICS und Google gleichermaßen
 * lesen: entweder auf die Minute genau in UTC (`20261020T170000Z`) oder als
 * ganzer Tag ohne Uhrzeit und damit ohne Zeitzone (`20261020`).
 */
export interface CalendarSpan {
  allDay: boolean;
  start: string;
  end: string;
}

/**
 * Der Zeitzonen-Versatz von Europe/Berlin zu einem Zeitpunkt, in Millisekunden.
 *
 * `Intl` kennt die Umstellungstermine, wir nicht – ein fest verdrahtetes
 * „+02:00“ wäre im Winterhalbjahr um eine Stunde falsch, und genau das ist der
 * Unterschied zwischen einem Termin, der im Kalender richtig steht, und einem,
 * bei dem man zu spät kommt.
 */
function zoneOffsetMs(instant: number, timeZone = TIME_ZONE): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(instant));
  const value = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");
  const asUtc = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    // Manche Engines schreiben Mitternacht als „24“.
    value("hour") % 24,
    value("minute"),
    value("second"),
  );
  return asUtc - instant;
}

/** Ortszeit („20.10.2026, 19:00 in Berlin“) als echter Zeitpunkt. */
function toInstant(dateIso: string, time: string, timeZone = TIME_ZONE): Date {
  const [year, month, day] = dateIso.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  // Zweimal rechnen: erst mit dem Versatz zur Wandzeit schätzen, dann mit dem
  // Versatz zum geschätzten Zeitpunkt korrigieren. An den beiden Umstellungs-
  // wochenenden liegen beide Werte eine Stunde auseinander.
  const guess = wall - zoneOffsetMs(wall, timeZone);
  return new Date(wall - zoneOffsetMs(guess, timeZone));
}

/**
 * Ortszeit als ISO 8601 mit Versatz („2026-11-04T19:00:00+01:00“) – so, wie
 * Suchmaschinen sie in strukturierten Daten erwarten. Ohne Versatz rät jeder
 * Leser die Zeitzone selbst.
 */
export function localDateTime(dateIso: string, time: string, timeZone = TIME_ZONE): string {
  const offset = zoneOffsetMs(toInstant(dateIso, time, timeZone).getTime(), timeZone) / 60000;
  const sign = offset < 0 ? "-" : "+";
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${dateIso}T${time}:00${sign}${hh}:${mm}`;
}

/** Der Tag danach – ganztägige Einträge enden nach RFC 5545 exklusiv. */
function nextDay(dateIso: string): string {
  const [year, month, day] = dateIso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

/**
 * Wann der Termin läuft – entweder auf die Minute genau oder als ganzer Tag.
 *
 * Ein Enddatum schlägt die Uhrzeit: Bei einem dreitägigen Kongress sagt die
 * zweite Uhrzeit nichts über den letzten Tag aus, ganze Tage schon.
 */
export function calendarSpan(event: CalendarEvent): CalendarSpan {
  if (event.endDate || !event.startTime) {
    return {
      allDay: true,
      start: dateStamp(event.date),
      end: dateStamp(nextDay(event.endDate ?? event.date)),
    };
  }
  const start = toInstant(event.date, event.startTime);
  const end = event.endTime
    ? toInstant(event.date, event.endTime)
    : new Date(start.getTime() + DEFAULT_DURATION_MINUTES * 60_000);
  // Ein Termin über Mitternacht („22:00 – 01:00“) endet am Folgetag; ohne das
  // wäre er minus drei Stunden lang, und der Kalender verwirft ihn.
  return {
    allDay: false,
    start: utcStamp(start),
    end: utcStamp(end > start ? end : new Date(end.getTime() + 24 * 60 * 60_000)),
  };
}

/** `20261020T170000Z` – der Zeitpunkt in UTC, wie ICS und Google ihn lesen. */
function utcStamp(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
}

/** `20261020` – ein reines Datum, ohne Uhrzeit und damit ohne Zeitzone. */
function dateStamp(dateIso: string): string {
  return dateIso.replace(/-/g, "");
}

/** Beschreibung und Link in einem Textfeld – beide Ziele haben nur eins. */
function details(event: CalendarEvent): string {
  return [event.description, event.url].filter(Boolean).join("\n\n");
}

/**
 * Sonderzeichen, die in ICS Struktur bedeuten: Semikolon und Komma trennen
 * Werte, der Backslash maskiert, ein echter Zeilenumbruch beendet die
 * Eigenschaft. Unmaskiert bricht schon ein Komma im Titel die Datei.
 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Wie viele Bytes ein Zeichen in UTF-8 belegt. */
function byteLength(char: string): number {
  const code = char.codePointAt(0) ?? 0;
  if (code < 0x80) return 1;
  if (code < 0x800) return 2;
  if (code < 0x10000) return 3;
  return 4;
}

/**
 * RFC 5545 erlaubt 75 Oktette je Zeile; längere Zeilen werden umgebrochen und
 * mit einem Leerzeichen fortgesetzt. Gezählt wird in Bytes, nicht in Zeichen –
 * ein „ö“ zählt doppelt –, und ein Umbruch mitten in einem Mehrbyte-Zeichen
 * macht die Datei kaputt. Deshalb wird über Codepoints iteriert.
 */
function fold(line: string): string {
  const limit = 74; // ein Oktett Reserve für das Leerzeichen der Folgezeile
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = byteLength(char);
    if (bytes + size > limit) {
      out.push(current);
      current = "";
      bytes = 1; // das führende Leerzeichen zählt mit
    }
    current += char;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

/**
 * Der Termin als ICS-Datei. `now` nur für den Test – der Zeitstempel im
 * Eintrag soll sonst der echte sein.
 */
export function toIcs(event: CalendarEvent, now: Date = new Date()): string {
  const { allDay, start, end } = calendarSpan(event);
  const text = details(event);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PSNG//psng.info//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@psng.info`,
    `DTSTAMP:${utcStamp(now)}`,
    allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
    allDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
    `SUMMARY:${escapeText(event.title)}`,
    ...(text ? [`DESCRIPTION:${escapeText(text)}`] : []),
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    ...(event.url ? [`URL:${event.url}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // CRLF ist im Standard vorgeschrieben, nicht Geschmackssache: Outlook nimmt
  // Dateien mit reinem \n nicht an.
  return `${lines.map(fold).join("\r\n")}\r\n`;
}

/** Der Termin, vorausgefüllt im Google-Kalender. */
export function googleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = calendarSpan(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
  });
  const text = details(event);
  if (text) params.set("details", text);
  if (event.location) params.set("location", event.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Dateiname des Downloads – im Ordner „Downloads“ soll man ihn wiedererkennen. */
export function icsFileName(event: CalendarEvent): string {
  const slug = event.title
    .toLowerCase()
    // Umlaute ausschreiben, wie man sie im Deutschen umschreibt – zerlegt und
    // entkleidet ergäbe „Größe“ sonst „grosse“.
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    // Alles Übrige zerlegen (é → e + ´) und die Zeichen darüber verwerfen.
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
  // Titel, die schon mit „PSNG“ anfangen, tragen das Präfix nicht zweimal.
  const name = slug.startsWith("psng") ? slug : `psng-${slug || "termin"}`;
  return `${name}-${event.date}.ics`;
}

/**
 * Lädt den Termin als Datei herunter. Ein Blob statt eines `data:`-Links:
 * Safari bricht bei langen `data:`-URLs ab, und nur der Blob trägt einen
 * Dateinamen. macOS und iOS öffnen die Datei anschließend im Kalender.
 */
export function downloadIcs(event: CalendarEvent): void {
  const blob = new Blob([toIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = icsFileName(event);
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Erst nach dem Klick freigeben, sonst ist die Datei weg, bevor der Browser
  // sie gelesen hat.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
