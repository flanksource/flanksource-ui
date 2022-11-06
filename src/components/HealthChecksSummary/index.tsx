import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsHeartFill } from "react-icons/bs";
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
  const [hideUI, setHideUI] = useState(false);

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
    let hide = true;
    Object.keys(data).forEach((key) => {
      hide = hide && data[key] === 0;
    });
    setHideUI(hide);
    setSummary(data);
  }, [checks]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [summary]);

  if (!checks?.length || hideUI) {
    return null;
  }

  return (
    <div className="flex pb-2">
      <Link className="flex cursor-pointer items-center" to="/health">
        <AiFillHeart className="inline-block h-3.5 w-3.5 mr-1" />
        <p className="flex items-center text-xs pr-1">Health Checks</p>
        {summary.healthy > 0 && (
          <p className="flex items-center text-xs ml-1">
            <Chip
              text={summary.healthy}
              key="healthy"
              title="Healthy"
              color="green"
              data-tip="Healthy"
            />
          </p>
        )}
        {summary.unhealthy > 0 && (
          <p className="flex items-center text-xs ml-1">
            <Chip
              text={summary.unhealthy}
              key="unhealthy"
              title="Unhealthy"
              color="red"
              data-tip="Unhealthy"
            />
          </p>
        )}
        {summary.warning > 0 && (
          <p className="flex items-center text-xs ml-1">
            <Chip
              text={summary.warning}
              key="warning"
              title="Warning"
              color="orange"
              data-tip="Warning"
            />
          </p>
        )}
      </Link>
    </div>
  );
}
