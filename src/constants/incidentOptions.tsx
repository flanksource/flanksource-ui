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
    description: "Low",
    value: IncidentSeverity.Low
  },
  {
    icon: <HiOutlineChevronDown color="green" />,
    description: "Medium",
    value: IncidentSeverity.Medium
  },
  {
    icon: <HiOutlineMinus color="yellow" />,
    description: "High",
    value: IncidentSeverity.High
  },
  {
    icon: <HiOutlineChevronUp color="red" />,
    description: "Blocker",
    value: IncidentSeverity.Blocker
  },
  {
    icon: <HiOutlineChevronDoubleUp color="red" />,
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
