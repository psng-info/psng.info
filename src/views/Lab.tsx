import { useEffect } from "react";
import Footer from "@/components/Footer";
import PartnerStripe from "@/components/PartnerStripe";
import SkipLink, { MAIN_ID } from "@/components/SkipLink";
import LabNav from "@/components/lab/LabNav";
import LabHero, { ProofStats } from "@/components/lab/LabHero";
import WaysIn from "@/components/lab/WaysIn";
import NextEvents from "@/components/lab/NextEvents";
import LocalGroups from "@/components/lab/LocalGroups";
import { Credibility, Proof } from "@/components/lab/Credibility";
import FinalCta from "@/components/lab/FinalCta";
import { getUpcomingAgenda } from "@/data/events";
import { useCopy } from "@/i18n/copy";
import { localeTags, useLocale } from "@/i18n/locale";

/**
 * Vorschau einer neu geordneten Startseite – unter /lab und /en/lab, nicht
 * verlinkt, nicht in der Sitemap, mit noindex.
 *
 * Die Reihenfolge folgt der Frage, die jemand hat, der das PSNG gerade
 * entdeckt: Was ist das, passiert da gerade etwas, wie komme ich rein? Die
 * Erklärtexte der Startseite (Status quo, Vorbilder, FAQ, Team) stehen dort
 * weiter; hier wird nur auf sie verwiesen.
 */
const Lab = () => {
  const c = useCopy();
  const locale = useLocale();

  // Bewusst nicht useDocumentHead: Das setzt Canonical und hreflang aus
  // routes.ts, und dort steht die Vorschau absichtlich nicht.
  useEffect(() => {
    document.documentElement.lang = localeTags[locale];
    document.title = c.lab.title;
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, [locale, c.lab.title]);

  // Bei jedem Rendern aus dem heutigen Datum – nach einem Termin rückt der
  // nächste von selbst nach.
  const [next, ...after] = getUpcomingAgenda();

  return (
    <div className="relative min-h-screen bg-white">
      <SkipLink />
      <LabNav />
      <main id={MAIN_ID} tabIndex={-1}>
        <LabHero next={next} />
        <ProofStats />
        <WaysIn />
        <NextEvents entries={after} />
        <LocalGroups />
        <Credibility />
        <Proof />
        <PartnerStripe />
        <div className="pt-16 md:pt-24 bg-white">
          <FinalCta />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Lab;
