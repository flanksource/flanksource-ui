import React from "react";

interface StatusBadgeProps {
  status: string;
  printView?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  printView = false
}) => {
  const getStatusColor = (
    status: string
  ): { bg: string; dot: string; text: string } => {
    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "pending":
      case "in-progress":
      case "mitigated":
        return {
          bg: "bg-blue-100 text-blue-800",
          dot: "bg-blue-600",
          text: "text-blue-700"
        };
      case "investigating":
        return {
          bg: "bg-yellow-100 text-yellow-800",
          dot: "bg-yellow-600",
          text: "text-yellow-700"
        };
      case "critical":
        return {
          bg: "bg-red-100 text-red-800",
          dot: "bg-red-600",
          text: "text-red-700"
        };
      case "high":
        return {
          bg: "bg-orange-100 text-orange-800",
          dot: "bg-orange-600",
          text: "text-orange-700"
        };
      case "medium":
        return {
          bg: "bg-yellow-100 text-yellow-800",
          dot: "bg-yellow-600",
          text: "text-yellow-700"
        };
      case "low":
        return {
          bg: "bg-blue-100 text-blue-800",
          dot: "bg-blue-600",
          text: "text-blue-700"
        };
      default:
        // Heuristics for dynamic status values
        if (
          statusLower.includes("success") ||
          statusLower.includes("succeed") ||
          statusLower.includes("resolved") ||
          statusLower.includes("complete") ||
          statusLower.includes("pass") ||
          statusLower.includes("ok")
        ) {
          return {
            bg: "bg-green-100 text-green-800",
            dot: "bg-green-600",
            text: "text-green-700"
          };
        } else if (
          statusLower.includes("error") ||
          statusLower.includes("fail") ||
          statusLower.includes("reject") ||
          statusLower.includes("deny")
        ) {
          return {
            bg: "bg-red-100 text-red-800",
            dot: "bg-red-600",
            text: "text-red-700"
          };
        } else if (
          statusLower.includes("warn") ||
          statusLower.includes("caution") ||
          statusLower.includes("alert")
        ) {
          return {
            bg: "bg-yellow-100 text-yellow-800",
            dot: "bg-yellow-600",
            text: "text-yellow-700"
          };
        } else if (
          statusLower.includes("progress") ||
          statusLower.includes("running") ||
          statusLower.includes("active")
        ) {
          return {
            bg: "bg-blue-100 text-blue-800",
            dot: "bg-blue-600",
            text: "text-blue-700"
          };
        }

        return {
          bg: "bg-gray-100 text-gray-800",
          dot: "bg-gray-600",
          text: "text-gray-700"
        };
    }
  };

  const { bg, dot, text } = getStatusColor(status);

  if (printView) {
    return (
      <span className="inline-flex items-center">
        <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${dot}`} />
        <span className={text}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </span>
    );
  }

  return (
    <span className={`status-badge ${bg}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
