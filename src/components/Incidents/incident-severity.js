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
      {severity.icon}
      {!iconOnly && (
        <p className="text-darker-black text-sm leading-5 font-normal ml-2.5">
          {severity.text}
        </p>
      )}
    </>
  );
}
