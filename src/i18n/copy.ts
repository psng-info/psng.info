import { useLocale, type Locale } from "./locale";

/**
 * Alle Texte der Oberfläche, je Sprache an einer Stelle.
 *
 * Deutsch ist die Quelle: `Copy` wird aus dem deutschen Objekt abgeleitet, und
 * das englische muss diesen Typ erfüllen. Fehlt drüben ein Schlüssel, schlägt
 * der Typecheck fehl – eine Übersetzung kann also nicht unbemerkt zurückfallen.
 *
 * Für Listen gilt das nur eingeschränkt: Ein Array mit weniger Einträgen ist
 * typkorrekt. Deshalb prüft `copy.test.ts` zusätzlich, dass die Listen in
 * beiden Sprachen gleich lang sind und dieselben Schlüssel tragen.
 *
 * Inhaltstexte (Events, Team, Partner) stehen nicht hier, sondern bei ihren
 * Daten – dort, wo sie gepflegt werden. Sie tragen den Typ `Localized`.
 */
const de = {
  nav: {
    links: [
      { label: "Über uns", hash: "#uber-uns" },
      { label: "Events", hash: "#events" },
      { label: "Leitfaden", hash: "#leitfaden" },
      { label: "FAQ", hash: "#faq" },
      { label: "Team", hash: "#team" },
      { label: "Kooperation", hash: "#kooperation" },
      { label: "Kontakt", hash: "#kontakt" },
    ],
    media: "Medien",
    menuToggle: "Menü umschalten",
    banner: "Unser neuer Medien-Blog ist jetzt online: medien.psng.info",
    languageLabel: "Sprache wechseln",
    skipToContent: "Zum Inhalt springen",
    tocLabel: "Inhalt der Seite",
  },

  hero: {
    headlineBefore: "Psychedelische ",
    headlineAccent: "Forschung",
    headlineAfter: " verbindet",
    students: "250+ Studierende",
    cities: "13+ Städte",
    bpsaChip: "Live in Berlin: die BPSA",
    tagline:
      "Deutschlands erstes bundesweites studentisches Netzwerk für psychedelische Wissenschaft. Seit März 2026 aktiv.",
    joinWhatsapp: "WhatsApp beitreten",
    foundGroup: "Gründe deine Gruppe",
  },

  about: {
    eyebrow: "Über uns",
    title: "Was ist das PSNG?",
    intro:
      "Das Psychedelic Student Network Germany (PSNG) ist ein bundesweites Netzwerk von Studierenden an deutschen Hochschulen, die ein gemeinsames Interesse an psychedelischer Wissenschaft verbindet. Unser Ziel ist es, engagierte Studierende zusammenzubringen und eine starke Community aufzubauen, die gemeinsam an einer verantwortungsvollen Zukunft dieses Forschungsfeldes arbeitet.",
    visionTitle: "Unsere Vision",
    visionText:
      "Eine Zukunft, in der psychedelische Wissenschaft entstigmatisiert ist, interessierte Menschen einander leicht finden können und Forschung im Bereich der Psychedelika sicher, wissenschaftlich fundiert und ethisch betrieben wird.",
    statusTitle: "Status quo in Deutschland",
    statusText:
      "Angesichts wachsender medialer Aufmerksamkeit, zunehmender wissenschaftlicher Forschung und eines steigenden gesellschaftlichen Interesses an Psychedelika gehen wir davon aus, dass auch unter Studierenden in Deutschland ein großes Interesse an psychedelischer Forschung und Therapie besteht. Gleichzeitig fehlt es bislang an bundesweiten studentischen Zusammenschlüssen, die die Entwicklung dieses Feldes durch Austausch und Vernetzung auf studentischer Ebene fördern.",
    modelsTitle: "Vorbilder: Schweiz & Italien",
    modelsText:
      "In der Schweiz sind lokale Hochschulgruppen im Swiss Psychedelic Student Network (SPSN) zusammengeschlossen. In Italien verbindet das University Network for Psychedelic Students (UNePSI) Studierende an verschiedenen Universitäten. Diese Netzwerke dienen als Vorbilder für das PSNG.",
    pillars: [
      {
        key: "network",
        title: "Vernetzung",
        description:
          "Wir verbinden bestehende Studierendeninitiativen und unterstützen neue Hochschulgruppen bei ihrer Gründung.",
      },
      {
        key: "education",
        title: "Bildung",
        description:
          "Regelmäßige Lectures, Community Calls und Journal Clubs zu psychedelischer Wissenschaft und Therapie.",
      },
      {
        key: "research",
        title: "Forschung",
        description:
          "Förderung studentischer Forschungsprojekte und Zusammenarbeit mit akademischen Institutionen.",
      },
      {
        key: "resources",
        title: "Ressourcen",
        description:
          "Gründungsdokumente, Vorlagen, Kontakte und organisatorische Hilfsmittel für lokale Gruppen.",
      },
    ],
  },

  onboarding: {
    eyebrow: "Neu hier?",
    title: "So machst du mit",
    steps: [
      {
        key: "join",
        title: "Community beitreten",
        desc: "Tritt unserer WhatsApp-Gruppe bei und vernetze dich mit 250+ Studierenden aus ganz Deutschland.",
        cta: "WhatsApp beitreten",
      },
      {
        key: "events",
        title: "Events & Calls besuchen",
        desc: "Nimm an monatlichen Lectures und Community Calls teil – online, kostenlos, offen für alle.",
        cta: "Termine ansehen",
      },
      {
        key: "start",
        title: "Lokalgruppe starten",
        desc: "Bring psychedelische Wissenschaft an deine Hochschule. Wir helfen dir beim Aufbau.",
        cta: "Leitfaden lesen",
      },
    ],
  },

  midCta: {
    title: "Noch nicht dabei?",
    text: "Tritt unserer WhatsApp-Community bei und vernetze dich mit 250+ Studierenden aus 13+ Städten.",
    cta: "WhatsApp beitreten",
  },

  events: {
    eyebrow: "Events",
    title: "Veranstaltungen",
    introBefore:
      "Vorträge, Treffen und Konferenzbesuche. (Zoom-)Links zur Teilnahme gibt's über ",
    introMiddle: " und ",
    introAfter: ".",
    seriesNoteBefore: "Lectures:",
    seriesNoteAfter:
      "Ausnahmen bestätigen die Regel. Fachlicher Input aus der Community und von eingeladenen Expert:innen.",
    seriesNoteOn: "auf",
    seriesNoteEvery: "einmal im Monat,",
    seriesNoteClock: "Uhr,",
    filters: { all: "Alle", talks: "Vorträge", community: "Community" },
    columns: { talks: "Vorträge", community: "Community" },
    columnsSingular: { talks: "Vortrag", community: "Community" },
    speakerTypes: { student: "Studentisch", guest: "Expertenvortrag" },
    languages: { de: "Deutsch", en: "Englisch" },
    languageNote: {
      talk: { before: "Der Vortrag ist ", in: "auf " },
      event: { before: "Die Veranstaltung ist ", in: "auf " },
    },
    seriesLabel: "PSNG Lecture",
    seriesSemesterLabel: "PSNG Lecture zum Semesterauftakt",
    seriesNote: "Termin steht. Thema und Speaker geben wir rechtzeitig bekannt.",
    today: "heute",
    showMore: "Mehr anzeigen",
    detailsSoon: "Weitere Details folgen bald.",
    dateLabel: "Datum:",
    locationLabel: "Ort:",
    contributionLabel: "Beitrag:",
    register: "Jetzt anmelden",
    addToCalendar: "Zum Kalender hinzufügen",
    calendarGoogle: "Google Kalender",
    calendarApple: "Apple Kalender / iCloud",
    calendarIcs: "ICS-Datei herunterladen",
    lumaHint:
      "Alle weiteren Infos und das vollständige Programm gibt's auf Luma.",
    lumaLink: "Event auf Luma ansehen →",
    playRecording: "Aufnahme abspielen:",
    playAftermovie: "Aftermovie abspielen:",
    playShort: "Mini-Aftermovie abspielen:",
    shortTitle: "Mini-Aftermovie",
    attendeesPlus: "Teilnehmende",
    attendees: "Teilnehmende",
    online: "online",
    inPerson: "vor Ort",
    rating: "Bewertung",
    recommend: "Weiterempfehlung",
    slides: "Folien ansehen →",
    recap: "Recap lesen →",
    furtherReading: "Zum Weiterlesen",
    linkedinOf: "LinkedIn von",
    linkedin: "LinkedIn",
    learnMore: "Mehr erfahren",
    with: "mit",
    partOf: "Teil von",
    inCooperationWith: "In Kooperation mit der",
    instagram: "Instagram →",
    photoFallback: "Foto",
    firstEvent: "✨ Unser erstes Event",
    ownLectureTitle: "Du willst selbst eine Lecture geben?",
    ownLectureText:
      "Unsere Lectures kommen aus der Community – Bachelor-, Master- oder Promotionsthemen, ein spannendes Paper, ein eigenes Projekt. Melde dich, wir geben dir die Bühne.",
    proposeTalk: "Vortrag vorschlagen",
    askInWhatsapp: "In der WhatsApp-Community melden",
  },

  guide: {
    eyebrow: "Leitfaden & Ressourcen",
    title: "Gründe deine Hochschulgruppe oder schließ dich einer an",
    intro:
      "Schon 250+ Studierende in 13+ Städten sind Teil des bundesweiten Psychedelic Student Network Germany. Ob du eine neue Gruppe an deiner Hochschule gründest oder einer bestehenden beitrittst: Wir vernetzen dich mit anderen.",
    cardEyebrow: "Vollständiger Leitfaden",
    cardTitle: "Von null bis zur ersten Sitzung.",
    cardText:
      "Schritt für Schritt erklärt: AStA-Anmeldung, Mitstreiter*innen finden, Moderationsregeln, Krisenplan sowie Ideen für ein Curriculum.",
    cardTags: [
      "AStA & Bürokratie",
      "Erstes Event",
      "Moderationsregeln",
      "Krisenplan",
      "Curriculum",
    ],
    cardCta: "Leitfaden lesen →",
    principlesEyebrow: "Kurzfassung",
    principlesTitle: "Bevor du anfängst",
    principlesIntro:
      "Du musst kein*e Expert*in sein, um zu starten. Hier sind vier Grundprinzipien, die uns leiten:",
    principles: [
      {
        key: "start",
        title: "Fang einfach an",
        desc: "Warte nicht auf den perfekten Zeitpunkt. Der erste Schritt ist der wichtigste.",
      },
      {
        key: "expectations",
        title: "Realistische Erwartungen",
        desc: "Gruppen fluktuieren. Lass dich von schwächeren Phasen nicht entmutigen – jedes Treffen bringt Erfahrung.",
      },
      {
        key: "support",
        title: "Hol dir Unterstützung",
        desc: "Delegiere Aufgaben (Social Media, Raumsuche, Protokolle). Wer Verantwortung übernimmt, bleibt langfristig dabei.",
      },
      {
        key: "conduct",
        title: "Code of Conduct",
        desc: "Wissenschaftsbasiert, kein Substanzkonsum oder -verkauf, keine therapeutischen Angebote.",
      },
    ],
    stepsTitle: "So startest du",
    steps: [
      {
        key: "team",
        title: "1. Team zusammenstellen",
        desc: "Finde 2–3 Mitstreiter*innen an deiner Hochschule – oder tritt unserer WhatsApp-Community bei, wo wir für jede Stadt eine eigene Gruppe haben.",
        link: "WhatsApp beitreten",
      },
      {
        key: "contact",
        title: "2. Kontakt zum PSNG",
        desc: "Schreib uns über unser Kontaktformular – wir unterstützen euch beim Aufbau und vernetzen euch mit anderen Gruppen.",
        link: "Kontaktformular",
      },
      {
        key: "meeting",
        title: "3. Erstes Treffen planen",
        desc: "Lehnt euch an unsere monatlichen Lectures und Community Calls an oder entwickelt eigene Formate.",
        link: "Events & Termine",
      },
      {
        key: "resources",
        title: "4. Ressourcen nutzen",
        desc: "Der Leitfaden gibt euch Struktur, das Curriculum liefert Themen-Inspiration, und unsere vergangenen Events sind ein guter erster inhaltlicher Aufschlag.",
        link: "Leitfaden",
      },
    ],
    cta: "Jetzt Gruppe gründen – Kontakt aufnehmen",
  },

  faq: {
    eyebrow: "Häufige Fragen",
    title: "FAQ",
    items: [
      {
        key: "student",
        question:
          "Muss ich Student*in sein, um Teil des PSNG oder einer Lokalgruppe zu werden?",
        answer:
          "Nein, ein studentischer Status ist keine zwingende Voraussetzung, um Mitglied zu werden. Wenn es bereits eine Lokalgruppe an einer Uni in deiner Stadt gibt, helfen wir gerne dabei, den Kontakt herzustellen.",
      },
      {
        key: "found",
        question: "Muss ich Student*in sein, um eine Lokalgruppe gründen zu können?",
        answer:
          "Das PSNG richtet sich primär an Menschen im akademischen Kontext. Auch wenn ein Studierendenstatus keine formale Pflicht ist, liegt unser Fokus klar auf wissenschaftlichem Austausch und Nachwuchsförderung.",
      },
      {
        key: "organised",
        question: "Wie ist eine Lokalgruppe organisiert?",
        answer:
          "Ganz individuell, je nach Lokalgruppe! Wir unterstützen euch bei der Gründung, z.B. durch Bereitstellung von Gründungsdokumenten bereits bestehender Studierendengruppen. Als Teil des PSNG erklären sich die Lokalgruppen bereit, den Code of Conduct zu wahren.",
      },
      {
        key: "offers",
        question: "Welche Angebote bietet das PSNG selbst?",
        answer:
          "Wir bieten regelmäßige Calls für Fragen an sowie Unterstützung und Impulse zur Vernetzung. Außerdem teilen wir Journal-Clubs, Keynote-Lectures und weitere Formate der Lokalgruppen im PSNG-Netzwerk. Dadurch möchten wir den Lokalgruppen auch eine Plattform anbieten, auf der sie eine größere Reichweite erreichen.",
      },
    ],
  },

  team: {
    eyebrow: "Team",
    title: "Wer steckt dahinter?",
    intro:
      "Das PSNG wird organisiert durch Psychologie- und Medizinstudierende aus Berlin, Essen und Wuppertal. Events stemmen wir meist gemeinsam als ganzes Orga-Team.",
    linkedin: "LinkedIn →",
    contactCta: "Kontakt aufnehmen",
    photoCaption: "Team 2026 im August",
    founderNotePrefix: "Mitgegründet mit ",
    founderNoteSuffix: ", der das PSNG über ein Jahr lang mit aufgebaut hat. Danke, Cam!",
    recruiting: {
      name: "Teil des Teams werden",
      tag: "Wir suchen Verstärkung",
      place: "Bundesweit",
      text: "Du begeisterst dich für psychedelische Wissenschaft und möchtest das PSNG aktiv mitgestalten? Wir freuen uns über engagierte Studierende aus ganz Deutschland, die unser Netzwerk stärken wollen.",
    },
  },

  partners: {
    eyebrow: "Kooperation",
    title: "Unsere Partner",
    intro: "Wir sind stolze Kooperationspartner der folgenden Organisationen.",
    stripeLabel: "In Kooperation mit",
    website: "Website",
    instagram: "Instagram",
    telegram: "Telegram",
    opportunity: "Forschungsmöglichkeiten",
    ctaBefore:
      "Du möchtest mit uns kooperieren für Events, Reichweite, Forschung oder Ideen-Sparring? ",
    ctaLink: "Schreib uns",
    ctaAfter: ".",
  },

  contact: {
    eyebrow: "Kontakt",
    title: "Schreib uns",
    intro:
      "Ob Gruppengründung, Kooperation, Feedback oder eine Beschwerde – wähle dein Anliegen und wir melden uns bei dir.",
    successTitle: "Danke für deine Nachricht!",
    successText: "Wir melden uns so bald wie möglich bei dir.",
    successAgain: "Weitere Nachricht senden",
    honeypot: "Nicht ausfüllen:",
    name: "Name",
    email: "E-Mail",
    subject: "Anliegen",
    subjectPlaceholder: "Bitte auswählen",
    message: "Nachricht",
    errorBefore: "Etwas ist schiefgelaufen. Bitte versuch es erneut oder schreib uns direkt an ",
    errorAfter: ".",
    submitting: "Wird gesendet…",
    submit: "Nachricht senden",
    subjectRequired: "Bitte wähle zuerst dein Anliegen aus.",
    subjects: [
      { key: "group", label: "Ich möchte eine Lokalgruppe gründen" },
      { key: "team", label: "Ich möchte Teil des Teams werden" },
      { key: "talk", label: "Ich möchte einen Vortrag vorschlagen" },
      { key: "cooperation", label: "Kooperationsanfrage" },
      { key: "feedback", label: "Feedback zur Website oder zum Netzwerk" },
      { key: "complaint", label: "Beschwerde / Code-of-Conduct-Anliegen" },
      { key: "other", label: "Sonstiges" },
    ],
  },

  footer: {
    joinWhatsapp: "WhatsApp-Community beitreten",
    imprint: "Impressum",
    privacy: "Datenschutz",
    guide: "Leitfaden",
    codeOfConduct: "Code of Conduct",
    rights:
      "Psychedelic Student Network Germany (PSNG). Alle Rechte vorbehalten.",
    thanks: "Mit Dank an David Frank aus Basel.",
    germanOnly: "(auf Deutsch)",
  },

  notFound: {
    eyebrow: "Fehler 404",
    title: "Diese Seite gibt es nicht",
    textBefore: "Die Adresse ",
    textAfter:
      " führt ins Leere. Vielleicht ist der Link veraltet oder hat sich ein Tippfehler eingeschlichen.",
    continue: "Hier geht es weiter:",
    suggestions: [
      { key: "home", label: "Startseite" },
      { key: "events", label: "Events & Termine" },
      { key: "guide", label: "Leitfaden: Gruppe gründen" },
      { key: "contact", label: "Kontakt" },
    ],
  },

  legal: {
    back: "Zurück zur Startseite",
  },

  /*
   * Die Vorschau unter /lab. Nur was dort neu ist, steht hier – alles, wofür es
   * auf der Startseite schon einen Text gibt (Einstiege, Kennzahlen,
   * Gruppen-Überschrift, Abschluss), liest die Seite von dort.
   */
  lab: {
    title: "PSNG – Vorschau",
    nav: {
      events: "Events",
      groups: "Hochschulgruppen",
      guide: "Leitfaden",
      about: "Über uns",
    },
    hero: {
      eyebrow: "Psychedelic Student Network Germany",
      headlineBefore: "Deutschlands studentisches Netzwerk für ",
      headlineAccent: "psychedelische Wissenschaft",
      headlineAfter: ".",
      text: "Wir bringen Studierende zusammen, die sich für psychedelische Forschung interessieren: mit Lectures, Community Calls und Unterstützung beim Gründen einer Hochschulgruppe.",
    },
    upNext: "Als Nächstes",
    since: "Seit März 2026 aktiv",
    agenda: {
      eyebrow: "Termine",
      title: "Danach im Kalender",
      all: "Alle Termine & Aufzeichnungen →",
    },
    groups: {
      eyebrow: "Hochschulgruppen",
      intro:
        "Ob du einer bestehenden Gruppe beitrittst oder an deiner Hochschule eine gründest: Wir vernetzen dich mit anderen und helfen beim Aufbau.",
      steps: [
        {
          key: "team",
          title: "Team finden",
          desc: "2–3 Leute an deiner Hochschule, oder über die Stadtgruppen in der WhatsApp-Community.",
        },
        {
          key: "contact",
          title: "Bei uns melden",
          desc: "Wir helfen beim Aufbau und vernetzen euch mit anderen Gruppen.",
        },
        {
          key: "meeting",
          title: "Erstes Treffen planen",
          desc: "An unsere Lectures anlehnen oder eigene Formate entwickeln.",
        },
        {
          key: "resources",
          title: "Ressourcen nutzen",
          desc: "Leitfaden, Curriculum und die Aufzeichnungen vergangener Events.",
        },
      ],
      cta: "Gruppe gründen",
    },
    credibility: {
      eyebrow: "Wofür wir stehen",
      title: "Was das PSNG ist – und was nicht.",
      mission:
        "Wir bringen engagierte Studierende zusammen und bauen eine Community auf, die gemeinsam an einer verantwortungsvollen Zukunft dieses Forschungsfeldes arbeitet.",
      items: [
        {
          key: "students",
          title: "Studentisch organisiert",
          desc: "Getragen von Psychologie- und Medizinstudierenden aus Berlin und Wuppertal.",
        },
        {
          key: "science",
          title: "Wissenschaftsbasiert",
          desc: "Lectures, Journal Clubs und Austausch über aktuelle Forschung, aus der Community und mit eingeladenen Expert:innen.",
        },
        {
          key: "conduct",
          title: "Mit klaren Regeln",
          desc: "Kein Substanzkonsum oder -verkauf, keine therapeutischen Angebote.",
        },
        {
          key: "europe",
          title: "Europäisch vernetzt",
          desc: "Nach dem Vorbild der Studierendennetzwerke in der Schweiz (SPSN) und Italien (UNePSI), mit denen wir kooperieren.",
        },
      ],
      codeOfConduct: "Code of Conduct lesen →",
      about: "Mehr über das PSNG →",
    },
    proof: {
      eyebrow: "Rückblick",
      more: "Zum Rückblick →",
    },
  },

  meta: {
    home: {
      title: "PSNG – Psychedelic Student Network Germany",
      description:
        "Deutschlands erstes bundesweites studentisches Netzwerk für psychedelische Wissenschaft. Lectures, Events und Unterstützung beim Gründen einer Hochschulgruppe.",
    },
    guide: {
      title: "Leitfaden: Hochschulgruppe gründen – PSNG",
      description:
        "Schritt für Schritt zur eigenen Hochschulgruppe: AStA-Anmeldung, erstes Event, Moderationsregeln, Krisenplan und ein Curriculum zum Loslegen.",
    },
    codeOfConduct: {
      title: "Code of Conduct – PSNG",
      description:
        "Die Grundsätze, nach denen wir im PSNG zusammenarbeiten: wissenschaftsbasiert, ohne Substanzkonsum, ohne therapeutische Angebote.",
    },
    about: {
      title: "Über uns – PSNG",
      description:
        "Wer hinter dem PSNG steht, wofür wir uns einsetzen und mit welchen Organisationen wir zusammenarbeiten.",
    },
    events: {
      title: "Events – PSNG",
      description:
        "Lectures, Community Calls und Treffen des PSNG: kommende Termine und Rückblicke mit Aufzeichnungen und Fotos.",
    },
    imprint: {
      title: "Impressum – PSNG",
      description: "Angaben gemäß § 5 TMG für psng.info.",
    },
    privacy: {
      title: "Datenschutz – PSNG",
      description: "Wie das PSNG mit personenbezogenen Daten auf psng.info umgeht.",
    },
  },
};

