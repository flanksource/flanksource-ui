import React from "react";
import { Status } from "@flanksource-ui/components/Status";

export type HealthType = "healthy" | "unhealthy" | "warning" | "unknown";

interface HealthBadgeProps {
  health: HealthType;
  printView?: boolean;
}

const HealthBadge: React.FC<HealthBadgeProps> = ({
  health,
  printView = false
}) => {
  if (printView) {
    // For print view, we want minimal styling - just dot and text
    const dotColors: Record<HealthType, string> = {
      healthy: "bg-green-600",
      unhealthy: "bg-red-600",
      warning: "bg-yellow-600",
      unknown: "bg-gray-600"
    };
    const textColors: Record<HealthType, string> = {
      healthy: "text-green-700",
      unhealthy: "text-red-700",
      warning: "text-yellow-700",
      unknown: "text-gray-700"
    };

    return (
      <span className="inline-flex items-center">
        <span
          className={`mr-1.5 inline-block h-2 w-2 rounded-full ${dotColors[health]}`}
        />
        <span className={textColors[health]}>
          {health.charAt(0).toUpperCase() + health.slice(1)}
        </span>
      </span>
    );
  }

  return <Status status={health} />;
};

export default HealthBadge;
