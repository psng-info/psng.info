import { useEffect, useState } from "react";
import { activeSection } from "@/lib/toc";

/**
 * Welche der Sektionen gerade gelesen wird – für die Markierung im
 * Inhaltsverzeichnis am Rand und in der Navigation oben.
 *
 * Maßgeblich ist dieselbe Linie, an der ein Sprung zu einem Anker die Sektion
 * absetzt (scroll-padding-top in index.css). Sonst wäre nach einem Klick auf
 * „Team" noch die Sektion davor markiert.
 *
 * -1, solange keine Sektion die Linie erreicht hat oder die Sektionen auf der
 * Seite gar nicht vorkommen (Unterseiten).
 */
export function useActiveSection(hashes: string[]): number {
  const [active, setActive] = useState(-1);
  const key = hashes.join(" ");

  useEffect(() => {
    const ids = key.split(" ").map((h) => h.replace(/^#/, ""));
    let frame = 0;
    const update = () => {
      const els = ids.map((id) => document.getElementById(id));
      if (els.some((el) => !el)) return setActive(-1);
      const scrollY = window.scrollY;
      const tops = els.map((el) => el!.getBoundingClientRect().top + scrollY);
      const padding =
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      setActive(activeSection(tops, scrollY + padding + 1));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return active;
}
