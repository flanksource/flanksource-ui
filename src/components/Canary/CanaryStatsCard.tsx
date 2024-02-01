import { HealthCheck } from "@flanksource-ui/api/types/health";
import clsx from "clsx";
import { StatCard } from "../StatCard";

type CanaryStatsCardsProps = {
  checks?: HealthCheck[];

  passing: {
    checks: number;
    filtered: number;
  };
};

export default function CanaryStatsCards({
  checks,
  passing
}: CanaryStatsCardsProps) {
  return (
    <div className={clsx("flex flex-row gap-2")}>
      <StatCard title="Checks" customValue={checks?.length || 0} />

      <StatCard
        title="Passing"
        customValue={
          <span className="text-green-500">{passing.checks || 0}</span>
        }
      />

      <StatCard
        title="Failing"
        customValue={
          <span className="text-red-500">
            {checks!.length - passing.checks || 0}
          </span>
        }
      />
    </div>
  );
}
