import { getCollection } from "astro:content";
import { WHATSAPP_LINK } from "@/lib/links";
import type { Milestone, Partner, SiteEvent } from "./types";

/*
 * Lädt die Collections und löst die Verweise auf. Nur in Astro-Dateien
 * aufrufen (beim Build) – die Inseln bekommen das Ergebnis als Prop.
 */

async function loadPartners(): Promise<Map<string, Partner>> {
  const entries = await getCollection("partners");
  return new Map(entries.map((p) => [p.id, { ...p.data, id: p.id }]));
}

export async function loadEvents(): Promise<SiteEvent[]> {
  const [entries, partners] = await Promise.all([getCollection("events"), loadPartners()]);
  return entries
    .map(({ id, data }): SiteEvent => {
      const { partner, partOf, registrationUrl, ...rest } = data;
      return {
        ...rest,
        slug: id,
        partner: partner ? { ...partners.get(partner.id.id)!, role: partner.role } : undefined,
        partOf: partOf?.id,
        registrationUrl: registrationUrl === "whatsapp" ? WHATSAPP_LINK : registrationUrl,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function loadMilestones(): Promise<Milestone[]> {
  const [entries, partners] = await Promise.all([getCollection("milestones"), loadPartners()]);
  return entries.map(({ id, data }) => ({
    ...data,
    id,
    partner: data.partner ? partners.get(data.partner.id) : undefined,
  }));
}
