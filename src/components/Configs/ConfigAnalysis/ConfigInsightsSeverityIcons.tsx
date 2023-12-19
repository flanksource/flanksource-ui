import {
  HiExclamation,
  HiInformationCircle,
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineMinus
} from "react-icons/hi";

type ConfigInsightsSeverityIconsProps = {
  severity: string;
  size?: number;
};

export default function ConfigInsightsSeverityIcons({
  severity,
  size = 20
}: ConfigInsightsSeverityIconsProps) {
  switch (severity) {
    case "info":
      return <HiInformationCircle className="text-gray-500" size={size} />;
    case "warning":
      return <HiExclamation className="text-yellow-500" size={size} />;
    case "low":
      return <HiOutlineChevronDoubleDown color="green" size={size} />;
    case "medium":
      return <HiOutlineChevronDown color="green" size={size} />;
    case "high":
      return <HiOutlineMinus color="orange" size={size} />;
    case "blocker":
      return <HiOutlineChevronUp color="red" size={size} />;
    case "critical":
      return <HiOutlineChevronDoubleUp className="text-red-500" size={size} />;
    default:
      return null;
  }
}
