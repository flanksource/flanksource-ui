import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function toFixedIfNecessary(value, dp) {
  return +parseFloat(value).toFixed(dp);
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const colorHandler = (type, color) => {
  switch (color) {
    case "red":
      return `${type}-card-top-border-red`;
    case "orange":
      return `${type}-card-top-border-orange`;
    case "green":
      return `${type}-card-top-border-green`;
    case "gray":
      return `${type}-card-top-border-gray`;
    default:
      return `${type}-card-top-border-white`;
  }
};
