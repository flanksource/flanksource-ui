import React from "react";
import clsx from "clsx";
import { Tag } from "../Tag/Tag";

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
  color?: "red" | "orange" | "green" | "gray";
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function Chip({ text, color, children, ...props }: Props) {
  return (
    <Tag className={clsx(getBackgroundColorClass(color))} {...props}>
      {text || children}
    </Tag>
  );
}
