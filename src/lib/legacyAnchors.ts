import type { Locale } from "@/i18n/locale";
import { pathFor } from "@/i18n/routes";
import { HOME_ANCHORS } from "@/lib/anchors";
import { eventPath } from "@/lib/events/paths";
import { hasPage } from "@/lib/events/schedule";
import type { SiteEvent } from "@/lib/events/types";

/*
 * Anker der alten Startseite (bis Oktober 2026), die in geteilten Links und
 * Lesezeichen weiterleben. Hashes erreichen den Server nicht – die Startseite
 * übersetzt sie deshalb im Browser (siehe pages/index.astro).
 */

/** Sektionen, die von der Startseite weggezogen sind. */
const SECTIONS = {
  events: { route: "events" },
  "uber-uns": { route: "about" },
  team: { route: "about", hash: "team" },
  kooperation: { route: "about", hash: "kooperation" },
  // Die alte Sektion war ein Anriss des Leitfadens mit Knopf dorthin – ihr
  // Nachfolger ist der Block „Hochschulgruppen“ auf derselben Seite.
  leitfaden: { route: "home", hash: HOME_ANCHORS.groups },
} as const;

/** Alte Event-IDs (`#event-<id>`) → Ordner in src/content/events. */
export const LEGACY_EVENT_IDS: Record<string, string> = {
  "kickoff-2026-03-03": "kickoff",
  "presence-tryp-expo-2026": "tryp-expo-2026",
  "presence-icpr-2026": "icpr-2026",
  "presence-alps-2026": "alps-conference-2026",
  "lecture-1": "lecture-1",
  "lecture-2": "lecture-2",
  "lecture-lonergan-2026-06": "lecture-eric-lonergan",
  "lecture-5": "lecture-torsten-passie",
  "lecture-6": "lecture-miguel-mora-vera",
  "lecture-schmidt-2026-10-20": "lecture-timo-schmidt",
  "lecture-majic-2026-11-04": "lecture-tomislav-majic",
  "talk-beed-2026-08-08": "talk-prateep-beed",
  "gathering-2026-08-08": "abend-rund-um-psychedelika",
};

/** Der Meilenstein hatte auf der alten Seite ebenfalls einen Anker. */
const LEGACY_MILESTONE_IDS: Record<string, string> = {
  "milestone-medien-blog-2026-09-01": "medien-blog",
};

/**
 * Alter Anker (ohne `#`) → neues Ziel als Pfad mit Anker. Events mit eigener
 * Seite führen dorthin, alle anderen zu ihrem Eintrag im Zeitstrahl.
 */
export function legacyAnchorTargets(events: SiteEvent[], locale: Locale): Record<string, string> {
  const targets: Record<string, string> = {};
  for (const [anchor, { route, ...rest }] of Object.entries(SECTIONS)) {
    const hash = "hash" in rest ? `#${rest.hash}` : "";
    targets[anchor] = `${pathFor(route, locale)}${hash}`;
  }
  const bySlug = new Map(events.map((e) => [e.slug, e]));
  for (const [oldId, slug] of Object.entries(LEGACY_EVENT_IDS)) {
    const event = bySlug.get(slug);
    if (!event) continue;
    targets[`event-${oldId}`] = hasPage(event) ? eventPath(slug, locale) : `${pathFor("events", locale)}#${slug}`;
  }
  for (const [oldId, id] of Object.entries(LEGACY_MILESTONE_IDS)) {
    targets[`event-${oldId}`] = `${pathFor("events", locale)}#${id}`;
  }
  return targets;
}
