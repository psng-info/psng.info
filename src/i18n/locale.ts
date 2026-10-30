import { createContext, createElement, useContext, type ComponentType, type ReactNode } from "react";

/**
 * Die Seite gibt es auf Deutsch und Englisch. Deutsch ist die Standardsprache
 * und läuft ohne Präfix – die bestehenden URLs bleiben damit unverändert, und
 * nichts, was irgendwo verlinkt ist, bricht weg.
 */
export const locales = ["de", "en"] as const;

export type Locale = (typeof locales)[number];

export const DEFAULT_LOCALE: Locale = "de";

/** Das Sprachpräfix im Pfad, ohne Schrägstriche. Deutsch hat keins. */
export const localePrefix: Record<Locale, string> = {
  de: "",
  en: "en",
};

/**
 * Liest die Sprache aus dem Pfad. Bewusst nicht aus State oder Context: Der
 * Pfad ist ohnehin die Wahrheit – er steht in der Adresszeile, im Lesezeichen
 * und im Index der Suchmaschine. Ein zweiter Speicherort daneben könnte davon
 * abweichen, und dann wäre unklar, welcher von beiden gilt.
 */
export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "de";
}

/*
 * Die Sprache kommt von der Astro-Seite, die sie aus ihrem Pfad kennt, und
 * wird an jede React-Wurzel als Prop gereicht (siehe `withLocale`). Jede Insel
 * ist eine eigene Wurzel – ein Context über die ganze Seite gibt es nicht.
 */
const LocaleContext = createContext<Locale | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children?: ReactNode }) {
  return createElement(LocaleContext.Provider, { value: locale }, children);
}

/** Die Sprache der gerade angezeigten Seite. */
export function useLocale(): Locale {
  const locale = useContext(LocaleContext);
  // Lieber laut scheitern als eine englische Seite still auf Deutsch rendern.
  if (!locale) throw new Error("useLocale() außerhalb von LocaleProvider – fehlt withLocale()?");
  return locale;
}

/**
 * Macht eine Komponente zur Wurzel, die Astro einbinden kann: Sie bekommt die
 * Sprache als Prop und reicht sie per Context nach unten weiter.
 */
export function withLocale<P extends object>(Component: ComponentType<P>) {
  const Wrapped = ({ locale, ...props }: P & { locale: Locale }) =>
    createElement(LocaleProvider, { locale }, createElement(Component as ComponentType<object>, props));
  Wrapped.displayName = `withLocale(${Component.displayName ?? Component.name})`;
  return Wrapped;
}

/** Die jeweils andere Sprache – der Umschalter kennt nur zwei Zustände. */
export function otherLocale(locale: Locale): Locale {
  return locale === "de" ? "en" : "de";
}

/** Anzeigename einer Sprache, in der Sprache selbst. */
export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
};

/** Kürzel für den Umschalter, wo der volle Name zu breit ist. */
export const localeShortNames: Record<Locale, string> = {
  de: "DE",
  en: "EN",
};

/** Der `lang`- und `hreflang`-Wert, den HTML erwartet. */
export const localeTags: Record<Locale, string> = {
  de: "de",
  en: "en",
};

/** Der `og:locale`-Wert, den Open Graph erwartet. */
export const localeOgTags: Record<Locale, string> = {
  de: "de_DE",
  en: "en_US",
};
