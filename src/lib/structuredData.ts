import { useEffect } from "react";
import {
  events,
  hasAssets,
  hasContent,
  getEventAnchor,
  parseTimeRange,
  type PsngEvent,
} from "@/data/events";
import { SITE_URL } from "@/i18n/head";
import {
  CONTACT_EMAIL,
  INSTAGRAM_LINK,
  LINKEDIN_LINK,
  YOUTUBE_LINK,
} from "@/lib/links";
import type { Locale } from "@/i18n/locale";
import { localeTags } from "@/i18n/locale";
import { pathFor } from "@/i18n/routes";
import { pick } from "@/i18n/localized";

/**
 * Maschinenlesbare Fassung dessen, was auf der Seite ohnehin steht.
 *
 * Die Seite ist eine reine Client-Anwendung: Was ein Crawler ohne JavaScript
 * sieht, ist die statische index.html. Diese Angaben hier setzt der Browser
 * nach dem Laden – Google führt dafür JavaScript aus, andere Crawler nicht
 * unbedingt. Das ist derselbe Kompromiss, unter dem schon useDocumentHead
 * arbeitet, und derselbe Grund, warum in index.html sinnvolle Vorgaben stehen.
 *
 * Bewusst zurückhaltend: Hier steht nur, was auf der Seite belegt ist. Keine
 * Mitgliederzahlen, keine Bewertungen, keine Preise – strukturierte Daten, die
 * über den sichtbaren Inhalt hinausgehen, sind bei Google ein Verstoß und
 * hier obendrein eine Behauptung, die niemand geprüft hat.
 */

const SCRIPT_ID = "psng-structured-data";

/** Stabiler Bezeichner, damit Events auf dieselbe Organisation zeigen können. */
const ORG_ID = `${SITE_URL}/#organisation`;

/**
 * Ein gebündeltes Bild trägt zur Laufzeit einen absoluten Pfad mit Hash
 * (`/assets/foo-a1b2c3.webp`). Für strukturierte Daten muss daraus eine
 * vollständige URL werden – relative Angaben ignoriert Google.
 */
function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/**
 * Die Uhrzeit steht als Fließtext in den Daten („19:00 – 20:00", „ganztägig").
 * Für `startDate` braucht es ISO 8601, also wird gelesen, was lesbar ist, und
 * sonst bleibt es beim reinen Datum – das ist nach Schema.org zulässig und
 * allemal besser als eine geratene Uhrzeit.
 *
 * Ohne Zeitzonen-Versatz: Damit gilt die Ortszeit der Veranstaltung, und genau
 * so ist die Angabe auf der Karte auch gemeint. Ein fest verdrahtetes „+02:00"
 * wäre im Winterhalbjahr schlicht falsch.
 */
function eventTimes(event: PsngEvent): { startDate: string; endDate?: string } {
  const { start: startTime, end: endTime } = parseTimeRange(pick(event.time, "de"));

  if (!startTime) {
    // Ganztägig oder ohne Angabe: Ein mehrtägiger Kongress trägt sein Ende im
    // eigenen Feld, alles andere endet am selben Tag.
    return { startDate: event.date, endDate: event.endDate };
  }

  const start = `${event.date}T${startTime}`;
  // Ein Enddatum im Event schlägt die Uhrzeit: Bei mehrtägigen Terminen sagt
  // die zweite Uhrzeit nichts über den letzten Tag aus.
  if (event.endDate) return { startDate: start, endDate: event.endDate };
  return {
    startDate: start,
    endDate: endTime ? `${event.date}T${endTime}` : undefined,
  };
}

/**
 * Online, vor Ort oder beides – abgeleitet aus dem Ort, der auf der Karte
 * steht. Kein Raten darüber hinaus: Steht kein Ort in den Daten, bleibt die
 * Angabe weg, statt einen zu erfinden.
 */
