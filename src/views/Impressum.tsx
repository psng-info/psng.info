import LegalPageLayout from "@/components/LegalPageLayout";
import { useCopy } from "@/i18n/copy";
import { useLocale } from "@/i18n/locale";
import { useDocumentHead } from "@/i18n/head";

const Impressum = () => {
  const c = useCopy();
  const locale = useLocale();
  useDocumentHead({
    locale,
    routeKey: "imprint",
    title: c.meta.imprint.title,
    description: c.meta.imprint.description,
  });

  return (
    <LegalPageLayout title="Impressum">
      <h2>Angaben gemäß § 5 DDG (vormals § 5 TMG)</h2>
      <p>
        Psychedelic Student Network Germany (PSNG)
        <br />
        Studentisches Netzwerk mit wissenschaftlich-akademischem Fokus auf
        psychedelische Forschung
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        Lennert van de Kreeke
        <br />
        Tucholskystraße 7
        <br />
        10117 Berlin
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href="mailto:kontakt@psng.info">kontakt@psng.info</a>
        <br />
        Telefon: +49 156 79779954
        <br />
        <em>
          Hinweis: Anrufe werden möglicherweise nicht sofort entgegengenommen
          – wir antworten bevorzugt per E-Mail.
        </em>
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Die Inhalte dieser Website dienen ausschließlich wissenschaftlichen,
        akademischen und informativen Zwecken. Sie stellen keine Anleitung
        zum Konsum von Substanzen und keine medizinische, rechtliche oder
        therapeutische Beratung dar. Trotz sorgfältiger inhaltlicher
        Kontrolle übernehmen wir keine Haftung für die Inhalte externer
        Links. Für den Inhalt der verlinkten Seiten sind ausschließlich
        deren Betreiber verantwortlich.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren
        Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
        fremden Inhalte auch keine Gewähr übernehmen. Zum Zeitpunkt der
        Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Bei
        Bekanntwerden von Rechtsverletzungen werden wir derartige Links
        umgehend entfernen.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
        Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
        Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
        des jeweiligen Autors bzw. Erstellers.
      </p>

      <h2>Datenschutz</h2>
      <p>
        Informationen zur Verarbeitung personenbezogener Daten findest du in
        unserer{" "}
        <a href="/datenschutz">Datenschutzerklärung</a>.
      </p>
    </LegalPageLayout>
  );
};

export default Impressum;
