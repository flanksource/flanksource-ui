import { Topology } from "@flanksource-ui/api/types/topology";
import {
  StatusInfo,
  StatusLine
} from "@flanksource-ui/components/StatusLine/StatusLine";
import { useMemo } from "react";

type TopologyItemHealthSummaryProps = {
  topology: Topology;
};

export default function TopologyItemHealthSummary({
  topology
}: TopologyItemHealthSummaryProps) {
  console.log(
    "TopologyItemHealthSummaryProps",
    topology.components?.map((c) => c.summary?.checks)
  );

  const statusLines = useMemo(() => {
    const summary = topology.components?.reduce(
      (acc, component) => {
        const health =
          (component.summary?.healthy || 0) +
          (component.summary?.checks?.healthy || 0);
        const warning =
          component.summary?.warning ||
          0 + (component.summary?.checks?.warning || 0);
        const unhealthy =
          component.summary?.unhealthy ||
          0 + (component.summary?.checks?.unhealthy || 0);
        if (health) {
          acc["health"] += health;
        }
        if (warning) {
          acc["warning"] += warning;
        }
        if (unhealthy) {
          acc["unhealthy"] += unhealthy;
        }
        return acc;
      },
      {
        health: 0,
        unhealthy: 0,
        warning: 0
      }
    );

    if (!summary) {
      return undefined;
    }

    return Object.entries(summary)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => {
        return {
          label: count,
          color:
            status === "health"
              ? "green"
              : status === "warning"
                ? "orange"
                : "red"
        } satisfies StatusInfo;
      });
  }, [topology]);

  if (!statusLines || statusLines.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <StatusLine statuses={statusLines} hideName label={""} />
    </div>
  );
}
