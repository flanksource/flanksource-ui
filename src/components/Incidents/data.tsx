import { AiOutlineClose } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import { RiLightbulbFill } from "react-icons/ri";
import {
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineMinus
} from "react-icons/hi";

export const defaultSelections = {
  all: {
    description: "All",
    value: "all",
    order: -1
  }
};

export const severityItems = {
  Low: {
    id: "dropdown-severity-low",
    icon: <HiOutlineChevronDoubleDown color="green" />,
    name: "Low",
    description: "Low",
    value: "Low"
  },
  Medium: {
    id: "dropdown-severity-medium",
    icon: <HiOutlineChevronDown color="green" />,
    name: "Medium",
    description: "Medium",
    value: "Medium"
  },
  High: {
    id: "dropdown-severity-high",
    icon: <HiOutlineMinus color="orange" />,
    name: "High",
    description: "High",
    value: "High"
  },
  Blocker: {
    id: "dropdown-severity-blocker",
    icon: <HiOutlineChevronUp color="red" />,
    name: "Blocker",
    description: "Blocker",
    value: "Blocker"
  },
  Critical: {
    id: "dropdown-severity-critical",
    icon: <HiOutlineChevronDoubleUp color="red" />,
    name: "Critical",
    description: "Critical",
    value: "Critical"
  }
} as const;

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
} as const;

export const typeItems = {
  cost: {
    id: "dropdown-type-cost",
    name: "cost",
    icon: <BiDollarCircle />,
    description: "Cost",
    value: "cost"
  },
  availability: {
    id: "dropdown-type-availability",
    name: "availability",
    icon: <ImHeartBroken />,
    description: "Availability",
    value: "availability"
  },
  performance: {
    id: "dropdown-type-performance",
    name: "performance",
    icon: <IoMdSpeedometer />,
    description: "Performance",
    value: "performance"
  },
  security: {
    id: "dropdown-type-security",
    name: "security",
    icon: <MdSecurity />,
    description: "Security",
    value: "security"
  },
  integration: {
    id: "dropdown-type-integration",
    name: "integration",
    icon: <GrIntegration />,
    description: "Integration",
    value: "integration"
  },
  compliance: {
    id: "dropdown-type-compliance",
    name: "compliance",
    icon: <FaTasks />,
    description: "Compliance",
    value: "compliance"
  },
  technicalDebt: {
    id: "dropdown-type-technical-debt",
    name: "technicalDebt",
    icon: <GrWorkshop />,
    description: "Technical Debt",
    value: "technicalDebt"
  }
} as const;
