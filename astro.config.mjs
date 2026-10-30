import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Die Sitemap baut src/pages/sitemap.xml.ts selbst: hreflang nur für echte
// Übersetzungen, Event-Seiten nur mit Inhalt – das kann die Integration nicht.
export default defineConfig({
  site: "https://psng.info",
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [react()],
});
