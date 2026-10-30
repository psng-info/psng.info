import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCopy } from "@/i18n/copy";
import { useLocale } from "@/i18n/locale";
import { pathFor } from "@/i18n/routes";

const NotFound = () => {
  const { pathname } = useLocation();
  const c = useCopy();
  const locale = useLocale();
  const home = pathFor("home", locale);
  const targets: Record<string, string> = {
    home,
    events: `${home}#events`,
    guide: pathFor("guide", locale),
    contact: `${home}#kontakt`,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="container mx-auto flex-1 px-6 pt-40 pb-24">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-primary mb-4">
            {c.notFound.eyebrow}
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            {c.notFound.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-2">
            {c.notFound.textBefore}
            <code className="text-foreground">{pathname}</code>
            {c.notFound.textAfter}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {c.notFound.continue}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {c.notFound.suggestions.map((s) => (
              <Link
                key={s.key}
                to={targets[s.key]}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-primary/30 text-primary font-heading font-medium text-sm hover:bg-primary/5 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
