import LegalPageLayout from "@/components/LegalPageLayout";
import { useCopy } from "@/i18n/copy";
import { useLocale } from "@/i18n/locale";
import { useDocumentHead } from "@/i18n/head";

/*
 * Englische Fassung des Code of Conduct. Anders als Impressum und
 * Datenschutzerklärung wird dieses Dokument übersetzt: Es regelt, wie man sich
 * im Netzwerk verhält, und wer sich daran halten soll, muss es lesen können.
 *
 * Eigene Komponente statt Textbausteinen in einem gemeinsamen Gerüst – ein
 * Dokument wird als Ganzes geschrieben und als Ganzes überarbeitet. Ändert
 * sich die deutsche Fassung, gehört diese hier mit angefasst.
 */
const CodeOfConductEn = () => {
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
      <p className="text-sm text-muted-foreground">Version: 7 January 2026</p>

      <h2>1. Scope</h2>
      <p>This code of conduct applies to:</p>
      <ul>
        <li>all PSNG events (online and in person),</li>
        <li>internal and public communication spaces,</li>
        <li>
          any situation in which people act on behalf of the PSNG or identify
          themselves with the network.
        </li>
      </ul>
      <p>
        It applies to members, organisers, participants, speakers, guests and
        partner organisations.
      </p>

      <h2>2. What the network is, and the conditions it works under</h2>
      <p>
        The PSNG is an education-focused, student-run network that supports
        science, research and critical engagement with psychedelic and
        consciousness research.
      </p>
      <p>The PSNG:</p>
      <ul>
        <li>
          does not offer therapy, medical treatment, diagnosis or crisis
          intervention,
        </li>
        <li>
          does not promote the purchase, sale or use of illegal substances,
        </li>
        <li>
          complies with applicable German law and, where relevant, university
          regulations,
        </li>
        <li>
          treats peer formats (such as sharing circles) as voluntary,
          non-therapeutic spaces for exchange.
        </li>
      </ul>
      <p>
        Within the PSNG context, members may not present themselves as
        therapists, healers or guides unless they hold a corresponding
        state-recognised qualification.
      </p>

      <h2>3. Values &amp; attitude</h2>
      <p>The PSNG stands for:</p>
      <ul>
        <li>respectful and inclusive safer spaces,</li>
        <li>
          scientifically grounded, considered and responsible communication,
        </li>
        <li>openness, curiosity, integrity and a sense of responsibility,</li>
        <li>
          recognition that psychedelic topics have scientific, cultural and, for
          some people, spiritual dimensions — without making therapeutic or
          metaphysical claims to truth.
        </li>
      </ul>

      <h2>4. Personal and collective responsibility</h2>
      <p>
        The PSNG's local groups are organised in a decentralised way. The
        network relies on self-responsibility, integrity and collective care.
      </p>
      <p>That means:</p>
      <ul>
        <li>
          every person is responsible for their own behaviour, statements and
          contributions,
        </li>
        <li>safety and quality are a shared responsibility,</li>
        <li>
          conflicts should be addressed respectfully, directly and responsibly,
        </li>
        <li>
          the PSNG and its local groups may exclude people from shared events
          and communication channels if they repeatedly breach this code of
          conduct.
        </li>
      </ul>

      <h2>5. Respectful conduct &amp; protection from discrimination</h2>
      <p>
        The PSNG is committed to respectful, accessible and inclusive spaces.
      </p>
      <p>We do not accept:</p>
      <ul>
        <li>
          discrimination on the basis of ethnicity, origin, gender, sexuality,
          disability, religion, age or social position,
        </li>
        <li>harassment and boundary violations,</li>
        <li>
          bullying, intimidation, or disrespectful or degrading communication.
        </li>
      </ul>
      <p>
        Where needed, the PSNG can point those affected towards appropriate
        support and counselling services.
      </p>

      <h2>6. Confidentiality, data protection &amp; privacy</h2>
      <p>
        The PSNG follows the core principles of the GDPR: consent, purpose
        limitation, data minimisation, security and deletion.
      </p>
      <p>Principles:</p>
      <ul>
        <li>
          personal and sensitive information is only collected and shared with
          explicit consent,
        </li>
        <li>what is said in confidential spaces stays confidential,</li>
        <li>
          no recordings, screenshots or captures are made or published without
          the consent of the people concerned,
        </li>
        <li>
          if information is processed, the PSNG must disclose how that data is
          handled.
        </li>
      </ul>

      <h2>7. Responsible care — without therapeutic responsibility</h2>
      <p>
        The PSNG fosters a culture of attentiveness, respect and care. At the
        same time:
      </p>
      <ul>
        <li>
          the PSNG is not a substitute for therapy, clinical advice or crisis
          support,
        </li>
        <li>
          every person is responsible for their own health and wellbeing,
        </li>
        <li>
          where there is a recognisable risk, we can point towards professional
          support.
        </li>
      </ul>

      <h2>8. Scientific responsibility &amp; quality of information</h2>
      <p>
        The PSNG sees itself as an educational network for scientific research
        and for critically reflected research and therapeutic practice.
      </p>
      <p>We therefore commit to:</p>
      <ul>
        <li>handling information responsibly,</li>
        <li>using traceable and reputable sources,</li>
        <li>
          clearly distinguishing between scientific findings, open questions and
          personal experience,
        </li>
        <li>
          avoiding misinformation, exaggeration, sensationalism and
          pseudoscientific claims,
        </li>
        <li>being transparent about where information comes from.</li>
      </ul>
      <p>
        Personal experiences may be shared, as long as they are communicated as
        subjective perspectives and not presented as general facts or
        recommendations.
      </p>

      <h2>9. Law &amp; harm reduction</h2>
      <p>The PSNG:</p>
      <ul>
        <li>
          does not tolerate the trade, brokering or procurement of illegal
          substances,
        </li>
        <li>
          provides evidence-based harm reduction information for educational
          purposes only, not as a recommendation to use anything.
        </li>
      </ul>

      <h2>10. Conflicts of interest, commercialisation &amp; influence</h2>
      <p>To preserve independence and integrity:</p>
      <ul>
        <li>
          no covert advertising or instrumental use of the network,
        </li>
        <li>
          commercial interests and partnerships must be disclosed,
        </li>
        <li>
          no manipulative influence, no abuse of power, no "guru" roles.
        </li>
      </ul>
      <p>
        You may mention your own projects, but without pressure, canvassing or
        taking advantage of the community.
      </p>

      <h2>11. Representation &amp; public communication</h2>
      <p>Anyone representing the PSNG commits to:</p>
      <ul>
        <li>
          clearly distinguishing personal opinions from network positions,
        </li>
        <li>
          describing the PSNG accurately as an education-focused student
          network,
        </li>
        <li>not implying medical authority,</li>
        <li>
          using the name and logo responsibly and in the spirit of the network.
        </li>
      </ul>

      <h2>12. Acceptance</h2>
      <p>
        By taking part in PSNG spaces, events and communication platforms,
        members accept this code of conduct and help to shape a respectful,
        considered and responsible community.
      </p>
    </LegalPageLayout>
  );
};

export default CodeOfConductEn;
