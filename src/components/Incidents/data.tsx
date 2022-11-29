import { AiOutlineClose } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { INCIDENT_SEVERITY_OPTIONS } from "../../constants/incidentOptions.tsx";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import { RiLightbulbFill } from "react-icons/ri";

export const severityItems = {
  Low: {
    id: "dropdown-severity-low",
    ...INCIDENT_SEVERITY_OPTIONS[0]
  },
  Medium: {
    id: "dropdown-severity-medium",
    ...INCIDENT_SEVERITY_OPTIONS[1]
  },
  High: {
    id: "dropdown-severity-high",
    ...INCIDENT_SEVERITY_OPTIONS[2]
  },
  Blocker: {
    id: "dropdown-severity-blocker",
    ...INCIDENT_SEVERITY_OPTIONS[3]
  },
  Critical: {
    id: "dropdown-severity-critical",
    ...INCIDENT_SEVERITY_OPTIONS[4]
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
