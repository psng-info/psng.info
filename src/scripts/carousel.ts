/**
 * Fotokarussell ohne Bibliothek: Die Spur ist ein waagerecht scrollender
 * Streifen mit Einrasten, wischen geht also ohne JavaScript. Hier kommen nur
 * die Pfeile (am Ende wieder von vorn) und der Zähler „2 / 5“ dazu.
 *
 *   [data-carousel] > [data-carousel-track] > li
 *                   > [data-carousel-prev], [data-carousel-next], [data-carousel-count]
 */
export function initCarousels(): void {
  for (const root of document.querySelectorAll<HTMLElement>("[data-carousel]")) {
    const track = root.querySelector<HTMLElement>("[data-carousel-track]");
    if (!track) continue;
    const slides = track.children.length;
    const count = root.querySelector<HTMLElement>("[data-carousel-count]");
    const index = () => Math.round(track.scrollLeft / track.clientWidth);
    const go = (i: number) => track.scrollTo({ left: ((i + slides) % slides) * track.clientWidth });

    root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => go(index() - 1));
    root.querySelector("[data-carousel-next]")?.addEventListener("click", () => go(index() + 1));
    if (count) {
      track.addEventListener("scroll", () => (count.textContent = `${index() + 1} / ${slides}`), { passive: true });
    }
  }
}
