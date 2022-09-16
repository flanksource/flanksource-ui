import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from "react-icons/hi";
import { IncidentPriority } from "../../constants/incident-priority";

export const priorities = [
  {
    label: "Low",
    value: IncidentPriority.Low,
    icon: <HiOutlineChevronDown color="green" />
  },
  {
    label: "Medium",
    value: IncidentPriority.Medium,
    icon: <HiOutlineChevronUp color="red" />
  },
  {
    label: "High",
    value: IncidentPriority.High,
    icon: <HiOutlineChevronDoubleUp color="red" />
  }
];
