import {
  BPSA_INSTAGRAM_LINK,
  BPSA_LINK,
  PARAB_LINK,
  WHATSAPP_LINK,
} from "@/lib/links";
import type { Locale } from "@/i18n/locale";
import { intlLocale, pick, type Localized } from "@/i18n/localized";
import trypPhoto1 from "@/assets/tryp-1.webp";
import icprPhoto from "@/assets/icpr-1.webp";
import alpsPhoto01 from "@/assets/alps-conference/alps-01.webp";
import alpsPhoto02 from "@/assets/alps-conference/alps-02.webp";
import bpsaLogo from "@/assets/BPSA-Logo.webp";
import miguelMoraVeraPhoto from "@/assets/Miguel-Mora-Vera.webp";
import timoSchmidtPhoto from "@/assets/Timo-Schmidt.webp";
import medienBlogThumb from "@/assets/Medien-Blog.webp";
import ytKickoff from "@/assets/yt-fH9gMcj65l4.webp";
import ytLonergan from "@/assets/yt-LftC0jVmxuI.webp";
import ytPrateep from "@/assets/yt-7TlMMklQ34g.webp";
import ytMiguel from "@/assets/yt-R4pILAsjxWM.webp";
import ytPassie from "@/assets/yt-d5nUzSYQPAY.webp";
import ytShortGathering from "@/assets/yt-T5r5fJ9OOm0.webp";
import miguelPhoto01 from "@/assets/miguel-lecture/miguel-01.webp";
import miguelPhoto02 from "@/assets/miguel-lecture/miguel-02.webp";
import miguelPhoto03 from "@/assets/miguel-lecture/miguel-03.webp";
import miguelPhoto04 from "@/assets/miguel-lecture/miguel-04.webp";
import miguelPhoto05 from "@/assets/miguel-lecture/miguel-05.webp";
import miguelPhoto06 from "@/assets/miguel-lecture/miguel-06.webp";
import miguelPhoto07 from "@/assets/miguel-lecture/miguel-07.webp";
import miguelPhoto08 from "@/assets/miguel-lecture/miguel-08.webp";
import miguelPhoto09 from "@/assets/miguel-lecture/miguel-09.webp";
import miguelPhoto10 from "@/assets/miguel-lecture/miguel-10.webp";
import miguelPhoto11 from "@/assets/miguel-lecture/miguel-11.webp";
import abendPhoto01 from "@/assets/abend-rund-um-psychedelika/abend-01.webp";
import abendPhoto04 from "@/assets/abend-rund-um-psychedelika/abend-04.webp";
import abendPhoto06 from "@/assets/abend-rund-um-psychedelika/abend-06.webp";
import abendPhoto07 from "@/assets/abend-rund-um-psychedelika/abend-07.webp";
import abendPhoto09 from "@/assets/abend-rund-um-psychedelika/abend-09.webp";
import abendPhoto10 from "@/assets/abend-rund-um-psychedelika/abend-10.webp";
import abendPhoto11 from "@/assets/abend-rund-um-psychedelika/abend-11.webp";
import abendPhoto12 from "@/assets/abend-rund-um-psychedelika/abend-12.webp";
import abendPhoto15 from "@/assets/abend-rund-um-psychedelika/abend-15.webp";
import abendPhoto16 from "@/assets/abend-rund-um-psychedelika/abend-16.webp";
import abendPhoto17 from "@/assets/abend-rund-um-psychedelika/abend-17.webp";
import abendPhoto18 from "@/assets/abend-rund-um-psychedelika/abend-18.webp";
import abendPhoto19 from "@/assets/abend-rund-um-psychedelika/abend-19.webp";
import abendPhoto20 from "@/assets/abend-rund-um-psychedelika/abend-20.webp";
import abendPhoto21 from "@/assets/abend-rund-um-psychedelika/abend-21.webp";
import abendPhoto22 from "@/assets/abend-rund-um-psychedelika/abend-22.webp";
import abendPhoto23 from "@/assets/abend-rund-um-psychedelika/abend-23.webp";
import abendPhoto24 from "@/assets/abend-rund-um-psychedelika/abend-24.webp";
import abendPhoto25 from "@/assets/abend-rund-um-psychedelika/abend-25.webp";
import abendPhoto26 from "@/assets/abend-rund-um-psychedelika/abend-26.webp";
import abendPhoto27 from "@/assets/abend-rund-um-psychedelika/abend-27.webp";
import abendPhoto28 from "@/assets/abend-rund-um-psychedelika/abend-28.webp";
import abendPhoto29 from "@/assets/abend-rund-um-psychedelika/abend-29.webp";
import abendPhoto30 from "@/assets/abend-rund-um-psychedelika/abend-30.webp";
import abendPhoto31 from "@/assets/abend-rund-um-psychedelika/abend-31.webp";
import abendPhoto32 from "@/assets/abend-rund-um-psychedelika/abend-32.webp";
import abendPhoto33 from "@/assets/abend-rund-um-psychedelika/abend-33.webp";

export type EventCategory =
  | "kickoff"
  | "lecture"
  | "gathering"
  | "workshop"
  | "other";

/** Die Spalten der Events-Sektion – Einordnung nach Veranstaltungstyp, nicht nach Speaker-Status. */
export type EventColumn = "vortraege" | "community";

/**
 * Vortragssprache, ausgewiesen nur dort, wo sie von der Seitensprache abweicht.
 * Der Hinweis erklärt zugleich, warum Beschreibung und Kurzvita einer solchen
 * Karte englisch sind: Sie geben den Vortrag in seiner Sprache wieder, statt
 * ihn zu übersetzen. Bewusst als Satz und nicht als Chip – die Chips daneben
 * sortieren die Karte ein, das hier sagt etwas über ihren Inhalt.
 */
export type EventLanguage = "de" | "en";

export type SpeakerType = "student" | "gast";

/** Farbwelt eines Partner-Chips; die Klassen dazu heißen `badge-*` in index.css. */
export type PartnerTone = "bpsa" | "parab";

/**
 * Ein Eintrag im Zeitstrahl, der kein Termin ist – ein Launch, ein Projektstart.
 * Bewusst ein eigener Typ statt eines Events ohne Uhrzeit und Ort: Ein Event,
 * bei dem die Hälfte der Pflichtfelder nicht zutrifft, lädt zu leeren Karten ein.
 */
export interface PsngMilestone {
  id: string;
  date: string;
  title: Localized;
  description: Localized;
  /** Gleiche Achse wie bei Events, damit der Filter auch Meilensteine erfasst. */
  column: EventColumn;
  /** Kurzes Label auf dem Verlaufs-Chip, z. B. "Launch". */
  badge?: Localized;
  /**
   * Organisation, die den Meilenstein mitgetragen hat, als Chip in der
   * Kopfzeile. Anders als ein Event bekommt ein Meilenstein keine Fußleiste:
   * Ein Launch hat keine Rollen zu verteilen, nur eine Mitwirkende zu nennen.
   */
  partner?: { short: string; name: string; url: string; tone: PartnerTone };
  /** Vorschaubild, 16:9, lokal im Repo – z. B. ein Screengrab des Launches. */
  image?: string;
  links?: { label: Localized; url: string }[];
}

/**
 * Die Lecture-Reihe hat einen festen Takt: jeder 2. Dienstag im Monat. Die
 * Termine stehen damit fest, lange bevor Thema und Speaker feststehen –
 * deshalb werden sie berechnet statt gepflegt. Als leere Platzhalter-Events in
 * `events` waren sie zweimal unbrauchbar: Sie verschwanden beim Verstreichen
 * wieder, und die Liste endete irgendwann dort, wo jemand aufgehört hat, sie
 * zu pflegen. Berechnet reißt der Takt nie ab.
 */
