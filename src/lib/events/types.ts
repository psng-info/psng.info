import type { CollectionEntry } from "astro:content";
import type { Localized } from "@/i18n/localized";

/*
 * Die Formen, mit denen Seiten und Inseln arbeiten. Sie kommen aus den
 * Content Collections (src/content.config.ts), mit aufgelösten Verweisen:
 * Ein Event trägt seinen Partner als Objekt statt als ID, und `whatsapp` ist
 * schon zum Link geworden. Alles darin ist serialisierbar – Bilder sind
 * ImageMetadata (src, Breite, Höhe) –, damit es unverändert als Prop in eine
 * React-Insel gehen kann.
 */

type EventData = CollectionEntry<"events">["data"];
type PartnerData = CollectionEntry<"partners">["data"];
type MilestoneData = CollectionEntry<"milestones">["data"];

export type Partner = PartnerData & { id: string };

export interface SiteEvent extends Omit<EventData, "partner" | "partOf" | "registrationUrl"> {
  /** Ordnername in src/content/events – und der Pfad der Detailseite. */
  slug: string;
  partner?: Partner & { role?: Localized };
  /** Slug der Veranstaltung, in deren Rahmen dieser Vortrag lief. */
  partOf?: string;
  registrationUrl?: string;
}

export interface Milestone extends Omit<MilestoneData, "partner"> {
  id: string;
  partner?: Partner;
}

export type EventColumn = SiteEvent["column"];

/** Anlass eines Reihentermins, der einen eigenen Namen trägt (der Name steht in copy.ts). */
export type SeriesLabelKey = "semesterStart";

/** Ein berechneter Termin der Lecture-Reihe – kein Event, solange kein Thema feststeht. */
export interface SeriesDate {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  column: EventColumn;
  labelKey?: SeriesLabelKey;
  coHost?: string;
}

/** Ein redaktioneller Hinweis für den Hero, mit festem Zeitraum. */
export type Feature = CollectionEntry<"features">["data"] & { id: string };
