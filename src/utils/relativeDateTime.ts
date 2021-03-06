import dayjs from "dayjs";

export const relativeDateTime = (ts) => {
  const t = dayjs(ts);
  const n = dayjs();

  if (n.isSame(t, "day")) {
    return dayjs(ts).fromNow();
  }

  if (n.diff(t, "days") === 1) {
    return `${t.format("h:mm A")} yesterday`;
  }

  return t.format("h:mm A, dddd, MMMM D, YYYY");
};
