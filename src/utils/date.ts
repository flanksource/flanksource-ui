import dayjs, { ConfigType as DateConfig, ManipulateType } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { ValueType } from "../context/TopologyPageContext";

dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "seconds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy"
  }
});

export function isDate(dateString?: ValueType) {
  if (
    !dateString ||
    dateString === null ||
    !["string", "object"].includes(typeof dateString)
  ) {
    return false;
  }

  return !isNaN(new Date(dateString).getDate());
}

export const TIME_BUCKETS = {
  TODAY: { name: "today", sortOrder: 0 },
  THIS_WEEK: { name: "this week", sortOrder: 1 },
  THIS_MONTH: { name: "this month", sortOrder: 2 },
  THIS_YEAR: { name: "this year", sortOrder: 3 },
  PREVIOUS_YEAR: { name: "previous year", sortOrder: 4 }
};

export function getTimeBucket(date: DateConfig) {
  if (!dayjs(date).isValid) {
    return "";
  }

  if (dayjs(date).isToday()) {
    return TIME_BUCKETS.TODAY.name;
  } else if (dayjs(date).isSameOrAfter(dayjs().startOf("week"))) {
    return TIME_BUCKETS.THIS_WEEK.name;
  } else if (dayjs(date).isSameOrAfter(dayjs().startOf("month"))) {
    return TIME_BUCKETS.THIS_MONTH.name;
  } else if (dayjs(date).isSameOrAfter(dayjs().startOf("year"))) {
    return TIME_BUCKETS.THIS_YEAR.name;
  } else {
    return TIME_BUCKETS.PREVIOUS_YEAR.name;
  }
}
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
 * @param date
 * @returns relative date as string
 */
export const relativeDateTime = (
  from: string | Date,
  to = dayjs().toISOString()
) => {
  const fromDate = dayjs.utc(from).local();
  const toDate = dayjs.utc(to).local();

  if (
    toDate.isSame(from, "day") &&
    toDate.isSame(from, "month") &&
    toDate.isSame(from, "year")
  ) {
    return fromDate.fromNow();
  }

  if (
    toDate.diff(fromDate, "days") === 1 &&
    toDate.isSame(from, "month") &&
    toDate.isSame(from, "year")
  ) {
    return `${fromDate.format(DATE_FORMATS.TIME)} yesterday`;
  }

  return fromDate.format(DATE_FORMATS.LONG);
};

/**
 *
 * @param value date to check
 * @returns boolean check if value is a valid date
 */
export const isValidDate = (value: DateConfig) => dayjs(value).isValid();

/**
 *
 * @param value date to convert
 * @returns string of ISO date
 */
export const dateToISOString = (value: DateConfig) =>
  dayjs(value).toISOString();

/**
 *
 * @param value date to convert
 * @returns Native date object
 */
export const dateToJSDate = (value: DateConfig) => dayjs(value).toDate();

/**
 *
 * @param value date to format
 * @param format custom string format for the date
 * @returns formatted string of the date
 */
export const customDateFormattor = (value: DateConfig, format: string) =>
  dayjs(value).format(format);

/**
 *
 * @param decValue Time in number needed to be decreased from now
 * @param decUnit Unit of time to be decreased. Must be of type ManipulateType from dayjs
 * @returns Day.js object with reduced time
 */
export const subtractDateFromNow = (decValue: number, decUnit: string) =>
  dayjs().subtract(decValue, decUnit as ManipulateType);

/**
 *
 * @param date1 First date
 * @param date2 Second Date
 * @param diffUnit To get the difference in another unit of measurement, pass that measurement as the second argument.
 * @param isDiffInFloat Boolean value to specify if difference is needed in decimals.
 * @returns Difference between the first and second date in milliseconds (or required units if diffUnit is specified)
 */
export const dateDiff = (
  date1: DateConfig,
  date2: DateConfig,
  diffUnit?: string,
  isDiffInFloat?: boolean
) => dayjs(date1).diff(dayjs(date2), diffUnit as ManipulateType, isDiffInFloat);
