import React from "react";

const BadgeFC = ({
  text,
  value,
  size = "sm",
  dot,
  title,
  className,
  colorClass = "bg-indigo-100 text-indigo-800",
  roundedClass = "rounded"
}) => {
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
            className={`${svgClassName} text-indigo-400" fill="${dot}" viewBox="0 0 8 8"`}
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