export type Copy = typeof de;

const en: Copy = {
  nav: {
    links: [
      { label: "About", hash: "#uber-uns" },
      { label: "Events", hash: "#events" },
      { label: "Get started", hash: "#leitfaden" },
      { label: "FAQ", hash: "#faq" },
      { label: "Team", hash: "#team" },
      { label: "Partners", hash: "#kooperation" },
      { label: "Contact", hash: "#kontakt" },
    ],
    media: "Media",
    menuToggle: "Toggle menu",
    banner: "Our new media blog is live: medien.psng.info",
    languageLabel: "Change language",
    skipToContent: "Skip to content",
    tocLabel: "On this page",
  },

  hero: {
    headlineBefore: "Psychedelic ",
    headlineAccent: "research",
    headlineAfter: " connects",
    students: "250+ students",
    cities: "13+ cities",
    bpsaChip: "Live in Berlin: the BPSA",
    tagline:
      "Germany's first nationwide student network for psychedelic science. Active since March 2026.",
    joinWhatsapp: "Join on WhatsApp",
    foundGroup: "Start your own group",
  },

  about: {
    eyebrow: "About us",
    title: "What is the PSNG?",
    intro:
      "The Psychedelic Student Network Germany (PSNG) is a nationwide network of students at German universities who share an interest in psychedelic science. Our aim is to bring committed students together and build a strong community that works towards a responsible future for this field of research.",
    visionTitle: "Our vision",
    visionText:
      "A future in which psychedelic science is destigmatised, people with an interest in it can find each other easily, and research on psychedelics is conducted safely, rigorously and ethically.",
    statusTitle: "Where Germany stands",
    statusText:
      "With growing media attention, expanding scientific research and rising public interest in psychedelics, we assume that students in Germany are just as interested in psychedelic research and therapy. What has been missing so far is a nationwide student body that advances the field through exchange and connection at student level.",
    modelsTitle: "Models: Switzerland & Italy",
    modelsText:
      "In Switzerland, local university groups are joined together in the Swiss Psychedelic Student Network (SPSN). In Italy, the University Network for Psychedelic Students (UNePSI) connects students across different universities. Both networks served as models for the PSNG.",
    pillars: [
      {
        key: "network",
        title: "Connection",
        description:
          "We link up existing student initiatives and help new university groups get off the ground.",
      },
      {
        key: "education",
        title: "Education",
        description:
          "Regular lectures, community calls and journal clubs on psychedelic science and therapy.",
      },
      {
        key: "research",
        title: "Research",
        description:
          "Support for student research projects and collaboration with academic institutions.",
      },
      {
        key: "resources",
        title: "Resources",
        description:
          "Founding documents, templates, contacts and organisational tools for local groups.",
      },
    ],
  },

  onboarding: {
    eyebrow: "New here?",
    title: "How to get involved",
    steps: [
      {
        key: "join",
        title: "Join the community",
        desc: "Join our WhatsApp group and connect with 250+ students from across Germany.",
        cta: "Join on WhatsApp",
      },
      {
        key: "events",
        title: "Come to events & calls",
        desc: "Take part in monthly lectures and community calls – online, free, open to everyone.",
        cta: "See upcoming dates",
      },
      {
        key: "start",
        title: "Start a local group",
        desc: "Bring psychedelic science to your university. We'll help you set it up.",
        cta: "Read the guide",
      },
    ],
  },

  midCta: {
    title: "Not with us yet?",
    text: "Join our WhatsApp community and connect with 250+ students across 13+ cities.",
    cta: "Join on WhatsApp",
  },

  events: {
    eyebrow: "Events",
    title: "Events",
    introBefore:
      "Talks, meet-ups and conference visits. (Zoom) links to join are shared via ",
    introMiddle: " and ",
    introAfter: ".",
    seriesNoteBefore: "Lectures:",
    seriesNoteAfter:
      "Exceptions prove the rule. Expert input from within the community and from invited speakers.",
    seriesNoteOn: "on",
    seriesNoteEvery: "once a month,",
    seriesNoteClock: "CET,",
    filters: { all: "All", talks: "Talks", community: "Community" },
    columns: { talks: "Talks", community: "Community" },
    columnsSingular: { talks: "Talk", community: "Community" },
    speakerTypes: { student: "Student talk", guest: "Expert talk" },
    languages: { de: "German", en: "English" },
    languageNote: {
      talk: { before: "This talk is ", in: "in " },
      event: { before: "This event is ", in: "in " },
    },
    seriesLabel: "PSNG Lecture",
    seriesSemesterLabel: "PSNG Lecture — start of term",
    seriesNote: "The date is set. We'll announce topic and speaker in good time.",
    today: "today",
    showMore: "Show more",
    detailsSoon: "More details to follow.",
    dateLabel: "Date:",
    locationLabel: "Location:",
    contributionLabel: "Contribution:",
    register: "Register now",
    addToCalendar: "Add to calendar",
    calendarGoogle: "Google Calendar",
    calendarApple: "Apple Calendar / iCloud",
    calendarIcs: "Download .ics file",
    lumaHint: "Full details and the complete programme are on Luma.",
    lumaLink: "View the event on Luma →",
    playRecording: "Play recording:",
    playAftermovie: "Play aftermovie:",
    playShort: "Play mini aftermovie:",
    shortTitle: "Mini aftermovie",
    attendeesPlus: "attendees",
    attendees: "attendees",
    online: "online",
    inPerson: "in person",
    rating: "rating",
    recommend: "would recommend",
    slides: "View slides →",
    recap: "Read the recap →",
    furtherReading: "Further reading",
    linkedinOf: "LinkedIn of",
    linkedin: "LinkedIn",
    learnMore: "Find out more",
    with: "with",
    partOf: "Part of",
    inCooperationWith: "In cooperation with the",
    instagram: "Instagram →",
    photoFallback: "Photo",
    firstEvent: "✨ Our first event",
    ownLectureTitle: "Want to give a lecture yourself?",
    ownLectureText:
      "Our lectures come from the community – bachelor's, master's or doctoral work, a paper you find exciting, a project of your own. Get in touch and the stage is yours.",
    proposeTalk: "Propose a talk",
    askInWhatsapp: "Ask in the WhatsApp community",
  },

  guide: {
    eyebrow: "Guide & resources",
    title: "Start a university group, or join one",
    intro:
      "250+ students in 13+ cities are already part of the nationwide Psychedelic Student Network Germany. Whether you start a new group at your university or join an existing one, we'll connect you with others.",
    cardEyebrow: "The full guide",
    cardTitle: "From nothing to your first meeting.",
    cardText:
      "Step by step: registering with the student union, finding co-organisers, facilitation rules, a crisis plan, and ideas for a curriculum.",
    cardTags: [
      "Student union & admin",
      "First event",
      "Facilitation rules",
      "Crisis plan",
      "Curriculum",
    ],
    cardCta: "Read the guide →",
    principlesEyebrow: "In short",
    principlesTitle: "Before you start",
    principlesIntro:
      "You don't need to be an expert to begin. Here are four principles that guide us:",
    principles: [
      {
        key: "start",
        title: "Just start",
        desc: "Don't wait for the perfect moment. The first step is the one that matters most.",
      },
      {
        key: "expectations",
        title: "Realistic expectations",
        desc: "Groups ebb and flow. Don't let the quieter stretches discourage you – every meeting adds experience.",
      },
      {
        key: "support",
        title: "Get support",
        desc: "Delegate tasks (social media, finding rooms, minutes). People who take on responsibility tend to stay.",
      },
      {
        key: "conduct",
        title: "Code of conduct",
        desc: "Science-based, no use or sale of substances, no therapeutic services.",
      },
    ],
    stepsTitle: "How to begin",
    steps: [
      {
        key: "team",
        title: "1. Put a team together",
        desc: "Find 2–3 co-organisers at your university – or join our WhatsApp community, where every city has its own group.",
        link: "Join on WhatsApp",
      },
      {
        key: "contact",
        title: "2. Get in touch with the PSNG",
        desc: "Write to us through the contact form – we'll help you set things up and connect you with other groups.",
        link: "Contact form",
      },
      {
        key: "meeting",
        title: "3. Plan a first meeting",
        desc: "Build on our monthly lectures and community calls, or develop formats of your own.",
        link: "Events & dates",
      },
      {
        key: "resources",
        title: "4. Use the resources",
        desc: "The guide gives you structure, the curriculum supplies topics, and our past events are a good first thing to show.",
        link: "Guide",
      },
    ],
    cta: "Start a group – get in touch",
  },

  faq: {
    eyebrow: "Common questions",
    title: "FAQ",
    items: [
      {
        key: "student",
        question:
          "Do I have to be a student to join the PSNG or a local group?",
        answer:
          "No, student status is not a requirement for membership. If there is already a local group at a university in your city, we're happy to put you in touch.",
      },
      {
        key: "found",
        question: "Do I have to be a student to start a local group?",
        answer:
          "The PSNG is aimed primarily at people in an academic context. Student status is not formally required, but our focus is clearly on scientific exchange and supporting early-career researchers.",
      },
      {
        key: "organised",
        question: "How is a local group organised?",
        answer:
          "Entirely up to each group. We support you in setting one up, for example with founding documents from student groups that already exist. As part of the PSNG, local groups agree to uphold the code of conduct.",
      },
      {
        key: "offers",
        question: "What does the PSNG itself offer?",
        answer:
          "We hold regular calls for questions and offer support and ideas for connecting with others. We also share journal clubs, keynote lectures and other formats from local groups across the PSNG network, giving those groups a platform and a wider reach.",
      },
    ],
  },

  team: {
    eyebrow: "Team",
    title: "Who's behind this?",
    intro:
      "The PSNG is organised by psychology and medical students in Berlin, Essen and Wuppertal. Events are usually a joint effort of the whole organising team.",
    linkedin: "LinkedIn →",
    contactCta: "Get in touch",
    photoCaption: "The team in August 2026",
    founderNotePrefix: "Co-founded with ",
    founderNoteSuffix: ", who helped build the PSNG for over a year. Thanks, Cam!",
    recruiting: {
      name: "Join the team",
      tag: "We're looking for people",
      place: "Nationwide",
      text: "Excited about psychedelic science and keen to help shape the PSNG? We'd love to hear from committed students across Germany who want to strengthen the network.",
    },
  },

  partners: {
    eyebrow: "Partners",
    title: "Our partners",
    intro: "We are proud to work with the following organisations.",
    stripeLabel: "In cooperation with",
    website: "Website",
    instagram: "Instagram",
    telegram: "Telegram",
    opportunity: "Research opportunities",
    ctaBefore:
      "Would you like to work with us on events, reach, research or simply to bounce around ideas? ",
    ctaLink: "Write to us",
    ctaAfter: ".",
  },

  contact: {
    eyebrow: "Contact",
    title: "Write to us",
    intro:
      "Starting a group, a partnership, feedback or a complaint – pick your topic and we'll get back to you.",
    successTitle: "Thank you for your message!",
    successText: "We'll get back to you as soon as we can.",
    successAgain: "Send another message",
    honeypot: "Do not fill in:",
    name: "Name",
    email: "Email",
    subject: "Topic",
    subjectPlaceholder: "Please choose",
    message: "Message",
    errorBefore: "Something went wrong. Please try again, or write to us directly at ",
    errorAfter: ".",
    submitting: "Sending…",
    submit: "Send message",
    subjectRequired: "Please choose a topic first.",
    subjects: [
      { key: "group", label: "I'd like to start a local group" },
      { key: "team", label: "I'd like to join the team" },
      { key: "talk", label: "I'd like to propose a talk" },
      { key: "cooperation", label: "Partnership enquiry" },
      { key: "feedback", label: "Feedback on the site or the network" },
      { key: "complaint", label: "Complaint / code of conduct matter" },
      { key: "other", label: "Something else" },
    ],
  },

  footer: {
    joinWhatsapp: "Join the WhatsApp community",
    imprint: "Imprint",
    privacy: "Privacy",
    guide: "Guide",
    codeOfConduct: "Code of Conduct",
    rights: "Psychedelic Student Network Germany (PSNG). All rights reserved.",
    thanks: "With thanks to David Frank in Basel.",
    germanOnly: "(in German)",
  },

  notFound: {
    eyebrow: "Error 404",
    title: "This page doesn't exist",
    textBefore: "The address ",
    textAfter: " leads nowhere. The link may be out of date, or there's a typo in it.",
    continue: "Try one of these:",
    suggestions: [
      { key: "home", label: "Home" },
      { key: "events", label: "Events & dates" },
      { key: "guide", label: "Guide: starting a group" },
      { key: "contact", label: "Contact" },
    ],
  },

  legal: {
    back: "Back to the homepage",
  },

  lab: {
    title: "PSNG – preview",
    nav: {
      events: "Events",
      groups: "University groups",
      guide: "Guide",
      about: "About",
    },
    hero: {
      eyebrow: "Psychedelic Student Network Germany",
      headlineBefore: "Germany's student network for ",
      headlineAccent: "psychedelic science",
      headlineAfter: ".",
      text: "We bring together students interested in psychedelic research: with lectures, community calls and support for starting a university group.",
    },
    upNext: "Up next",
    since: "Active since March 2026",
    agenda: {
      eyebrow: "Events",
      title: "Coming up after that",
      all: "All events & recordings →",
    },
    groups: {
      eyebrow: "University groups",
      intro:
        "Whether you join an existing group or start one at your university, we'll connect you with others and help you set it up.",
      steps: [
        {
          key: "team",
          title: "Find a team",
          desc: "2–3 people at your university, or through the city groups in the WhatsApp community.",
        },
        {
          key: "contact",
          title: "Get in touch",
          desc: "We help you set things up and connect you with other groups.",
        },
        {
          key: "meeting",
          title: "Plan a first meeting",
          desc: "Build on our lectures or develop formats of your own.",
        },
        {
          key: "resources",
          title: "Use the resources",
          desc: "The guide, the curriculum and recordings of past events.",
        },
      ],
      cta: "Start a group",
    },
    credibility: {
      eyebrow: "What we stand for",
      title: "What the PSNG is, and what it isn't.",
      mission:
        "We bring committed students together and build a community that works towards a responsible future for this field of research.",
      items: [
        {
          key: "students",
          title: "Student-led",
          desc: "Organised by psychology and medical students in Berlin, Essen and Wuppertal. Events are usually a joint effort of the whole organising team.",
        },
        {
          key: "science",
          title: "Science-based",
          desc: "Lectures, journal clubs and discussion of current research, from within the community and with invited experts.",
        },
        {
          key: "conduct",
          title: "Clear rules",
          desc: "No use or sale of substances, no therapeutic services.",
        },
        {
          key: "europe",
          title: "Connected across Europe",
          desc: "Modelled on the student networks in Switzerland (SPSN) and Italy (UNePSI), both of which we work with.",
        },
      ],
      codeOfConduct: "Read the code of conduct →",
      about: "More about the PSNG →",
    },
    proof: {
      eyebrow: "Looking back",
      more: "See the recap →",
    },
  },

  meta: {
    home: {
      title: "PSNG – Psychedelic Student Network Germany",
      description:
        "Germany's first nationwide student network for psychedelic science. Lectures, events and support for starting a university group.",
    },
    guide: {
      title: "Guide: starting a university group – PSNG",
      description:
        "Step by step to your own university group: registering with the student union, a first event, facilitation rules, a crisis plan and a curriculum to get going.",
    },
    codeOfConduct: {
      title: "Code of Conduct – PSNG",
      description:
        "The principles we work by at the PSNG: science-based, no substance use, no therapeutic services.",
    },
    about: {
      title: "About – PSNG",
      description:
        "Who is behind the PSNG, what we stand for and which organisations we work with.",
    },
    events: {
      title: "Events – PSNG",
      description:
        "PSNG lectures, community calls and meet-ups: upcoming dates and recaps with recordings and photos.",
    },
    imprint: {
      title: "Imprint – PSNG",
      description: "Legal notice under § 5 TMG for psng.info.",
    },
    privacy: {
      title: "Privacy – PSNG",
      description: "How the PSNG handles personal data on psng.info.",
    },
  },
};

export const copy: Record<Locale, Copy> = { de, en };

/** Die Texte in der Sprache der aktuellen Seite. */
export function useCopy(): Copy {
  return copy[useLocale()];
}
