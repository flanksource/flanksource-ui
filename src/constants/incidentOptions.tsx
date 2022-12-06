import { AiOutlineClose } from "react-icons/ai";
import { BsExclamation } from "react-icons/bs";
import { RiLightbulbFill } from "react-icons/ri";

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