export const LECTURE_SERIES = {
  /** Wochentag nach `Date#getDay`: 2 = Dienstag. */
  weekday: 2,
  /** Der wievielte dieses Wochentags im Monat. */
  ordinal: 2,
  time: "19:00 – 20:00",
  location: "Zoom",
  column: "vortraege" as EventColumn,
};

/**
 * Anlass eines Reihentermins, der einen eigenen Namen trägt. Als Schlüssel und
 * nicht als Text: Der Name steht in copy.ts und damit in beiden Sprachen.
 */
export type SeriesLabelKey = "semesterStart";

/** Ein Monat, in dem die Reihe bewusst vom Takt abweicht. */
export interface SeriesOverride {
  /** Gilt in seinem Monat anstelle des berechneten Termins. */
  date: string;
  /** Ersetzt das Standardlabel, wenn der Anlass einen eigenen Namen hat. */
  labelKey?: SeriesLabelKey;
}

/**
 * Ausnahmen vom Takt. Der Oktobertermin liegt eine Woche nach dem zweiten
 * Dienstag: Zum Semesterstart ist die Uni erst danach wieder voll da. Der
 * Novembertermin liegt eine Woche davor.
 *
 * Bewusst ein Override statt eines Events ohne Thema und Speaker – ein
 * abweichender Termin ist immer noch nur ein Termin, und als Event hätte er
 * eine Karte gefüllt, in der die Hälfte der Felder leer bleibt.
 */
export const SERIES_OVERRIDES: SeriesOverride[] = [
  { date: "2026-10-20", labelKey: "semesterStart" },
  { date: "2026-11-03" },
];

/** Ein berechneter Termin der Reihe – kein Event, solange kein Thema feststeht. */
export interface SeriesDate {
  id: string;
  date: string;
  time: string;
  location: string;
  column: EventColumn;
  /** Fehlt er, gilt der Standardname der Reihe. */
  labelKey?: SeriesLabelKey;
}

export interface EventAssets {
  youtubeUrl?: string;
  shortsUrl?: string;
  slidesUrl?: string;
  photos?: string[];
  /** Alt-Texte parallel zu `photos`, gleicher Index. Fehlt einer, greift ein generischer Fallback. */
  photoAlts?: Localized[];
  attendees?: number;
  /** Durchschnittsbewertung der Teilnehmenden, z. B. "9/10". */
  rating?: string;
  /** Anteil der Teilnehmenden, die das Event weiterempfehlen würden, in Prozent. */
  recommendPercent?: number;
  recapUrl?: string;
  speakerLinkedinUrl?: string;
  /** Link zu einer externen Website (z. B. Partner-Konferenz), mit eigenem Linktext. */
  externalUrl?: string;
  externalLabel?: Localized;
  /** Portraitfoto des Speakers, quadratisch dargestellt. */
  speakerPhoto?: string;
  /**
   * Lokal gehostetes Vorschaubild für `youtubeUrl`. Ohne das würde beim reinen
   * Betrachten der Seite schon ein Thumbnail von i.ytimg.com geladen und damit
   * die IP-Adresse an Google übertragen – vor jeder Nutzerinteraktion.
   */
  youtubeThumbnail?: string;
  /** Dasselbe für `shortsUrl`. Hochkant (9:16), sonst füllt es den Rahmen nicht. */
  shortsThumbnail?: string;
}

/**
 * Die Kooperationsleiste am Fuß einer Karte: wer das Event mitgetragen hat,
 * womit, und wo man die Organisation findet.
 *
 * Vorher stand dieselbe Sache dreifach verteilt auf der Karte – ein Chip mit
 * einem Kürzel, irgendwo ein Logo, und der eigentliche Satz als Kleingedrucktes
 * unter allem anderen. Zusammen war das weder als Beitrag erkennbar noch führte
 * es irgendwohin. Als eigener Block trägt es Name, Logo, Rolle und Links an
 * einer Stelle.
 *
 * Der Chip in der Kopfzeile kommt aus demselben Objekt. Als eigenes Feld
 * daneben lief er zweimal aus dem Tritt: Karten trugen den Chip ohne die
 * Leiste oder die Leiste ohne den Chip, obwohl beide dasselbe behaupten.
 */
export interface PartnerCredit {
  /** Kürzel für den Chip in der Kopfzeile, z. B. "BPSA". */
  short: string;
  /** Farbwelt des Chips. */
  tone: PartnerTone;
  /** Ausgeschriebener Name, z. B. "Berlin Psychedelic Science Association". */
  name: string;
  /** Logo der Organisation, frei stehend eingepasst statt beschnitten. */
  logo: string;
  /**
   * Ein Satz dazu, was die Organisation bei genau diesem Event getragen hat.
   * Entfällt, wo die Karte das ohnehin schon sagt – etwa bei einem Vortrag,
   * der auf den gemeinsam veranstalteten Abend verweist, aus dem er stammt.
   */
  role?: Localized;
  url?: string;
  instagramUrl?: string;
}

export interface PsngEvent {
  id: string;
  title: Localized;
  /** Leitfrage oder Untertitel, steht direkt unter dem Titel. */
  subtitle?: Localized;
  category: EventCategory;
  column: EventColumn;
  date: string;
  /**
   * Stellt der Datumsangabe den Wochentag voran. Bewusst ein Schalter und kein
   * Text: Der Wochentag steht bereits im Datum und wird von `Intl` in der
   * jeweiligen Sprache benannt – als Feld müsste man ihn zweimal pflegen und
   * könnte ihn falsch pflegen.
   */
  showWeekday?: boolean;
  time: Localized;
  endDate?: string;
  location?: Localized;
  speaker?: string;
  speakerType?: SpeakerType;
  /**
   * Sprache der Veranstaltung. Der Hinweis erscheint nur, wo sie von der
   * Sprache der Seite abweicht – wer die Seite auf Englisch liest, soll
   * erfahren, dass eine Aufzeichnung auf Deutsch ist, und umgekehrt. Stimmen
   * beide überein, wäre der Satz nur Rauschen.
   *
   * Ohne Angabe erscheint gar nichts. Bewusst kein Rückfall auf Deutsch: Bei
   * einem Konferenzbesuch wie der ICPR ist „auf Deutsch" schlicht falsch, und
   * bei einem dreitägigen Kongress ist die Frage gar nicht sinnvoll.
   */
  language?: EventLanguage;
  /** verlinkt den Namen des Speakers in der Karte (z. B. persönliche Website) */
  speakerWebsiteUrl?: string;
  /** Kurzvita des Speakers, getrennt von der inhaltlichen Beschreibung. */
  speakerBio?: Localized;
  /**
   * Was der Speaker selbst zum Weiterlesen nennt: Paper, Datenbanken,
   * Projekte. Kurzzitat und Link stehen auf der Karte, damit man sich vorher
   * einlesen kann, ohne einen Titel abzutippen – und hinterher noch findet,
   * worüber der Vortrag lief. Die Zitate bleiben in der Sprache der Quelle;
   * übersetzt wird höchstens der Satz, der eine Datenbank erklärt.
   */
  furtherReading?: { text: Localized; url: string }[];
  /** kurzes Label für besonders hervorgehobene Events (z. B. "Erstes eigenes In-Person-Event") */
  highlightBadge?: Localized;
  /** hebt das Event in den Aufnahmen hervor (z. B. der Kick-off) */
  featured?: boolean;
  /** rendert das Event in den vergangenen Events als große Feature-Karte (Foto-Karussell + Video), statt im normalen 2-Spalten-Grid */
  featuredLarge?: boolean;
  /**
   * Kein „Zum Kalender hinzufügen“ auf dieser Karte. Für Termine, die man
   * sich nicht als eigenen Eintrag anlegt: fremde, mehrtägige Konferenzen,
   * bei denen wir als Community zu Gast waren. Dort gilt der Kalender der
   * Konferenz, und unser Eintrag wäre ein Ganztagsblock über drei Tage, der
   * nichts darüber sagt, wann man sich trifft.
   */
  noCalendar?: boolean;
  /**
   * Kooperation mit einer Partnerorganisation: Chip in der Kopfzeile und
   * Leiste am Kartenfuß. Ersetzt für solche Events den `disclaimer`. Die
   * Gestaltung (`badge-bpsa` und `surface-bpsa` in index.css) ist derzeit auf
   * die BPSA gemünzt.
   */
  partnerCredit?: PartnerCredit;
  /**
   * ID der Veranstaltung, in deren Rahmen dieser Vortrag lief. Ein Talk aus
   * einem größeren Abend bekommt eine eigene Karte, weil die Aufzeichnung für
   * sich steht – der Abend drumherum soll darüber nicht verloren gehen.
   */
  partOfEventId?: string;
  description?: Localized;
  /** kurzer Hinweis, für wen das Event gedacht ist, direkt unter der Beschreibung */
  audienceNote?: Localized;
  /** Teilnahmebeitrag, in der Datum/Ort-Faktenzeile angezeigt */
  contribution?: Localized;
  /** kursiver Hinweis am Kartenende (z. B. "Vorläufiges Programm, Änderungen möglich.") */
  disclaimer?: Localized;
  /**
   * Bild über einer kommenden Karte, z. B. das Motiv einer Konferenz. Bewusst
   * nicht unter `assets.photos`: Fotos machen aus der Karte einen Rückblick
   * ohne Anmelde-Button. Nach dem Termin weicht es echten Fotos.
   */
  coverImage?: string;
  coverAlt?: Localized;
  /** Website der Veranstaltung, als Link neben dem Anmelde-Button. */
  websiteUrl?: string;
  websiteLabel?: Localized;
  registrationUrl?: string;
  /** überschreibt den Standard-Button-Text "Jetzt anmelden" (z. B. "Zoom-Link" bei Online-Talks) */
  registrationLabel?: Localized;
  assets?: EventAssets;
}

