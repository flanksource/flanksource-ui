import { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { StatusLine, StatusLineProps } from "../StatusLine/StatusLine";

type HealthChecksSummaryProps = React.HTMLProps<HTMLDivElement> & {
  checks: any[];
};

export function HealthChecksSummary({
  checks,
  ...rest
}: HealthChecksSummaryProps) {
  const statusLineInfo: StatusLineProps | null = useMemo(() => {
    if (!checks) {
      return null;
    }

    const data: StatusLineProps = {
      label: "Health Checks",
      icon: <AiFillHeart className="inline-block h-3.5 w-3.5 mr-1" />,
      url: "/health",
      statuses: []
    };

    const summary: Record<string, number> = {
      healthy: 0,
      unhealthy: 0,
      warning: 0
    };

    checks.forEach((check) => {
      const status = check.status;
      summary.healthy += status === "healthy" ? 1 : 0;
      summary.warning += status === "warning" ? 1 : 0;
      summary.unhealthy += status === "unhealthy" ? 1 : 0;
    });

    let hide = true;

    Object.keys(summary).forEach((key) => {
      hide = hide && summary[key] === 0;
    });

    if (hide) {
      return null;
    }

    if (summary.healthy > 0) {
      data.statuses.push({
        label: summary.healthy.toString(),
        color: "green"
      });
    }

    if (summary.unhealthy > 0) {
      data.statuses.push({
        label: summary.unhealthy.toString(),
        color: "red"
      });
    }

    if (summary.warning > 0) {
      data.statuses.push({
        label: summary.warning.toString(),
        color: "orange"
      });
    }

    return data;
  }, [checks]);

  if (!checks?.length || !statusLineInfo) {
    return null;
  }

  return <StatusLine {...statusLineInfo} {...rest} />;
}
