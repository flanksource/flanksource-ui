import clsx from "clsx";
import React, { useState } from "react";
import { Oval } from "react-loading-icons";
import { Icon } from "../Icon";

interface Props {
  className?: string;
  text: React.ReactElement;
  icon?: React.ReactElement | string | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  onClick: () => Promise<void>;
}

const ButtonFC = ({
  className = "btn-primary",
  text,
  icon,
  size = "sm",
  onClick
}: Props) => {
  switch (size) {
    case "xs":
      className += " px-2.5 py-1.5 text-xs rounded";
      break;
    case "sm":
      className += "  px-3 py-2 text-sm  leading-4 rounded-md ";
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
      className += "  px-3 py-2 text-sm  leading-4 rounded-md ";
  }

  const [_icon, setIcon] = useState<React.ReactElement>(
    // @ts-ignore:next-line
    React.isValidElement(icon) ? icon : <Icon icon={icon} size={size} />
  );
  const [_className, setClassName] = useState(className);

  const handleOnClick = () => {
    const oldIcon = _icon;
    // setText("Updating...");
    setClassName("btn-disabled");
    setIcon(<Oval width="18px" height="18px" color="white" />);
    onClick().finally(() => {
      // setText(oldText);
      setIcon(oldIcon);
      setClassName(className);
    });
  };
  return (
    <button
      type="button"
      onClick={handleOnClick}
      className={clsx(_className, "space-x-2")}
    >
      {_icon != null && _icon}
      <span>{text}</span>
    </button>
  );
};

export const Button = React.memo(ButtonFC);
