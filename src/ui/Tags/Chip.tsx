import clsx from "clsx";
import React from "react";
import { Tag } from "./Tag";

const getBackgroundColorClass = (color?: string) => {
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

type Props = {
  text?: React.ReactNode;
  color?: "red" | "orange" | "green" | "gray" | "yellow";
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function Chip({ text, color, children, className, ...props }: Props) {
  return (
    <Tag
      className={clsx(
        getBackgroundColorClass(color),
        "min-w-8 break-all rounded-4px text-center align-baseline text-2xsi font-semibold"
      )}
      {...props}
    >
      {text || children}
    </Tag>
  );
}
