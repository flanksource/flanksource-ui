import { BsClock } from "react-icons/bs";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

export const timeRanges = [
  {
    icon: <BsClock />,
    description: "15 minutes",
    value: "15m"
  },
  {
    icon: <BsClock />,
    description: "1 hour",
    value: "1h"
  },
  {
    icon: <BsClock />,
    description: "2 hours",
    value: "2h"
  },
  {
    icon: <BsClock />,
    description: "3 hours",
    value: "3h"
  },
  {
    icon: <BsClock />,
    description: "6 hours",
    value: "6h"
  },
  {
    icon: <BsClock />,
    description: "12 hours",
    value: "12h"
  },
  {
    icon: <BsClock />,
    description: "1 day",
    value: "1d"
  },
  {
    icon: <BsClock />,
    description: "2 days",
    value: "2d"
  },
  {
    icon: <BsClock />,
    description: "3 days",
    value: "3d"
  },
  {
    icon: <BsClock />,
    description: "1 week",
    value: "1w"
  },
  {
    icon: <BsClock />,
    description: "2 weeks",
    value: "2w"
  },
  {
    icon: <BsClock />,
    description: "3 weeks",
    value: "3w"
  }
];

export function TimeRange({ ...rest }) {
  return <ReactSelectDropdown {...rest} items={timeRanges} />;
}
