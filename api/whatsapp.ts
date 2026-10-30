/**
 * /whatsapp → zählt den Klick bei GoatCounter und leitet in die Community.
 *
 * Serverseitig, damit die wichtigste Kennzahl auch bei Werbeblockern stimmt:
 * Ohne diesen Aufruf kommt niemand in die Gruppe. Gezählt wird nur der Ort des
 * Knopfs (`?from=hero`) und die Seite, von der er kam – keine IP, kein Gerät.
 *
 * Braucht GOATCOUNTER_TOKEN in Vercel (API-Token mit „Record pageviews“).
 * Fehlt er oder antwortet GoatCounter nicht, wird trotzdem weitergeleitet.
 */
import { WHATSAPP_LINK } from "../src/lib/links";

const ENDPOINT = "https://psng.goatcounter.com/api/v0/count";
// Vorschau-Dienste und Crawler öffnen Links auch – das sind keine Beitritte.
const BOT = /bot|crawl|spider|preview|facebookexternalhit|whatsapp|slurp|curl|wget/i;

const redirect = () => new Response(null, { status: 302, headers: { Location: WHATSAPP_LINK, "Cache-Control": "no-store" } });

async function count(request: Request): Promise<void> {
  const token = process.env.GOATCOUNTER_TOKEN;
  if (!token || BOT.test(request.headers.get("user-agent") ?? "")) return;

  const from = new URL(request.url).searchParams.get("from") ?? "";
  const place = /^[a-z0-9-]{1,40}$/.test(from) ? from : "unbekannt";
  let page = "";
  try {
    const referer = new URL(request.headers.get("referer") ?? "");
    if (referer.hostname.endsWith("psng.info")) page = referer.pathname;
  } catch {
    // Ohne Referer bleibt die Seite leer.
  }

  await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ no_sessions: true, hits: [{ path: `whatsapp/${place}`, title: page, event: true }] }),
    // Die Weiterleitung soll nie auf GoatCounter warten müssen.
    signal: AbortSignal.timeout(1500),
  }).catch(() => undefined);
}

export async function GET(request: Request) {
  await count(request);
  return redirect();
}

/** Für Prüfungen (scripts/check-deploy.mjs): leitet weiter, zählt aber nicht. */
export function HEAD() {
  return redirect();
}
