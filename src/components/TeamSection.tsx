import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ivanaImg from "@/assets/Ivana.webp";
import lennertImg from "@/assets/Lennert.webp";
import metaImg from "@/assets/Meta.webp";
import polinaImg from "@/assets/Polina.webp";
import stelaImg from "@/assets/Stela.webp";
import { useCopy } from "@/i18n/copy";
import { useLocale } from "@/i18n/locale";
import { pathFor } from "@/i18n/routes";
import { pick, type Localized } from "@/i18n/localized";

interface TeamMember {
  name: string;
  role: Localized;
  uni: Localized | null;
  bio: Localized;
  image: string | null;
  linkedin: string | null;
  isRecruiting: boolean;
}

const team: TeamMember[] = [
  {
    name: "Ivana Sterr",
    role: { de: "Medizinstudentin", en: "Medical student" },
    uni: "Charité Berlin",
    bio: {
      de: "Studiert Medizin und ist als studentische Hilfskraft an der Charité in der klinischen psychedelischen Forschung tätig. Inspiriert von der offenen, vernetzten Community bei Events der ALPS Foundation in der Schweiz.",
      en: "Studies medicine and works as a student assistant in clinical psychedelic research at the Charité. Inspired by the open, well-connected community at ALPS Foundation events in Switzerland.",
    },
    image: ivanaImg,
    linkedin: null,
    isRecruiting: false,
  },
  {
    name: "Lennert van de Kreeke",
    role: { de: "Medizinstudent", en: "Medical student" },
    uni: "Charité Berlin",
    bio: {
      de: "Aktiv in der klinischen Psychedelikaforschung und engagiert bei der ALPS Foundation in der Schweiz. Studiert Medizin in Berlin und sieht im PSNG großes Potenzial für Verbindung, Austausch und gemeinsame Entwicklung.",
      en: "Active in clinical psychedelic research and involved with the ALPS Foundation in Switzerland. Studies medicine in Berlin and sees great potential in the PSNG for connection, exchange and shared growth.",
    },
    image: lennertImg,
    linkedin: "https://www.linkedin.com/in/lennert-van-de-kreeke-1b860828b/",
    isRecruiting: false,
  },
  {
    name: "Meta Laubinger",
    role: { de: "Psychologie-Masterandin", en: "Psychology master's student" },
    uni: "Bergische Universität Wuppertal",
    bio: {
      de: "Klinische Psychologie-Masterandin und wissenschaftliche Hilfskraft. Überzeugt, dass Psychedelika ein kraftvolles Werkzeug zur Erforschung des Bewusstseins sind, deren therapeutisches Potenzial durch systematische Forschung nutzbar gemacht werden kann.",
      en: "Master's student in clinical psychology and a research assistant. Convinced that psychedelics are a powerful tool for studying consciousness, and that systematic research can make their therapeutic potential usable.",
    },
    image: metaImg,
    linkedin: "https://www.linkedin.com/in/meta-laubinger-905634395/",
    isRecruiting: false,
  },
  {
    name: "Stela Malvasija",
    role: { de: "Klinische Psychologin", en: "Clinical psychologist" },
    uni: "Euro-FH Europäische Fernhochschule Hamburg",
    bio: {
      de: "Klinische Psychologin mit besonderem Interesse an Psychedelika. Erforscht, wie veränderte Bewusstseinszustände Genesung, Verbundenheit und neue Narrative ermöglichen können – im Individuum und im Kollektiv.",
      en: "Clinical psychologist with a particular interest in psychedelics. Researches how altered states of consciousness can enable recovery, connectedness and new narratives, in the individual and in the collective.",
    },
    image: stelaImg,
    linkedin: "https://www.linkedin.com/in/stela-malvasija-5510011aa/",
    isRecruiting: false,
  },
  {
    name: "Polina Bedrina",
    role: { de: "Community Management & Events", en: "Community management & events" },
    uni: null,
    bio: {
      de: "Kümmert sich um die Community des PSNG und leitet die Events.",
      en: "Looks after the PSNG community and leads our events.",
    },
    image: polinaImg,
    linkedin: "https://www.linkedin.com/in/polina-bedrina/",
    isRecruiting: false,
  },
  {
    name: "Teil des Teams werden",
    role: { de: "Wir suchen Verstärkung", en: "We're looking for people" },
    uni: { de: "Bundesweit", en: "Nationwide" },
    bio: {
      de: "Du begeisterst dich für psychedelische Wissenschaft und möchtest das PSNG aktiv mitgestalten? Wir freuen uns über engagierte Studierende aus ganz Deutschland, die unser Netzwerk stärken wollen.",
      en: "Excited about psychedelic science and keen to help shape the PSNG? We'd love to hear from committed students across Germany who want to strengthen the network.",
    },
    image: null,
    linkedin: null,
    isRecruiting: true,
  },
];

const PlaceholderAvatar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-20 h-20 text-muted-foreground/30"
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clipRule="evenodd"
    />
  </svg>
);

const TeamSection = () => {
  const c = useCopy();
  const locale = useLocale();

  return (
    <section id="team" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-4"
        >
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-primary mb-4">
            {c.team.eyebrow}
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            {c.team.title}
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            {c.team.intro}
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex items-center justify-center">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    width={160}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlaceholderAvatar />
                )}
              </div>
              <div className="text-center flex flex-col flex-1">
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-medium mt-0.5">
                  {pick(member.role, locale)}
                </p>
                {member.uni && (
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {pick(member.uni, locale)}
                  </p>
                )}
                <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                  {pick(member.bio, locale)}
                </p>
                <div className="flex-1" />
                {(member.linkedin || member.isRecruiting) && (
                  <div className="mt-auto pt-3 border-t border-border/50">
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs font-medium text-primary hover:underline"
                      >
                        {c.team.linkedin}
                      </a>
                    ) : (
                      <Link
                        to={`${pathFor("home", locale)}?subject=team#kontakt`}
                        className="inline-flex items-center justify-center px-5 py-2 rounded-lg border border-primary/30 text-primary font-heading font-medium text-xs hover:bg-primary/5 transition-colors"
                      >
                        {c.team.contactCta}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
