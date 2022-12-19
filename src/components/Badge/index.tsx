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

const BadgeFC = ({
  text,
  value,
  size = "sm",
  dot,
  title,
  className,
  colorClass = "bg-blue-100 text-blue-800",
  roundedClass = "rounded"
}: BadgeProps) => {
  let spanClassname = "text-xs px-1.5";
  let svgClassName = "-ml-0.5 mr-1.5 h-2 w-2";
  if (size === "sm") {
    spanClassname = "text-sm px-2.5";
    svgClassName = "mr-1.5 h-2 w-2";
  }
  return (
    <>
      <span
        className={`${className} ${spanClassname} inline-flex items-center py-0.5 ${roundedClass} font-medium ${colorClass}`}
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
};

export const Badge = React.memo(BadgeFC);
