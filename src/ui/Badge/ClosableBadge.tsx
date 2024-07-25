import React from "react";
import { IoMdClose } from "react-icons/io";
import { Button } from "../Buttons/Button";

type BadgeProps = {
  size?: "xs" | "sm" | "md";
  color?: "blue" | "gray";
  dot?: string;
  title?: string;
  className?: string;
  colorClass?: string;
  roundedClass?: string;
  children: React.ReactNode;
  onRemove?: () => void;
};

export default function ClosableBadge({
  children,
  size = "sm",
  dot,
  title,
  color = "blue",
  className,
  roundedClass = "rounded",
  onRemove = () => {}
}: BadgeProps) {
  if (children == null || children === "") {
    return null;
  }

  const colorClass =
    color === "blue"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-200 text-gray-700";
  const spanClassName =
    size === "sm" ? "text-sm px-1 py-0.5" : "text-xs px-1 py-0.5";
  const svgClassName =
    size === "sm" ? "mr-1.5 h-2 w-2" : "-ml-0.5 mr-1.5 h-2 w-2";

  return (
    <div
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
      {children}
      <Button
        icon={<IoMdClose size={12} />}
        className="rounded border-l border-gray-50 py-1.5 pl-1.5 text-xs text-gray-500 hover:text-gray-700"
        size="none"
        onClick={onRemove}
        title="Remove filter"
      />
    </div>
  );
}
