import { useEffect, useState } from "react";
import { ExternalLink, Languages, Menu, X } from "lucide-react";
import psngLogo from "@/assets/PSNG-Logo-centered.webp";
import { whatsappHref } from "@/lib/links";
import { useCopy } from "@/i18n/copy";
import { type Locale, locales, localeNames, localeShortNames, useLocale, withLocale } from "@/i18n/locale";
import { rememberScrollForLocaleSwitch } from "@/i18n/localeScroll";
import { pathFor } from "@/i18n/routes";
import { HOME_ANCHORS } from "@/lib/anchors";

const MOBILE_MENU_ID = "mobile-nav";

export type NavSection = "events" | "about" | "guide";

interface Props {
  /** Dieselbe Seite in jeder Sprache – die Astro-Seite kennt sie, die Navigation nicht. */
  switchTo: Record<Locale, string>;
  /** Der Bereich, in dem man gerade ist, für `aria-current`. */
  current?: NavSection;
}

/**
 * Beide Sprachen nebeneinander, die aktive hervorgehoben. Bewusst keine
 * Flaggen: Eine Flagge steht für ein Land, nicht für eine Sprache.
 *
 * Die Links führen auf dieselbe Seite in der Zielsprache, nicht pauschal auf
 * die Startseite: Wer den Leitfaden liest, will ihn übersetzt und nicht von
 * vorn anfangen.
 */
function LanguageSwitch({ switchTo }: { switchTo: Record<Locale, string> }) {
  const current = useLocale();
  const c = useCopy();

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-muted p-0.5">
      <Languages size={13} aria-hidden="true" className="ml-1.5 shrink-0 text-muted-foreground" />
      <div role="group" aria-label={c.nav.languageLabel} className="inline-flex">
        {locales.map((l) => {
          const active = l === current;
          return (
            <a
              key={l}
              href={switchTo[l]}
              hrefLang={l}
              aria-label={localeNames[l]}
              aria-current={active ? "true" : undefined}
              onClick={rememberScrollForLocaleSwitch}
              className={`rounded-full px-2.5 py-1 font-heading text-xs font-medium transition-colors ${
                active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {localeShortNames[l]}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Vier Ziele und der Beitritt als einziger Knopf. Was früher eigene Punkte
 * hatte (FAQ, Team, Kontakt), steht auf der Startseite und unter „Über uns“.
 */
function SiteNav({ switchTo, current }: Props) {
  const [open, setOpen] = useState(false);
  const c = useCopy();
  const locale = useLocale();
  const home = pathFor("home", locale);

  // Menü schließen, wenn der Viewport auf Desktop-Breite wächst – sonst bliebe
  // das offene Panel ohne sichtbaren Schließen-Button stehen.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => mq.matches && setOpen(false);
    close();
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, [open]);

  const links: { key: string; label: string; href: string; section?: NavSection; external?: boolean }[] = [
    { key: "events", label: c.lab.nav.events, href: pathFor("events", locale), section: "events" },
    { key: "groups", label: c.lab.nav.groups, href: `${home}#${HOME_ANCHORS.groups}` },
    { key: "guide", label: c.lab.nav.guide, href: pathFor("guide", locale), section: "guide" },
    { key: "about", label: c.lab.nav.about, href: pathFor("about", locale), section: "about" },
    { key: "media", label: c.nav.media, href: "https://medien.psng.info", external: true },
  ];

  const linkClass = "font-heading text-sm font-medium transition-colors hover:text-primary";

  const renderLink = (link: (typeof links)[number], mobile = false) => {
    const active = link.section !== undefined && link.section === current;
    return (
      <a
        key={link.key}
        href={link.href}
        aria-current={active ? "page" : undefined}
        onClick={mobile ? () => setOpen(false) : undefined}
        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${linkClass} ${active ? "text-primary" : "text-muted-foreground"} ${mobile ? "py-1.5" : ""} ${link.external ? "inline-flex items-center gap-1" : ""}`}
      >
        {link.label}
        {link.external && <ExternalLink size={13} aria-hidden="true" />}
      </a>
    );
  };

  return (
    <nav data-site-nav className="glass fixed inset-x-0 top-0 z-50">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a
          href={home}
          className="flex shrink-0 items-center gap-3 font-heading text-xl font-bold tracking-tight text-primary"
        >
          <img
            src={psngLogo.src}
            alt="PSNG Logo"
            width={36}
            height={36}
            decoding="async"
            className="h-9 w-9 rounded-full border border-border"
          />
          <span className="hidden sm:inline">PSNG</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => renderLink(link))}
          <LanguageSwitch switchTo={switchTo} />
          <a
            href={whatsappHref("nav")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg gradient-psychedelic px-4 py-2 font-heading text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {c.hero.joinWhatsapp}
          </a>
        </div>

        {/* Auf dem Handy bleibt der Beitritt als Knopf stehen, statt im Menü
            zu verschwinden – er ist der eine Schritt, den die Seite auslösen
            will. „WhatsApp" allein, weil der volle Text die Leiste sprengt;
            das ausgeschriebene Ziel steht im aria-label. */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch switchTo={switchTo} />
          <a
            href={whatsappHref("nav-mobil")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.hero.joinWhatsapp}
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg gradient-psychedelic px-3 font-heading text-xs font-medium text-primary-foreground"
          >
            WhatsApp
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-primary"
            onClick={() => setOpen(!open)}
            aria-label={c.nav.menuToggle}
            aria-expanded={open}
            aria-controls={MOBILE_MENU_ID}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Bewusst ohne Auf-/Zuklapp-Animation: Die Navigation auf dem Handy
          darf nicht davon abhängen, dass eine Animation tatsächlich läuft. */}
      {open && (
        <div id={MOBILE_MENU_ID} className="glass md:hidden">
          <div className="flex flex-col gap-2 px-6 py-4">{links.map((link) => renderLink(link, true))}</div>
        </div>
      )}
    </nav>
  );
}

export default withLocale(SiteNav);
