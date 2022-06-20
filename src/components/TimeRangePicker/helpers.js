import dayjs from "dayjs";
import { getLocalItem, setLocalItem } from "../../utils/storage";
import { displayTimeFormat } from "./rangeOptions";

const rangeRegexp = /^now-\d{1,4}[mhdwMy]$/;

export const getIntervalData = (interval) => {
  if (interval === "now") return [0, "h"];
  if (typeof interval !== "string" || !rangeRegexp.test(interval))
    return "invalid interval";
  const data = interval.replace("now-", "");
  const intervalName = data.slice(-1);
  const intervalTime = Number(data.slice(0, -1));
  return [intervalTime, intervalName];
};

export const createIntervalName = (interval, letter) => {
  const dictionary = {
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

export const convertRangeValue = (value, format = "jsDate") => {
  if (
    (typeof value === "string" &&
      dayjs(value).isValid() &&
      !value.includes("now-")) ||
    (typeof value !== "string" && dayjs(value).isValid())
  ) {
    return format === "jsDate"
      ? dayjs(value).toDate()
      : format === "iso"
      ? dayjs(value).toISOString()
      : dayjs(value).format(format);
  }
  if (format === "jsDate") {
    return dayjs()
      .subtract(...getIntervalData(value))
      .toDate();
  }
  if (format === "iso") {
    return dayjs()
      .subtract(...getIntervalData(value))
      .toISOString();
  }
  if (format === "default") {
    return dayjs().subtract(...getIntervalData(value));
  }
  return dayjs()
    .subtract(...getIntervalData(value))
    .format(format);
};

export const createValueForInput = (value) =>
  dayjs(value).isValid() ? dayjs(value).format(displayTimeFormat) : value;

export const createDisplayValue = (range) => {
  if (
    typeof range.from === "string" &&
    range.from.includes("now") &&
    typeof range.to === "string" &&
    range.to === "now"
  ) {
    return createIntervalName(...getIntervalData(range.from));
  }
  if (dayjs(range.from).isValid() && range.to === "now") {
    return `${dayjs(range.from).format(displayTimeFormat)} to now`;
  }
  if (dayjs(range.from).isValid() && dayjs(range.to).isValid()) {
    return `${dayjs(range.from).format(displayTimeFormat)} to ${dayjs(
      range.to
    ).format(displayTimeFormat)}`;
  }
  if (
    typeof range.from === "string" &&
    range.from.includes("now") &&
    typeof range.to === "string" &&
    range.to.includes("now")
  ) {
    return `${convertRangeValue(
      range.from,
      displayTimeFormat
    )} to ${convertRangeValue(range.to, displayTimeFormat)}`;
  }
  return "invalid date";
};

export const areDatesSame = (...dates) => {
  const date1 = dayjs(dates[0]);
  const date2 = dayjs(dates[1]);
  return date1.diff(date2) < 1500;
};

export const storage = {
  setItem: (name, item) => {
    if (item) {
      const jsonItem = JSON.stringify(item);
      setLocalItem(name, jsonItem);
    }
  },

  getItem: (name) => {
    const item = getLocalItem(name);
    if (item && item !== "undefined") {
      return JSON.parse(item);
    }
    return null;
  }
};
