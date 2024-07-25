import { useMemo } from "react";
import { AiFillHeart } from "react-icons/ai";
import { StatusLine, StatusLineProps } from "../StatusLine/StatusLine";

type HealthChecksSummaryProps = React.HTMLProps<HTMLDivElement> & {
  target?: string;
  checks?: {
    healthy: number;
    warning: number;
    unhealthy: number;
  };
};

export function HealthChecksSummary({
  checks,
  target = "",
  ...rest
}: HealthChecksSummaryProps) {
  const statusLineInfo = useMemo(() => {
    if (!checks) {
      return null;
    }

    const data: StatusLineProps = {
      label: "Health Checks",
      icon: <AiFillHeart className="mr-1 inline-block h-3.5 w-3.5" />,
      url: "/health",
      statuses: [
        ...(checks.healthy > 0
          ? [
              {
                label: checks.healthy.toString(),
                color: "green" as const
              }
            ]
          : []),
        ...(checks.unhealthy > 0
          ? [
              {
                label: checks.unhealthy.toString(),
                color: "red" as const
              }
            ]
          : []),
        ...(checks.warning > 0
          ? [{ label: checks.warning, color: "orange" as const }]
          : [])
      ]
    };

    return data;
  }, [checks]);

  if (!checks || !Object.entries(checks).length || !statusLineInfo) {
    return null;
  }

  return <StatusLine {...statusLineInfo} {...rest} target={target} />;
}
