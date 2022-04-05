import { AiOutlineClose } from "react-icons/ai";
import { BsExclamation } from "react-icons/bs";
import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from "react-icons/hi";
import { RiLightbulbFill } from "react-icons/ri";

export const severityItems = {
  0: {
    id: "dropdown-severity-low",
    name: "low",
    icon: <HiOutlineChevronDown color="green" />,
    description: "Low",
    value: 0
  },
  1: {
    id: "dropdown-severity-medium",
    name: "medium",
    icon: <HiOutlineChevronUp color="red" />,
    description: "Medium",
    value: 1
  },
  2: {
    id: "dropdown-severity-high",
    name: "high",
    icon: <HiOutlineChevronDoubleUp color="red" />,
    description: "High",
    value: 2
  }
};

export const statusItems = {
  open: {
    id: "dropdown-status-open",
    icon: <RiLightbulbFill color="green" />,
    name: "open",
    description: "Open",
    value: "open"
  },
  closed: {
    id: "dropdown-status-closed",
    icon: <AiOutlineClose color="gray" />,
    name: "closed",
    description: "Closed",
    value: "closed"
  }
};

export const typeItems = {
  issue: {
    id: "dropdown-type-issue",
    name: "issue",
    icon: <BsExclamation />,
    description: "Issue",
    value: "issue"
  }
};
