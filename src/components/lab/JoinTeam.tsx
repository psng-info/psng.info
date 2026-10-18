import { MITMACHEN_FORM_LINK } from "@/lib/links";
import { useCopy } from "@/i18n/copy";
import { eyebrowClass, primaryButton } from "./shared";

/**
 * Der Weg ins Orga-Team, getrennt vom Beitritt zur Community: Wer nur
 * mitlesen will, geht in die WhatsApp-Community; wer mitgestalten will,
 * füllt das Formular aus. Der Ablauf (kleine Probeaufgabe, feste
 * Ansprechperson) steht im Text, damit niemand eine Bewerbung erwartet.
 */
const JoinTeam = () => {
  const c = useCopy();
  const k = c.lab.joinTeam;

  return (
    <section aria-labelledby="lab-join-team" className="bg-white py-16 md:py-24">
      <div className="container mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className={`${eyebrowClass} mb-3`}>{k.eyebrow}</p>
          <h2 id="lab-join-team" className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {k.title}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{k.text}</p>
          <a
            href={MITMACHEN_FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={`${primaryButton} mt-7`}
          >
            {k.cta}
          </a>
        </div>
        <ul className="flex flex-wrap gap-2">
          {k.areas.map((area) => (
            <li
              key={area}
              className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 font-heading text-sm text-foreground"
            >
              {area}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default JoinTeam;
