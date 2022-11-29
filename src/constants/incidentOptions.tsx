import { AiOutlineClose } from "react-icons/ai";
import { BsExclamation } from "react-icons/bs";
import {
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineMinus
} from "react-icons/hi";
import { RiLightbulbFill } from "react-icons/ri";
import { IncidentSeverity } from "../api/services/incident";

export const INCIDENT_SEVERITY_OPTIONS = [
  {
    icon: <HiOutlineChevronDoubleDown color="green" />,
    name: "Low",
    description: "Low",
    value: IncidentSeverity.Low
  },
  {
    icon: <HiOutlineChevronDown color="green" />,
    name: "Medium",
    description: "Medium",
    value: IncidentSeverity.Medium
  },
  {
    icon: <HiOutlineMinus color="orange" />,
    name: "High",
    description: "High",
    value: IncidentSeverity.High
  },
  {
    icon: <HiOutlineChevronUp color="red" />,
    name: "Blocker",
    description: "Blocker",
    value: IncidentSeverity.Blocker
  },
  {
    icon: <HiOutlineChevronDoubleUp color="red" />,
    name: "Critical",
    description: "Critical",
    value: IncidentSeverity.Critical
  }
];

export const INCIDENT_STATUS_OPTIONS = [
  {
    icon: <RiLightbulbFill color="green" />,
    description: "Open",
    value: "open"
  },
  {
    icon: <AiOutlineClose color="gray" />,
    description: "Closed",
    value: "closed"
  }
];

export const INCIDENT_TYPE_OPTIONS = [
  {
    icon: <BsExclamation />,
    description: "Issue",
    value: "issue"
  }
];
