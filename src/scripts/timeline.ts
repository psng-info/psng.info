import { formatRelativeToToday } from "@/lib/events/format";
import { toIsoDate } from "@/lib/events/schedule";
import type { Locale } from "@/i18n/locale";

/**
 * Der Zeitstrahl auf /events kommt fertig aus dem Build. Hier wird nur
 * nachgeführt, was vom heutigen Tag und von der Auswahl abhängt:
 *
 * - Heute-Marker und „in 6 Tagen“, falls seit dem Build ein Tag vergangen ist
 *   (die tägliche Neuerstellung holt den Rest nach),
 * - der Filter aus `?filter=` – in der URL, damit man auf eine gefilterte
 *   Ansicht verlinken kann und Zurück den Wechsel rückgängig macht,
 * - „Mehr anzeigen“ für alles Gewesene jenseits der ersten Einträge.
 */
const FILTERS = ["alle", "vortraege", "community"] as const;
type Filter = (typeof FILTERS)[number];

export function initTimeline(): void {
  const list = document.querySelector<HTMLOListElement>("ol.timeline");
  const marker = list?.querySelector<HTMLLIElement>(".timeline-today");
  const more = document.querySelector<HTMLButtonElement>(".timeline-more");
  if (!list || !marker || !more) return;

  const locale = document.documentElement.lang as Locale;
  const pageSize = Number(list.dataset.pageSize) || 8;
  const rows = [...list.querySelectorAll<HTMLLIElement>(".timeline-row")];
  let expanded = false;

  // Heute neu bestimmen: Der Marker steht vor dem ersten Eintrag, der vorbei ist.
  const today = toIsoDate(new Date());
  for (const row of rows) {
    row.dataset.phase = (row.dataset.end ?? row.dataset.date!) < today ? "past" : "upcoming";
    const relative = row.querySelector<HTMLElement>("[data-relative]");
    if (relative) {
      relative.hidden = row.dataset.phase === "past";
      relative.textContent = relative.hidden ? "" : formatRelativeToToday(relative.dataset.relative!, locale, new Date());
    }
  }
  const firstPast = rows.find((r) => r.dataset.phase === "past");
  list.insertBefore(marker, firstPast ?? null);

  const current = (): Filter => {
    const value = new URLSearchParams(location.search).get("filter");
    return (FILTERS as readonly string[]).includes(value ?? "") ? (value as Filter) : "alle";
  };

  const apply = () => {
    const filter = current();
    for (const link of document.querySelectorAll<HTMLAnchorElement>("a[data-filter]")) {
      if (link.dataset.filter === filter) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
    const matching = rows.filter((r) => filter === "alle" || r.dataset.column === filter);
    const past = matching.filter((r) => r.dataset.phase === "past");
    // Ein Link auf einen einzelnen Eintrag muss auch greifen, wenn er hinter
    // „Mehr anzeigen“ läge.
    const target = location.hash && past.findIndex((r) => `#${r.id}` === location.hash);
    if (typeof target === "number" && target >= pageSize) expanded = true;
    const shownPast = new Set(expanded ? past : past.slice(0, pageSize));
    for (const row of rows) {
      row.hidden = !matching.includes(row) || (row.dataset.phase === "past" && !shownPast.has(row));
    }
    // Der Marker trennt zwei Hälften; ist die obere leergefiltert, sagte er nur
    // noch „darüber kommt nichts“.
    marker.hidden = !matching.some((r) => r.dataset.phase === "upcoming");
    const hiddenCount = past.length - shownPast.size;
    more.hidden = hiddenCount === 0;
    more.textContent = `${more.dataset.label} (${hiddenCount})`;
  };

  for (const link of document.querySelectorAll<HTMLAnchorElement>("a[data-filter]")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const url = new URL(location.href);
      if (link.dataset.filter === "alle") url.searchParams.delete("filter");
      else url.searchParams.set("filter", link.dataset.filter!);
      history.pushState(null, "", url);
      apply();
    });
  }
  more.addEventListener("click", () => {
    expanded = true;
    apply();
  });
  window.addEventListener("popstate", apply);
  apply();
}
