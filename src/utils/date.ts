import { ValueType } from "../context/TopologyPageContext";
import dayjs, { ConfigType } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isBetween);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

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

export function getTimeBucket(date: ConfigType) {
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
