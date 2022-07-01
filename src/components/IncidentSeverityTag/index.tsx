import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronUp,
  HiOutlineChevronDown
} from "react-icons/hi";
import { IncidentSeverity } from "../../api/services/incident";

const getSeverity = (severity: IncidentSeverity) => {
  switch (severity) {
    case 2:
      return { icon: <HiOutlineChevronDoubleUp color="red" />, text: "High" };
    case 1:
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
