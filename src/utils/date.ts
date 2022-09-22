import dayjs from "dayjs";

export enum DATE_FORMATS {
  TIME = "h:mm A",
  SHORT = "MMM DD",
  LONG = "h:mm A, MMM DD, YYYY",
  TIME_RANGE = "YYYY-MM-DD HH:mm"
}

type formatDateOptions = {
  suffix?: string;
  asTimestamp?: boolean;
  stringFormat?: DATE_FORMATS;
};

/**
 * Format date into local time and apply the string formatting if given
 * else the date object is parsed into local time
 *
 * @param date date which needs to be parsed or formatted
 * @param stringFormat string of tokens to format the date, check https://day.js.org/docs/en/display/format#docsNav
 * @returns string if stringFormat is passed else a date object
 */
export const formatDate = (
  date: string | Date,
  { asTimestamp, stringFormat, suffix }: formatDateOptions = {}
) => {
  const localDate = dayjs(date).local();
  if (asTimestamp) return localDate.valueOf().toString();
  const formattedDate = stringFormat
    ? localDate.format(stringFormat)
    : localDate;
  return suffix ? `${formattedDate}${suffix}` : formattedDate;
};

/**
 * Parse the given date relative to the user locale
 *
 * @param date
 * @param fromNow give relative date from now
 * @returns relative date as string
 */
export const relativeDateTime = (date: string | Date, fromNow = false) => {
  const t = dayjs.utc(date).local();
  const n = dayjs();

  if (n.isSame(t, "day") || fromNow) {
    return t.fromNow();
  }

  if (n.diff(t, "days") === 1) {
    return `${t.format(DATE_FORMATS.TIME)} yesterday`;
  }

  return t.format(DATE_FORMATS.LONG);
};
