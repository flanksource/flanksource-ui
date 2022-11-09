import {
  dateDiff,
  formatISODate,
  dateToJSDate,
  isValidDate,
  subtractDateFromNow,
  formatTimeRange
} from "../../utils/date";
import { getLocalItem, setLocalItem } from "../../utils/storage";
import { RangeOption, rangeOptionsCategories } from "./rangeOptions";

export const isSupportedRelativeRange = (from: string, to: string): boolean => {
  for (let i = 0; i < rangeOptionsCategories.length; i++) {
    let options = rangeOptionsCategories[i].options;
    for (let j = 0; j < options.length; j++) {
      if (options[j].from === from && options[i].to === to) {
        return true;
      }
    }
  }
  return false;
};

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

export const createDisplayValue = (range: RangeOption) => {
  let label;
  rangeOptionsCategories.forEach((category) => {
    category.options.forEach((option) => {
      if (option.from === range.from && option.to === range.to) {
        label = option.display;
      }
    });
  });
  if (label) {
    return label;
  }
  if (range.from && range.to) {
    return `${formatTimeRange(range.from)} to ${formatTimeRange(range.to)}`;
  }
  return "";
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
