type StatusColorConfig = {
  badge: string;
  dot: string;
};

function getStatusColorConfig(
  status: string | undefined,
  good: boolean | undefined,
  mixed: boolean | undefined
): StatusColorConfig {
  status = status?.toLowerCase();

  // Red: degraded, missing, unhealthy, failed, or good=false
  if (
    status === "degraded" ||
    status === "missing" ||
    status === "unhealthy" ||
    status === "failed" ||
    (good !== undefined && !good)
  ) {
    return {
      badge: "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400",
      dot: "fill-red-500 dark:fill-red-400"
    };
  }

  // Gray: unknown, suspended
  if (status === "unknown" || status === "suspended") {
    return {
      badge: "bg-gray-100 text-gray-600 dark:bg-gray-400/10 dark:text-gray-300",
      dot: "fill-gray-400"
    };
  }

  // Orange: warning, warn, or mixed=true
  if (status === "warning" || status === "warn") {
    return {
      badge:
        "bg-orange-100 text-orange-800 dark:bg-orange-400/10 dark:text-orange-500",
      dot: "fill-orange-500 dark:fill-orange-400"
    };
  }

  if (mixed !== undefined && mixed) {
    return {
      badge:
        "bg-orange-100 text-orange-800 dark:bg-orange-400/10 dark:text-orange-500",
      dot: "fill-orange-500 dark:fill-orange-400"
    };
  }

  // Green: default (healthy)
  return {
    badge:
      "bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-400",
    dot: "fill-green-500 dark:fill-green-400"
  };
}

type StatusProps = {
  good?: boolean;
  mixed?: boolean;
  status?: string;
  className?: string;
  statusText?: string;
  hideText?: boolean;
};

export function Status({
  status,
  statusText,
  good,
  mixed,
  className = "",
  hideText = false
}: StatusProps) {
  if (!status && good === undefined && mixed === undefined) {
    return null;
  }

  const colorConfig = getStatusColorConfig(status, good, mixed);

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${colorConfig.badge} ${className}`}
    >
      <svg
        viewBox="0 0 6 6"
        aria-hidden="true"
        className={`size-1.5 ${colorConfig.dot}`}
      >
        <circle r={3} cx={3} cy={3} />
      </svg>
      {!hideText && <span className="capitalize">{statusText ?? status}</span>}
    </span>
  );
}
