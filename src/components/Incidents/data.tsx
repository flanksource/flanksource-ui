import { AiFillCloseCircle } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { ImHeartBroken } from "react-icons/im";
import { IoMdSpeedometer } from "react-icons/io";
import { FaRegClock } from "react-icons/fa";
import {
  MdFindInPage,
  MdNewReleases,
  MdOutlineAltRoute,
  MdSecurity
} from "react-icons/md";
import {
  HiExclamation,
  HiInformationCircle,
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineMinus
} from "react-icons/hi";
import { capitalizeFirstLetter } from "../../utils/common";
import { GoIssueClosed, GoIssueOpened } from "react-icons/go";
import { IncidentStatus } from "../../api/types/incident";

export const defaultSelections = {
  all: {
    description: "All",
    value: "all",
    order: -1
  }
};

export const severityItems = {
  Info: {
    id: "dropdown-severity-info",
    icon: <HiInformationCircle className="text-gray-500" />,
    name: "Info",
    description: "Info",
    value: "info"
  },
  Warning: {
    id: "dropdown-severity-warning",
    icon: <HiExclamation className="text-yellow-500" />,
    name: "Warning",
    description: "Warning",
    value: "warning"
  },
  Low: {
    id: "dropdown-severity-low",
    icon: <HiOutlineChevronDoubleDown color="green" />,
    name: "Low",
    description: "Low",
    value: "low"
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
    value: "high"
  },
  Blocker: {
    id: "dropdown-severity-blocker",
    icon: <HiOutlineChevronUp color="red" />,
    name: "Blocker",
    description: "Blocker",
    value: "blocker"
  },
  Critical: {
    id: "dropdown-severity-critical",
    icon: <HiOutlineChevronDoubleUp color="red" />,
    name: "Critical",
    description: "Critical",
    value: "critical"
  }
} as const;

export const incidentStatusItems = {
  [IncidentStatus.Open]: {
    id: `dropdown-status-${IncidentStatus.Open}`,
    icon: <GoIssueOpened className="inline" color="gray" />,
    name: IncidentStatus.Open,
    description: capitalizeFirstLetter(IncidentStatus.Open),
    value: IncidentStatus.Open
  },
  [IncidentStatus.Closed]: {
    id: `dropdown-status-${IncidentStatus.Closed}`,
    icon: <AiFillCloseCircle className="inline" color="gray" />,
    name: IncidentStatus.Closed,
    description: capitalizeFirstLetter(IncidentStatus.Closed),
    value: IncidentStatus.Closed
  },
  [IncidentStatus.New]: {
    id: `dropdown-status-${IncidentStatus.New}`,
    icon: <MdNewReleases className="inline" color="gray" />,
    name: IncidentStatus.New,
    description: capitalizeFirstLetter(IncidentStatus.New),
    value: IncidentStatus.New
  },
  [IncidentStatus.Mitigated]: {
    id: `dropdown-status-${IncidentStatus.Mitigated}`,
    icon: <MdOutlineAltRoute className="inline" color="gray" />,
    name: IncidentStatus.Mitigated,
    description: capitalizeFirstLetter(IncidentStatus.Mitigated),
    value: IncidentStatus.Mitigated
  },
  [IncidentStatus.Investigating]: {
    id: `dropdown-status-${IncidentStatus.Investigating}`,
    icon: <MdFindInPage className="inline" color="gray" />,
    name: IncidentStatus.Investigating,
    description: capitalizeFirstLetter(IncidentStatus.Investigating),
    value: IncidentStatus.Investigating
  },
  [IncidentStatus.Resolved]: {
    id: `dropdown-status-${IncidentStatus.Resolved}`,
    icon: <GoIssueClosed className="inline" color="gray" />,
    name: IncidentStatus.Resolved,
    description: capitalizeFirstLetter(IncidentStatus.Resolved),
    value: IncidentStatus.Resolved
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
  },
  reliability: {
    id: "dropdown-type-reliability",
    name: "reliability",
    icon: <FaRegClock />,
    description: "Reliability",
    value: "reliability"
  }
} as const;
