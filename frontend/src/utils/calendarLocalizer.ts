// utils/calendarLocalizer.ts
import { format, parse, startOfWeek, getDay } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";
import enUS from "date-fns/locale/en-US"; // Direct ES module import

const locales = {
  "en-US": enUS, // Use the imported locale directly
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default localizer;
