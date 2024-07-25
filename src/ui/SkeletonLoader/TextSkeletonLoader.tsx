import clsx from "clsx";
import React from "react";

type TextSkeletonLoaderProps = React.HTMLProps<HTMLDivElement>;

export default function TextSkeletonLoader({
  className,
  ...props
}: TextSkeletonLoaderProps) {
  return (
    <div className="animate-pulse" {...props}>
      <div
        className={clsx(
          "h-8 rounded-md bg-gray-200",
          className ? className : "w-36"
        )}
      ></div>
    </div>
  );
}
