import {
  dateDiff,
  dateToJSDate,
  formatISODate,
  isValidDate,
  subtractDateFromNow
} from "../../../utils/date";
import { getLocalItem, setLocalItem } from "../../../utils/storage";

export const getIntervalData = (interval: string): [number, string] => {
  if (interval === "now") {
    return [0, "h"];
  }
  const data = interval.replace("now-", "");
  const intervalName = data.slice(-1);
  const intervalTime = Number(data.slice(0, -1));
  return [intervalTime, intervalName];
};

export const createIntervalName = (interval: number, letter: string) => {
  const dictionary: { [key: string]: string } = {
    m: "minute",
    h: "hour",
    d: "day",
    w: "week",
    M: "month",
    y: "year"
  };

  return dictionary[letter]
    ? `${interval.toString()} ${dictionary[letter]}${interval > 1 ? "s" : ""}`
    : "invalid format";
};

export const convertRangeValue = (
  value: string,
  format = "jsDate"
): string | Date => {
  if (
    (typeof value === "string" &&
      isValidDate(value) &&
      !value.includes("now-")) ||
    (typeof value !== "string" && isValidDate(value))
  ) {
    return format === "jsDate"
      ? dateToJSDate(value)
      : format === "iso"
        ? formatISODate(value)
        : dateToJSDate(value);
  }
  if (format === "jsDate") {
    return dateToJSDate(subtractDateFromNow(...getIntervalData(value)));
  }
  if (format === "iso") {
    return formatISODate(subtractDateFromNow(...getIntervalData(value)));
  }
  return dateToJSDate(subtractDateFromNow(...getIntervalData(value)));
};

type DateOrString = Date | string;

export const areDatesSame = (...dates: DateOrString[]) =>
  dateDiff(dates[0], dates[1]) < 1500;

export const storage = {
  setItem: (name: string, item: any) => {
    if (item) {
      const jsonItem = JSON.stringify(item);
      setLocalItem(name, jsonItem);
    }
  },
  getItem: (name: string) => {
    const item = getLocalItem(name);
    if (item && item !== "undefined") {
      return JSON.parse(item);
    }
    return null;
  }
};
