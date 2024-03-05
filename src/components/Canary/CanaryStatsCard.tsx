import { HealthCheck } from "@flanksource-ui/api/types/health";
import clsx from "clsx";
import { Tooltip } from "react-tooltip";
import { StatCard } from "../StatCard";
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

  return (
    <div className={clsx("flex flex-row gap-2")}>
      <div className="flex flex-row divide-x-2">
        <div className="flex flex-col items-center px-2">
          <StatCard
            title={<Status good={true} />}
            customValue={
              <>
                <div
                  className="space-x-1"
                  data-tooltip-id="passing-tooltip"
                  data-tooltip-content={`${
                    isFilterApplied ? passing.filtered : passing.checks
                  } checks passing`}
                >
                  {isFilterApplied ? (
                    <span className="text-green-500">
                      {passing.filtered || 0}
                    </span>
                  ) : (
                    <span className="text-green-500">
                      {passing.checks || 0}
                    </span>
                  )}
                </div>
                <Tooltip id="passing-tooltip" />
              </>
            }
          />
        </div>
        <div className="flex flex-col items-center px-2">
          <StatCard
            title={<Status good={false} />}
            customValue={
              <div
                className="space-x-1"
                data-tooltip-id="failing-tooltip"
                data-tooltip-content={`${
                  isFilterApplied
                    ? filteredChecksLength - passing.filtered
                    : checks?.length - passing.checks
                } checks failing`}
              >
                {isFilterApplied ? (
                  <span className="text-red-500">
                    {filteredChecksLength - passing.filtered || 0}
                  </span>
                ) : (
                  <span className="text-red-500">
                    {checks!.length - passing.checks || 0}
                  </span>
                )}

                <Tooltip id="failing-tooltip" />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
