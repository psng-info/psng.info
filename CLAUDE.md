# CLAUDE.md – psng.info

Website des Psychedelic Student Network Germany (PSNG). Stand: Oktober 2026.

## Stack und Befehle

- React, Vite, TypeScript, Tailwind, shadcn/ui, framer-motion, React Router, Vitest
- `npm run dev` (localhost:8080), `npm run build`, `npm run test`, `npm run lint`
- Hosting: Netlify, Auto-Deploy von `main`. Alles auf `main` ist sofort live, deshalb Änderungen über einen Branch und Pull Request.
- `public/_redirects`: Kurzlinks stehen **vor** der SPA-Regel `/* /index.html 200`.

## Konventionen

- Alle Texte stehen zweisprachig in `src/i18n/copy.ts` (`de` ist die Vorlage, `en: Copy` muss dieselbe Form haben). Keine Texte direkt in Komponenten.
- Externe Links zentral in `src/lib/links.ts`.
- Code-Kommentare auf Deutsch, sie erklären das Warum.
- Sichtbare Texte: keine Gedankenstriche (– oder —) zur Satzgliederung, sondern Komma, Punkt oder umgebauter Satz. Kein Marketing-Sprech, nüchtern und wissenschaftlich.
- Nichts erfinden: keine geschätzten Zahlen, keine Zitate ohne Quelle.
- Bilder: Quellen nach `src/assets/`, Website-Versionen per `scripts/optimize-images.mjs`. Social-Media- und Print-Grafiken nach `design/`.

## Seitenstruktur

- `/` und `/en`: Startseite (`src/pages/Index.tsx`) mit Team, FAQ, Kontakt.
- `/lab` und `/en/lab`: Vorschau einer neuen Startseite (`src/pages/Lab.tsx`, Komponenten in `src/components/lab/`). Bewusst nicht in `src/i18n/routes.ts`, nicht in der Sitemap, `noindex`.
- Termine: `src/data/events.ts`.
- Team: `src/components/TeamSection.tsx` (alphabetisch, Feld `focus` = Verantwortungsbereich im PSNG).

## Organisatorischer Kontext (Oktober 2026)

- **Strategie:** Der Aufbau vieler Lokalgruppen hat im ersten Halbjahr nicht funktioniert, nur die BPSA in Berlin existiert. Neuer Fokus: PSNG als nationale Plattform mit drei Säulen: Lecture-Serie und Content-Archiv, Matching für Forschung und Abschlussarbeiten, e.V.-Gründung. Texte, die stark auf „Hochschulgruppe gründen" setzen, sind deshalb zu überprüfen.
- **uniMIND:** Die uniMIND-Gruppen der MIND Foundation haben ihren Ansprechpartner verloren, er hat ihnen das PSNG empfohlen. Bestehende Gruppen ins Netzwerk zu holen ist ein wahrscheinlicher nächster Schwerpunkt.
- **Team:** Lennert (Koordination, IT und Website), Meta (Vereinsgründung, Events), Stela (Marketing, Social Media, Grafik), Polina (Community Management, Events), Ivana (Vereinsgründung, Lecture-Serie, derzeit reduziert). Cameron ist Alumni und steht nicht mehr auf der Seite.
- **Mitmachen im Orga-Team:** Google Form, Link in `MITMACHEN_FORM_LINK`, Kurzlink `psng.info/mitmachen`. Ablauf: Formular, 1:1, vierwöchige Probeaufgabe mit Buddy, Review.
- **Offen:** Ob auch Nicht-Studierende im Orga-Team mitmachen. Texte deshalb nicht auf „nur Studierende" zuspitzen.
- Interne Doku (Wiki, HR-Sheet) liegt im Google Drive des PSNG, nicht im Repo. Keine Zugangsdaten ins Repo.