export const events: PsngEvent[] = [
  // ── Kick-off ──────────────────────────────────────────────────────────────
  {
    id: "kickoff-2026-03-03",
    title: { de: "Kick-off: Was macht das PSNG?", en: "Kick-off: what does the PSNG do?" },
    category: "kickoff",
    column: "community",
    date: "2026-03-03",
    time: "19:00 – 20:00",
    speaker: "PSNG-Team",
    language: "de",
    featured: true,
    description: {
      de: "Unser allererstes Event – und ein besonderer Moment. Beim Kick-off hat sich das PSNG erstmals vorgestellt: wer wir sind, was unsere Mission ist und wie du aktiv werden, einer Lokalgruppe beitreten oder deine eigene gründen kannst. Danke an alle, die dabei waren!",
      en: "Our very first event, and a special moment. At the kick-off the PSNG introduced itself: who we are, what our mission is, and how you can get involved, join a local group or start one of your own. Thank you to everyone who came!",
    },
    assets: {
      youtubeUrl: "https://www.youtube.com/watch?v=fH9gMcj65l4",
      youtubeThumbnail: ytKickoff,
      slidesUrl: "https://www.canva.com/design/DAHBkDM0-8o/t39605od4UYhUdlL0MnidQ/view",
    },
  },

  // ── Präsenz in der Community (externe Konferenzen) ────────────────────────
  {
    id: "presence-tryp-expo-2026",
    noCalendar: true,
    title: "TRYP Expo",
    category: "other",
    column: "community",
    date: "2026-05-16",
    time: { de: "ganztägig", en: "all day" },
    location: "Funkhaus Berlin",
    description: {
      de: "Europas größtes Event an der Schnittstelle von Psychedelika-Forschung, Mental Health und Bewusstseinskultur: 80+ Speaker, 150+ Aussteller, drei Tage Funkhaus Berlin. Das PSNG hat sich dort als Community getroffen: gemeinsamer Besuch, Banner, und Mittagessen.",
      en: "Europe's largest event at the intersection of psychedelic research, mental health and consciousness culture: 80+ speakers, 150+ exhibitors, three days at Funkhaus Berlin. The PSNG met up there as a community — we went together, brought a banner and had lunch.",
    },
    assets: {
      photos: [trypPhoto1],
      externalUrl: "https://tryp.de",
      externalLabel: "tryp.de",
    },
  },
  {
    id: "presence-icpr-2026",
    noCalendar: true,
    title: "ICPR 2026",
    category: "other",
    column: "community",
    date: "2026-06-05",
    time: { de: "ganztägig", en: "all day" },
    location: "Haarlem",
    description: {
      de: "International Conference on Psychedelic Research: Europas wichtigste wissenschaftliche Konferenz für Psychedelika-Forschung. Das PSNG hat sich auch hier als Gruppe getroffen, ein wichtiger Schritt in der Vernetzung mit der europäischen Forschungscommunity.",
      en: "International Conference on Psychedelic Research: Europe's most important scientific conference on psychedelic research. The PSNG met up here as a group too — an important step in connecting with the European research community.",
    },
    assets: {
      photos: [icprPhoto],
      externalUrl: "https://icpr-conference.com",
      externalLabel: "icpr-conference.com",
    },
  },
  {
    id: "presence-alps-2026",
    noCalendar: true,
    title: "ALPS Research Conference 2026",
    category: "other",
    column: "community",
    date: "2026-10-09",
    endDate: "2026-10-10",
    time: { de: "ganztägig", en: "all day" },
    location: "Kultur & Kongresshaus Aarau",
    description: {
      de: "Die ALPS Conference der Schweizer ALPS Foundation ist einer der zentralen Treffpunkte für psychedelische Forschung in Europa. Zwei Tage lang kommen dort Forschende, Studierende und die Community zusammen, bei Vorträgen, Postern und Panels. Wir waren mit dem PSNG dabei, haben uns gemeinsam Vorträge angehört, uns mit anderen Studierendenorganisationen vernetzt und uns untereinander besser kennengelernt. Wenn du dich für psychedelische Forschung interessierst, lohnt sich die Reise zur Konferenz. Es gibt auch Volunteering-Möglichkeiten, bei denen das Ticket inklusive ist.",
      en: "The ALPS Conference, run by the Swiss ALPS Foundation, is one of the central meeting points for psychedelic research in Europe. For two days, researchers, students and the wider community come together for talks, posters and panels. We went as the PSNG, sat in on talks together, connected with other student organisations and got to know each other better. If you're interested in psychedelic research, the conference is worth the trip. There are also volunteering spots that include a ticket.",
    },
    assets: {
      photos: [alpsPhoto01, alpsPhoto02],
      photoAlts: [
        {
          de: "Die PSNG-Gruppe winkt auf der Treppe vor dem ALPS- und dem PSNG-Banner",
          en: "The PSNG group waving on the stairs in front of the ALPS and PSNG banners",
        },
        {
          de: "Gruppenbild aller Teilnehmenden der ALPS Conference 2026 im Saal in Aarau",
          en: "Group photo of everyone at the ALPS Conference 2026 in the hall in Aarau",
        },
      ],
      externalUrl: "https://alpsconference.com",
      externalLabel: "alpsconference.com",
    },
  },

  // ── Lectures (1. Dienstag des Monats) ─────────────────────────────────────
  {
    id: "lecture-1",
    title: "1. PSNG Lecture",
    category: "lecture",
    column: "vortraege",
    date: "2026-04-14",
    time: "19:00 – 20:00",
    location: "Zoom",
  },
  {
    id: "lecture-2",
    title: "2. PSNG Lecture",
    category: "lecture",
    column: "vortraege",
    date: "2026-05-12",
    time: "19:00 – 20:00",
    location: "Zoom",
  },
  {
    id: "lecture-lonergan-2026-06",
    title: "Introduction to Psychedelic Neuroscience",
    category: "lecture",
    column: "vortraege",
    date: "2026-06-09",
    time: "19:00 – 20:00",
    speaker: "Eric Lonergan, PhD cand.",
    speakerType: "student",
    language: "en",
    description: {
      de: "Ein breiter Überblick: Was Psychedelika sind und wie sie im Gehirn wirken – wie sie Wahrnehmung verändern und psychische Erkrankungen behandeln können. Eric forscht am Decision Circuits Lab (Einstein Center for Neurosciences Berlin) zu den neuronalen und serotonergen Mechanismen von Halluzinationen.",
      en: "A broad overview: what psychedelics are and how they act in the brain — how they alter perception and how they can treat mental illness. Eric researches the neural and serotonergic mechanisms of hallucinations at the Decision Circuits Lab (Einstein Center for Neurosciences Berlin).",
    },
    // Ohne `role`: Die Beschreibung darüber sagt schon, worum es ging, und wer
    // den Abend getragen hat, steht in der Überschrift der Leiste.
    partnerCredit: {
      short: "BPSA",
      tone: "bpsa",
      name: "Berlin Psychedelic Science Association",
      logo: bpsaLogo,
      url: BPSA_LINK,
      instagramUrl: BPSA_INSTAGRAM_LINK,
    },
    assets: {
      youtubeUrl: "https://www.youtube.com/watch?v=LftC0jVmxuI",
      youtubeThumbnail: ytLonergan,
      speakerLinkedinUrl: "https://www.linkedin.com/in/eric-lonergan-563b0683/",
    },
  },
  {
    id: "lecture-5",
    // Titel bleibt deutsch: Der Vortrag hieß so. Der Sprachhinweis auf der
    // Karte sagt, warum hier kein englischer Titel steht.
    title:
      "Ein realitätsnaher Blick auf die aktuelle Therapieforschung mit Psychedelika",
    subtitle: {
      de: "Wie steht es um den tatsächlichen Nutzen für Psychiatrie und Psychotherapie und die Implementierung in das Medizinsystem?",
      en: "What is the actual benefit for psychiatry and psychotherapy, and how would it be implemented in the health system?",
    },
    category: "lecture",
    column: "vortraege",
    date: "2026-08-11",
    showWeekday: true,
    time: "19:30 – 20:30",
    location: "Zoom",
    speaker: "Prof. Dr. Torsten Passie",
    speakerType: "gast",
    speakerWebsiteUrl: "http://psychedelic-science.org/",
    language: "de",
    description: {
      de: "Ein nüchterner Blick auf Wirksamkeit, Methodikkritik und die Grenzen der aktuellen Psychedelika-Forschung. Es geht unter anderem um Neuroplastizität samt negativer Effekte und Nullergebnisse, um die Haltbarkeit von Therapieeffekten und darum, wie gut sich präklinische Befunde übertragen lassen.",
      en: "A sober look at efficacy, methodological criticism and the limits of current psychedelic research. Topics include neuroplasticity, including negative effects and null results, how long therapeutic effects last, and how well preclinical findings translate.",
    },
    speakerBio: {
      de: "Torsten Passie ist apl. Professor für Psychiatrie und Psychotherapie an der Medizinischen Hochschule Hannover und Visiting Scientist an der Goethe-Universität Frankfurt am Main. Er forscht seit mehr als 35 Jahren zu Psychedelika und gilt international als anerkannter Experte für die Pharmakologie und therapeutische Anwendung halluzinogener und entaktogener Substanzen.",
      en: "Torsten Passie is adjunct professor of psychiatry and psychotherapy at Hannover Medical School and a visiting scientist at Goethe University Frankfurt. He has researched psychedelics for more than 35 years and is internationally recognised as an expert on the pharmacology and therapeutic use of hallucinogenic and entactogenic substances.",
    },
    registrationUrl: "https://luma.com/jtglh7ct",
    // Kein Speakerfoto: Das Thumbnail des Videos zeigt ihn schon.
    assets: {
      youtubeUrl: "https://www.youtube.com/watch?v=d5nUzSYQPAY",
      youtubeThumbnail: ytPassie,
    },
  },
  {
    id: "lecture-6",
    title: "Logos und Ekstase. Zur Genealogie eines akademischen Tabus | Hybrid Event",
    subtitle: {
      de: "Was hat die Geschichte des Denkens mit psychedelischer Erfahrung zu tun?",
      en: "What does the history of thought have to do with psychedelic experience?",
    },
    category: "lecture",
    column: "vortraege",
    date: "2026-09-08",
    showWeekday: true,
    time: "19:00 – 20:30",
    location: {
      de: "Zoom und vor Ort: HU Campus Nord, Leonor-Michaelis-Haus, 4. OG, Raum 503a",
      en: "Zoom and in person: HU Campus Nord, Leonor-Michaelis-Haus, 4th floor, room 503a",
    },
    speaker: "Miguel Estéfano Mora Vera, PhD cand.",
    speakerType: "student",
    language: "de",
    description: {
      de: "Ein interdisziplinärer Vortrag über Philosophie, Religion, Geschichte und die Frage, was überhaupt als legitime Form von Erkenntnis gilt.",
      en: "An interdisciplinary talk on philosophy, religion, history, and the question of what counts as a legitimate form of knowledge in the first place.",
    },
    speakerBio: {
      de: "Philosoph, Musiker und Komponist. Er promoviert an der Universität Freiburg und lebt in Berlin.",
      en: "Philosopher, musician and composer. He is doing his doctorate at the University of Freiburg and lives in Berlin.",
    },
    audienceNote: {
      de: "Kostenlos und offen für alle.",
      en: "Free and open to everyone.",
    },
    partnerCredit: {
      short: "BPSA",
      tone: "bpsa",
      name: "Berlin Psychedelic Science Association",
      logo: bpsaLogo,
      role: {
        de: "Eine gemeinsame Lecture von PSNG und BPSA.",
        en: "A joint lecture by the PSNG and the BPSA.",
      },
      url: BPSA_LINK,
      instagramUrl: BPSA_INSTAGRAM_LINK,
    },
    // Keine Anmeldung: Der Zoom-Link wird kurz vorher in der WhatsApp-Gruppe
    // und auf Instagram geteilt. Der Button führt deshalb in die Community,
    // nicht auf ein Anmeldeformular.
    registrationUrl: WHATSAPP_LINK,
    registrationLabel: {
      de: "Zoom-Link via WhatsApp",
      en: "Zoom link via WhatsApp",
    },
    assets: {
      youtubeUrl: "https://www.youtube.com/watch?v=R4pILAsjxWM",
      youtubeThumbnail: ytMiguel,
      photos: [
        miguelPhoto01,
        miguelPhoto02,
        miguelPhoto03,
        miguelPhoto04,
        miguelPhoto05,
        miguelPhoto06,
        miguelPhoto07,
        miguelPhoto08,
        miguelPhoto09,
        miguelPhoto10,
        miguelPhoto11,
      ],
      photoAlts: [
        { de: "Eine Reihe aufmerksamer Zuhörender", en: "A row of attentive listeners" },
        { de: "Miguel erklärt mit erhobener Hand", en: "Miguel explaining with a raised hand" },
        { de: "Zuhörende in der ersten Reihe, eine lacht", en: "Listeners in the front row, one of them laughing" },
        { de: "Miguel spricht, den Stift in der Hand", en: "Miguel speaking, pen in hand" },
        { de: "Zuhörende, nah aufgenommen", en: "Listeners, close up" },
        { de: "Mitschrift mit Füller im Notizbuch", en: "Notes taken with a fountain pen" },
        { de: "Zwei Zuhörende im Profil", en: "Two listeners in profile" },
        { de: "Ein Teilnehmer stellt in der Diskussion eine Frage", en: "A participant asking a question in the discussion" },
        { de: "Ein Teilnehmer gestikuliert in der Diskussion", en: "A participant gesturing during the discussion" },
        { de: "Der Raum von hinten: Miguel am Tisch, im Vordergrund der Laptop für den Zoom-Stream", en: "The room from the back: Miguel at the desk, the laptop for the Zoom stream in front" },
        { de: "Laptop mit Zoom: Die Online-Teilnehmenden während der Fragerunde", en: "Laptop with Zoom: the online participants during the Q&A" },
      ],
      speakerLinkedinUrl: "https://www.linkedin.com/in/miguel-estefano-mora-vera/",
      speakerPhoto: miguelMoraVeraPhoto,
    },
  },

  {
    id: "lecture-schmidt-2026-10-20",
    title: "The Systematic Scientific Study of Altered States of Consciousness",
    subtitle: {
      de: "Wie lassen sich psychedelische und andere veränderte Bewusstseinszustände systematisch beschreiben, messen und vergleichen?",
      en: "How can psychedelic and other altered states of consciousness be systematically described, measured and compared?",
    },
    category: "lecture",
    column: "vortraege",
    date: "2026-10-20",
    showWeekday: true,
    time: { de: "19:00 – 20:30 Uhr, inkl. Apéro", en: "19:00 – 20:30, incl. apéro" },
    location: {
      de: "Zoom und vor Ort: HU Berlin, Philippstraße 12, Haus 4, Hörsaal 4",
      en: "Zoom and in person: HU Berlin, Philippstraße 12, building 4, lecture hall 4",
    },
    speaker: "Prof. Dr. Timo Torsten Schmidt",
    speakerType: "gast",
    language: "en",
    description: {
      de: "Veränderte Bewusstseinszustände – besonders die durch Psychedelika ausgelösten – verändern Wahrnehmung, Gefühl, Denken und Selbsterleben tiefgreifend. Der Vortrag stellt Ansätze vor, diese vielschichtigen Erfahrungen systematisch zu beschreiben, zu quantifizieren und zu klassifizieren. An der Altered States Database (ASDB) zeigt Timo T. Schmidt, wie psychometrische Daten aus vielen experimentellen Studien den quantitativen Vergleich zwischen verschiedenen Substanzen und anderen bewusstseinsverändernden Techniken möglich machen. Zum Schluss geht es darum, wie groß angelegte Erhebungen und Citizen Science die Vielfalt veränderter Erfahrungen auch außerhalb des Labors kartieren können.",
      en: "Altered states of consciousness, particularly those induced by psychedelics, involve profound changes across perception, emotion, cognition and self-experience. The talk introduces approaches for systematically describing, quantifying and classifying these multidimensional experiences. Drawing on the Altered States Database (ASDB), Timo T. Schmidt shows how psychometric data accumulated across experimental studies enable quantitative comparisons between different substances and other consciousness-modifying techniques. It closes on how large-scale and citizen-science approaches can help map the diversity of altered experiences beyond traditional laboratory settings.",
    },
    speakerBio: {
      de: "Timo Torsten Schmidt ist Kognitionswissenschaftler und Professor für Cognitive Neuroscience an der Medical School Berlin (MSB), wo er den Masterstudiengang Cognitive Neuroscience leitet. Er forscht zur Neurowissenschaft und Phänomenologie veränderter Bewusstseinszustände – psychedelische Zustände, Meditation, stroboskopische Lichtstimulation. Er hat die Altered States Database gegründet, eine große Sammlung für den quantitativen Vergleich subjektiver Erfahrungen über verschiedene Induktionsmethoden hinweg, und ist Mitgründer und Vorstandsmitglied von CIRCE, einer gemeinnützigen Organisation für interdisziplinäre und partizipative Bewusstseinsforschung.",
      en: "Timo Torsten Schmidt is a cognitive neuroscientist and Professor of Cognitive Neuroscience at Medical School Berlin (MSB), where he leads the MSc Cognitive Neuroscience programme. His research focuses on the neuroscience and phenomenology of altered states of consciousness, including psychedelic states, meditation and stroboscopic light stimulation. He founded the Altered States Database, a large-scale resource for the quantitative comparison of subjective experiences across different methods of inducing altered states, and is a co-founder and board member of CIRCE, a non-profit organisation promoting interdisciplinary and participatory research on consciousness and altered states.",
    },
    audienceNote: {
      de: "45 Minuten Vortrag, danach Fragen und Antworten.",
      en: "A 45-minute talk, followed by Q&A.",
    },
    furtherReading: [
      {
        text: {
          de: "asdb.info – offene Datenbank mit Fragebogendaten zu veränderten Bewusstseinszuständen, ausgelöst durch Substanzen wie durch Methoden ohne Substanz. Online selbst vergleichbar.",
          en: "asdb.info – an open-science database of questionnaire data on altered states, induced by substances and by non-drug methods. Compare them yourself online.",
        },
        url: "https://asdb.info",
      },
      {
        text: "Fort, L. D., Costines, C., Wittmann, M., Demertzi, A., & Schmidt, T. T. (2025). Classification schemes of altered states of consciousness. Neuroscience & Biobehavioral Reviews, 175, 106178.",
        url: "https://doi.org/10.1016/j.neubiorev.2025.106178",
      },
      {
        text: "Prugger, J., Derdiyok, E., Dinkelacker, J., Costines, C., & Schmidt, T. T. (2022). The Altered States Database: Psychometric data from a systematic literature review. Scientific Data, 9, 720.",
        url: "https://doi.org/10.1038/s41597-022-01822-4",
      },
    ],
    partnerCredit: {
      short: "BPSA",
      tone: "bpsa",
      name: "Berlin Psychedelic Science Association",
      logo: bpsaLogo,
      role: {
        de: "Eine gemeinsame Lecture von PSNG und BPSA.",
        en: "A joint lecture by the PSNG and the BPSA.",
      },
      url: BPSA_LINK,
      instagramUrl: BPSA_INSTAGRAM_LINK,
    },
    // Wie beim Vortrag im September: keine Anmeldung, der Zoom-Link kommt
    // kurz vorher in die WhatsApp-Community.
    registrationUrl: WHATSAPP_LINK,
    registrationLabel: {
      de: "Zoom-Link via WhatsApp",
      en: "Zoom link via WhatsApp",
    },
    assets: {
      speakerPhoto: timoSchmidtPhoto,
    },
  },

  // Speaker steht, Thema und Uhrzeit noch nicht. Ohne Kalendereintrag, bis die
  // Uhrzeit feststeht – sonst landet ein Termin ohne Zeit im Kalender.
  {
    id: "lecture-majic-2026-11-03",
    title: { de: "Lecture mit Dr. med. Tomislav Majić", en: "Lecture with Dr. med. Tomislav Majić" },
    subtitle: { de: "Thema folgt", en: "Topic to be announced" },
    category: "lecture",
    column: "vortraege",
    date: "2026-11-03",
    showWeekday: true,
    time: { de: "Uhrzeit folgt", en: "Time to be announced" },
    location: {
      de: "Zoom und vor Ort: HU Berlin, Philippstraße 12, Haus 4, Hörsaal 4",
      en: "Zoom and in person: HU Berlin, Philippstraße 12, building 4, lecture hall 4",
    },
    speaker: "Dr. med. Tomislav Majić",
    speakerType: "gast",
    noCalendar: true,
    registrationUrl: WHATSAPP_LINK,
    registrationLabel: {
      de: "Zoom-Link via WhatsApp",
      en: "Zoom link via WhatsApp",
    },
  },

  // Ein Vortrag aus dem Abend vom 8.8., mit eigener Karte, weil die Aufzeichnung
  // für sich steht. Gleiches Datum wie der Abend – bei Gleichstand entscheidet
  // die Reihenfolge hier, und der Vortrag steht über dem Abend, aus dem er kommt.
  {
    id: "talk-beed-2026-08-08",
    title: "The Neuroscience of Psychedelics and Prosocial Effects",
    subtitle:
      "From receptor binding to behaviour – what do we know about how psychedelics work?",
    category: "lecture",
    column: "vortraege",
    date: "2026-08-08",
    showWeekday: true,
    time: "16:00 – 20:00",
    location: "Molecule Office @ König Galerie, Alexandrinenstraße 118–121, 10969 Berlin",
    speaker: "Dr. Prateep Beed",
    speakerType: "gast",
    language: "en",
    partOfEventId: "gathering-2026-08-08",
    // Beschreibung und Kurzvita in der Sprache des Vortrags, ausgewiesen durch
    // den Sprach-Chip auf der Karte.
    description:
      "Psychedelics can be studied at every level of the nervous system, from receptor binding to behaviour. Prateep Beed walks through those levels, asks how serotonergic psychedelics compare in drug harm rankings, and traces how the research field developed over time. He then covers individual effect domains – neuroplasticity, therapeutic outcomes in depression, altered self-experience – and closes on prosocial effects: MDMA, LSD and psilocybin compared on empathy, trust and felt connectedness, and which of those are dose-dependent or persist beyond the acute drug state.",
    speakerBio:
      "A Berlin-based neuroscientist who also designs immersive experiences using virtual reality. He completed his PhD at the Charité – Universitätsmedizin Berlin and spent more than a decade there and at the Berlin Institute of Health studying how excitatory and inhibitory activity is balanced in cortical networks, and what happens to that balance in neurodegenerative disease such as Alzheimer's. Alongside the lab work he co-founded Immersia Labs, which develops multisensory VR for emotional regulation and stress reduction, and he advises the MIND Foundation on neuroscience.",
    partnerCredit: {
      short: "BPSA",
      tone: "bpsa",
      name: "Berlin Psychedelic Science Association",
      logo: bpsaLogo,
      url: BPSA_LINK,
      instagramUrl: BPSA_INSTAGRAM_LINK,
    },
    assets: {
      youtubeUrl: "https://www.youtube.com/watch?v=7TlMMklQ34g",
      youtubeThumbnail: ytPrateep,
    },
  },

  // ── Gatherings ────────────────────────────────────────────────────────────
  {
    id: "gathering-2026-08-08",
    title: {
      de: "Ein Abend rund um Psychedelika, Forschung, Verbindung & Austausch",
      en: "An evening around psychedelics, research, connection & exchange",
    },
    category: "gathering",
    column: "community",
    highlightBadge: {
      de: "Erstes eigenes In-Person-Event",
      en: "Our first in-person event",
    },
    date: "2026-08-08",
    showWeekday: true,
    time: {
      de: "16:00 bis 20:00 Uhr (Einlass ab 15:30)",
      en: "16:00 to 20:00 (doors from 15:30)",
    },
    location: "Molecule Office @ König Galerie, Alexandrinenstraße 118–121, 10969 Berlin",
    contribution: {
      de: "5 bis 10 € empfohlen, freiwillig, niemand wird abgewiesen",
      en: "€5–10 suggested, voluntary, nobody is turned away",
    },
    registrationUrl: "https://luma.com/n6io5052",
    description: {
      de: "Unser erstes eigenes In-Person-Treffen, gemeinsam mit der Berlin Psychedelic Science Association (BPSA), zu Gast im Molecule Office. Ein Abend zum Ankommen, Kennenlernen und Austauschen: mit einem Vortrag von Dr. Prateep Beed zu den prosozialen Effekten von Psychedelika, einem interaktiven Workshop von Eric Lonergan (PhD cand.) und Jennifer Them (PhD cand.), einem Impuls-Talk von Stela Malvasija, M.Sc. zur Integration und einer Klangmeditation mit Journalling, geleitet von Lucie André (Beyond Yoga) und Daniel Burckhardt (HRL). Durch den Abend führte Lennert van de Kreeke. Dazu ein mit viel Liebe selbstgemachtes veganes Fingerfood-Buffet und ein Büchertisch vom Nachtschatten Verlag mit psychedelischer Literatur zum Stöbern. Danach gemeinsames Abendessen auswärts für alle, die mochten. Danke an alle, die dabei waren!",
      en: "Our first in-person meet-up, together with the Berlin Psychedelic Science Association (BPSA) and hosted at the Molecule Office. An evening to arrive, meet people and talk: a lecture by Dr Prateep Beed on the prosocial effects of psychedelics, an interactive workshop by Eric Lonergan (PhD cand.) and Jennifer Them (PhD cand.), a short talk on integration by Stela Malvasija, M.Sc., and a sound meditation with journalling led by Lucie André (Beyond Yoga) and Daniel Burckhardt (HRL). Lennert van de Kreeke hosted the evening. Plus a lovingly home-made vegan finger-food buffet and a book table from Nachtschatten Verlag with psychedelic literature to browse. Afterwards, dinner out together for anyone who felt like it. Thank you to everyone who came!",
    },
    audienceNote: {
      de: "Für Studierende und alle Interessierten, Vorwissen braucht ihr keins.",
      en: "For students and anyone else interested — no prior knowledge needed.",
    },
    featuredLarge: true,
    partnerCredit: {
      short: "BPSA",
      tone: "bpsa",
      name: "Berlin Psychedelic Science Association",
      logo: bpsaLogo,
      role: {
        de: "Gemeinsam von der BPSA und dem PSNG veranstaltet.",
        en: "Organised jointly by the BPSA and the PSNG.",
      },
      url: BPSA_LINK,
      instagramUrl: BPSA_INSTAGRAM_LINK,
    },
    assets: {
      rating: "9/10",
      recommendPercent: 81,
      attendees: 30,
      shortsUrl: "https://youtube.com/shorts/T5r5fJ9OOm0?feature=share",
      shortsThumbnail: ytShortGathering,
      // Reihenfolge kuratiert: stärkstes Foto zuerst (Weitwinkel-Abschlusskreis),
      // dann Team, Sprecherin, Talk, Abschlusskreis, Gong, Garten, Banner,
      // danach chronologisch durch den Abend. DSLR-Fotos (18–30) ersetzen die
      // schwächeren Handy-Aufnahmen derselben Momente.
      photos: [
        abendPhoto31,
        abendPhoto09,
        abendPhoto29,
        abendPhoto32,
        abendPhoto04,
        abendPhoto17,
        abendPhoto11,
        abendPhoto16,
        abendPhoto10,
        abendPhoto01,
        abendPhoto18,
        abendPhoto19,
        abendPhoto20,
        abendPhoto27,
        abendPhoto06,
        abendPhoto21,
        abendPhoto22,
        abendPhoto23,
        abendPhoto24,
        abendPhoto33,
        abendPhoto07,
        abendPhoto26,
        abendPhoto25,
        abendPhoto28,
        abendPhoto12,
        abendPhoto30,
        abendPhoto15,
      ],
      photoAlts: [
        { de: "Weitwinkelblick von der Empore auf den vollen Raum im Abschlusskreis", en: "Wide view from the gallery of the full room in the closing circle" },
        { de: "Gruppenfoto auf der Bühne", en: "Group photo on stage" },
        { de: "Sprecherin am Mikrofon zur Klangmeditation", en: "Speaker at the microphone introducing the sound meditation" },
        { de: "Folie 'Prosocial Effects' während des Vortrags von Prateep Beed", en: "Slide reading 'Prosocial Effects' during Prateep Beed's talk" },
        { de: "Sprecher mit Klangschale während des Vortrags", en: "Speaker holding a singing bowl during the talk" },
        { de: "Abschlusskreis im Innenraum", en: "Closing circle indoors" },
        { de: "Loungebereich mit Gong für die Klangmeditation", en: "Lounge area with a gong for the sound meditation" },
        { de: "Gruppe im Garten nach der Veranstaltung", en: "Group in the garden after the event" },
        { de: "Banner der Community am Eingang", en: "Community banner at the entrance" },
        { de: "Leuchtschild von Molecule am Eingang des Veranstaltungsorts", en: "Molecule's illuminated sign at the entrance to the venue" },
        { de: "Vorbereiteter Raum mit Sitzkissen für den Workshop", en: "The room set up with floor cushions for the workshop" },
        { de: "Folie mit Vergleich potenzieller Risiken verschiedener Substanzen", en: "Slide comparing the potential harms of different substances" },
        { de: "Publikum aufmerksam beim Vortrag", en: "The audience listening to the talk" },
        { de: "Publikum vor der Folie zu Psilocybin", en: "The audience in front of the slide on psilocybin" },
        { de: "Teilnehmende im Gespräch beim Empfang", en: "Attendees talking during the reception" },
        { de: "Teilnehmende im lebhaften Gespräch", en: "Attendees in lively conversation" },
        { de: "Teilnehmende beim Get-together", en: "Attendees at the get-together" },
        { de: "Teilnehmerin im Gespräch", en: "An attendee in conversation" },
        { de: "Teilnehmerinnen im herzlichen Gespräch", en: "Two attendees in warm conversation" },
        { de: "Reich gedeckter Fingerfood-Tisch im Garten", en: "A well-stocked finger-food table in the garden" },
        { de: "Veganes Fingerfood für den Abend", en: "Vegan finger food for the evening" },
        { de: "Büchertisch mit psychedelischer Literatur", en: "Book table with psychedelic literature" },
        { de: "Teilnehmerin im Garten des Veranstaltungsorts", en: "An attendee in the venue's garden" },
        { de: "Teilnehmende beim Austausch im Garten", en: "Attendees talking in the garden" },
        { de: "Teilnehmende im Stehkreis zur Klangmeditation", en: "Attendees standing in a circle for the sound meditation" },
        { de: "Teilnehmende im Workshop auf dem Boden", en: "Attendees sitting on the floor during the workshop" },
        { de: "Teilnehmer im Gespräch", en: "An attendee in conversation" },
      ],
      // TODO: Aftermovie einbinden, sobald der Schnitt fertig ist – als
      // unlisted YouTube-Video (16:9) hochladen und hier ergänzen:
      // youtubeUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
      // youtubeThumbnail: <lokal importiertes Standbild aus dem Video, siehe
      //   Kommentar bei EventAssets.youtubeThumbnail für den Datenschutzgrund>,
    },
  },
];

