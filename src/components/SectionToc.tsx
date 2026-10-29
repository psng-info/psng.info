import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { MAIN_ID } from "@/components/SkipLink";
import { useCopy } from "@/i18n/copy";
import { barSpan, sectionWeights, stripPosition } from "@/lib/toc";
import { useActiveSection } from "@/lib/useActiveSection";

type Weights = ReturnType<typeof sectionWeights>;

/*
 * Schriften wie im Inhaltsverzeichnis von LessWrong: der Titel in
 * Kapitälchen aus einer Buchschrift, die Einträge in einer humanistischen
 * Grotesk. Beide als Systemschriften, es wird nichts nachgeladen – auf dem Mac
 * Palatino und Gill Sans, unter Windows Palatino Linotype und Calibri.
 */
const TITLE_FONT = 'Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", Georgia, serif';
const ROW_FONT =
  'Calibri, "Gill Sans", "Gill Sans MT", "Myriad Pro", Myriad, "Liberation Sans", "Nimbus Sans L", Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Mindestlänge des Balkens als Anteil der Linie, siehe barSpan(). */
const MIN_BAR = 0.12;

/**
 * Inhaltsverzeichnis am linken Rand der Startseite, nach dem Vorbild der
 * Beitragsseiten auf LessWrong.
 *
 * Im Ruhezustand ist nur ein schmaler Streifen zu sehen: eine Linie mit einem
 * Punkt je Sektion und einem Balken für den Teil der Seite, der gerade im Bild
 * ist. Erst wenn die Maus über der Spalte steht, blenden die Namen ein. Die
 * Abstände der Punkte entsprechen der Länge der Sektionen (siehe lib/toc.ts).
 *
 * Die Spalte ist reserviert, die Sektionen weichen ihr aus (Klasse
 * `toc-shift` in index.css). Unter 960 px – auch bei starkem Zoom – fällt
 * beides weg und der Inhalt steht wieder mittig.
 *
 * Die Einträge kommen aus `c.nav.links`: dieselben Sektionen und Namen wie in
 * der Navigation, in beiden Sprachen.
 */
const SectionToc = () => {
  const c = useCopy();
  const links = c.nav.links;
  const active = useActiveSection(links.map((l) => l.hash));

  const [weights, setWeights] = useState<Weights | null>(null);

  const columnRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const weightsRef = useRef<Weights | null>(null);

  const sync = useCallback(() => {
    const column = columnRef.current;
    const line = lineRef.current;
    const bar = barRef.current;
    const main = document.getElementById(MAIN_ID);
    // Unter 960 px ist die Spalte ausgeblendet, dann gibt es nichts zu tun.
    if (!column || !line || !bar || !main || column.offsetParent === null) return;

    const scrollY = window.scrollY;
    const docTop = (el: Element) => el.getBoundingClientRect().top + scrollY;
    const sections = links.map((l) => document.getElementById(l.hash.slice(1)));
    if (sections.some((s) => !s)) return;

    const start = docTop(main);
    const end = start + main.offsetHeight;
    const tops = sections.map((s) => docTop(s!));

    const next = sectionWeights(tops, start, end);
    const prev = weightsRef.current;
    if (
      !prev ||
      Math.round(prev.intro) !== Math.round(next.intro) ||
      prev.sections.some((w, i) => Math.round(w) !== Math.round(next.sections[i]))
    ) {
      weightsRef.current = next;
      setWeights(next);
    }

    // Wie bei LessWrong: das ganze Fenster von seiner Ober- bis zur Unterkante,
    // stückweise über die Punkte auf die Linie abgebildet.
    const lineRect = line.getBoundingClientRect();
    const dotYs = dotRefs.current.map((dot) => {
      if (!dot) return 0;
      const r = dot.getBoundingClientRect();
      return r.top + r.height / 2 - lineRect.top;
    });
    const docYs = [start, ...tops, end];
    const stripYs = [0, ...dotYs, lineRect.height];
    const span = barSpan(
      stripPosition(scrollY, docYs, stripYs),
      stripPosition(scrollY + window.innerHeight, docYs, stripYs),
      lineRect.height,
      lineRect.height * MIN_BAR,
    );
    bar.style.top = `${span.top}px`;
    bar.style.height = `${span.height}px`;
  }, [links]);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Sektionen ändern ihre Höhe auch ohne Scrollen: aufgeklappte FAQ,
    // Eventfilter, nachgeladene Bilder.
    const main = document.getElementById(MAIN_ID);
    const observer = new ResizeObserver(schedule);
    if (main) observer.observe(main);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [sync]);

  // Neue Gewichte verschieben die Punkte, der Balken muss nachziehen.
  useEffect(() => {
    sync();
  }, [weights, sync]);

  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0 });
  };

  // Ohne Maus gibt es kein Hover, die Namen blieben auf dem Tablet für immer
  // unsichtbar. Dort stehen sie deshalb dauerhaft.
  const reveal =
    "opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";
  const flex = (w: number | undefined) => ({ flex: `${w ?? 1} 1 0%` });
  const tone = (on: boolean) =>
    on ? "text-foreground" : "text-muted-foreground hover:text-foreground";

  return (
    <nav
      aria-label={c.nav.tocLabel}
      className="group absolute inset-y-0 left-0 z-10 hidden w-[var(--toc-width)] min-[960px]:block print:hidden"
    >
      <div
        ref={columnRef}
        className="sticky top-[var(--nav-height,6rem)] ml-px h-[calc(100vh-var(--nav-height,6rem))] overflow-y-auto pb-6 pl-4 pt-[22px] text-left text-xs leading-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex h-full">
          <div ref={lineRef} className="relative -mr-1 w-px shrink-0 bg-foreground/20">
            <div ref={barRef} className="absolute -left-[0.5px] w-[2px] bg-primary" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col pr-2" style={{ fontFamily: ROW_FONT }}>
            <a
              href="#"
              onClick={toTop}
              aria-current={active === -1 ? "location" : undefined}
              className={`${reveal} ${tone(active === -1)} ml-[13px] block pb-3 pt-1.5 text-[16.9px] leading-[15.08px] [font-variant:small-caps]`}
              style={{ fontFamily: TITLE_FONT }}
            >
              Psychedelic Student Network Germany
            </a>

            <div style={flex(weights?.intro)} />

            <ol className="flex flex-col" style={flex(weights?.sections.reduce((a, b) => a + b, 0))}>
              {links.map((link, i) => (
                <li key={link.hash} className="flex flex-col" style={flex(weights?.sections[i])}>
                  <a
                    href={link.hash}
                    aria-current={active === i ? "location" : undefined}
                    className="flex items-center"
                  >
                    {/* Der Punkt als Zeichen wie bei LessWrong; mit den Rändern
                        sitzt er mittig auf der Linie. */}
                    <span
                      ref={(el) => (dotRefs.current[i] = el)}
                      aria-hidden="true"
                      className="ml-0.5 mr-2 h-[9px] font-serif text-[9px] leading-[9px] text-foreground/60"
                    >
                      •
                    </span>
                    <span
                      className={`${reveal} ${tone(active === i)} py-1.5 text-[15.08px] leading-[1em]`}
                    >
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SectionToc;
