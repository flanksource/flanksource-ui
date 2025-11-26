import React from "react";
import { getSeverityOfText } from "./View/panels/utils";

interface StatusBadgeProps {
  status: string;
  printView?: boolean;
}

/**
 * Tailwind CSS color definitions for each severity level.
 * Each severity contains background, dot indicator, and text color classes.
 *
 * Severity mapping:
 * - "info": Green (success, resolved, healthy)
 * - "low": Blue (in-progress, pending)
 * - "medium": Yellow (warning)
 * - "high": Orange (high severity)
 * - "critical": Red (critical/error)
 */
const STATUS_COLORS: Record<string, { bg: string; dot: string; text: string }> =
  {
    info: {
      bg: "bg-green-100 text-green-800",
      dot: "bg-green-600",
      text: "text-green-700"
    },
    low: {
      bg: "bg-blue-100 text-blue-800",
      dot: "bg-blue-600",
      text: "text-blue-700"
    },
    medium: {
      bg: "bg-yellow-100 text-yellow-800",
      dot: "bg-yellow-600",
      text: "text-yellow-700"
    },
    high: {
      bg: "bg-orange-100 text-orange-800",
      dot: "bg-orange-600",
      text: "text-orange-700"
    },
    critical: {
      bg: "bg-red-100 text-red-800",
      dot: "bg-red-600",
      text: "text-red-700"
    },
    unknown: {
      bg: "bg-gray-100 text-gray-800",
      dot: "bg-gray-600",
      text: "text-gray-700"
    }
  };

/**
 * Capitalizes the first character of a string.
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
const capitalizeStatus = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Displays a status badge with heuristic-based coloring.
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  printView = false
}) => {
  const getStatusColor = (
    status: string
  ): { bg: string; dot: string; text: string } => {
    const severity = getSeverityOfText(status);
    return STATUS_COLORS[severity];
  };

  const { bg, dot, text } = getStatusColor(status);
  const displayStatus = capitalizeStatus(status);

  if (printView) {
    return (
      <span className="inline-flex items-center">
        <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${dot}`} />
        <span className={text}>{displayStatus}</span>
      </span>
    );
  }

  return <span className={`status-badge ${bg}`}>{displayStatus}</span>;
};

export default StatusBadge;
