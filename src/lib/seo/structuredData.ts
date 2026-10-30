import { localDateTime } from "@/lib/calendar";
import { eventPath } from "@/lib/events/paths";
import type { SiteEvent } from "@/lib/events/types";
import { CONTACT_EMAIL, INSTAGRAM_LINK, LINKEDIN_LINK, YOUTUBE_LINK } from "@/lib/links";
import { type Locale, localeTags } from "@/i18n/locale";
import { pick } from "@/i18n/localized";
import { absoluteUrl, SITE_URL } from "./site";

/**
 * Maschinenlesbare Fassung dessen, was auf der Seite ohnehin steht – im
 * ausgelieferten HTML, nicht erst nach dem Laden.
 *
 * Bewusst zurückhaltend: Hier steht nur, was auf der Seite belegt ist. Keine
 * Mitgliederzahlen, keine Bewertungen, keine Preise – strukturierte Daten, die
 * über den sichtbaren Inhalt hinausgehen, sind bei Google ein Verstoß und
 * hier obendrein eine Behauptung, die niemand geprüft hat.
 */

/** Stabiler Bezeichner, damit Events auf dieselbe Organisation zeigen können. */
export const ORG_ID = `${SITE_URL}/#organisation`;

export function organizationNode(description: string) {
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

export function websiteNode(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "PSNG",
    publisher: { "@id": ORG_ID },
    inLanguage: localeTags[locale],
  };
}

/**
 * Anfang und Ende mit Zeitzonen-Versatz. Ohne feste Uhrzeit bleibt es beim
 * reinen Datum – nach Schema.org zulässig und besser als eine geratene Zeit.
 * Ein Enddatum schlägt die Uhrzeit: Bei mehrtägigen Terminen sagt die zweite
 * Uhrzeit nichts über den letzten Tag aus.
 */
export function eventTimes(e: SiteEvent): { startDate: string; endDate?: string } {
  if (!e.startTime || e.timeTbd) return { startDate: e.date, endDate: e.endDate };
  const startDate = localDateTime(e.date, e.startTime, e.timeZone);
  if (e.endDate) return { startDate, endDate: e.endDate };
  return { startDate, endDate: e.endTime ? localDateTime(e.date, e.endTime, e.timeZone) : undefined };
}

/**
 * Online, vor Ort oder beides – aus `attendance`, nicht aus dem Ortstext.
 * Ein Place nur mit echter Adresse (`venue`); fehlt `attendance`, bleibt die
 * Angabe weg, statt eine zu erfinden.
 */
function eventPlace(e: SiteEvent, url: string) {
  if (!e.attendance) return undefined;
  const virtual = { "@type": "VirtualLocation", url };
  const place = e.venue && {
    "@type": "Place",
    name: e.venue.name,
    address: {
      "@type": "PostalAddress",
      ...(e.venue.street ? { streetAddress: e.venue.street } : {}),
      ...(e.venue.postalCode ? { postalCode: e.venue.postalCode } : {}),
      addressLocality: e.venue.city,
      addressCountry: e.venue.country,
    },
  };
  const mode = (m: string) => `https://schema.org/${m}EventAttendanceMode`;
  if (e.attendance === "online") return { eventAttendanceMode: mode("Online"), location: virtual };
  if (e.attendance === "hybrid") {
    return { eventAttendanceMode: mode("Mixed"), location: place ? [place, virtual] : virtual };
  }
  return place ? { eventAttendanceMode: mode("Offline"), location: place } : undefined;
}

function eventStatus(e: SiteEvent) {
  const status = (s: string) => `https://schema.org/Event${s}`;
  if (e.status === "cancelled") return { eventStatus: status("Cancelled") };
  if (e.status === "postponed") return { eventStatus: status("Postponed") };
  if (e.rescheduledFrom) return { eventStatus: status("Rescheduled"), previousStartDate: e.rescheduledFrom };
  return { eventStatus: status("Scheduled") };
}

/**
 * Ein Event als Schema.org-Event, für seine eigene Detailseite.
 *
 * @param images absolute oder Pfad-URLs der Bilder, die auf der Seite stehen
 *   (Astro kennt die gebauten Pfade, diese Funktion nicht).
 */
export function eventNode(e: SiteEvent, locale: Locale, images: string[] = []) {
  const url = absoluteUrl(eventPath(e.slug, locale));
  const partner = e.partner && { "@type": "Organization", name: e.partner.name, url: e.partner.url };
  // Bei fremden Konferenzen sind wir Gäste, nicht Veranstalter.
  const organizer =
    e.role === "own" ? { "@id": ORG_ID } : e.role === "co-hosted" ? [{ "@id": ORG_ID }, ...(partner ? [partner] : [])] : partner;
  return {
    "@type": "Event",
    "@id": `${absoluteUrl(eventPath(e.slug, "de"))}#event`,
    name: pick(e.title, locale),
    ...eventTimes(e),
    ...eventStatus(e),
    ...eventPlace(e, url),
    ...(e.description ? { description: pick(e.description, locale) } : {}),
    ...(e.language ? { inLanguage: e.language } : {}),
    ...(images.length ? { image: images.map(absoluteUrl) } : {}),
    // Der Speaker ist eine Person; das PSNG-Team ist es nicht.
    ...(e.speaker && e.speaker !== "PSNG-Team"
      ? {
          performer: {
            "@type": "Person",
            name: e.speaker,
            ...(e.speakerWebsiteUrl ? { url: e.speakerWebsiteUrl } : {}),
          },
        }
      : {}),
    ...(organizer ? { organizer } : {}),
    url,
  };
}

/** Mehrere Knoten als ein Block – eine Stelle im Head statt vieler. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
