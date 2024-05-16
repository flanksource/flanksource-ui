import clsx from "clsx";
import React from "react";

type Props = {
  text?: React.ReactNode;
  icon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className = "btn-primary",
  disabled = false,
  text,
  icon,
  size = "sm",
  onClick = () => {},
  type = "button",
  ...props
}: Props) {
  switch (size) {
    case "xs":
      className += " px-2.5 py-1.5 text-xs rounded";
      break;
    case "sm":
      className += " px-3 py-2 text-sm  leading-4 rounded-md ";
      break;
    case "md":
      className += " px-4 py-2 text-sm rounded-md ";
      break;
    case "lg":
      className += " px-4 py-2  text-base rounded-md ";
      break;
    case "xl":
      className += " px-6 py-3  text-base rounded-md ";
      break;
    case "none":
      className += "";
      break;
    default:
      className += " px-3 py-2 text-sm  leading-4 rounded-md ";
  }

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={clsx(
        className,
        "space-x-2",
        disabled && "btn-disabled hover:btn-disabled cursor-not-allowed"
      )}
      {...props}
    >
      {icon}
      {text && <span>{text}</span>}
    </button>
  );
}
