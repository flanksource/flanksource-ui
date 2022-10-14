import { typeItems } from "../Incidents/data";

interface IProps {
  type: string;
  textClassName?: string;
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
      <p className={`leading-5 ${textClassName}  ml-1.5 font-medium`}>NA</p>
    );
  }
  return (
    <>
      <div className="my-auto">{icon}</div>
      <p className={`leading-5  ${textClassName} ml-1.5 font-medium`}>{text}</p>
    </>
  );
}
