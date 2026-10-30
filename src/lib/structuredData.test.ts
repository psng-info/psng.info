import { describe, expect, it } from "vitest";
import { buildHomeGraph } from "./structuredData";
import { events, hasAssets, hasContent } from "@/data/events";

/**
 * Strukturierte Daten sind das, was Suchmaschinen lesen, ohne dass es je
 * jemandem auffiele, wenn es falsch ist – niemand sieht sie auf der Seite.
 * Deshalb hier die Bedingungen, die sie erfüllen müssen, damit sie überhaupt
 * ausgewertet werden, und die, unter denen sie nicht mehr zur Seite passen.
 */
describe("strukturierte Daten der Startseite", () => {
  const graph = buildHomeGraph("de", "Beschreibung");

  it("beschreibt genau die Events, die auch als Karte erscheinen", () => {
    const listed = events.filter((e) => hasAssets(e) || hasContent(e));
    const nodes = graph.filter((n) => n["@type"] === "Event");
    expect(nodes).toHaveLength(listed.length);
  });

  it("gibt jedem Event ein gültiges ISO-Datum", () => {
    for (const node of graph.filter((n) => n["@type"] === "Event")) {
      const start = (node as { startDate: string }).startDate;
      expect(start).toMatch(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/);
      expect(Number.isNaN(Date.parse(start))).toBe(false);
    }
  });

  it("liest die Uhrzeit aus der Textangabe, wo eine dasteht", () => {
    const kickoff = graph.find(
      (n) => (n as { "@id"?: string })["@id"]?.endsWith("#event-kickoff-2026-03-03"),
    ) as { startDate: string; endDate?: string } | undefined;
    expect(kickoff?.startDate).toBe("2026-03-03T19:00");
    expect(kickoff?.endDate).toBe("2026-03-03T20:00");
  });

  it("bleibt bei ganztägigen Events beim reinen Datum", () => {
    const tryp = graph.find(
      (n) => (n as { "@id"?: string })["@id"]?.endsWith("#event-presence-tryp-expo-2026"),
    ) as { startDate: string } | undefined;
    expect(tryp?.startDate).toBe("2026-05-16");
  });

  it("zeichnet Zoom plus Raum als hybrid aus, nicht als reines Online-Event", () => {
    const majic = graph.find(
      (n) => (n as { "@id"?: string })["@id"]?.endsWith("#event-lecture-majic-2026-11-04"),
    ) as { eventAttendanceMode: string; location: { "@type": string }[]; startDate: string };
    expect(majic.eventAttendanceMode).toBe("https://schema.org/MixedEventAttendanceMode");
    expect(majic.location.map((l) => l["@type"])).toEqual(["Place", "VirtualLocation"]);
    expect(majic.startDate).toBe("2026-11-04T19:00");
  });

  it("führt die Organisation genau einmal und verweist von dort aus", () => {
    const orgs = graph.filter((n) => n["@type"] === "Organization");
    expect(orgs).toHaveLength(1);

    const orgId = (orgs[0] as { "@id": string })["@id"];
    for (const node of graph.filter((n) => n["@type"] === "Event")) {
      expect((node as { organizer: { "@id": string } }).organizer["@id"]).toBe(orgId);
    }
  });

  it("nennt nur absolute URLs – relative wertet Google nicht aus", () => {
    const urls: string[] = [];
    JSON.stringify(graph, (key, value) => {
      if ((key === "url" || key === "logo" || key === "image") && typeof value === "string") {
        urls.push(value);
      }
      if (key === "image" && Array.isArray(value)) urls.push(...value);
      return value;
    });
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(url).toMatch(/^https?:\/\//);
  });

  it("übersetzt mit der Sprache mit", () => {
    const en = buildHomeGraph("en", "Description");
    const deKickoff = graph.find(
      (n) => (n as { "@id"?: string })["@id"]?.endsWith("#event-kickoff-2026-03-03"),
    ) as { name: string };
    const enKickoff = en.find(
      (n) => (n as { "@id"?: string })["@id"]?.endsWith("#event-kickoff-2026-03-03"),
    ) as { name: string };
    expect(deKickoff.name).not.toBe(enKickoff.name);
  });
});
