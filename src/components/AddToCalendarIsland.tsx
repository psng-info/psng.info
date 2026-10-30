import { withLocale } from "@/i18n/locale";
import AddToCalendar from "./AddToCalendar";

/** AddToCalendar als Insel: bekommt die Sprache als Prop statt aus dem Router. */
export default withLocale(AddToCalendar);
