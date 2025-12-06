import { Badge } from "@flanksource-ui/components/ui/badge";

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
    status === "failed" ||
    (good !== undefined && !good)
  ) {
    return "bg-red-400";
  }

  if (status === "unknown" || status === "suspended") {
    return "bg-gray-400";
  }

  if (status === "warning" || status === "warn") {
    return "bg-light-orange";
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
  if (!status && good === undefined && mixed === undefined) {
    return null;
  }

  const color = getStatusColor(status, good, mixed);

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 text-muted-foreground ${className}`}
    >
      <span
        className={`inline-block h-3 w-3 flex-shrink-0 rounded-full ${className} ${color}`}
        aria-hidden="true"
      />
      {!hideText && <span className="capitalize">{statusText ?? status}</span>}
    </Badge>
  );
}
