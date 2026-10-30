import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/*
 * Die Inhalte der Seite, die sich laufend ändern: Events, Meilensteine und die
 * Partner, mit denen Events laufen. Jeder Eintrag ist ein Ordner mit einer
 * YAML-Datei und seinen Bildern daneben – so liegt alles zu einem Event an
 * einer Stelle, und ein Editor wie Decap kann später dieselben Dateien
 * bearbeiten.
 *
 * Das Schema ist zugleich die Prüfung: Ein Tippfehler, ein fehlendes Bild oder
 * eine Uhrzeit im falschen Format bricht den Build ab, und damit den Deploy –
 * bevor etwas Falsches auf der Seite steht.
 */

/** Ein Text in beiden Sprachen – oder einer, der in beiden gleich lautet. */
const localized = z.union([z.string(), z.object({ de: z.string(), en: z.string().optional() })]);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum als \"JJJJ-MM-TT\" (in Anführungszeichen)");
const clock = z.string().regex(/^\d{2}:\d{2}$/, "Uhrzeit als \"HH:MM\" (in Anführungszeichen)");
const column = z.enum(["vortraege", "community"]);

/** Der Ordnername ist die ID – und bei Events der Slug der öffentlichen URL. */
const byFolder = ({ entry }: { entry: string }) => entry.split("/")[0];

const events = defineCollection({
  loader: glob({ pattern: "*/event.yaml", base: "./src/content/events", generateId: byFolder }),
  schema: ({ image }) =>
    z
      .object({
        title: localized,
        /** Leitfrage oder Untertitel, direkt unter dem Titel. */
        subtitle: localized.optional(),

        /**
         * Wer veranstaltet: wir allein, wir mit einem Partner, oder jemand
         * anderes, bei dem wir als Community zu Gast waren.
         */
        role: z.enum(["own", "co-hosted", "external"]),
        /** Nur bei `external`: trotzdem eine eigene Seite, weil wir eigenes Material haben. */
        ownPage: z.boolean().optional(),
        category: z.enum(["kickoff", "lecture", "gathering", "workshop", "conference", "other"]),
        /** Die Filterachse auf /events. */
        column,
        /** Kurzes Label für besonders hervorgehobene Events. */
        highlightBadge: localized.optional(),
        featured: z.boolean().optional(),
        /** Im Archiv als große Feature-Karte mit Karussell. */
        featuredLarge: z.boolean().optional(),

        /** Kalenderdatum in der Ortszeit des Events. */
        date: isoDate,
        /** Letzter Tag bei Mehrtägigem – oder der Folgetag, wenn es über Mitternacht geht. */
        endDate: isoDate.optional(),
        showWeekday: z.boolean().optional(),
        /** Fehlt sie, ist das Event ganztägig – es sei denn, `timeTbd` ist gesetzt. */
        startTime: clock.optional(),
        endTime: clock.optional(),
        /** Die Uhrzeit steht noch nicht fest. Solange gibt es keinen Kalendereintrag. */
        timeTbd: z.boolean().optional(),
        /** Zusatz zur Uhrzeit, z. B. „Einlass ab 15:30“. */
        timeNote: localized.optional(),
        /** IANA-Zeitzone, nur für Events außerhalb Deutschlands nötig. */
        timeZone: z.string().default("Europe/Berlin"),

        /** Fehlt sie, bleibt der Ort in den strukturierten Daten offen – geraten wird nicht. */
        attendance: z.enum(["online", "in-person", "hybrid"]).optional(),
        /** Ort, wie er auf der Seite steht. */
        location: localized.optional(),
        /** Ort für Suchmaschinen und Kalender – nur, was feststeht. */
        venue: z
          .object({
            name: z.string(),
            street: z.string().optional(),
            postalCode: z.string().optional(),
            city: z.string(),
            country: z.string().length(2),
          })
          .optional(),
        /** Sprache der Veranstaltung; der Hinweis erscheint nur, wo sie von der Seitensprache abweicht. */
        language: z.enum(["de", "en"]).optional(),

        status: z.enum(["scheduled", "postponed", "cancelled"]).default("scheduled"),
        /** Früheres Datum nach einer Verschiebung, für den Hinweis „verschoben vom …“. */
        rescheduledFrom: isoDate.optional(),
        registrationState: z.enum(["open", "full", "closed"]).default("open"),

        /** Slug der Veranstaltung, in deren Rahmen dieser Vortrag lief. */
        partOf: reference("events").optional(),
        /** Frühere Slugs dieser Seite – jeder braucht einen 301 in vercel.json. */
        previousSlugs: z.array(z.string()).optional(),

        speaker: z.string().optional(),
        speakerType: z.enum(["student", "gast"]).optional(),
        speakerPhoto: image().optional(),
        speakerWebsiteUrl: z.url().optional(),
        speakerLinkedinUrl: z.url().optional(),
        speakerBio: localized.optional(),

        description: localized.optional(),
        /** Offizieller Abstract des Vortrags – nur auf der eigenen Seite, /events zeigt `description`. */
        abstract: z.object({ title: localized.optional(), text: localized }).optional(),
        /** Für wen das Event gedacht ist. */
        audienceNote: localized.optional(),
        /** Teilnahmebeitrag. */
        contribution: localized.optional(),
        /** Kursiver Hinweis am Ende, z. B. „Vorläufiges Programm“. */
        disclaimer: localized.optional(),
        furtherReading: z.array(z.object({ text: localized, url: z.url() })).optional(),

        partner: z
          .object({
            id: reference("partners"),
            /** Was der Partner bei genau diesem Event getragen hat. */
            role: localized.optional(),
          })
          .optional(),

        /** Motiv über einer kommenden Karte; nach dem Termin weicht es echten Fotos. */
        cover: z.object({ src: image(), alt: localized }).optional(),
        /** Vorschaubild für geteilte Links, 1200 × 630. */
        socialImage: z.object({ src: image(), alt: localized }).optional(),

        websiteUrl: z.url().optional(),
        websiteLabel: localized.optional(),
        /** `whatsapp` steht für den Link zur Community aus lib/links.ts. */
        registrationUrl: z.union([z.literal("whatsapp"), z.url()]).optional(),
        registrationLabel: localized.optional(),
        externalUrl: z.url().optional(),
        externalLabel: localized.optional(),

        /** Lokal gehostetes Vorschaubild, damit beim bloßen Ansehen nichts zu Google geht. */
        recording: z.object({ url: z.url(), thumbnail: image() }).optional(),
        short: z.object({ url: z.url(), thumbnail: image() }).optional(),
        slidesUrl: z.url().optional(),
        recapUrl: z.url().optional(),
        photos: z.array(z.object({ src: image(), alt: localized.optional() })).optional(),
        attendees: z.number().int().positive().optional(),
        /** Davon online dabei. */
        attendeesOnline: z.number().int().nonnegative().optional(),
        /** Durchschnittsbewertung der Teilnehmenden, z. B. "9/10". */
        rating: z.string().optional(),
        recommendPercent: z.number().min(0).max(100).optional(),
      })
      .refine((e) => !(e.timeTbd && e.startTime), {
        message: "timeTbd und startTime schließen sich aus",
        path: ["timeTbd"],
      })
      .refine((e) => !e.endTime || e.startTime, {
        message: "endTime ohne startTime",
        path: ["endTime"],
      })
      .refine((e) => !e.endDate || e.endDate >= e.date, {
        message: "endDate liegt vor date",
        path: ["endDate"],
      })
      .refine((e) => e.role !== "external" || e.ownPage || e.externalUrl, {
        message: "Ein externes Event ohne eigene Seite braucht externalUrl",
        path: ["externalUrl"],
      })
      .refine((e) => e.attendance !== "in-person" || e.venue, {
        message: "Vor Ort ohne venue",
        path: ["venue"],
      }),
});

