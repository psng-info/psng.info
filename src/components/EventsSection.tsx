import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import AddToCalendar from "@/components/AddToCalendar";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  LECTURE_SERIES,
  formatEventDate,
  formatEventDateShort,
  formatRelativeToToday,
  getEventAnchor,
  getEventById,
  getTimelineEntries,
  type EventColumn,
  type PartnerCredit,
  type PartnerTone,
  type PsngEvent,
  type PsngMilestone,
  type SeriesDate,
  type TimelineEntry,
} from "@/data/events";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { calendarEntry, seriesCalendarEntry } from "@/lib/eventCalendar";
import { WHATSAPP_LINK, INSTAGRAM_LINK } from "@/lib/links";
import { useCopy } from "@/i18n/copy";
import { useLocale } from "@/i18n/locale";
import { pick, type Localized } from "@/i18n/localized";

/**
 * Der Typ-Chip. Steht auf jeder Karte und benennt dieselbe Achse wie der
 * Filter darüber – nur im Singular, weil eine Karte genau ein Eintrag ist.
 * Wortstamm und Reihenfolge bleiben gleich, damit weiterhin erkennbar ist,
 * warum eine Karte aus einem Filter herausfällt.
 */
export function ColumnChip({ column }: { column: EventColumn }) {
  const c = useCopy();
  return (
    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
      {column === "vortraege" ? c.events.columnsSingular.talks : c.events.columnsSingular.community}
    </span>
  );
}

/**
 * Chip einer Partnerorganisation, in deren eigener Farbwelt. Verlinkt, wenn
 * die Organisation eine eigene Seite hat – so führt die Karte auch dorthin,
 * ohne dass der Fließtext einen weiteren Link tragen muss.
 */
/**
 * Weist die Sprache einer Veranstaltung aus, wenn sie nicht die der Seite ist.
 * Steht vor der Beschreibung, damit die Erklärung kommt, bevor jemand auf
 * einen Text in einer anderen Sprache stößt und ihn für ein Versehen hält.
 *
 * Zwei Bedingungen, und beide sind nötig: Ohne Angabe im Event erscheint gar
 * nichts – bei einem Konferenzbesuch wie der ICPR wäre jede Sprachangabe
 * erfunden. Und stimmt die Sprache mit der der Seite überein, sagt der Satz
 * ohnehin nichts aus.
 *
 * Die Formulierung richtet sich nach der Art: Ein Kick-off ist kein Vortrag,
 * und „der Vortrag ist auf Deutsch" wäre dort schlicht falsch.
 */
export function LanguageNote({ event }: { event: PsngEvent }) {
  const c = useCopy();
  const locale = useLocale();
  if (!event.language || event.language === locale) return null;

  const phrasing =
    event.category === "lecture" ? c.events.languageNote.talk : c.events.languageNote.event;

  return (
    <p className="text-sm text-muted-foreground">
      {phrasing.before}
      <span className="font-medium text-foreground">
        {phrasing.in}
        {c.events.languages[event.language]}
      </span>
      .
    </p>
  );
}

/**
 * Als Literale und nicht als `badge-${tone}` zusammengesetzt: Die Klassen
 * stehen in `@layer utilities`, und was Tailwind im Quelltext nicht
 * ausgeschrieben findet, wirft es beim Bauen weg.
 */
const partnerToneClass: Record<PartnerTone, string> = {
  bpsa: "badge-bpsa",
  parab: "badge-parab",
};

function PartnerBadge({
  short,
  name,
  url,
  tone,
}: {
  short: string;
  /** Ausgeschrieben für Screenreader – das Kürzel allein sagt dort nichts. */
  name: string;
  url?: string;
  tone: PartnerTone;
}) {
  const className = `inline-flex items-center gap-1 rounded-full ${partnerToneClass[tone]} px-2 py-1 text-xs font-heading font-medium`;

  if (!url) return <span className={className}>{short}</span>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className={`${className} hover:opacity-90 transition-opacity`}
    >
      {short}
      <ExternalLink size={12} aria-hidden="true" />
    </a>
  );
}

/** Der Chip zu einer Kooperationsleiste – dieselbe Organisation, kurz gefasst. */
export function CreditBadge({ credit }: { credit: PartnerCredit }) {
  return (
    <PartnerBadge
      short={credit.short}
      name={credit.name}
      url={credit.url}
      tone={credit.tone}
    />
  );
}


/**
 * `registrationUrl` führt nicht immer auf eine Luma-Seite – bei Miguels Lecture
 * etwa in die WhatsApp-Gruppe, weil es für den Abend nie eine Luma-Seite gab.
 * Der Hinweistext und der Rückblick-Link behaupteten das trotzdem und führten
 * dann auf etwas, das nichts mit Luma zu tun hat.
 */
