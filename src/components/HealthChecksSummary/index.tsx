import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Chip } from "../Chip";

type HealthChecksSummaryProps = {
  checks: any[];
};

export function HealthChecksSummary({ checks }: HealthChecksSummaryProps) {
  const [summary, setSummary] = useState({
    healthy: 0,
    unhealthy: 0,
    warning: 0
  });

  useEffect(() => {
    if (!checks) {
      return;
    }
    const data = {
      healthy: 0,
      unhealthy: 0,
      warning: 0
    };
    checks.forEach((check) => {
      const status = check.status;
      data.healthy += status === "healthy" ? 1 : 0;
      data.warning += status === "warning" ? 1 : 0;
      data.unhealthy += status === "unhealthy" ? 1 : 0;
    });
    setSummary(data);
  }, [checks]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [summary]);

  if (!checks?.length) {
    return null;
  }

  return (
    <div className="flex pb-2">
      <Link className="flex cursor-pointer" to="/health">
        <p className="flex items-center text-xs">Health Checks:</p>
        <p className="flex items-center text-xs ml-1">
          <Chip
            text={summary.healthy}
            key="healthy"
            title="Healthy"
            color="green"
            data-tip="Healthy"
          />
        </p>
        <p className="flex items-center text-xs ml-1">
          <Chip
            text={summary.unhealthy}
            key="unhealthy"
            title="Unhealthy"
            color="red"
            data-tip="Unhealthy"
          />
        </p>
        <p className="flex items-center text-xs ml-1">
          <Chip
            text={summary.warning}
            key="warning"
            title="Warning"
            color="orange"
            data-tip="Warning"
          />
        </p>
      </Link>
    </div>
  );
}
