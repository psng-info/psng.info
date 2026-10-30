import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// Statische Ausgabe ohne Adapter: Vercel liefert die Dateien aus, und
// api/kontakt.ts läuft daneben als eigene Vercel Function.
export default defineConfig({
  site: "https://psng.info",
  // Eine Schreibweise je Seite – /leitfaden, nie /leitfaden/. Dazu passt
  // `format: "file"` (leitfaden.html) und `cleanUrls` in vercel.json.
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [react(), sitemap()],
});
