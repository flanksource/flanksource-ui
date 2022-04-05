export const getIntervalData = (interval) => {
  if (interval === "now" || !interval.includes("now-")) return [0, "h"];
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
