import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.webp";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EventsSection from "@/components/EventsSection";
import GuideSection from "@/components/GuideSection";
import FAQSection from "@/components/FAQSection";
import TeamSection from "@/components/TeamSection";
import PartnersSection from "@/components/PartnersSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PartnerStripe from "@/components/PartnerStripe";
import SkipLink, { MAIN_ID } from "@/components/SkipLink";
import SectionToc from "@/components/SectionToc";
import { WHATSAPP_LINK } from "@/lib/links";
import { useCopy } from "@/i18n/copy";
import { useLocale } from "@/i18n/locale";
import { useDocumentHead } from "@/i18n/head";
import { useHomeStructuredData } from "@/lib/structuredData";

const Index = () => {
  const c = useCopy();
  const locale = useLocale();
  useDocumentHead({
    locale,
    routeKey: "home",
    title: c.meta.home.title,
    description: c.meta.home.description,
  });
  useHomeStructuredData(locale, c.meta.home.description);

  // Ziele und Nummern gehören zur Gestaltung, die Texte nach copy.ts.
  const stepTargets = {
    join: { href: WHATSAPP_LINK, external: true },
    events: { href: "#events", external: false },
    start: { href: "#leitfaden", external: false },
  } as const;

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute top-[100vh] left-0 right-0 bottom-0 -z-20 bg-white" />
      <SkipLink />
      <Navbar />

      {/* Die Spalte des Inhaltsverzeichnisses reicht so weit wie <main>, nicht
          bis in den Footer. */}
      <div className="relative">
        <SectionToc />
        {/* tabIndex={-1}: Ohne das nimmt <main> keinen Fokus an, und der
            Sprunglink verschöbe nur den Blick – der nächste Tastendruck landete
            wieder oben in der Navigation. */}
        <main id={MAIN_ID} tabIndex={-1} className="toc-shift">
          <HeroSection />
          <PartnerStripe />

          <div className="bg-primary/5">
            <AboutSection />
          </div>

          {/* Neu hier? Onboarding-Funnel */}
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center mb-10"
              >
                <p className="font-heading text-sm uppercase tracking-[0.2em] text-primary mb-4">
                  {c.onboarding.eyebrow}
                </p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  {c.onboarding.title}
                </h2>
              </motion.div>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {c.onboarding.steps.map((step, i) => {
                  const target = stepTargets[step.key as keyof typeof stepTargets];
                  return (

                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-card rounded-2xl p-6 border border-border flex flex-col"
                  >
                    <span className="font-heading text-xs font-bold text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mb-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{step.desc}</p>
                    <a
                      href={target.href}
                      {...(target.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-4 inline-flex items-center text-xs font-medium text-primary hover:underline"
                    >
                      {step.cta} →
                    </a>
                  </motion.div>
                  );
                })}
            </div>
          </div>
          </section>

          <div className="bg-primary/5">
            <EventsSection />
          </div>

          {/* Mid-page WhatsApp CTA */}
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-xl mx-auto text-center bg-foreground rounded-2xl p-10"
              >
                <h3 className="font-heading text-2xl font-bold text-background mb-3">
                  {c.midCta.title}
                </h3>
                <p className="text-background/70 font-body mb-6">
                  {c.midCta.text}
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg gradient-psychedelic text-primary-foreground font-heading font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  {c.midCta.cta}
                </a>
              </motion.div>
          </div>
          </section>

          <div className="bg-primary/5">
            <GuideSection />
          </div>

          <div className="bg-white">
            <FAQSection />
          </div>

          <div className="bg-primary/5">
            <TeamSection />
          </div>

          <div className="bg-white">
            <PartnersSection />
          </div>

          <div className="bg-primary/5">
            <ContactSection />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
