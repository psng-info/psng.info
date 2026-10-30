import type { Copy } from "@/i18n/copy";
import type { Locale } from "@/i18n/locale";
import { pick } from "@/i18n/localized";
import { WHATSAPP_LINK, whatsappHref } from "@/lib/links";
import { eventPath } from "./paths";
import { canRegister, hasAssets, hasPage, isPast } from "./schedule";
import type { EventColumn, SiteEvent } from "./types";

/*
 * Was eine Karte und eine Detailseite aus einem Event machen – als reine
 * Funktionen, damit die Regeln getestet werden und nicht im Markup stecken.
 */

export function columnLabel(column: EventColumn, c: Copy): string {
  return column === "vortraege" ? c.events.columnsSingular.talks : c.events.columnsSingular.community;
}

export interface CardAction {
  href: string;
  label: string;
  external: boolean;
}

/**
 * Die eine Handlung einer Karte. Mit eigener Seite führt sie dorthin – vorher
 * mit Anmeldung im Namen, wenn es eine gibt, nachher zum Rückblick, wenn es
 * Material gibt. Ohne eigene Seite bleibt nur der Weg nach außen.
 */
export function cardAction(e: SiteEvent, locale: Locale, c: Copy, ref: Date): CardAction | undefined {
  if (hasPage(e)) {
    const label = isPast(e, ref)
      ? hasAssets(e)
        ? c.eventPage.toRecap
        : c.eventPage.details
      : canRegister(e, ref)
        ? c.eventPage.detailsAndRegister
        : c.eventPage.details;
    return { href: eventPath(e.slug, locale), label, external: false };
  }
  if (e.externalUrl) {
    return { href: e.externalUrl, label: pick(e.externalLabel, locale) ?? c.eventPage.toWebsite, external: true };
  }
  return undefined;
}

type ImageLike = SiteEvent["cover"] extends infer T ? (T extends { src: infer S } ? S : never) : never;

/**
 * Vorschaubild für geteilte Links. Das eigens gestaltete zuerst, dann das
 * Motiv, dann echte Fotos oder das Video-Standbild. Ohne all das greift das
 * allgemeine Bild der Seite (im Layout).
 */
export function socialImageOf(e: SiteEvent, locale: Locale): { src: ImageLike; alt: string } | undefined {
  if (e.socialImage) return { src: e.socialImage.src, alt: pick(e.socialImage.alt, locale) };
  if (e.cover) return { src: e.cover.src, alt: pick(e.cover.alt, locale) };
  const photo = e.photos?.[0];
  if (photo) return { src: photo.src, alt: pick(photo.alt, locale) ?? pick(e.title, locale) };
  if (e.recording) return { src: e.recording.thumbnail, alt: pick(e.title, locale) };
  return undefined;
}

/**
 * Ziel eines Anmeldeknopfs. Führt die Anmeldung in die WhatsApp-Gruppe, läuft
 * sie über /whatsapp, damit der Beitritt gezählt wird (siehe api/whatsapp.ts).
 */
export function registerHref(e: SiteEvent, from: string): string | undefined {
  return e.registrationUrl === WHATSAPP_LINK ? whatsappHref(from) : e.registrationUrl;
}
