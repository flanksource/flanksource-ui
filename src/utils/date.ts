import dayjs from "dayjs";

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

export const relativeDateTime = (ts: string | Date) => {
  const t = dayjs.utc(ts).local();
  const n = dayjs();

  if (n.isSame(t, "day")) {
    return t.fromNow();
  }

  if (n.diff(t, "days") === 1) {
    return `${t.format("h:mm A")} yesterday`;
  }

  return t.format("h:mm A, dddd, MMMM D, YYYY");
};
