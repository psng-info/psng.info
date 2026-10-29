/*
 * Rechenteil des Inhaltsverzeichnisses am linken Rand (SectionToc.tsx), ohne
 * DOM, damit er sich testen lässt.
 *
 * Die Leiste bildet die Seite maßstäblich ab: Jede Sektion bekommt so viel
 * Höhe, wie sie auf der Seite einnimmt. Der Punkt einer Sektion sitzt damit
 * ungefähr dort, wo sie im Dokument beginnt, und der Balken auf der Linie
 * zeigt, welcher Teil der Seite gerade im Bild ist.
 */

/**
 * Gewichte für die Zeilen der Leiste: wie viel Seite vor der ersten Sektion
 * liegt (Hero und Partnerleiste) und wie lang jede Sektion bis zur nächsten
 * ist. Die letzte reicht bis zum Ende von `<main>`.
 */
export function sectionWeights(tops: number[], start: number, end: number) {
  const intro = Math.max(0, (tops[0] ?? end) - start);
  const sections = tops.map((top, i) => Math.max(0, (tops[i + 1] ?? end) - top));
  return { intro, sections };
}

/**
 * Rechnet eine Position im Dokument auf eine Höhe in der Leiste um.
 *
 * Stückweise linear zwischen festen Paaren (Anfang, Beginn jeder Sektion,
 * Ende): Steht eine Sektion oben im Bild, steht der Balken genau auf ihrem
 * Punkt – auch wenn Titel und Abstände oben in der Leiste die Proportionen
 * etwas verschieben.
 */
export function stripPosition(y: number, docYs: number[], stripYs: number[]): number {
  if (y <= docYs[0]) return stripYs[0];
  for (let i = 1; i < docYs.length; i++) {
    if (y <= docYs[i]) {
      const span = docYs[i] - docYs[i - 1];
      const t = span > 0 ? (y - docYs[i - 1]) / span : 1;
      return stripYs[i - 1] + t * (stripYs[i] - stripYs[i - 1]);
    }
  }
  return stripYs[stripYs.length - 1];
}

/**
 * Lage und Länge des Balkens auf der Linie, mit Mindestlänge.
 *
 * Die Startseite ist etwa doppelt so lang wie ein typischer LessWrong-Beitrag,
 * maßstäblich wäre der Balken entsprechend halb so lang und in den langen
 * Sektionen kaum zu sehen. Deshalb nie kürzer als `minLength`. Er wächst nach
 * unten, damit sein oberes Ende auf dem Punkt der Sektion bleibt, die gerade
 * oben im Bild beginnt, und am Ende der Linie nach oben.
 */
export function barSpan(top: number, bottom: number, lineHeight: number, minLength: number) {
  const height = Math.min(lineHeight, Math.max(bottom - top, minLength));
  return { top: Math.max(0, Math.min(top, lineHeight - height)), height };
}

/** Die letzte Sektion, deren Anfang die Linie `y` erreicht hat; -1 davor. */
export function activeSection(tops: number[], y: number): number {
  let active = -1;
  tops.forEach((top, i) => {
    if (top <= y) active = i;
  });
  return active;
}
