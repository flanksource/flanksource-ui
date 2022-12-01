import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronUp,
  HiOutlineChevronDown
} from "react-icons/hi";
import { IncidentSeverity } from "../../api/services/incident";

const getSeverity = (severity: IncidentSeverity) => {
  switch (severity) {
    case "High":
      return { icon: <HiOutlineChevronDoubleUp color="red" />, text: "High" };
    case "Medium":
      return { icon: <HiOutlineChevronUp color="red" />, text: "Medium" };
    default:
      return { icon: <HiOutlineChevronDown color="green" />, text: "Low" };
  }
};

interface IProps {
  severity: IncidentSeverity;
  iconOnly?: boolean;
}

export function IncidentSeverityTag({ severity, iconOnly }: IProps) {
  const { icon, text } = getSeverity(severity);
  return (
    <>
      <div className="my-auto">{icon}</div>
      {!iconOnly && <p className="leading-5  ml-1.5">{text}</p>}
    </>
  );
}
