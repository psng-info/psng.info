import { describe, expect, it } from "vitest";
import { hasPage } from "@/lib/events/schedule";
import { bySlug, testEvents, withChanges } from "@/lib/events/testData";
import { eventNode, eventTimes, graph, ORG_ID, organizationNode, websiteNode } from "./structuredData";

describe("eventTimes", () => {
  it("schreibt die Uhrzeit mit Berliner Versatz – Winterzeit", () => {
    expect(eventTimes(bySlug("lecture-tomislav-majic"))).toEqual({
      startDate: "2026-11-04T19:00:00+01:00",
      endDate: "2026-11-04T20:30:00+01:00",
    });
  });

  it("schreibt die Uhrzeit mit Berliner Versatz – Sommerzeit", () => {
    expect(eventTimes(bySlug("lecture-torsten-passie")).startDate).toBe("2026-08-11T19:30:00+02:00");
  });

  it("bleibt ohne feste Uhrzeit beim reinen Datum", () => {
    expect(eventTimes(bySlug("alps-conference-2026"))).toEqual({ startDate: "2026-10-09", endDate: "2026-10-10" });
    const tbd = withChanges("lecture-tomislav-majic", { timeTbd: true, startTime: undefined, endTime: undefined });
    expect(eventTimes(tbd)).toEqual({ startDate: "2026-11-04", endDate: undefined });
  });
});

describe("eventNode", () => {
  it("zeichnet ein hybrides Event mit Adresse und Online-Teil aus", () => {
    const node = eventNode(bySlug("lecture-tomislav-majic"), "de");
    expect(node.eventAttendanceMode).toBe("https://schema.org/MixedEventAttendanceMode");
    expect(node.location).toEqual([
      expect.objectContaining({ "@type": "Place", address: expect.objectContaining({ addressCountry: "DE" }) }),
      { "@type": "VirtualLocation", url: "https://psng.info/events/lecture-tomislav-majic" },
    ]);
  });

  it("lässt den Ort weg, wenn nicht feststeht, wie man teilnimmt", () => {
    const node = eventNode(withChanges("lecture-tomislav-majic", { attendance: undefined }), "de");
    expect(node).not.toHaveProperty("location");
    expect(node).not.toHaveProperty("eventAttendanceMode");
  });

  it("meldet Absagen und Verschiebungen", () => {
    expect(eventNode(withChanges("lecture-tomislav-majic", { status: "cancelled" }), "de").eventStatus).toBe(
      "https://schema.org/EventCancelled",
    );
    const moved = eventNode(withChanges("lecture-tomislav-majic", { rescheduledFrom: "2026-10-28" }), "de");
    expect(moved.eventStatus).toBe("https://schema.org/EventRescheduled");
    expect(moved).toHaveProperty("previousStartDate", "2026-10-28");
  });

  it("nennt bei gemeinsamen Events beide Veranstalter, bei fremden nicht uns", () => {
    expect(eventNode(bySlug("abend-rund-um-psychedelika"), "de").organizer).toEqual([
      { "@id": ORG_ID },
      expect.objectContaining({ "@type": "Organization" }),
    ]);
    expect(JSON.stringify(eventNode(bySlug("alps-conference-2026"), "de"))).not.toContain(ORG_ID);
  });

  it("verweist auf die Detailseite in der Sprache und hält die @id sprachunabhängig", () => {
    const de = eventNode(bySlug("lecture-tomislav-majic"), "de");
    const en = eventNode(bySlug("lecture-tomislav-majic"), "en");
    expect(en.url).toBe("https://psng.info/en/events/lecture-tomislav-majic");
    expect(en["@id"]).toBe(de["@id"]);
  });

  it("nennt nur absolute URLs – relative wertet Google nicht aus", () => {
    for (const e of testEvents.filter(hasPage)) {
      const json = JSON.stringify(graph(organizationNode("x"), websiteNode("de"), eventNode(e, "de", ["/_astro/a.webp"])));
      for (const [, url] of json.matchAll(/"(?:url|image|@id|logo)":\s*"([^"]+)"/g)) {
        expect(url, e.slug).toMatch(/^https?:\/\//);
      }
    }
  });
});