const milestones = defineCollection({
  loader: glob({ pattern: "*/milestone.yaml", base: "./src/content/milestones", generateId: byFolder }),
  schema: ({ image }) =>
    z.object({
      title: localized,
      date: isoDate,
      column,
      badge: localized.optional(),
      partner: reference("partners").optional(),
      image: image().optional(),
      description: localized,
      links: z.array(z.object({ label: localized, url: z.url() })).optional(),
    }),
});

const partners = defineCollection({
  loader: glob({ pattern: "*/partner.yaml", base: "./src/content/partners", generateId: byFolder }),
  schema: ({ image }) =>
    z.object({
      /** Kürzel für Chips, z. B. „BPSA“. */
      short: z.string().optional(),
      name: z.string(),
      /** Name auf der Partnerkarte, wenn er vom kurzen Namen abweicht. */
      displayName: z.string().optional(),
      /** Farbwelt des Chips; die Klassen dazu heißen `badge-*` in index.css. */
      tone: z.enum(["bpsa", "parab"]).optional(),
      /** Reihenfolge auf der Seite – wer am engsten mit uns arbeitet, steht vorn. */
      order: z.number().int(),
      logo: image(),
      url: z.url(),
      instagramUrl: z.url().optional(),
      telegramUrl: z.url().optional(),
      /** Ein Angebot an die Community, z. B. Artikel einreichen. */
      opportunity: z
        .object({ url: z.string().regex(/^(https:|mailto:)/), label: localized.optional() })
        .optional(),
      description: localized,
    }),
});

const team = defineCollection({
  loader: glob({ pattern: "*/member.yaml", base: "./src/content/team", generateId: byFolder }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number().int(),
      photo: image(),
      /** Aufgaben im PSNG, aus dem HR-Sheet (Tab Members). */
      roles: z.array(localized),
      /** Studium oder Beruf. */
      study: localized.optional(),
      /** Hochschule oder Ort. */
      place: localized.optional(),
      bio: localized,
      linkedinUrl: z.url().optional(),
    }),
});

const features = defineCollection({
  loader: glob({ pattern: "*/feature.yaml", base: "./src/content/features", generateId: byFolder }),
  schema: z
    .object({
      title: localized,
      text: localized,
      cta: z.object({ label: localized, url: z.string().regex(/^(https:|\/)/) }),
      /** Erster und letzter Tag im Hero, beide einschließlich. Ohne Ende kein Feature – es bliebe sonst ewig stehen. */
      from: isoDate,
      until: isoDate,
      /** Bei mehreren gleichzeitig gewinnt die höhere Zahl. */
      priority: z.number().int().default(1),
    })
    .refine((f) => f.until >= f.from, { message: "until liegt vor from", path: ["until"] }),
});

export const collections = { events, milestones, partners, team, features };
