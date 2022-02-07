import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronUp,
  HiOutlineChevronDown
} from "react-icons/hi";

const getSeverity = (incident) => {
  switch (incident.severity) {
    case 2:
      return { icon: <HiOutlineChevronDoubleUp color="red" />, text: "High" };
    case 1:
      return { icon: <HiOutlineChevronUp color="red" />, text: "Medium" };
    default:
      return { icon: <HiOutlineChevronDown color="green" />, text: "Low" };
  }
};

export function IncidentSeverity({ incident, iconOnly }) {
  const severity = getSeverity(incident);
  return (
    <>
      <div className="my-auto">{severity.icon}</div>
      {!iconOnly && <p className="leading-5  ml-1.5">{severity.text}</p>}
    </>
  );
}
