import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function toFixedIfNecessary(value, dp) {
  return +parseFloat(value).toFixed(dp);
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const cardStatusBorderTop = (status) => {
  switch (status) {
    case "healthy":
      return "border-card-top-border-orange";
    case "unhealthy":
      return "border-card-top-border-red";
    default:
      return "border-card-top-border-white";
  }
};
export const chipBackgroundColor = (color) => {
  switch (color) {
    case "red":
      return "bg-card-top-border-red";
    case "orange":
      return "bg-card-top-border-orange";
    case "green":
      return "bg-card-top-border-green";
    case "gray":
      return "bg-card-top-border-gray";
    default:
      return "border-card-top-border-green";
  }
};
