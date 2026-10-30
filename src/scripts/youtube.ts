/**
 * Videos laden erst nach dem Klick – vorher geht keine Anfrage an YouTube,
 * zu sehen ist nur das lokal gespeicherte Standbild. Gilt für jeden
 * `button[data-youtube]` auf der Seite.
 */
export function initYouTubeButtons(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>("button[data-youtube]")) {
    button.addEventListener("click", () => {
      const frame = document.createElement("iframe");
      frame.src = button.dataset.youtube!;
      frame.title = button.dataset.title ?? "";
      frame.allow = "autoplay; encrypted-media; picture-in-picture";
      frame.allowFullscreen = true;
      frame.className = "absolute inset-0 h-full w-full";
      button.replaceWith(frame);
    });
  }
}
