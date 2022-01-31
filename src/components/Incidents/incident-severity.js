import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronUp,
  HiOutlineChevronDown
} from "react-icons/hi";

const getSeverity = (incident) => {
  switch (incident.severity) {
    case 0:
      return { icon: <HiOutlineChevronDoubleUp color="red" />, text: "High" };
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      return { icon: <HiOutlineChevronUp color="red" />, text: "Medium" };
    default:
      return { icon: <HiOutlineChevronDown color="green" />, text: "Medium" };
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