function eventPlace(event: PsngEvent, locale: Locale) {
  const location = pick(event.location, locale);
  if (!location) return undefined;

  const virtual = {
    "@type": "VirtualLocation",
    // Der Zoom-Link steht nur dort, wo er öffentlich ist; sonst bleibt der
    // Name des Dienstes die einzige ehrliche Angabe.
    ...(event.registrationUrl ? { url: event.registrationUrl } : { name: location }),
  };
  const place = {
    "@type": "Place",
    name: location,
    address: { "@type": "PostalAddress", addressCountry: "DE" },
  };

  // Ausgewertet wird die deutsche Fassung, damit beide Sprachen dasselbe sagen.
  const de = pick(event.location, "de") ?? location;
  const online = /zoom|online/i.test(de);
  const onSite = /vor ort/i.test(de);

  if (online && onSite) {
    return {
      attendanceMode: "https://schema.org/MixedEventAttendanceMode",
      location: [place, virtual],
    };
  }
  if (online) {
    return { attendanceMode: "https://schema.org/OnlineEventAttendanceMode", location: virtual };
  }
  return { attendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: place };
}

function eventNode(event: PsngEvent, locale: Locale) {
  const { startDate, endDate } = eventTimes(event);
  const place = eventPlace(event, locale);
  const image = event.assets?.speakerPhoto ?? event.assets?.youtubeThumbnail;

  return {
    "@type": "Event",
    "@id": `${SITE_URL}${pathFor("home", locale)}#${getEventAnchor(event)}`,
    name: pick(event.title, locale),
    startDate,
    ...(endDate ? { endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    ...(place
      ? { eventAttendanceMode: place.attendanceMode, location: place.location }
      : {}),
    ...(event.description ? { description: pick(event.description, locale) } : {}),
    ...(event.language ? { inLanguage: event.language } : {}),
    ...(image ? { image: [absoluteUrl(image)] } : {}),
    // Der Speaker ist eine Person; das PSNG-Team ist es nicht.
    ...(event.speaker && event.speaker !== "PSNG-Team"
      ? {
          performer: {
            "@type": "Person",
            name: event.speaker,
            ...(event.speakerWebsiteUrl ? { url: event.speakerWebsiteUrl } : {}),
          },
        }
      : {}),
    organizer: { "@id": ORG_ID },
    url: `${SITE_URL}${pathFor("home", locale)}#${getEventAnchor(event)}`,
  };
}

function organizationNode(locale: Locale, description: string) {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Psychedelic Student Network Germany",
    alternateName: "PSNG",
    url: SITE_URL,
    logo: `${SITE_URL}/psng-logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description,
    email: CONTACT_EMAIL,
    areaServed: { "@type": "Country", name: "Germany" },
    // „Seit März 2026 aktiv" – dieselbe Angabe wie im Hero.
    foundingDate: "2026-03",
    inLanguage: [localeTags.de, localeTags.en],
    sameAs: [INSTAGRAM_LINK, LINKEDIN_LINK, YOUTUBE_LINK],
  };
}

/**
 * Der vollständige Graph der Startseite. Als eigene Funktion und nicht im Hook
 * versteckt: So lässt sich prüfen, was da eigentlich ausgeliefert wird, ohne
 * eine Seite zu rendern.
 */
export function buildHomeGraph(locale: Locale, description: string) {
  // Alles, was auf der Seite als Karte erscheint – dieselbe Bedingung wie im
  // Zeitstrahl, damit die strukturierten Daten nichts beschreiben, was gar
  // nicht dasteht.
  const listed = events.filter((e) => hasAssets(e) || hasContent(e));

  return [
    organizationNode(locale, description),
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "PSNG",
      publisher: { "@id": ORG_ID },
      inLanguage: localeTags[locale],
    },
    ...listed.map((e) => eventNode(e, locale)),
  ];
}

/**
 * Hängt die strukturierten Daten der Startseite in den Head und räumt sie
 * wieder weg, wenn die Seite verlassen wird. Ein einzelnes Skript mit `@graph`
 * statt vieler Blöcke: So gibt es genau eine Stelle, die ersetzt wird, wenn
 * die Sprache wechselt.
 */
export function useHomeStructuredData(locale: Locale, description: string) {
  useEffect(() => {
    const graph = buildHomeGraph(locale, description);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCRIPT_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });

    document.getElementById(SCRIPT_ID)?.remove();
    document.head.appendChild(script);

    return () => script.remove();
  }, [locale, description]);
}
