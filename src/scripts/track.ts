/**
 * Klicks zählen mit GoatCounter – ohne Cookies, ohne personenbezogene Daten.
 * Ein Klick wird als Ereignis `art/ort` gezählt, etwa `whatsapp/home-hero`;
 * die Seite steht im Titel. So zeigt GoatCounter, welcher Knopf wo wirkt.
 *
 * Ein Listener für die ganze Seite statt Attributen an jedem Link: Neue Links
 * werden automatisch erfasst, auch die in React-Inseln.
 */
declare global {
  interface Window {
    goatcounter?: { count: (vars: { path: string; title?: string; event?: boolean }) => void };
  }
}

export function track(name: string): void {
  // count.js lädt asynchron; vor dem Laden oder mit Blocker geht das Ereignis verloren.
  window.goatcounter?.count({ path: name, title: location.pathname, event: true });
}

/** Wo auf der Seite: ein eigener Name (`data-track`), Navigation, Footer, sonst der Abschnitt. */
function place(el: Element): string {
  const named = el.closest<HTMLElement>("[data-track]")?.dataset.track;
  if (named) return named;
  if (el.closest("[data-site-nav]")) return "nav";
  if (el.closest("footer")) return "footer";
  const section = el.closest("section, article, dialog");
  const id = section?.id || section?.getAttribute("aria-labelledby");
  return id || "seite";
}

function kind(url: URL): string | undefined {
  if (url.hostname === "chat.whatsapp.com") return "whatsapp";
  if (url.hostname.endsWith("luma.com")) return "anmeldung";
  if (url.hostname === "medien.psng.info") return "medien";
  if (url.protocol === "mailto:") return "mail";
  if (url.hostname !== location.hostname && url.protocol.startsWith("http")) return `extern-${url.hostname.replace(/^www\./, "")}`;
  return undefined;
}

export function initTracking(): void {
  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-gallery-open]")) return track("galerie");
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (link) {
        const name = kind(new URL(link.href, location.href));
        if (name) track(`${name}/${place(link)}`);
        return;
      }
      if (event.target.closest("button[data-youtube]")) track(`video/${place(event.target)}`);
    },
    { capture: true },
  );
}
