import { useState } from "react";
import { Oval } from "react-loading-icons";
import { Icon } from "../Icon";

export function Button({
  className = "btn-primary",
  text,
  icon,
  size = "sm",
  onClick
}) {
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

  const [_icon, setIcon] = useState(<Icon icon={icon} size={size} />);
  const [_className, setClassName] = useState(className);

  const handleOnClick = () => {
    const oldIcon = _icon;
    // setText("Updating...");
    setClassName("btn-disabled");
    setIcon(<Oval color="white" height="1.5em" />);
    onClick().finally(() => {
      // setText(oldText);
      setIcon(oldIcon);
      setClassName(className);
    });
  };
  return (
    <button type="button" onClick={handleOnClick} className={_className}>
      {_icon != null && _icon}
      {text}
    </button>
  );
}
