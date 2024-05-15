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
        className={clsx("flex justify-center items-center", className)}
        {...props}
      >
        <BallTriangle stroke="zinc" opacity={0.8} fill="gray" height="4em" />
      </div>
    );
  } else {
    return (
      <div
        className={clsx("flex justify-center items-center", className)}
        {...props}
      >
        <Oval stroke="gray" height="1.5em" />
        <span className="text-sm ml-3">{text}</span>
      </div>
    );
  }
}
