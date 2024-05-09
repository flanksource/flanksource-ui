function getStatusColor(
  status: string | undefined,
  good: boolean | undefined,
  mixed: boolean | undefined
): string {
  status = status?.toLowerCase();

  if (
    status === "degraded" ||
    status === "missing" ||
    status === "unhealthy" ||
    (good !== undefined && !good)
  ) {
    return "bg-red-400";
  }

  if (status === "unknown" || status === "suspended") {
    return "bg-gray-400";
  }

  if (mixed !== undefined && mixed) {
    return "bg-light-orange";
  }

  return "bg-green-400";
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
  if (!status) {
    return null;
  }

  const color = getStatusColor(status, good, mixed);

  return (
    <div className="flex flex-row items-center">
      <span
        className={`flex-shrink-0 inline-block h-3 w-3 rounded-full shadow-md ${className} ${color}`}
        aria-hidden="true"
      />
      {!hideText && (
        <span className="capitalize pl-1">{statusText ?? status}</span>
      )}
    </div>
  );
}
