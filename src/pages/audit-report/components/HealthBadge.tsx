import React from "react";

export type HealthType = "healthy" | "unhealthy" | "warning" | "unknown";

interface HealthBadgeProps {
  health: HealthType;
  printView?: boolean;
}

const HealthBadge: React.FC<HealthBadgeProps> = ({
  health,
  printView = false
}) => {
  const getHealthColor = (
    health: HealthType
  ): { bg: string; dot: string; text: string } => {
    switch (health.toLowerCase()) {
      case "healthy":
        return {
          bg: "bg-green-100 text-green-800",
          dot: "bg-green-600",
          text: "text-green-700"
        };
      case "unhealthy":
        return {
          bg: "bg-red-100 text-red-800",
          dot: "bg-red-600",
          text: "text-red-700"
        };
      case "warning":
        return {
          bg: "bg-yellow-100 text-yellow-800",
          dot: "bg-yellow-600",
          text: "text-yellow-700"
        };
      case "unknown":
      default:
        return {
          bg: "bg-gray-100 text-gray-800",
          dot: "bg-gray-600",
          text: "text-gray-700"
        };
    }
  };

  const { bg, dot, text } = getHealthColor(health);

  if (printView) {
    return (
      <span className="inline-flex items-center">
        <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${dot}`} />
        <span className={text}>
          {health.charAt(0).toUpperCase() + health.slice(1)}
        </span>
      </span>
    );
  }

  return (
    <span className={`status-badge ${bg}`}>
      {health.charAt(0).toUpperCase() + health.slice(1)}
    </span>
  );
};

export default HealthBadge;
