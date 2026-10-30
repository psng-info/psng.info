import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Ein Text in beiden Sprachen – oder einer, der in beiden gleich lautet. */
const localized = z.union([z.string(), z.object({ de: z.string(), en: z.string().optional() })]);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum als JJJJ-MM-TT");
const clock = z.string().regex(/^\d{2}:\d{2}$/, "Uhrzeit als HH:MM");

/*
 * Ein Ordner pro Event unter src/content/events/<slug>/, darin event.yaml und
 * die Bilder des Events. Der Ordnername ist der Slug der öffentlichen URL.
 */
const events = defineCollection({
  loader: glob({ pattern: "*/event.yaml", base: "./src/content/events", generateId: ({ entry }) => entry.split("/")[0] }),
  schema: ({ image }) =>
    z.object({
      title: localized,
      date: isoDate,
      startTime: clock.optional(),
      endTime: clock.optional(),
      attendance: z.enum(["online", "in-person", "hybrid"]),
      location: localized.optional(),
      speaker: z.string().optional(),
      speakerPhoto: image().optional(),
    }),
});

export const collections = { events };
