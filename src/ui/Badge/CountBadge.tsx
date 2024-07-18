import React, { useMemo } from "react";

type CountBadgeProps = {
  value?: number;
  size?: "xs" | "sm" | "md";
  title?: string;
  className?: string;
  colorClass?: string;
  roundedClass?: string;
};

export const CountBadge = React.memo(function ({
  value = 0,
  size = "sm",
  title,
  className,
  colorClass = "bg-blue-100 text-blue-800",
  roundedClass = "rounded"
}: CountBadgeProps) {
  const spanClassName = size === "sm" ? "text-sm px-1" : "text-xs px-1.5";
  const widthHeightClassName = useMemo(() => {
    const length = value.toString().length;
    if (length === 1) {
      return `w-5 h-5`;
    } else if (length === 2) {
      return `w-6 h-6`;
    } else if (length === 3) {
      return `w-7.5 h-8`;
    }
    return `w-fit h-5 rounded-sm`;
  }, [value]);

  return (
    <span
      className={`${widthHeightClassName} ${className} ${spanClassName} inline items-center justify-center py-0.5 ${roundedClass} font-medium ${colorClass}`}
      title={title}
    >
      {value}
    </span>
  );
});
