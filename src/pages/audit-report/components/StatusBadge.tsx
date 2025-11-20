import React from "react";
import { getStatusColorIndex } from "./View/panels/utils";

interface StatusBadgeProps {
  status: string;
  printView?: boolean;
}

/**
 * Tailwind CSS color definitions for each status color index.
 * Each index (0-5) contains background, dot indicator, and text color classes.
 *
 * Index mapping:
 * - 0: Gray (unknown/default status)
 * - 1: Green (success, resolved, healthy)
 * - 2: Blue (in-progress, pending)
 * - 3: Yellow (warning)
 * - 4: Orange (high severity)
 * - 5: Red (critical/error)
 */
const STATUS_COLORS = [
  {
    bg: "bg-gray-100 text-gray-800",
    dot: "bg-gray-600",
    text: "text-gray-700"
  },
  {
    bg: "bg-green-100 text-green-800",
    dot: "bg-green-600",
    text: "text-green-700"
  },
  {
    bg: "bg-blue-100 text-blue-800",
    dot: "bg-blue-600",
    text: "text-blue-700"
  },
  {
    bg: "bg-yellow-100 text-yellow-800",
    dot: "bg-yellow-600",
    text: "text-yellow-700"
  },
  {
    bg: "bg-orange-100 text-orange-800",
    dot: "bg-orange-600",
    text: "text-orange-700"
  },
  {
    bg: "bg-red-100 text-red-800",
    dot: "bg-red-600",
    text: "text-red-700"
  }
];

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
 *
 * Uses the status string to determine an appropriate color from a predefined palette.
 * Colors are assigned based on semantic meaning (green for success, red for error, etc.).
 * The component can render as either a simple badge or a print-optimized format with a dot indicator.
 *
 * @param props - Component props
 * @param props.status - The status string to display
 * @param props.printView - If true, renders with a dot indicator for print-friendly format (default: false)
 *
 * @example
 * <StatusBadge status="success" />
 * <StatusBadge status="error" printView />
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  printView = false
}) => {
  const getStatusColor = (
    status: string
  ): { bg: string; dot: string; text: string } => {
    const colorIndex = getStatusColorIndex(status);
    return STATUS_COLORS[colorIndex];
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
