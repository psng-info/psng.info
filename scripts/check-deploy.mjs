#!/usr/bin/env node
/*
 * Prüft einen Deploy von außen, so wie Crawler und Link-Vorschauen ihn sehen:
 * Statuscodes, Weiterleitungen, Head jeder Seite, Vorschaubilder, JSON-LD und
 * die Sitemap gegen die echten Seiten.
 *
 *   node scripts/check-deploy.mjs https://psng-info-git-astro-psng-team.vercel.app
 *
 * Für geschützte Previews liest das Skript VERCEL_AUTOMATION_BYPASS_SECRET aus
 * der Umgebung (z. B. `set -a; . ./.env.local; set +a`) und schickt es als
 * Header mit. Der Wert wird nie ausgegeben.
 */

const base = process.argv[2]?.replace(/\/$/, "");
if (!base) {
  console.error("Aufruf: node scripts/check-deploy.mjs <url>");
  process.exit(2);
}

const SITE = "https://psng.info";
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const headers = bypass ? { "x-vercel-protection-bypass": bypass } : {};

const failures = [];
let checks = 0;
const check = (ok, message) => {
  checks++;
  if (!ok) failures.push(message);
};

/** Absolute URL der Produktion → dieselbe Seite auf dem geprüften Deploy. */
const local = (url) => (url.startsWith(SITE) ? base + url.slice(SITE.length) || "/" : url);

const get = (path, init = {}) => fetch(path.startsWith("http") ? path : base + path, { redirect: "manual", headers, ...init });

// ── Seiten ───────────────────────────────────────────────────────────────────

const PAGES = [
  "/",
  "/en",
  "/events",
  "/en/events",
  "/ueber-uns",
  "/en/about",
  "/leitfaden",
  "/en/guide",
  "/code-of-conduct",
  "/en/code-of-conduct",
  "/impressum",
  "/datenschutz",
];

const attr = (html, re) => html.match(re)?.[1];
const meta = (html, key) =>
  attr(html, new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]*)"`)) ??
  attr(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="${key}"`));

const imageCache = new Map();
async function imageOk(url) {
  if (!imageCache.has(url)) {
    imageCache.set(
      url,
      get(local(url)).then((r) => r.status === 200 && (r.headers.get("content-type") ?? "").startsWith("image/")),
    );
  }
  return imageCache.get(url);
}

async function checkPage(path) {
  const res = await get(path);
  check(res.status === 200, `${path}: Status ${res.status}`);
  if (res.status !== 200) return;
  const html = await res.text();

  check(/<title>[^<]+<\/title>/.test(html), `${path}: kein <title>`);
  check(Boolean(meta(html, "description")), `${path}: keine Beschreibung`);
  const canonical = attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
  const noindex = /<meta[^>]+name="robots"[^>]+noindex/.test(html);
  check(Boolean(canonical) || noindex, `${path}: weder Canonical noch noindex`);

  const image = meta(html, "og:image");
  check(Boolean(image) && /^https:\/\//.test(image), `${path}: og:image fehlt oder ist nicht absolut`);
  if (image) check(await imageOk(image), `${path}: og:image nicht erreichbar (${image})`);

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json);
    } catch {
      check(false, `${path}: JSON-LD lässt sich nicht lesen`);
    }
  }
  return html;
}

// ── Ablauf ───────────────────────────────────────────────────────────────────

console.log(`Prüfe ${base}${bypass ? " (mit Bypass-Header)" : ""}`);

for (const path of PAGES) await checkPage(path);

// Event-Seiten: aus der Sitemap, jede mit Event-JSON-LD.
const sitemapRes = await get("/sitemap.xml");
check(sitemapRes.status === 200, `/sitemap.xml: Status ${sitemapRes.status}`);
const sitemap = await sitemapRes.text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check(locs.length > PAGES.length, `/sitemap.xml: nur ${locs.length} Einträge`);
for (const loc of locs) {
  const path = local(loc).slice(base.length) || "/";
  if (PAGES.includes(path)) continue;
  const html = await checkPage(path);
  if (html && /\/events\/[^/]+$/.test(path)) {
    check(/"@type":\s*"Event"/.test(html), `${path}: kein Event im JSON-LD`);
  }
}
// Was hreflang verspricht, muss es geben.
for (const [, href] of sitemap.matchAll(/hreflang="[^"]+" href="([^"]+)"/g)) {
  const path = local(href).slice(base.length) || "/";
  if (locs.includes(href)) continue;
  const res = await get(path);
  check(res.status === 200, `hreflang-Ziel ${path}: Status ${res.status}`);
}

// Kalender
const ics = await get("/events.ics");
check(ics.status === 200, `/events.ics: Status ${ics.status}`);
check((ics.headers.get("content-type") ?? "").includes("text/calendar"), `/events.ics: kein text/calendar`);
check((await ics.text()).includes("BEGIN:VEVENT"), "/events.ics: keine Termine");

// Echte 404
for (const path of ["/gibt-es-nicht", "/events/gibt-es-nicht", "/en/gibt-es-nicht"]) {
  const res = await get(path);
  check(res.status === 404, `${path}: Status ${res.status} statt 404`);
}

// Weiterleitungen
const REDIRECTS = [
  ["/lab", 308, "/"],
  ["/en/lab", 308, "/en"],
  ["/leitfaden/", 308, "/leitfaden"],
  ["/impressum.html", 308, "/impressum"],
];
for (const [from, status, to] of REDIRECTS) {
  const res = await get(from);
  const location = res.headers.get("location") ?? "";
  const target = location.startsWith("http") ? new URL(location).pathname : location;
  check(res.status === status && target === to, `${from}: ${res.status} → ${location || "–"} statt ${status} → ${to}`);
}
const hr = await get("/hr");
check([301, 302, 307, 308].includes(hr.status) && (hr.headers.get("location") ?? "").startsWith("https://claude.ai/"), `/hr: ${hr.status}`);

// Kontaktformular: Die Function muss da sein. Nur GET – ein POST würde eine Mail auslösen.
const api = await get("/api/kontakt");
check(api.status !== 404, `/api/kontakt: 404`);

// ── Ergebnis ─────────────────────────────────────────────────────────────────

if (failures.length) {
  console.error(`\n${failures.length} von ${checks} Prüfungen fehlgeschlagen:`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`Alle ${checks} Prüfungen bestanden (${locs.length} Seiten in der Sitemap).`);
