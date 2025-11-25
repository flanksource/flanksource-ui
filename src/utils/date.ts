import dayjs, { ConfigType as DateConfig, ManipulateType } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import duration from "dayjs/plugin/duration";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

import { SortOrders } from "../constants";
import { ValueType } from "../api/types/common";

dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(duration);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%ds",
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

export function isEmpty(value: any): boolean {
  return (
    value === "" ||
    value == null ||
    dayjs(value).isSame(dayjs("0001-01-01T00:00:00+00:00"))
  );
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
const formatDate = (
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

export const formatLongDate = (date: string | Date) => {
  return formatDate(date, {
    stringFormat: DATE_FORMATS.LONG
  }).toString();
};

export const formatTimeRange = (date: string | Date) => {
  return formatDate(date, {
    stringFormat: DATE_FORMATS.TIME_RANGE
  });
};

export const age = (from: string | Date) => {
  if (
    from === "" ||
    from == null ||
    dayjs(from).isSame(dayjs("0001-01-01T00:00:00+00:00"))
  ) {
    return "";
  }
  return dayjs.utc(from).local().fromNow(true);
};

/**
 * Parse the given date relative to the user locale
 *
 * @param date
 * @param date
 * @returns relative date as string
 */
export const relativeDateTime = (from: string | Date, to?: string | Date) => {
  if (dayjs(from).isSame(dayjs("0001-01-01T00:00:00+00:00"))) {
    return "";
  }
  const fromDate = dayjs.utc(from).local();
  if (to) {
    const toDate = dayjs.utc(to).local();
    // if the difference is less than 1 second, return difference in
    // milliseconds. This is to avoid returning 0 seconds when DateTime.from
    // from dayjs.
    if (toDate.diff(fromDate) < 1000) {
      return `${toDate.diff(fromDate)}ms`;
    }
    return fromDate.from(toDate, true);
  }
  return fromDate.fromNow();
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
export const formatISODate = (value: DateConfig) => dayjs(value).toISOString();

/**
 *
 * @param value date to convert
 * @returns Native date object
 */
export const dateToJSDate = (value: DateConfig) => dayjs(value).toDate();

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
  diffUnit?: ManipulateType,
  isDiffInFloat?: boolean
) => dayjs(date1).diff(dayjs(date2), diffUnit, isDiffInFloat);

export const formatDateToMonthDayTime = (date: string | Date) => {
  return dayjs(date).format("MMM DD(HH:mm)");
};

export const formatDateToMonthDay = (date: string | Date) => {
  return dayjs(date).format("MMMM DD");
};

export const formatDateToYear = (date: string | Date) => {
  return dayjs(date).format("YYYY");
};

export const formatDateToTime = (date: string | Date) => {
  return dayjs(date).format("HH:mm");
};

export const dateSortHelper = (
  order: string,
  dateOne?: string | Date,
  dateTwo?: string | Date
) => {
  if (dateOne === undefined || dateTwo === undefined) return 0;
  const value1 = +new Date(dateOne);
  const value2 = +new Date(dateTwo);
  if (value1 > value2) {
    return SortOrders.asc === order ? 1 : -1;
  } else if (value1 < value2) {
    return SortOrders.asc === order ? -1 : 1;
  }
  return 0;
};

export function formatDuration(ms: number): string {
  ms = Math.abs(ms);
  const dur = dayjs.duration(ms, "milliseconds");
  const totalMs = dur.asMilliseconds();

  if (totalMs < 1000) {
    return `${Math.floor(totalMs)}ms`;
  }

  const totalSeconds = dur.asSeconds();
  if (totalSeconds < 60) {
    return `${Math.floor(totalSeconds)}s`;
  }

  const totalMinutes = dur.asMinutes();
  if (totalMinutes < 60) {
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.floor(dur.asSeconds() % 60);
    return seconds > 0 ? `${minutes}m${seconds}s` : `${minutes}m`;
  }

  const totalHours = dur.asHours();
  if (totalHours < 24) {
    return `${Math.floor(totalHours)}h`;
  }

  const totalDays = dur.asDays();

  // Less than 2 days: show compound format (e.g., "1d1h")
  if (totalDays < 2) {
    const days = Math.floor(totalDays);
    const hours = Math.floor(dur.asHours() % 24);
    return hours > 0 ? `${days}d${hours}h` : `${days}d`;
  }

  // Less than ~60 days: show decimal days (e.g., "2.1d") or whole days (e.g., "20d")
  if (totalDays < 60) {
    const rounded = Math.round(totalDays * 10) / 10;
    return rounded % 1 === 0
      ? `${Math.floor(rounded)}d`
      : `${rounded.toFixed(1)}d`;
  }

  // Months + days format (e.g., "3mo4d")
  const avgDaysPerMonth = 30.44;
  const months = Math.floor(totalDays / avgDaysPerMonth);
  const remainingDays = Math.round(totalDays - months * avgDaysPerMonth);
  return remainingDays > 0 ? `${months}mo${remainingDays}d` : `${months}mo`;
}
