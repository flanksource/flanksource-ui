import { AiOutlineClose } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from "react-icons/hi";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
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
};
