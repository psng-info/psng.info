import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { WHATSAPP_LINK } from "@/lib/links";
import type { Milestone, Partner, SiteEvent } from "./types";

/*
 * Die echten Inhalte für Tests, ohne Astro: liest dieselben YAML-Dateien wie
 * die Content Collections und setzt die Vorgaben des Schemas. Bilder bleiben
 * Pfade – Tests prüfen Logik, keine Bildgrößen; die prüft der Build.
 *
 * Bewusst die echten Daten und keine erfundenen: Ein Test, der an einem
 * ausgedachten Event grün wird, sagt nichts darüber, ob die Seite stimmt.
 */

const CONTENT = path.resolve(__dirname, "../../content");

function readAll(collection: string, file: string): { id: string; data: Record<string, unknown> }[] {
  const dir = path.join(CONTENT, collection);
  return fs
    .readdirSync(dir)
    .filter((name) => fs.existsSync(path.join(dir, name, file)))
    .map((id) => ({ id, data: YAML.parse(fs.readFileSync(path.join(dir, id, file), "utf8")) }));
}

const partners = new Map(
  readAll("partners", "partner.yaml").map(({ id, data }) => [id, { ...data, id } as unknown as Partner]),
);

export const testEvents: SiteEvent[] = readAll("events", "event.yaml")
  .map(({ id, data }) => {
    const partner = data.partner as { id: string; role?: unknown } | undefined;
    return {
      status: "scheduled",
      registrationState: "open",
      timeZone: "Europe/Berlin",
      ...data,
      slug: id,
      partner: partner ? { ...partners.get(partner.id)!, role: partner.role } : undefined,
      registrationUrl: data.registrationUrl === "whatsapp" ? WHATSAPP_LINK : data.registrationUrl,
    } as unknown as SiteEvent;
  })
  .sort((a, b) => a.date.localeCompare(b.date));

export const testMilestones: Milestone[] = readAll("milestones", "milestone.yaml").map(
  ({ id, data }) =>
    ({
      ...data,
      id,
      partner: data.partner ? partners.get(data.partner as string) : undefined,
    }) as unknown as Milestone,
);

export function bySlug(slug: string): SiteEvent {
  const e = testEvents.find((x) => x.slug === slug);
  if (!e) throw new Error(`Kein Event ${slug}`);
  return e;
}

/** Ein Event mit geänderten Feldern – für Zustände, die es in den echten Daten (noch) nicht gibt. */
export function withChanges(slug: string, changes: Partial<SiteEvent>): SiteEvent {
  return { ...bySlug(slug), ...changes };
}
