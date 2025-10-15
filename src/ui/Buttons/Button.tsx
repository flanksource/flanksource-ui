import clsx from "clsx";
import React from "react";
import { Tooltip } from "react-tooltip";

type Props = {
  /**
   * @deprecated
   *
   * use children instead
   */
  text?: React.ReactNode;
  /**
   * @deprecated
   *
   * use children instead
   */
  icon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  /**
   * Tooltip message to show when button is disabled
   */
  disabledTooltip?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  className = "btn-primary",
  disabled = false,
  text,
  icon,
  size = "sm",
  onClick = () => {},
  type = "button",
  children,
  disabledTooltip,
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

  const button = (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={clsx(
        className,
        "space-x-2",
        disabled &&
          "btn-disabled hover:btn-disabled pointer-events-none cursor-not-allowed"
      )}
      {...props}
    >
      {children || (
        <>
          {icon}
          {text && <span>{text}</span>}
        </>
      )}
    </button>
  );

  if (disabled && disabledTooltip) {
    const tooltipId = `button-tooltip-${Math.random().toString(36).substring(7)}`;
    return (
      <>
        <div
          className="inline-block"
          data-tooltip-id={tooltipId}
          data-tooltip-content={disabledTooltip}
          data-tooltip-place="top"
        >
          {button}
        </div>
        <Tooltip id={tooltipId} className="z-50" />
      </>
    );
  }

  return button;
}
