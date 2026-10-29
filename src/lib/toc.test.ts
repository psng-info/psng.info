import { describe, expect, it } from "vitest";
import { activeSection, barSpan, sectionWeights, stripPosition } from "./toc";

describe("sectionWeights", () => {
  it("misst den Vorlauf und jede Sektion bis zur nächsten", () => {
    expect(sectionWeights([1000, 1500, 3500], 0, 4000)).toEqual({
      intro: 1000,
      sections: [500, 2000, 500],
    });
  });

  it("rechnet ab dem Anfang von <main>, nicht ab dem Dokument", () => {
    expect(sectionWeights([300, 400], 100, 600).intro).toBe(200);
  });

  it("wird nie negativ, wenn Sektionen sich überlappen", () => {
    expect(sectionWeights([500, 400], 0, 300)).toEqual({ intro: 500, sections: [0, 0] });
  });
});

describe("stripPosition", () => {
  const docYs = [0, 1000, 3000, 4000];
  const stripYs = [0, 100, 150, 400];

  it("trifft an einem Sektionsanfang genau deren Punkt", () => {
    expect(stripPosition(1000, docYs, stripYs)).toBe(100);
    expect(stripPosition(3000, docYs, stripYs)).toBe(150);
  });

  it("interpoliert innerhalb einer Sektion linear", () => {
    expect(stripPosition(2000, docYs, stripYs)).toBe(125);
  });

  it("bleibt an den Enden der Leiste stehen", () => {
    expect(stripPosition(-50, docYs, stripYs)).toBe(0);
    expect(stripPosition(9000, docYs, stripYs)).toBe(400);
  });

  it("verkraftet Sektionen ohne Höhe", () => {
    expect(stripPosition(1000, [0, 1000, 1000, 2000], [0, 50, 60, 100])).toBe(50);
  });
});

describe("activeSection", () => {
  it("ist -1, solange noch keine Sektion die Linie erreicht hat", () => {
    expect(activeSection([500, 900], 499)).toBe(-1);
  });

  it("wählt die letzte Sektion, deren Anfang erreicht ist", () => {
    expect(activeSection([500, 900], 500)).toBe(0);
    expect(activeSection([500, 900], 2000)).toBe(1);
  });
});

describe("barSpan", () => {
  it("übernimmt den Ausschnitt, wenn er lang genug ist", () => {
    expect(barSpan(100, 250, 800, 96)).toEqual({ top: 100, height: 150 });
  });

  it("verlängert einen zu kurzen Balken nach unten", () => {
    expect(barSpan(100, 130, 800, 96)).toEqual({ top: 100, height: 96 });
  });

  it("schiebt ihn am Ende der Linie nach oben, statt überzustehen", () => {
    expect(barSpan(780, 800, 800, 96)).toEqual({ top: 704, height: 96 });
  });
});
