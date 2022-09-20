import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// this is required to parse the date into UTC
// and adding local conversion to the dayjs object
dayjs.extend(utc);

export const relativeDateTime = (ts: string | Date) => {
  const t = dayjs.utc(ts).local();
  const n = dayjs();

  if (n.isSame(t, "day")) {
    return dayjs(ts).fromNow();
  }

  if (n.diff(t, "days") === 1) {
    return `${t.format("h:mm A")} yesterday`;
  }

  return t.format("h:mm A, dddd, MMMM D, YYYY");
};