export const milestones: PsngMilestone[] = [
  {
    id: "milestone-medien-blog-2026-09-01",
    date: "2026-09-01",
    title: { de: "Medien-Blog ist online", en: "The media blog is live" },
    column: "community",
    badge: "Launch",
    image: medienBlogThumb,
    partner: {
      short: "PARAB",
      name: "Psychedelic Awareness & Research Association Basel",
      url: PARAB_LINK,
      tone: "parab",
    },
    description: {
      de: "Unser gemeinsames Projekt mit PARAB: Beiträge rund um psychedelische Wissenschaft zum Lesen, Hören und Sehen. Dort liegen auch alle Aufnahmen unserer Lectures gesammelt.",
      en: "Our joint project with PARAB: pieces on psychedelic science to read, listen to and watch. It is also where all the recordings of our lectures are collected.",
    },
    // Nur noch der Blog selbst: Zu PARAB führt jetzt der Chip in der Kopfzeile.
    links: [{ label: "medien.psng.info", url: "https://medien.psng.info" }],
  },
];

/**
 * `new Date("2026-07-28")` wird als UTC-Mitternacht geparst und anschließend in
 * Lokalzeit formatiert – westlich von UTC ergibt das den Vortag. Die Datums-
 * angaben sind aber kalendarisch gemeint, also explizit lokal konstruieren.
 */
function parseEventDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function hasAssets(e: PsngEvent): boolean {
  const a = e.assets;
  if (!a) return false;
  return Boolean(
    a.youtubeUrl || a.shortsUrl || a.slidesUrl || a.recapUrl || a.attendees || a.photos?.length || a.externalUrl,
  );
}

/** Ob ein Event mehr als nur Titel/Datum trägt (Beschreibung, Speaker oder Anmeldelink). */
export function hasContent(e: PsngEvent): boolean {
  return Boolean(e.description || e.speaker || e.registrationUrl);
}

export function getUpcomingEvents(referenceDate: Date = new Date()): PsngEvent[] {
  const t = startOfDay(referenceDate);
  return events
    .filter((e) => parseEventDate(e.date).getTime() >= t)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Vergangene Events mit Material – neueste zuerst, wie man ein Archiv liest. */
export function getHighlightEvents(referenceDate: Date = new Date()): PsngEvent[] {
  const t = startOfDay(referenceDate);
  return events
    .filter((e) => parseEventDate(e.date).getTime() < t && hasAssets(e))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Vergangene Events ohne Material (kein Video/Foto/Link), aber mit echtem
 * Inhalt (Beschreibung, Speaker o. Ä.) – z. B. eine gehaltene Lecture, für
 * die noch keine Aufzeichnung vorliegt. Reine Platzhalter-Termine ohne
 * Inhalt bleiben unsichtbar, statt als leere Karten aufzutauchen.
 */
export function getPastPlainEvents(referenceDate: Date = new Date()): PsngEvent[] {
  const t = startOfDay(referenceDate);
  return events
    .filter((e) => parseEventDate(e.date).getTime() < t && !hasAssets(e) && hasContent(e))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Ein Event nach seiner ID – für Querverweise von einer Karte auf eine andere. */
export function getEventById(id: string): PsngEvent | undefined {
  return events.find((e) => e.id === id);
}

/** Stabiler Anker für Deep-Links auf ein vergangenes Event. */
export function getEventAnchor(event: PsngEvent): string {
  return `event-${event.id}`;
}

export function formatEventDate(
  iso: string,
  locale: Locale,
  withWeekday = false,
): string {
  return parseEventDate(iso).toLocaleDateString(intlLocale(locale), {
    ...(withWeekday ? { weekday: "long" as const } : {}),
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatEventDateShort(iso: string, locale: Locale): string {
  return parseEventDate(iso).toLocaleDateString(intlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Die Uhrzeit steht in den Daten als Anzeigetext – „19:00 – 20:00“, „16:00
 * bis 20:00 Uhr (Einlass ab 15:30)“, „ganztägig“. Wer damit rechnen will,
 * braucht Zahlen: Die erste gefundene Uhrzeit ist der Anfang, die zweite das
 * Ende, alles Weitere (ein Einlass) bleibt Text. Steht gar keine da, ist der
 * Termin ganztägig – geraten wird keine.
 *
 * Genutzt von den strukturierten Daten und vom Kalendereintrag. Beide müssen
 * dieselbe Uhrzeit meinen wie die Karte, deshalb steht die Lesart hier einmal.
 */
export function parseTimeRange(time: string | undefined): {
  start?: string;
  end?: string;
} {
  const matches = time?.match(/\d{1,2}:\d{2}/g);
  if (!matches?.length) return {};
  // „9:30“ kommt als vier Zeichen – Kalender und Schema wollen „09:30“.
  const pad = (t: string) => (t.length === 4 ? `0${t}` : t);
  return {
    start: pad(matches[0]),
    end: matches[1] ? pad(matches[1]) : undefined,
  };
}

/**
 * Abstand zu heute, nur für kommende Termine. Macht „liegt noch weit weg"
 * lesbar statt bloß sichtbar – verlässlicher als jede Abstufung über Farbe
 * oder Transparenz, die im Zweifel nur wie ein Rendering-Fehler aussieht.
 */
export function formatRelativeToToday(
  iso: string,
  locale: Locale,
  referenceDate: Date = new Date(),
): string {
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.round(
    (startOfDay(parseEventDate(iso)) - startOfDay(referenceDate)) / dayMs,
  );
  // `Intl.RelativeTimeFormat` beugt und pluralisiert selbst – die Stufen
  // (Tage, Wochen, Monate) bleiben unsere, die Formulierung nicht. Sonst
  // stünde hier für jede weitere Sprache eine neue Tabelle mit Wortformen.
  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: "auto" });
  if (days <= 0) return rtf.format(0, "day");
  if (days === 1) return rtf.format(1, "day");
  if (days < 14) return rtf.format(days, "day");
  const weeks = Math.round(days / 7);
  if (weeks < 9) return rtf.format(weeks, "week");
  return rtf.format(Math.round(days / 30.44), "month");
}

/** Datum des n-ten `weekday` eines Monats. `month` ist 0-basiert wie bei `Date`. */
function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  ordinal: number,
): Date {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (ordinal - 1) * 7);
}

function toIsoDate(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * Die nächsten Termine der Lecture-Reihe, aufsteigend. Termine, für die schon
 * ein echtes Event in `events` steht, fallen raus – sonst stünde derselbe
 * Dienstag zweimal im Zeitstrahl, einmal mit Thema und einmal ohne. Weicht ein
 * Monat vom Takt ab, gilt sein Eintrag aus `SERIES_OVERRIDES` statt des
 * berechneten Datums.
 */
export function getUpcomingSeriesDates(
  count = 3,
  referenceDate: Date = new Date(),
): SeriesDate[] {
  const today = startOfDay(referenceDate);
  const booked = new Set(events.map((e) => e.date));
  const overrides = new Map(
    SERIES_OVERRIDES.map((o) => [o.date.slice(0, 7), o] as const),
  );
  const out: SeriesDate[] = [];

  // Der Deckel begrenzt die Suche auf ein Jahr im Voraus: Wären alle Termine
  // belegt, liefe die Schleife sonst endlos.
  for (let i = 0; out.length < count && i < count + 12; i++) {
    const d = nthWeekdayOfMonth(
      referenceDate.getFullYear(),
      referenceDate.getMonth() + i,
      LECTURE_SERIES.weekday,
      LECTURE_SERIES.ordinal,
    );
    const override = overrides.get(toIsoDate(d).slice(0, 7));
    const iso = override?.date ?? toIsoDate(d);
    if (startOfDay(parseEventDate(iso)) < today || booked.has(iso)) continue;
    out.push({
      id: `series-${iso}`,
      date: iso,
      time: LECTURE_SERIES.time,
      location: LECTURE_SERIES.location,
      column: LECTURE_SERIES.column,
      labelKey: override?.labelKey,
    });
  }
  return out;
}

/** Wie eine vergangene Veranstaltung im Zeitstrahl gerendert wird. */
export type EventVariant = "feature" | "highlight" | "plain";

export type TimelineEntry =
  | {
      kind: "event";
      id: string;
      date: string;
      column: EventColumn;
      variant: EventVariant;
      event: PsngEvent;
    }
  | { kind: "series"; id: string; date: string; column: EventColumn; series: SeriesDate }
  | {
      kind: "milestone";
      id: string;
      date: string;
      column: EventColumn;
      milestone: PsngMilestone;
    };

function toEventEntry(event: PsngEvent): TimelineEntry {
  return {
    kind: "event",
    id: getEventAnchor(event),
    date: event.date,
    column: event.column,
    variant: event.featuredLarge ? "feature" : hasAssets(event) ? "highlight" : "plain",
    event,
  };
}

/**
 * Der Zeitstrahl in zwei Hälften, beide absteigend sortiert. Aneinandergehängt
 * ergeben sie einen durchgehend chronologischen Strang: der am weitesten
 * entfernte Termin oben, direkt darunter der nächste, dann heute, dann rückwärts
 * durch alles Gewesene.
 */
export function getTimelineEntries(referenceDate: Date = new Date()): {
  upcoming: TimelineEntry[];
  past: TimelineEntry[];
} {
  const today = startOfDay(referenceDate);
  const byDateDesc = (a: TimelineEntry, b: TimelineEntry) => b.date.localeCompare(a.date);

  const upcoming: TimelineEntry[] = [
    ...getUpcomingEvents(referenceDate).map(toEventEntry),
    // Nur der nächste Termin der Reihe. Weiter im Voraus wäre es eine
    // Ankündigung für Abende, von denen wir noch nicht wissen, ob sie im Takt
    // liegen – die letzten drei lagen es nicht.
    ...getUpcomingSeriesDates(1, referenceDate).map(
      (series): TimelineEntry => ({
        kind: "series",
        id: series.id,
        date: series.date,
        column: series.column,
        series,
      }),
    ),
  ].sort(byDateDesc);

  const past: TimelineEntry[] = [
    ...getHighlightEvents(referenceDate).map(toEventEntry),
    ...getPastPlainEvents(referenceDate).map(toEventEntry),
    // Ein Meilenstein von heute ist bereits passiert – anders als ein Termin,
    // der heute erst noch stattfindet.
    ...milestones
      .filter((m) => startOfDay(parseEventDate(m.date)) <= today)
      .map((milestone): TimelineEntry => ({
        kind: "milestone",
        id: milestone.id,
        date: milestone.date,
        column: milestone.column,
        milestone,
      })),
  ].sort(byDateDesc);

  return { upcoming, past };
}

/**
 * Was als Nächstes ansteht, aufsteigend: der nächste Termin zuerst. Dieselben
 * Einträge wie die obere Hälfte des Zeitstrahls, nur andersherum gelesen – der
 * Zeitstrahl stapelt von der Zukunft auf heute zu, eine Liste „Als Nächstes"
 * liest man von heute aus nach vorn. Bewusst aus `getTimelineEntries`
 * abgeleitet statt neu gefiltert: Welche Termine als kommend gelten, soll an
 * genau einer Stelle entschieden werden.
 *
 * Meilensteine fallen heraus – sie sind Rückblick, kein Termin.
 */
export function getUpcomingAgenda(
  referenceDate: Date = new Date(),
): Extract<TimelineEntry, { kind: "event" | "series" }>[] {
  return getTimelineEntries(referenceDate)
    .upcoming.filter(
      (entry): entry is Extract<TimelineEntry, { kind: "event" | "series" }> =>
        entry.kind !== "milestone",
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Das jüngste vergangene Event mit Rückmeldung der Teilnehmenden – Anzahl
 * und Bewertung. Für einen knappen Beleg, dass Veranstaltungen tatsächlich
 * stattfinden und ankommen, ohne Zahlen zu erfinden: Fehlt so ein Event,
 * gibt es auch keinen Beleg.
 */
export function getLatestRatedEvent(
  referenceDate: Date = new Date(),
): PsngEvent | undefined {
  return getHighlightEvents(referenceDate).find(
    (e) => e.assets?.attendees && e.assets.rating,
  );
}
