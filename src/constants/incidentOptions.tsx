import { AiOutlineClose } from "react-icons/ai";
import { BsExclamation } from "react-icons/bs";
import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from "react-icons/hi";
import { RiLightbulbFill } from "react-icons/ri";
import { IncidentSeverity } from "../api/services/incident";

export const INCIDENT_SEVERITY_OPTIONS = [
  {
    icon: <HiOutlineChevronDown color="green" />,
    description: "Low",
    value: IncidentSeverity.Low
  },
  {
    icon: <HiOutlineChevronUp color="red" />,
    description: "Medium",
    value: IncidentSeverity.Medium
  },
  {
    icon: <HiOutlineChevronDoubleUp color="red" />,
    description: "High",
    value: IncidentSeverity.High
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
