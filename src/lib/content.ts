import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";

/*
 * Team und Partner in der Reihenfolge, in der sie auf der Seite stehen. Nur
 * in Astro-Dateien aufrufen (beim Build).
 *
 * Der Cast auf ImageMetadata: `image()` im Schema liefert zur Laufzeit genau
 * das, der abgeleitete Typ hat aber `format` als optional, und <Image> nimmt
 * ihn deshalb nicht an.
 */

export async function loadPartnerList() {
  const entries = await getCollection("partners");
  return entries
    .map((p) => ({ ...p.data, id: p.id, logo: p.data.logo as ImageMetadata }))
    .sort((a, b) => a.order - b.order);
}

export async function loadTeam() {
  const entries = await getCollection("team");
  return entries
    .map((m) => ({ ...m.data, id: m.id, photo: m.data.photo as ImageMetadata }))
    .sort((a, b) => a.order - b.order);
}

export type PartnerEntry = Awaited<ReturnType<typeof loadPartnerList>>[number];
export type TeamEntry = Awaited<ReturnType<typeof loadTeam>>[number];
