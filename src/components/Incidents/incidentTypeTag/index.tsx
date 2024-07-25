import { Tooltip } from "react-tooltip";
import { typeItems } from "../data";

interface IProps {
  type: keyof typeof typeItems;
  textClassName?: string;
}
export function IncidentTypeIcon({ type }: IProps) {
  const { icon, text } = {
    icon: typeItems[type]?.icon,
    text: typeItems[type]?.description
  };
  if (!icon && !text) {
    return null;
  }
  return (
    <>
      <div
        data-tooltip-id="incident-icon-tooltip"
        data-tooltip-content={text}
        className="my-auto w-4"
      >
        {icon}
      </div>
      <Tooltip id="incident-icon-tooltip" />
    </>
  );
}

export function IncidentTypeTag({
  type,
  textClassName = "text-sm text-gray-900"
}: IProps) {
  const { icon, text } = {
    icon: typeItems[type]?.icon,
    text: typeItems[type]?.description
  };
  if (!icon && !text) {
    return (
      <p className={`leading-5 ${textClassName} ml-1.5 font-medium`}>NA</p>
    );
  }
  return (
    <>
      <div className="my-auto">{icon}</div>
      <p className={`leading-5 ${textClassName} ml-1.5 font-medium`}>{text}</p>
    </>
  );
}
