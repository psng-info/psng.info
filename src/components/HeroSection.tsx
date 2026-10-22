import psngLogo from "@/assets/PSNG-Logo-centered-transparent.webp";
import bpsaLogo from "@/assets/BPSA-Logo.webp";
import { BPSA_LINK, WHATSAPP_LINK } from "@/lib/links";
import { useCopy } from "@/i18n/copy";

/*
 * Der Hero nutzt CSS-Animationen statt framer-motion. Grund: Die Elemente sind
 * ohne laufende Animation sichtbar – ein Besucher, dessen Browser die Animation
 * nicht ausführt (Tab im Hintergrund geöffnet, angehaltene Frames), sieht
 * trotzdem Überschrift und Buttons statt einer leeren Seite.
 */
const HeroSection = () => {
  const c = useCopy();

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div className="animate-rise-in relative w-56 md:w-80 flex items-center justify-center">
        <div className="absolute w-[82%] h-[82%] rounded-full bg-white" />
        {/* Wird in index.html vorgeladen – es ist das LCP-Element der Seite. */}
        <img
          src={psngLogo}
          alt="PSNG Logo"
          width={640}
          height={630}
          decoding="async"
          className="relative w-full object-contain"
        />
      </div>

      <div className="mt-6 text-center max-w-2xl mx-auto">
        <h1
          className="animate-rise-in font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4"
          style={{ animationDelay: "0.15s" }}
        >
          {c.hero.headlineBefore}
          <span className="gradient-text">{c.hero.headlineAccent}</span>
          {c.hero.headlineAfter}
        </h1>
        <div
          className="animate-rise-in flex justify-center gap-3 font-heading text-sm text-foreground/50 mb-4"
          style={{ animationDelay: "0.2s" }}
        >
          <span>{c.hero.students}</span>
          <span>·</span>
          <span>{c.hero.cities}</span>
        </div>
        {/* Fester Hinweis auf die Berliner Lectures statt eines Popups: Er steht
            in der Kennzahlenzeile, weil er dieselbe Geschichte erzählt – das
            Netzwerk ist auch vor Ort aktiv. */}
        <a
          href={BPSA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-rise-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 py-1 pl-1 pr-3.5 font-heading text-sm text-foreground/80 backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
          style={{ animationDelay: "0.22s" }}
        >
          {/* Nur das Gehirn-Motiv: Die Wortmarke darunter wäre in 28px unlesbar. */}
          <span className="h-7 w-7 overflow-hidden rounded-full bg-white">
            <img src={bpsaLogo} alt="" width={28} height={28} className="h-full w-full origin-[50%_30%] scale-[1.7] object-contain" />
          </span>
          {c.hero.bpsaChip} →
        </a>
        <p
          className="animate-rise-in text-foreground/70 text-base md:text-lg max-w-xl mx-auto mb-8 font-body"
          style={{ animationDelay: "0.25s" }}
        >
          {c.hero.tagline}
        </p>
        <div
          className="animate-rise-in flex flex-col sm:flex-row gap-4 justify-center"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg gradient-psychedelic text-primary-foreground font-heading font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {c.hero.joinWhatsapp}
          </a>
          <a
            href="#leitfaden"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-primary/30 text-primary font-heading font-medium text-sm hover:bg-primary/5 transition-colors"
          >
            {c.hero.foundGroup}
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
