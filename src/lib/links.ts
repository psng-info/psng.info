/**
 * Zentrale Sammelstelle für externe Links, die an mehreren Stellen auftauchen.
 * Rotiert der WhatsApp-Einladungslink: hier und in api/whatsapp.ts ändern
 * (ein Test vergleicht beide).
 */

export const WHATSAPP_LINK =
  "https://chat.whatsapp.com/LBUA3UpzOV9BW1v59EZK8w?s=cl&p=i&ilr=1";

/**
 * Der Beitrittslink für Knöpfe: über /whatsapp (api/whatsapp.ts), das den
 * Klick serverseitig zählt – auch bei Werbeblockern. `from` sagt, welcher
 * Knopf es war. Im Dev-Server gibt es die Function nicht, dort direkt.
 */
export function whatsappHref(from: string): string {
  return import.meta.env?.DEV ? WHATSAPP_LINK : `/whatsapp?from=${from}`;
}

export const INSTAGRAM_LINK = "https://www.instagram.com/psng.info/";

/**
 * Auftritt der Berlin Psychedelic Science Association (BPSA) unter der
 * PSNG-Domain. Liegt auf GitHub Pages. Wirft der Link eine Zertifikats-
 * warnung, ist die Custom Domain dort nicht eingetragen – Pages stellt das
 * Let's-Encrypt-Zertifikat erst aus, wenn sie in den Repo-Einstellungen steht.
 */
export const BPSA_LINK = "https://bpsa.psng.info";
export const BPSA_INSTAGRAM_LINK = "https://www.instagram.com/bpsa.berlin/";
/** PARAB – Psychedelic Awareness & Research Association Basel. */
export const PARAB_LINK = "https://parab.ch";
export const PARAB_INSTAGRAM_LINK =
  "https://www.instagram.com/psychedelicassociationbasel/";

export const YOUTUBE_LINK =
  "https://www.youtube.com/channel/UCMHHH4dOREJTJF_ySpgV7mA";
export const LINKEDIN_LINK = "https://www.linkedin.com/company/111432265";
export const CONTACT_EMAIL = "kontakt@psng.info";
