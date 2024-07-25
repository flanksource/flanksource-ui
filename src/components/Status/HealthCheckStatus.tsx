import { HealthCheck } from "../../api/types/health";

type StatusProps = {
  check?: Pick<HealthCheck, "status">;
  isMixed?: boolean;
  className?: string;
};

export function HealthCheckStatus({
  check,
  isMixed = false,
  className = ""
}: StatusProps) {
  const color = isMixed
    ? "bg-light-orange"
    : check?.status === "healthy"
      ? "bg-green-400"
      : "bg-red-400";
  return (
    <span
      className={`inline-block h-3 w-3 flex-shrink-0 rounded-full shadow-md ${className} ${color}`}
      aria-hidden="true"
      // add test id
      data-testid="health-check-status"
    />
  );
}
