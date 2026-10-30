import LegalPageLayout from "@/components/LegalPageLayout";
import { useCopy } from "@/i18n/copy";
import { useLocale } from "@/i18n/locale";
import { useDocumentHead } from "@/i18n/head";

const CodeOfConduct = () => {
  const c = useCopy();
  const locale = useLocale();
  useDocumentHead({
    locale,
    routeKey: "codeOfConduct",
    title: c.meta.codeOfConduct.title,
    description: c.meta.codeOfConduct.description,
  });

  return (
    <LegalPageLayout title="Code of Conduct">
      <p className="text-sm text-muted-foreground">Version: 07 Januar 2026</p>

      <h2>1. Geltungsbereich</h2>
      <p>Dieser Code of Conduct gilt für:</p>
      <ul>
        <li>alle PSNG-Veranstaltungen (online und in Präsenz),</li>
        <li>interne und öffentliche Kommunikationsräume,</li>
        <li>
          jegliche Situationen, in denen Personen im Namen von PSNG
          auftreten oder sich mit dem Netzwerk identifizieren.
        </li>
      </ul>
      <p>
        Er gilt für Mitglieder, Organisator*innen, Teilnehmende,
        Referierende, Gäste und Kooperationspartner*innen.
      </p>

      <h2>2. Funktion und Rahmenbedingungen des Netzwerks</h2>
      <p>
        Das PSNG ist ein bildungsorientiertes, studentisch organisiertes
        Netzwerk, das Wissenschaft, Forschung und kritische
        Auseinandersetzung mit Psychedelika- und Bewusstseinsforschung
        fördert.
      </p>
      <p>Das PSNG:</p>
      <ul>
        <li>
          bietet keine Therapie, medizinische Behandlung, Diagnostik oder
          Krisenintervention an,
        </li>
        <li>
          fördert weder Kauf, Verkauf noch Konsum von illegalen Substanzen,
        </li>
        <li>
          hält sich an geltendes deutsches Recht sowie ggf. zutreffende
          universitäre Regelungen,
        </li>
        <li>
          versteht Peer-Formate (bspw. Sharing-Circles) als freiwillige,
          nicht-therapeutische Austauschformate.
        </li>
      </ul>
      <p>
        Mitglieder dürfen sich innerhalb des PSNG-Kontextes nicht als
        Therapeut*innen, Heiler*innen oder Guides darstellen, sofern sie
        keine entsprechende staatlich anerkannte Qualifikation vorweisen
        können.
      </p>

      <h2>3. Werte &amp; Haltung</h2>
      <p>Das PSNG steht für:</p>
      <ul>
        <li>Respektvolle und inklusive Safer Spaces,</li>
        <li>
          wissenschaftlich fundierte, reflektierte und
          verantwortungsbewusste Kommunikation,
        </li>
        <li>Offenheit, Neugier, Integrität und Verantwortungsbewusstsein,</li>
        <li>
          Anerkennung, dass psychedelische Themen wissenschaftliche,
          kulturelle und interindividuell ggf. spirituelle Dimensionen
          umfassen, ohne dass therapeutische oder metaphysische
          Wahrheitsansprüche gemacht werden.
        </li>
      </ul>

      <h2>4. Eigenverantwortung &amp; gemeinschaftliche Verantwortung</h2>
      <p>
        Die Lokalgruppen des PSNGs sind dezentral organisiert. Das PSNG
        setzt auf Selbstverantwortung, Integrität und kollektive
        Achtsamkeit.
      </p>
      <p>Das bedeutet:</p>
      <ul>
        <li>
          jede Person trägt Verantwortung für ihr Verhalten, ihre Aussagen
          und ihre Beiträge,
        </li>
        <li>Sicherheit und Qualität sind eine gemeinsame Verantwortung,</li>
        <li>
          Konflikte sollen respektvoll, direkt und verantwortungsbewusst
          adressiert werden,
        </li>
        <li>
          Das PSNG und Lokalgruppen dürfen Personen aus gemeinsamen
          Veranstaltungen und Kommunikationskanälen ausschließen, die
          wiederholt gegen den Code of Conduct des PSNG verstoßen.
        </li>
      </ul>

      <h2>5. Respektvolles Miteinander &amp; Diskriminierungsschutz</h2>
      <p>
        Das PSNG verpflichtet sich zu respektvollen, zugänglichen und
        inklusiven Räumen.
      </p>
      <p>Nicht akzeptiert werden:</p>
      <ul>
        <li>
          Diskriminierung aufgrund von Ethnie, Herkunft, Geschlecht,
          Sexualität, Behinderung, Religion, Alter oder sozialer Position,
        </li>
        <li>Belästigung und Grenzverletzungen,</li>
        <li>
          Mobbing, Einschüchterung, respektlose oder entwürdigende
          Kommunikation.
        </li>
      </ul>
      <p>
        Bei Bedarf berät das PSNG Betroffene hinsichtlich entsprechender
        Hilfs- und Beratungsangebote.
      </p>

      <h2>6. Vertraulichkeit, Datenschutz &amp; Privatsphäre</h2>
      <p>
        Das PSNG folgt den Kernprinzipien der DSGVO: Einwilligung,
        Zweckbindung, Datensparsamkeit, Sicherheit und Löschung.
      </p>
      <p>Grundsätze:</p>
      <ul>
        <li>
          persönliche und sensible Informationen werden nur mit expliziter
          Zustimmung erhoben und geteilt,
        </li>
        <li>Inhalte aus vertraulichen Räumen bleiben vertraulich,</li>
        <li>
          keine Erstellung oder Veröffentlichung von Aufzeichnungen,
          Screenshots oder Mitschnitten ohne Zustimmung der betroffenen
          Personen,
        </li>
        <li>
          falls Informationen verarbeitet werden, muss das PSNG offenlegen,
          wie mit diesen Daten umgegangen wird.
        </li>
      </ul>

      <h2>7. Verantwortungsvolle Fürsorge – ohne therapeutische Verantwortung</h2>
      <p>
        Das PSNG fördert eine Kultur von Achtsamkeit, Respekt und Umsicht.
        Gleichzeitig gilt:
      </p>
      <ul>
        <li>
          Das PSNG ersetzt keine Therapie, klinische Beratung oder
          Krisenhilfe,
        </li>
        <li>
          jede Person trägt Verantwortung für ihre eigene Gesundheit und
          Wohlbefinden,
        </li>
        <li>
          bei erkennbarer Gefährdung kann auf professionelle Unterstützung
          hingewiesen werden.
        </li>
      </ul>

      <h2>8. Wissenschaftliche Verantwortung &amp; Informationsqualität</h2>
      <p>
        Das PSNG versteht sich als Bildungsnetzwerk für wissenschaftliche
        Forschung und kritisch reflektierte Therapie- und
        Forschungspraxis.
      </p>
      <p>Daher verpflichten wir uns zu:</p>
      <ul>
        <li>verantwortungsvollem Umgang mit Informationen,</li>
        <li>Nutzung nachvollziehbarer und seriöser Quellen,</li>
        <li>
          klarer Unterscheidung zwischen wissenschaftlichen Erkenntnissen,
          offenen Fragen und persönlichen Erfahrungen,
        </li>
        <li>
          Verzicht auf Fehlinformation, Übertreibung, Sensationalisierung
          und pseudowissenschaftliche Behauptungen,
        </li>
        <li>Transparenz darüber, woher Informationen stammen.</li>
      </ul>
      <p>
        Persönliche Erfahrungen dürfen geteilt werden, solange sie als
        subjektive Perspektiven kommuniziert und nicht als allgemeingültige
        Fakten oder Empfehlungen dargestellt werden.
      </p>

      <h2>9. Recht &amp; Harm Reduction</h2>
      <p>Das PSNG:</p>
      <ul>
        <li>
          duldet weder Handel, Vermittlung noch Beschaffung illegaler
          Substanzen,
        </li>
        <li>
          vermittelt evidenzbasierte Harm-Reduction-Informationen
          ausschließlich zu Bildungszwecken, nicht als
          Konsumempfehlung.
        </li>
      </ul>

      <h2>10. Interessenkonflikte, Kommerzialisierung &amp; Einflussnahme</h2>
      <p>Zur Wahrung von Unabhängigkeit und Integrität gilt:</p>
      <ul>
        <li>keine verdeckte Werbung oder instrumentelle Nutzung des Netzwerks,</li>
        <li>
          wirtschaftliche Interessen und Kooperationen müssen transparent
          gemacht werden,
        </li>
        <li>
          keine manipulative Einflussnahme, kein Machtmissbrauch, keine
          „Guru-Rollen“.
        </li>
      </ul>
      <p>
        Eigene Projekte dürfen erwähnt werden, jedoch ohne Druck, Akquise
        oder Ausnutzung der Gemeinschaft.
      </p>

      <h2>11. Repräsentation &amp; öffentliche Kommunikation</h2>
      <p>Wer PSNG repräsentiert, verpflichtet sich:</p>
      <ul>
        <li>
          persönliche Meinungen klar von Netzwerkpositionen zu
          unterscheiden,
        </li>
        <li>
          PSNG korrekt als bildungsorientiertes, studentisches Netzwerk
          darzustellen,
        </li>
        <li>keine medizinische Autorität zu suggerieren,</li>
        <li>
          Name und Logo verantwortungsvoll und im Sinne des Netzwerks zu
          verwenden.
        </li>
      </ul>

      <h2>12. Anerkennung</h2>
      <p>
        Durch Teilnahme an PSNG-Räumen, Veranstaltungen und
        Kommunikationsplattformen erkennen Mitglieder diesen Code of
        Conduct an und tragen dazu bei, eine respektvolle, reflektierte und
        verantwortungsvolle Gemeinschaft zu gestalten.
      </p>
    </LegalPageLayout>
  );
};

export default CodeOfConduct;