/**
 * Die Kooperationsleiste am Kartenfuß: Logo, was die Organisation beigetragen
 * hat, und die Wege zu ihr. Trägt als einziger Teil der Karte die Farben der
 * Partnerorganisation (`surface-bpsa`) – damit hebt sich der fremde Beitrag
 * vom eigenen Inhalt ab, statt in einer flächigen Tönung mit ihm zu verschwimmen.
 */
function PartnerCreditStrip({ credit }: { credit: PartnerCredit }) {
  const c = useCopy();
  const locale = useLocale();
  return (
    <div className="surface-bpsa flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
      <img
        src={credit.logo}
        alt={`Logo ${credit.name}`}
        width={80}
        height={80}
        loading="lazy"
        decoding="async"
        className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
      />
      <div className="min-w-0 flex-1 basis-56">
        <p className="font-heading text-sm font-medium text-foreground">
          {c.events.inCooperationWith} {credit.name}
        </p>
        {credit.role ? (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {pick(credit.role, locale)}
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {credit.url ? (
            <a
              href={credit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              {credit.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} →
            </a>
          ) : null}
          {credit.instagramUrl ? (
            <a
              href={credit.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              {c.events.instagram}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Rückverweis auf den Abend, aus dem ein Vortrag stammt. Reiner Anker statt
 * Router-Link: Das Ziel steht auf derselben Seite und trägt die ID schon.
 */
/**
 * Was der Speaker zum Weiterlesen nennt – Paper, eine Datenbank, ein Projekt.
 * Klein gesetzt unter der Kurzvita: Wer sich vorher einlesen will, findet die
 * Titel verlinkt, statt sie abzutippen. Steht auf der Karte vorher wie im
 * Rückblick, denn nach dem Vortrag sucht man sie erst recht.
 */
function FurtherReading({ event }: { event: PsngEvent }) {
  const c = useCopy();
  const locale = useLocale();
  if (!event.furtherReading?.length) return null;

  return (
    <div>
      <p className="font-heading text-xs font-medium text-foreground">
        {c.events.furtherReading}
      </p>
      <ul className="mt-1.5 space-y-1.5">
        {event.furtherReading.map((entry) => (
          <li key={entry.url} className="text-xs leading-relaxed">
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
            >
              {pick(entry.text, locale)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PartOfLine({ event }: { event: PsngEvent }) {
  const c = useCopy();
  const locale = useLocale();
  const parent = event.partOfEventId ? getEventById(event.partOfEventId) : undefined;
  if (!parent) return null;

  return (
    <p className="text-sm text-muted-foreground">
      {c.events.partOf}{" "}
      <a
        href={`#${getEventAnchor(parent)}`}
        className="font-medium text-primary hover:underline"
      >
        {pick(parent.title, locale)}
      </a>
    </p>
  );
}

function isLumaLink(url?: string): boolean {
  return Boolean(url?.includes("luma.com"));
}

function EventCard({
  event,
  i,
  past = false,
}: {
  event: PsngEvent;
  i: number;
  /** Blendet Anmelde-CTA und Luma-Hinweis aus – nach dem Termin sind sie hinfällig. */
  past?: boolean;
}) {
  // Hat jemand keine eigene Website, ist das LinkedIn-Profil der nächstbeste
  // Beleg – in der Highlight-Karte steht es ohnehin schon als eigener Link.
  const speakerLink = event.speakerWebsiteUrl ?? event.assets?.speakerLinkedinUrl;
  const c = useCopy();
  const locale = useLocale();
  // Ein vergangener Termin gehört in keinen Kalender mehr – dieselbe
  // Überlegung wie beim Anmelde-Button darunter.
  const calendar = past ? undefined : calendarEntry(event, locale, c);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
    >
      {event.coverImage && (
        <div className="-mx-6 -mt-6 mb-5 aspect-[40/21] overflow-hidden rounded-t-2xl bg-muted">
          <img
            src={event.coverImage}
            alt={pick(event.coverAlt, locale) ?? pick(event.title, locale)}
            width={1200}
            height={630}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ColumnChip column={event.column} />
        {event.highlightBadge && (
          <span className="inline-block px-2 py-1 rounded-full gradient-psychedelic text-primary-foreground text-xs font-heading font-medium">
            {pick(event.highlightBadge, locale)}
          </span>
        )}
        {event.speakerType && (
          <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-heading font-medium">
            {event.speakerType === "student"
              ? c.events.speakerTypes.student
              : c.events.speakerTypes.guest}
          </span>
        )}
        {event.partnerCredit && <CreditBadge credit={event.partnerCredit} />}
      </div>
      <div>
        {event.assets?.speakerPhoto && (
          <img
            src={event.assets.speakerPhoto}
            alt={event.speaker ?? "Speaker"}
            width={105}
            height={105}
            loading="lazy"
            decoding="async"
            className="float-right ml-3 mb-1 h-[105px] w-[105px] rounded-2xl object-cover shadow-sm"
          />
        )}
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          {pick(event.title, locale)}
        </h3>
        {event.subtitle && (
          <p className="text-sm text-foreground/80 font-medium mb-2 leading-relaxed">
            {pick(event.subtitle, locale)}
          </p>
        )}
        {event.speaker && (
          <p className="text-sm text-primary font-medium mb-2">
            {speakerLink ? (
              <a
                href={speakerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {event.speaker}
              </a>
            ) : (
              event.speaker
            )}
          </p>
        )}
        {event.language && (
          <div className="mb-2">
            <LanguageNote event={event} />
          </div>
        )}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {pick(event.description, locale) ?? c.events.detailsSoon}
        </p>
        {event.speakerBio && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {pick(event.speakerBio, locale)}
          </p>
        )}
        <div className="mb-4">
          <FurtherReading event={event} />
        </div>
        {event.audienceNote && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {pick(event.audienceNote, locale)}
          </p>
        )}
        <div className="mb-4">
          <PartOfLine event={event} />
        </div>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">{c.events.dateLabel}</span>{" "}
          {formatEventDate(event.date, locale, event.showWeekday)}
          {event.endDate ? ` – ${formatEventDate(event.endDate, locale)}` : null},{" "}
          {pick(event.time, locale)}
        </p>
        {event.location ? (
          <p>
            <span className="font-medium text-foreground">{c.events.locationLabel}</span>{" "}
            {pick(event.location, locale)}
          </p>
        ) : null}
        {event.contribution ? (
          <p>
            <span className="font-medium text-foreground">
              {c.events.contributionLabel}
            </span>{" "}
            {pick(event.contribution, locale)}
          </p>
        ) : null}
      </div>
      {event.disclaimer && (
        <p className="text-xs text-muted-foreground italic mt-3">
          {pick(event.disclaimer, locale)}
        </p>
      )}
      {!past && isLumaLink(event.registrationUrl) && (
        <p className="text-xs text-muted-foreground mt-3">
          {c.events.lumaHint}
        </p>
      )}
      {!past && (event.registrationUrl || calendar || event.websiteUrl) && (
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg gradient-psychedelic px-4 py-2 text-sm font-heading font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {pick(event.registrationLabel, locale) ?? c.events.register}
            </a>
          )}
          {calendar && <AddToCalendar event={calendar} />}
          {event.websiteUrl && (
            <a
              href={event.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              {pick(event.websiteLabel, locale) ?? c.events.learnMore} →
            </a>
          )}
        </div>
      )}
      {past && isLumaLink(event.registrationUrl) && (
        <div className="mt-4">
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            {c.events.lumaLink}
          </a>
        </div>
      )}
      {/* Zuletzt und bewusst: Die Karte trägt rundum Innenabstand, die Leiste
          zieht sich mit negativen Rändern wieder an die Kanten. Steht noch
          etwas darunter, zieht der negative Rand es in die Leiste hinein –
          deshalb kommen Hinweise und Buttons davor. */}
      {event.partnerCredit && (
        <div className="-mx-6 -mb-6 mt-5 overflow-hidden rounded-b-2xl">
          <PartnerCreditStrip credit={event.partnerCredit} />
        </div>
      )}
    </motion.div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function HighlightCard({ ev }: { ev: PsngEvent }) {
  const [playing, setPlaying] = useState(false);
  const c = useCopy();
  const locale = useLocale();
  const a = ev.assets ?? {};
  // Nur lokale Vorschaubilder – fehlt eins, zeigen wir lieber gar keins, als
  // beim Seitenaufruf eine Anfrage an Google auszulösen.
  const thumb = a.youtubeThumbnail ?? null;
  const embed = a.youtubeUrl ? getYouTubeEmbedUrl(a.youtubeUrl) : null;
  const heroPhoto = a.photos?.[0];
  // Mit Video oben bekommen die Fotos eine eigene Spalte neben dem Text,
  // statt dass das erste davon ungesehen hinter dem Video verschwindet.
  const sidePhotos = a.youtubeUrl && a.photos?.length ? a.photos : null;

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card hover:shadow-lg transition-shadow">
      {a.youtubeUrl ? (
        <div className="relative aspect-video w-full bg-muted">
          {playing && embed ? (
            <iframe
              src={embed}
              title={pick(ev.title, locale)}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 flex items-center justify-center"
              aria-label={`${c.events.playRecording} ${pick(ev.title, locale)}`}
            >
              {thumb && (
                <img
                  src={thumb}
                  alt=""
                  width={960}
                  height={540}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/40" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition-transform group-hover:scale-110">
                <PlayIcon />
              </span>
            </button>
          )}
        </div>
      ) : a.photos && a.photos.length > 1 ? (
        <HeroPhotoCarousel photos={a.photos} alts={a.photoAlts} title={pick(ev.title, locale)} />
      ) : heroPhoto ? (
        <div className="relative aspect-video w-full bg-muted">
          <img
            src={heroPhoto}
            alt={pick(ev.title, locale)}
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className={sidePhotos ? "grid gap-5 p-5 md:grid-cols-2 md:gap-6" : "p-5"}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <ColumnChip column={ev.column} />
            {ev.speakerType && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {ev.speakerType === "student"
                  ? c.events.speakerTypes.student
                  : c.events.speakerTypes.guest}
              </span>
            )}
            {ev.partnerCredit && <CreditBadge credit={ev.partnerCredit} />}
            {ev.featured && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                {c.events.firstEvent}
              </span>
            )}
            <span>{formatEventDate(ev.date, locale)}</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-snug">
              {pick(ev.title, locale)}
            </h3>
            {ev.subtitle ? (
              <p className="text-sm font-medium leading-relaxed text-foreground/80">
                {pick(ev.subtitle, locale)}
              </p>
            ) : null}
            {/* Speaker und Ort nebeneinander statt entweder/oder: Sonst fällt bei
                jedem Vortrag der Ort weg, weil ein Speaker davorsteht – und im
                Rückblick ist gerade er die Angabe, die sonst nirgends mehr steht. */}
            {ev.speaker ? (
              <p className="text-sm text-muted-foreground">
                {c.events.with} {ev.speaker}
              </p>
            ) : null}
            {ev.location ? (
              <p className="text-sm text-muted-foreground">
                {pick(ev.location, locale)}
              </p>
            ) : null}
            <PartOfLine event={ev} />
            <LanguageNote event={ev} />
          </div>
          {ev.description ? (
            <p className="text-sm text-muted-foreground">
              {pick(ev.description, locale)}
            </p>
          ) : null}
          {/* Die Kurzvita gehört auch in den Rückblick: Wer den Vortrag Monate
              später findet, kennt den Namen darüber in der Regel nicht. */}
          {ev.speakerBio ? (
            <p className="text-sm text-muted-foreground">
              {pick(ev.speakerBio, locale)}
            </p>
          ) : null}
          <FurtherReading event={ev} />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm">
            {a.attendees ? (
              <span className="text-muted-foreground">
                {a.attendeesOnline
                  ? `${a.attendees} ${c.events.attendees} – ${a.attendeesOnline} ${c.events.online}, ${a.attendees - a.attendeesOnline} ${c.events.inPerson}`
                  : `${a.attendees}+ ${c.events.attendeesPlus}`}
              </span>
            ) : null}
            {a.slidesUrl ? (
              <a
                href={a.slidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {c.events.slides}
              </a>
            ) : null}
            {a.recapUrl ? (
              <a
                href={a.recapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {c.events.recap}
              </a>
            ) : null}
            {a.speakerLinkedinUrl ? (
              <a
                href={a.speakerLinkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {ev.speaker
                  ? `${c.events.linkedinOf} ${ev.speaker}`
                  : c.events.linkedin}{" "}
                →
              </a>
            ) : null}
            {a.externalUrl ? (
              <a
                href={a.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {pick(a.externalLabel, locale) ?? c.events.learnMore} →
              </a>
            ) : null}
          </div>

          {ev.disclaimer ? (
            <p className="text-xs italic text-muted-foreground">
              {pick(ev.disclaimer, locale)}
            </p>
          ) : null}
        </div>
        {sidePhotos ? (
          <SidePhotoCarousel
            photos={sidePhotos}
            alts={a.photoAlts}
            title={pick(ev.title, locale)}
          />
        ) : null}
      </div>

      {/* Außerhalb des Textblocks, damit die Leiste die Karte in ganzer Breite
          abschließt statt im Innenabstand zu schweben. */}
      {ev.partnerCredit ? <PartnerCreditStrip credit={ev.partnerCredit} /> : null}
    </div>
  );
}

/**
 * Mehrere Fotos oben auf einer Rückblick-Karte ohne Video, etwa die beiden
 * Gruppenbilder einer Konferenz. Randlos in derselben 16:9-Kachel wie das
 * Einzelfoto; die Quellen sind schon auf 16:9 zugeschnitten.
 */
function HeroPhotoCarousel({
  photos,
  alts,
  title,
}: {
  photos: string[];
  alts?: Localized[];
  title: string;
}) {
  const c = useCopy();
  const locale = useLocale();
  return (
    <Carousel opts={{ loop: true }} className="w-full">
      <CarouselContent className="ml-0">
        {photos.map((src, i) => (
          <CarouselItem key={src} className="pl-0">
            <div className="relative aspect-video w-full bg-muted">
              <img
                src={src}
                alt={
                  pick(alts?.[i], locale) ??
                  `${title} – ${c.events.photoFallback} ${i + 1}`
                }
                width={1200}
                height={675}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}

function GatheringPhotoCarousel({
  photos,
  alts,
  title,
}: {
  photos: string[];
  alts?: Localized[];
  title: string;
}) {
  const c = useCopy();
  const locale = useLocale();
  return (
    <Carousel opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {photos.map((src, i) => (
          <CarouselItem key={src}>
            {/* object-contain statt object-cover: Quellfotos haben unterschiedliche
                Seitenverhältnisse, ein hartes Cover-Crop hätte sonst regelmäßig Köpfe
                abgeschnitten. Überschüssiger Raum wird gelettert, nicht zugeschnitten. */}
            <div className="flex h-72 w-full items-center justify-center overflow-hidden rounded-lg bg-muted sm:h-96 md:h-[28rem]">
              <img
                src={src}
                alt={
                  pick(alts?.[i], locale) ??
                  `${title} – ${c.events.photoFallback} ${i + 1}`
                }
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}

/**
 * Die Fotos einer Lecture in der Spalte neben dem Text. Anders als beim
 * Gathering-Karussell ein festes 3:2 mit Beschnitt: Die Spalte ist schmal,
 * und gelettert blieben von einem 16:9-Still dort nur Streifen übrig. Kamera-
 * fotos sind ohnehin 3:2, bei den Stills fällt an den Rändern wenig weg.
 */
function SidePhotoCarousel({
  photos,
  alts,
  title,
}: {
  photos: string[];
  alts?: Localized[];
  title: string;
}) {
  const c = useCopy();
  const locale = useLocale();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => {
      api.off("select", update);
    };
  }, [api]);

  return (
    <div className="space-y-2 md:self-start">
      <Carousel opts={{ loop: true }} setApi={setApi} className="w-full">
        <CarouselContent>
          {photos.map((src, i) => (
            <CarouselItem key={src}>
              <div className="aspect-[3/2] w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={src}
                  alt={
                    pick(alts?.[i], locale) ??
                    `${title} – ${c.events.photoFallback} ${i + 1}`
                  }
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      <p className="text-center text-xs tabular-nums text-muted-foreground" aria-live="polite">
        {current + 1} / {photos.length}
      </p>
    </div>
  );
}

function GatheringAftermovie({ ev }: { ev: PsngEvent }) {
  const [playing, setPlaying] = useState(false);
  const c = useCopy();
  const locale = useLocale();
  const a = ev.assets ?? {};
  if (!a.youtubeUrl) return null;
  const embed = getYouTubeEmbedUrl(a.youtubeUrl);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
      {playing && embed ? (
        <iframe
          src={embed}
          title={`${c.events.shortTitle}: ${pick(ev.title, locale)}`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={`${c.events.playAftermovie} ${pick(ev.title, locale)}`}
        >
          {a.youtubeThumbnail && (
            <img
              src={a.youtubeThumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/40" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition-transform group-hover:scale-110">
            <PlayIcon />
          </span>
        </button>
      )}
    </div>
  );
}

function GatheringShort({
  url,
  title,
  thumbnail,
}: {
  url: string;
  title: string;
  /** Lokales Standbild – wie beim Aftermovie, siehe EventAssets.shortsThumbnail. */
  thumbnail?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const embed = getYouTubeEmbedUrl(url);

  return (
    <div className="border-t border-border/60 pt-5">
      {/* Zentriert wie das Video darunter, das mit max-w-[18rem] mittig in der Spalte sitzt. */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold">Mini-Aftermovie</h3>
      </div>
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[18rem] overflow-hidden rounded-lg bg-muted">
        {playing && embed ? (
          <iframe
            src={embed}
            title={`Mini-Aftermovie: ${title}`}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex items-center justify-center"
            aria-label={`Mini-Aftermovie abspielen: ${title}`}
          >
            {thumbnail && (
              <img
                src={thumbnail}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <span className="absolute inset-0 bg-foreground/10 transition-colors group-hover:bg-black/40" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition-transform group-hover:scale-110">
              <PlayIcon />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/** Große Feature-Karte für ein einzelnes, besonders großes vergangenes Event (Aftermovie + Foto-Karussell). */
function GatheringFeatureCard({ ev }: { ev: PsngEvent }) {
  const c = useCopy();
  const locale = useLocale();
  const a = ev.assets ?? {};
  const title = pick(ev.title, locale);

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card hover:shadow-lg transition-shadow">
      <div className="grid items-start gap-6 p-5 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <ColumnChip column={ev.column} />
            {ev.highlightBadge && (
              <span className="rounded-full gradient-psychedelic px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                {pick(ev.highlightBadge, locale)}
              </span>
            )}
            {ev.partnerCredit && <CreditBadge credit={ev.partnerCredit} />}
            <span>{formatEventDate(ev.date, locale)}</span>
          </div>

          <h3 className="text-xl font-semibold leading-snug">{title}</h3>
          {ev.location ? (
            <p className="text-sm text-muted-foreground">
              {pick(ev.location, locale)}
            </p>
          ) : null}
          {ev.description ? (
            <p className="text-sm text-muted-foreground">
              {pick(ev.description, locale)}
            </p>
          ) : null}
          {(a.attendees || a.rating || a.recommendPercent) && (
            <p className="text-sm text-muted-foreground">
              {[
                a.attendees ? `${a.attendees} ${c.events.attendees}` : null,
                a.rating ? `${a.rating} ${c.events.rating}` : null,
                a.recommendPercent
                  ? `${a.recommendPercent}% ${c.events.recommend}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        {a.shortsUrl ? (
          <GatheringShort url={a.shortsUrl} title={title} thumbnail={a.shortsThumbnail} />
        ) : null}
      </div>

      <div className="flex flex-col gap-4 p-5">
        {a.youtubeUrl ? <GatheringAftermovie ev={ev} /> : null}
        {a.photos?.length ? (
          <GatheringPhotoCarousel photos={a.photos} alts={a.photoAlts} title={title} />
        ) : null}
        {isLumaLink(ev.registrationUrl) && (
          <a
            href={ev.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            {c.events.lumaLink}
          </a>
        )}
      </div>

      {ev.partnerCredit ? <PartnerCreditStrip credit={ev.partnerCredit} /> : null}
    </div>
  );
}

// ── Zeitstrahl ──────────────────────────────────────────────────────────────

/**
 * Die Spalten des Zeitstrahls: Datum (erst ab md), Schiene mit Punkt, Karte.
 * Als Konstante, weil jede Zeile und der Heute-Marker exakt dieselbe Aufteilung
 * brauchen – laufen sie auseinander, sitzen die Punkte nicht mehr auf der Linie.
 */
const ROW_GRID =
  "grid grid-cols-[1.5rem_minmax(0,1fr)] md:grid-cols-[6.5rem_1.5rem_minmax(0,1fr)]";
/** Mitte der Punkte-Spalte – dort verläuft die Linie. */
const RAIL_X = "left-[0.75rem] md:left-[7.25rem]";

/**
 * Ein Termin der Lecture-Reihe, für den noch kein Thema feststeht. Bewusst
 * schmal und gestrichelt: Die Aussage ist der Takt, nicht der Inhalt.
 */
function SeriesRow({ series }: { series: SeriesDate }) {
  const c = useCopy();
  const locale = useLocale();
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <ColumnChip column={series.column} />
        <span className="text-xs text-muted-foreground md:hidden">
          {formatEventDate(series.date, locale)} ·{" "}
          {formatRelativeToToday(series.date, locale)}
        </span>
      </div>
      <p className="font-heading text-base font-semibold text-foreground">
        {series.labelKey === "semesterStart"
          ? c.events.seriesSemesterLabel
          : c.events.seriesLabel}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {series.time} · {series.location} – {c.events.seriesNote}
      </p>
      {/* Der Termin steht, das Thema noch nicht – wer ihn sich jetzt schon
          freihält, erfährt den Rest rechtzeitig. */}
      <div className="mt-3">
        <AddToCalendar event={seriesCalendarEntry(series, locale, c)} subtle />
      </div>
    </div>
  );
}

/**
 * Verlinkt die Nennung der Partnerorganisation im Fließtext. Der Name steht
 * dort ohnehin, und aus dem Satz heraus verlinkt führt er weiter, ohne dass
 * die Karte dafür eine zusätzliche Linkzeile braucht. Die URL kommt aus
 * demselben Objekt wie der Chip – sie steht nicht zweimal in den Daten.
 */
function PartnerLinkedText({
  text,
  partner,
}: {
  text: string;
  partner: { short: string; url: string };
}) {
  const parts = text.split(partner.short);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              {partner.short}
            </a>
          )}
          {part}
        </Fragment>
      ))}
    </>
  );
}

/** Meilenstein: kein Termin, sondern etwas, das seitdem da ist. */
function MilestoneCard({ milestone }: { milestone: PsngMilestone }) {
  const locale = useLocale();
  return (
    <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ColumnChip column={milestone.column} />
        {milestone.badge && (
          <span className="rounded-full gradient-psychedelic px-2.5 py-0.5 text-xs font-heading font-medium text-primary-foreground">
            {pick(milestone.badge, locale)}
          </span>
        )}
        {milestone.partner && (
          <PartnerBadge
            short={milestone.partner.short}
            name={milestone.partner.name}
            url={milestone.partner.url}
            tone={milestone.partner.tone}
          />
        )}
        <span className="text-xs text-muted-foreground md:hidden">
          {formatEventDate(milestone.date, locale)}
        </span>
      </div>
      {milestone.image && (
        <div className="mb-4 overflow-hidden rounded-lg border border-border/60 bg-muted">
          <img
            src={milestone.image}
            alt=""
            width={960}
            height={540}
            loading="lazy"
            decoding="async"
            className="aspect-video w-full object-cover"
          />
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
        {pick(milestone.title, locale)}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {milestone.partner ? (
          <PartnerLinkedText
            text={pick(milestone.description, locale)}
            partner={milestone.partner}
          />
        ) : (
          pick(milestone.description, locale)
        )}
      </p>
      {milestone.links?.length ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
          {milestone.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              {pick(link.label, locale)} →
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EntryCard({ entry, i }: { entry: TimelineEntry; i: number }) {
  if (entry.kind === "series") return <SeriesRow series={entry.series} />;
  if (entry.kind === "milestone") return <MilestoneCard milestone={entry.milestone} />;
  if (entry.variant === "feature") return <GatheringFeatureCard ev={entry.event} />;
  if (entry.variant === "highlight") return <HighlightCard ev={entry.event} />;
  return <EventCard event={entry.event} i={i} past={entry.date < todayIso()} />;
}

/** Nur für die Frage „Anmelde-Button noch anzeigen?" – auf den Tag genau. */
function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function TimelineRow({
  entry,
  i,
  upcoming,
  isNext,
}: {
  entry: TimelineEntry;
  i: number;
  upcoming: boolean;
  /** Der nächste anstehende Termin – der einzige Eintrag mit vollem Akzent. */
  isNext: boolean;
}) {
  const locale = useLocale();
  const dot = upcoming
    ? isNext
      ? "border-2 border-primary bg-background ring-4 ring-primary/10"
      : "border-2 border-primary/35 bg-background"
    : "bg-primary/30";

  return (
    <motion.li
      id={entry.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`${ROW_GRID} scroll-mt-36`}
    >
      <div className="hidden pr-4 pt-1 text-right md:block">
        <p className="font-heading text-sm font-medium text-foreground">
          {formatEventDateShort(entry.date, locale)}
        </p>
        {upcoming && (
          <p className="text-xs text-muted-foreground">
            {formatRelativeToToday(entry.date, locale)}
          </p>
        )}
      </div>
      <div className="flex justify-center pt-2">
        <span className={`h-3 w-3 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      </div>
      <div className={`min-w-0 pb-8 pl-3 md:pl-4 ${isNext ? "next-event-glow" : ""}`}>
        <EntryCard entry={entry} i={i} />
      </div>
    </motion.li>
  );
}

function TimelineList({
  entries,
  upcoming,
  nextId,
}: {
  entries: TimelineEntry[];
  upcoming: boolean;
  nextId?: string;
}) {
  if (entries.length === 0) return null;
  return (
    <ol className="relative">
      {/* Die Schiene. Nach oben ausgeblendet, wo die Termine noch weit weg sind –
          die Karten selbst bleiben unangetastet, verblasste Inhalte sähen nach
          Rendering-Fehler aus statt nach zeitlichem Abstand. */}
      <span
        aria-hidden="true"
        className={`absolute bottom-2 top-2 w-px ${RAIL_X} ${
          upcoming ? "bg-gradient-to-b from-transparent to-border" : "bg-border"
        }`}
      />
      {entries.map((entry, i) => (
        <TimelineRow
          key={entry.id}
          entry={entry}
          i={i}
          upcoming={upcoming}
          isNext={entry.id === nextId}
        />
      ))}
    </ol>
  );
}

function TodayMarker() {
  const c = useCopy();
  return (
    <div className={`${ROW_GRID} my-1 items-center`}>
      <p className="hidden pr-4 text-right font-heading text-xs uppercase tracking-[0.2em] text-primary/70 md:block">
        {c.events.today}
      </p>
      <div className="flex items-center justify-center">
        <span aria-hidden="true" className="h-px w-full bg-primary/30" />
      </div>
      <p className="pl-3 font-heading text-xs uppercase tracking-[0.2em] text-primary/70 md:hidden">
        {c.events.today}
      </p>
    </div>
  );
}

// ── Filter ──────────────────────────────────────────────────────────────────

const filters = ["alle", "vortraege", "community"] as const;
type Filter = (typeof filters)[number];

/** Ab wie vielen vergangenen Einträgen der Rest hinter „Mehr anzeigen" liegt. */
const PAST_PAGE_SIZE = 8;

const EventsSection = () => {
  // Der Filter liegt in der URL, damit man auf eine gefilterte Ansicht
  // verlinken kann und der Zurück-Button den Wechsel rückgängig macht.
  const c = useCopy();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const param = searchParams.get("events");
  const filter: Filter = (filters as readonly string[]).includes(param ?? "")
    ? (param as Filter)
    : "alle";

  // Ein Deep-Link auf ein einzelnes Event muss auch dann greifen, wenn der
  // Eintrag erst hinter „Mehr anzeigen" liegt.
  const [showAll, setShowAll] = useState(() => location.hash.startsWith("#event-"));

  const { upcoming, past } = getTimelineEntries();
  const matches = (entry: TimelineEntry) => filter === "alle" || entry.column === filter;
  const upcomingShown = upcoming.filter(matches);
  const pastMatching = past.filter(matches);
  const pastShown = showAll ? pastMatching : pastMatching.slice(0, PAST_PAGE_SIZE);

  // Die kommenden Einträge laufen von fern nach nah auf heute zu – der nächste
  // Termin steht also ganz unten.
  const nextId = upcomingShown.at(-1)?.id;
  const filterLabels: Record<Filter, string> = {
    alle: c.events.filters.all,
    vortraege: c.events.filters.talks,
    community: c.events.filters.community,
  };

  const selectFilter = (next: Filter) => {
    const params = new URLSearchParams(searchParams);
    // "Alle" ist der Standard und braucht keinen Parameter.
    if (next === "alle") params.delete("events");
    else params.set("events", next);
    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : "",
        hash: location.hash,
      },
      { replace: false, preventScrollReset: true },
    );
  };

  return (
    <section id="events" className="py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow={c.events.eyebrow}
          title={c.events.title}
          intro={
            <>
              {c.events.introBefore}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                WhatsApp
              </a>
              {c.events.introMiddle}
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                Instagram
              </a>
              {c.events.introAfter}
            </>
          }
        />

        <p className="mx-auto mb-8 max-w-3xl text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {c.events.seriesNoteBefore}
          </span>{" "}
          {c.events.seriesNoteEvery} {LECTURE_SERIES.time} {c.events.seriesNoteClock}{" "}
          {c.events.seriesNoteOn} {LECTURE_SERIES.location}.{" "}
          {c.events.seriesNoteAfter}
        </p>

        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-full bg-muted p-1">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => selectFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-full px-5 py-2 font-heading text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Schmaler als die Sektion: Die Schiene braucht links Platz, und die
            Karten bleiben lesbar. Breiter wird vor allem die große Gathering-
            Karte mit Karussell besser – das ist der Kompromiss. */}
        <div className="mx-auto max-w-5xl">
          <TimelineList entries={upcomingShown} upcoming nextId={nextId} />
          {/* Der Marker trennt zwei Hälften. Ist die obere leergefiltert, wäre
              er nur noch eine Linie mit der Aussage „darüber kommt nichts". */}
          {upcomingShown.length > 0 && <TodayMarker />}
          <TimelineList entries={pastShown} upcoming={false} />

          {pastShown.length < pastMatching.length && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {c.events.showMore} ({pastMatching.length - pastShown.length})
              </button>
            </div>
          )}
        </div>

        <div className="mt-14 rounded-2xl border border-border/60 bg-muted/40 p-8 text-center">
          <h3 className="text-xl font-semibold">{c.events.ownLectureTitle}</h3>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            {c.events.ownLectureText}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/?subject=vortrag#kontakt"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {c.events.proposeTalk}
            </Link>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {c.events.askInWhatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
