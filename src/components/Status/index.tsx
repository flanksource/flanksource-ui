type StatusProps = {
  good?: boolean;
  mixed?: boolean;
  status?: string;
  className?: string;
};

export function Status({ status, good, mixed, className = "" }: StatusProps) {
  let color = "bg-green-400";
  status = status?.toLowerCase();
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
    <>
      <span
        className={`flex-shrink-0 inline-block h-3 w-3 rounded-full shadow-md ${className} ${color}`}
        aria-hidden="true"
      />
      <span className="capitalize pl-1">{status}</span>
    </>
  );
}
