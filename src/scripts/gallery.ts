/**
 * Fotogalerie der Event-Seite: Ein Klick auf ein Foto im Raster öffnet es groß
 * in einem <dialog>. Die Spur rastet ein wie das Karussell, wischen geht also
 * nativ; dazu Pfeilknöpfe, Pfeiltasten und der Zähler. Escape schließt der
 * Browser selbst. Ohne JavaScript führt der Link einfach zum Bild.
 *
 *   [data-gallery-open="2"] … <dialog data-gallery>
 *     > [data-gallery-track] > li, [data-gallery-prev|next|close|count]
 */
export function initGallery(): void {
  const dialog = document.querySelector<HTMLDialogElement>("dialog[data-gallery]");
  const track = dialog?.querySelector<HTMLElement>("[data-gallery-track]");
  if (!dialog || !track) return;
  const slides = track.children.length;
  const count = dialog.querySelector<HTMLElement>("[data-gallery-count]");
  const index = () => Math.round(track.scrollLeft / track.clientWidth);
  // Wer Animationen abgeschaltet hat, springt statt zu gleiten.
  const smooth: ScrollBehavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
  const go = (i: number, behavior = smooth) =>
    track.scrollTo({ left: ((i + slides) % slides) * track.clientWidth, behavior });
  const images = [...track.querySelectorAll("img")];
  // `loading="lazy"` greift im Dialog nicht verlässlich – das aktuelle Foto
  // und seine Nachbarn werden deshalb selbst angestoßen.
  const update = () => {
    const i = index();
    for (const j of [i - 1, i, i + 1]) images.at(j % slides)?.setAttribute("loading", "eager");
    if (count) count.textContent = `${i + 1} / ${slides}`;
  };

  for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-gallery-open]")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      go(Number(link.dataset.galleryOpen), "instant");
      update();
    });
  }
  dialog.addEventListener("close", () => (document.documentElement.style.overflow = ""));
  dialog.querySelector("[data-gallery-close]")?.addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-gallery-prev]")?.addEventListener("click", () => go(index() - 1));
  dialog.querySelector("[data-gallery-next]")?.addEventListener("click", () => go(index() + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") go(index() - 1);
    else if (event.key === "ArrowRight") go(index() + 1);
    else return;
    event.preventDefault();
  });
  // Klick auf den dunklen Rand neben dem Bild schließt.
  track.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLImageElement)) dialog.close();
  });
  track.addEventListener("scroll", update, { passive: true });
}
