import { HealthCheck } from "@flanksource-ui/api/types/health";
import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import { Status } from "../Status";

type CanaryStatsCardsProps = {
  checks?: HealthCheck[];
  filteredChecks?: HealthCheck[];
  passing: {
    checks: number;
    filtered: number;
  };
};

export default function CanaryStatsCards({
  checks,
  passing,
  filteredChecks
}: CanaryStatsCardsProps) {
  const filteredChecksLength = filteredChecks?.length || 0;
  const isFilterApplied = filteredChecksLength !== checks?.length;

  const passingCount = isFilterApplied ? passing.filtered : passing.checks;
  const failingCount = isFilterApplied
    ? filteredChecksLength - passing.filtered
    : (checks?.length ?? 0) - passing.checks;

  return (
    <div className={clsx("flex flex-row items-center gap-2")}>
      <div
        data-tooltip-id="passing-tooltip"
        data-tooltip-content={`${passingCount} checks passing`}
      >
        <Status good={true} statusText={`Healthy: ${passingCount || 0}`} />
      </div>
      <Tooltip id="passing-tooltip" />

      <span className="text-gray-400">|</span>

      <div
        data-tooltip-id="failing-tooltip"
        data-tooltip-content={`${failingCount} checks failing`}
      >
        <Status good={false} statusText={`Unhealthy: ${failingCount || 0}`} />
      </div>
      <Tooltip id="failing-tooltip" />
    </div>
  );
}
