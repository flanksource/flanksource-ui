import React from "react";

type BadgeProps = {
  text: React.ReactNode;
  value?: string;
  size?: "xs" | "sm" | "md";
  dot?: string;
  title?: string;
  className?: string;
  colorClass?: string;
  roundedClass?: string;
};

export const Badge = React.memo(function ({
  text,
  value,
  size = "sm",
  dot,
  title,
  className,
  colorClass = "bg-blue-100 text-blue-800",
  roundedClass = "rounded"
}: BadgeProps) {
  if (text == null || text === "") {
    return null;
  }
  const spanClassName =
    size === "sm" ? "text-sm px-1 py-0.5" : "text-xs px-1 py-0.5";
  const svgClassName =
    size === "sm" ? "mr-1.5 h-2 w-2" : "-ml-0.5 mr-1.5 h-2 w-2";

  return (
    <>
      <span
        className={`${className} ${spanClassName} inline items-center ${roundedClass} font-medium ${colorClass}`}
        title={title}
      >
        {dot != null && (
          <svg
            className={`${svgClassName} text-blue-400" fill="${dot}" viewBox="0 0 8 8"`}
          >
            <circle cx={4} cy={4} r={3} />
          </svg>
        )}
        {text}
      </span>
      {value != null && `: ${value}`}
    </>
  );
});
