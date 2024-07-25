import clsx from "clsx";
import React from "react";

import { BallTriangle, Oval } from "react-loading-icons";

type Props = {
  text?: string;
  type?: "circle" | "modal";
} & React.HTMLAttributes<HTMLDivElement>;

export function Loading({
  text = "Loading...",
  type = "circle",
  className,
  ...props
}: Props) {
  if (type === "modal") {
    return (
      <div
        className={clsx("flex items-center justify-center", className)}
        {...props}
      >
        <BallTriangle stroke="zinc" opacity={0.8} fill="gray" height="4em" />
      </div>
    );
  } else {
    return (
      <div
        className={clsx("flex items-center justify-center", className)}
        {...props}
      >
        <Oval stroke="gray" height="1.5em" />
        <span className="ml-3 text-sm">{text}</span>
      </div>
    );
  }
}
