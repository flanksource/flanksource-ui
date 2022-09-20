import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// this is required to parse the date into UTC
// and adding local conversion to the dayjs object
dayjs.extend(utc);

/**
 * Format date into local time and apply the string formatting if given
 * else the date object is parsed into local time
 *
 * @param date date which needs to be parsed or formatted
 * @param stringFormat string of tokens to format the date, check https://day.js.org/docs/en/display/format#docsNav
 * @returns string if stringFormat is passed else a date object
 */
export const formatDate = (date: string | Date, stringFormat?: string) => {
  const localDate = dayjs(date).local();
  return stringFormat ? localDate.format(stringFormat) : localDate;
};
