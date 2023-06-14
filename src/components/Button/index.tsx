import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { Oval } from "react-loading-icons";
import { Icon } from "../Icon";

type Props = {
  text?: React.ReactNode;
  icon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
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
    default:
      className += " px-3 py-2 text-sm  leading-4 rounded-md ";
  }

  const [_icon, setIcon] = useState<React.ReactElement>(
    // @ts-ignore:next-line
    React.isValidElement(icon) ? icon : <Icon icon={icon} />
  );
  const [_className, setClassName] = useState(className);

  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      const oldIcon = _icon;
      // setText("Updating...");
      setClassName("btn-disabled");
      setIcon(<Oval width="18px" height="18px" color="white" />);

      Promise.resolve(onClick(e)).finally(() => {
        // setText(oldText);
        setIcon(oldIcon);
        setClassName(className);
      });
    },
    [_icon, className, onClick]
  );

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={handleOnClick}
      className={clsx(_className, "space-x-2")}
      {...props}
    >
      {_icon != null && _icon}
      {text && <span>{text}</span>}
    </button>
  );
}
