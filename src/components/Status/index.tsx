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
  let color = "bg-green-400";
  status = status?.toLowerCase();
  console.log("status", status);
  if (
    status === "degraded" ||
    status === "missing" ||
    status === "unhealthy" ||
    (good !== undefined && !good)
  ) {
    color = "bg-red-400";
  }

  if (status === "unknown" || status === "suspended") {
    color = "bg-gray-400";
  }

  if (mixed !== undefined && mixed) {
    color = "bg-light-orange";
  }

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
