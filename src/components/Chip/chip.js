import React from "react";
import clsx from "clsx";

const getBackgroundColorClass = (color) => {
  switch (color) {
    case "red":
      return "bg-light-red";
    case "orange":
      return "bg-light-orange";
    case "green":
      return "bg-light-green";
    case "gray":
      return "bg-light-gray";
    default:
      return "bg-light-green";
  }
};

export function Chip({ text, color }) {
  return (
    <div
      className={clsx(
        "text-center align-baseline min-w-8 min-h-8 text-2xs rounded-4px font-bold break-all",
        getBackgroundColorClass(color)
      )}
    >
      {text}
    </div>
  );
}
