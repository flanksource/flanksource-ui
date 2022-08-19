import { typeItems } from "../Incidents/data";

interface IProps {
  type: string;
}

export function IncidentTypeTag({ type }: IProps) {
  const { icon, text } = {
    icon: typeItems[type]?.icon,
    text: typeItems[type]?.description
  };
  if (!icon && !text) {
    return (
      <p className="leading-5 text-gray-900 text-sm ml-1.5 font-medium">NA</p>
    );
  }
  return (
    <>
      <div className="my-auto">{icon}</div>
      <p className="leading-5 text-gray-900 text-sm ml-1.5 font-medium">
        {text}
      </p>
    </>
  );
}
