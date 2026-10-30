/**
 * Blendet `[data-reveal]`-Elemente ein, sobald sie ins Bild scrollen – der
 * Ersatz für framer-motion, ohne Bibliothek.
 *
 * Versteckt wird nur, was beim Laden noch unterhalb des Sichtfelds liegt.
 * Was schon zu sehen ist, bleibt stehen, statt kurz zu verschwinden. Bei
 * reduzierter Bewegung oder ohne IntersectionObserver passiert gar nichts.
 */
export function initReveal(): void {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove("reveal-pending");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
    if (el.getBoundingClientRect().top < window.innerHeight) continue;
    el.classList.add("reveal-pending");
    observer.observe(el);
  }
}
