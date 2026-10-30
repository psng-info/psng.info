import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToHash from "@/components/ScrollToHash";
import KeepScrollOnLocaleChange from "@/i18n/KeepScrollOnLocaleChange";
import Index from "./views/Index";
import { pathFor } from "@/i18n/routes";

// Die Unterseiten sind reine Textseiten und werden von den meisten Besuchern
// nie geöffnet – sie gehören nicht in den Bundle der Startseite.
const Impressum = lazy(() => import("./views/Impressum"));
const Datenschutz = lazy(() => import("./views/Datenschutz"));
const CodeOfConduct = lazy(() => import("./views/CodeOfConduct"));
const CodeOfConductEn = lazy(() => import("./views/CodeOfConductEn"));
const Leitfaden = lazy(() => import("./views/Leitfaden"));
const Guide = lazy(() => import("./views/Guide"));
const NotFound = lazy(() => import("./views/NotFound"));
// Vorschau einer neuen Startseite, siehe pages/Lab.tsx.
const Lab = lazy(() => import("./views/Lab"));

/*
 * Die Pfade kommen aus dem Verzeichnis in i18n/routes.ts, nicht als Literale
 * hierher. Damit gibt es eine Stelle, an der steht, wie eine Seite in welcher
 * Sprache heißt – dieselbe, aus der der Sprachumschalter, die hreflang-Angaben
 * und der Sitemap-Test lesen.
 *
 * Lange Prosaseiten haben je Sprache eine eigene Komponente statt eines
 * gemeinsamen Gerüsts mit eingesetzten Textbausteinen: Wer so ein Dokument
 * übersetzt oder aktualisiert, arbeitet am ganzen Text und nicht an hundert
 * einzelnen Schnipseln.
 */
const App = () => (
  // reducedMotion="user": Wer Animationen systemweit abgeschaltet hat, sieht die
  // Sektionen sofort in ihrem Endzustand statt auf opacity:0 zu warten.
  <MotionConfig reducedMotion="user">
    <TooltipProvider>
      <BrowserRouter>
        <ScrollToHash />
        <KeepScrollOnLocaleChange />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path={pathFor("home", "de")} element={<Index />} />
            <Route path={pathFor("home", "en")} element={<Index />} />

            <Route path={pathFor("guide", "de")} element={<Leitfaden />} />
            <Route path={pathFor("guide", "en")} element={<Guide />} />

            <Route
              path={pathFor("codeOfConduct", "de")}
              element={<CodeOfConduct />}
            />
            <Route
              path={pathFor("codeOfConduct", "en")}
              element={<CodeOfConductEn />}
            />

            {/* Nur auf Deutsch: Impressum und Datenschutzerklärung haben
                rechtliche Wirkung, die deutsche Fassung ist die maßgebliche. */}
            <Route path={pathFor("imprint", "de")} element={<Impressum />} />
            <Route path={pathFor("privacy", "de")} element={<Datenschutz />} />

            {/* Vorschau, bewusst als Literal und nicht aus routes.ts: Dort
                landete sie in Sitemap, hreflang und Sprachumschalter. */}
            <Route path="/lab" element={<Lab />} />
            <Route path="/en/lab" element={<Lab />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </MotionConfig>
);

export default App;
