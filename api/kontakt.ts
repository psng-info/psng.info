/**
 * Kontaktformular → Mail an kontakt@psng.info über smtp2go.
 * Braucht die Umgebungsvariable SMTP2GO_API_KEY in Vercel; psng.info ist bei
 * smtp2go bereits als Absenderdomain eingerichtet (DKIM-Einträge im DNS).
 */

const TO = "kontakt@psng.info";
const FROM = "PSNG Website <website@psng.info>";

const MAX = { name: 200, email: 320, subject: 100, message: 10000 };

const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status });

export async function POST(request: Request) {
  const apiKey = process.env.SMTP2GO_API_KEY;
  if (!apiKey) return json(500, { ok: false, error: "not configured" });

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: "invalid body" });
  }

  const field = (key: keyof typeof MAX) =>
    typeof data[key] === "string" ? (data[key] as string).trim().slice(0, MAX[key]) : "";

  // Honeypot: Bots füllen das versteckte Feld aus – so tun, als hätte es geklappt.
  if (typeof data["bot-field"] === "string" && data["bot-field"] !== "") {
    return json(200, { ok: true });
  }

  // Zeilenumbrüche raus, weil Name und Betreff in Mail-Header wandern.
  const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
  const name = oneLine(field("name")).replace(/[<>"]/g, "");
  const email = field("email");
  const subject = oneLine(field("subject")) || "Sonstiges";
  const message = field("message");

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { ok: false, error: "missing fields" });
  }

  const res = await fetch("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Smtp2go-Api-Key": apiKey },
    body: JSON.stringify({
      sender: FROM,
      to: [TO],
      subject: `Kontaktformular: ${subject} – ${name}`,
      text_body: `Name: ${name}\nE-Mail: ${email}\nBetreff: ${subject}\n\n${message}`,
      custom_headers: [{ header: "Reply-To", value: `${name} <${email}>` }],
    }),
  });

  if (!res.ok) {
    console.error("smtp2go", res.status, await res.text());
    return json(502, { ok: false, error: "send failed" });
  }
  return json(200, { ok: true });
}
