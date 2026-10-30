import { describe, expect, it } from "vitest";
import { testEvents } from "@/lib/events/testData";
import { LEGACY_EVENT_IDS, legacyAnchorTargets } from "./legacyAnchors";

describe("legacyAnchorTargets", () => {
  it("kennt jedes Event, auf das eine alte ID zeigt", () => {
    const slugs = new Set(testEvents.map((e) => e.slug));
    for (const slug of Object.values(LEGACY_EVENT_IDS)) expect(slugs, slug).toContain(slug);
  });

  it("führt weggezogene Sektionen auf ihre neue Seite", () => {
    const de = legacyAnchorTargets(testEvents, "de");
    expect(de.events).toBe("/events");
    expect(de["uber-uns"]).toBe("/ueber-uns");
    expect(de.team).toBe("/ueber-uns#team");
    expect(de.kooperation).toBe("/ueber-uns#kooperation");
    expect(de.leitfaden).toBe("/#gruppen");
    const en = legacyAnchorTargets(testEvents, "en");
    expect(en.team).toBe("/en/about#team");
    expect(en.leitfaden).toBe("/en#gruppen");
  });

  it("führt Events mit Seite dorthin, die übrigen in den Zeitstrahl", () => {
    const de = legacyAnchorTargets(testEvents, "de");
    expect(de["event-lecture-majic-2026-11-04"]).toBe("/events/lecture-tomislav-majic");
    expect(de["event-presence-tryp-expo-2026"]).toBe("/events#tryp-expo-2026");
    expect(de["event-milestone-medien-blog-2026-09-01"]).toBe("/events#medien-blog");
    expect(legacyAnchorTargets(testEvents, "en")["event-presence-alps-2026"]).toBe("/en/events/alps-conference-2026");
  });

  it("lässt Anker der neuen Startseite unberührt", () => {
    const de = legacyAnchorTargets(testEvents, "de");
    for (const anchor of ["termine", "gruppen", "faq", "kontakt"]) expect(de[anchor]).toBeUndefined();
  });
});
