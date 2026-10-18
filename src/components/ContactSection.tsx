import { useState, useEffect, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/lib/links";
import { useCopy } from "@/i18n/copy";

/**
 * Die Werte gehen an /api/kontakt und landen in der Mail – sie bleiben deutsch und
 * damit über beide Sprachen hinweg vergleichbar. Übersetzt wird nur, was im
 * Auswahlfeld steht; die Zuordnung läuft über den Schlüssel aus copy.ts.
 */
const subjectValues: Record<string, string> = {
  group: "Gruppe gründen",
  team: "Team",
  talk: "Vortrag vorschlagen",
  cooperation: "Kooperation",
  feedback: "Feedback",
  complaint: "Beschwerde",
  other: "Sonstiges",
};


const subjectParamMap: Record<string, string> = {
  gruppe: "Gruppe gründen",
  team: "Team",
  vortrag: "Vortrag vorschlagen",
  kooperation: "Kooperation",
  feedback: "Feedback",
  beschwerde: "Beschwerde",
};

type Status = "idle" | "submitting" | "success" | "error";

const ContactSection = () => {
  const c = useCopy();
  const [status, setStatus] = useState<Status>("idle");
  const [subject, setSubject] = useState("");
  const { search } = useLocation();

  // Reagiert auch auf Client-seitige Navigation (?subject=… aus den CTAs),
  // nicht nur auf den ersten Seitenaufruf.
  useEffect(() => {
    const param = new URLSearchParams(search).get("subject");
    if (param && subjectParamMap[param]) {
      setSubject(subjectParamMap[param]);
      setStatus("idle");
    }
  }, [search]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    try {
      const response = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error("Submission failed");

      setStatus("success");
      form.reset();
      setSubject("");
    } catch {
      setStatus("error");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setSubject("");
  };

  return (
    <section id="kontakt" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-primary mb-4">
            {c.contact.eyebrow}
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            {c.contact.title}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {c.contact.intro}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl mx-auto"
        >
          {status === "success" ? (
            <div
              role="status"
              aria-live="polite"
              className="bg-card rounded-2xl border border-border p-8 text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {c.contact.successTitle}
              </h3>
              <p className="text-muted-foreground text-sm mb-5">
                {c.contact.successText}
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-heading font-medium text-primary hover:underline"
              >
                {c.contact.successAgain}
              </button>
            </div>
          ) : (
            <form
              name="kontakt"
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-5 hover:shadow-lg transition-shadow"
            >
              <p className="hidden">
                <label>
                  {c.contact.honeypot} <input name="bot-field" />
                </label>
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="name">{c.contact.name}</Label>
                  <Input id="name" name="name" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">{c.contact.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">{c.contact.subject}</Label>
                <input type="hidden" name="subject" value={subject} />
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject" className="mt-1.5">
                    <SelectValue placeholder={c.contact.subjectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {c.contact.subjects.map((option) => (
                      <SelectItem
                        key={option.key}
                        value={subjectValues[option.key]}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">{c.contact.message}</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-1.5"
                />
              </div>

              <div role="status" aria-live="polite">
                {status === "error" && (
                  <p className="text-destructive text-sm">
                    {c.contact.errorBefore}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                      {CONTACT_EMAIL}
                    </a>
                    {c.contact.errorAfter}
                  </p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={status === "submitting" || !subject}
                  className="w-full gradient-psychedelic text-primary-foreground font-heading"
                >
                  {status === "submitting" ? c.contact.submitting : c.contact.submit}
                </Button>
                {!subject && (
                  <p className="text-muted-foreground text-xs mt-2 text-center">
                    {c.contact.subjectRequired}
                  </p>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
