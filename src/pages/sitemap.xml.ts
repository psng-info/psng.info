import type { APIRoute } from "astro";
import { loadEvents } from "@/lib/events/load";
import { indexablePages } from "@/lib/seo/pages";
import { sitemapXml } from "@/lib/seo/sitemap";

export const GET: APIRoute = async () =>
  new Response(sitemapXml(indexablePages(await loadEvents())), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
