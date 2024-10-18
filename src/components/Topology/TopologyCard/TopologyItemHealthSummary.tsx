import { Topology } from "@flanksource-ui/api/types/topology";
import { StatusLine } from "@flanksource-ui/components/StatusLine/StatusLine";
import { useMemo } from "react";
import { getTopologyHealthSummary } from "./TopologCardStatuses";

type TopologyItemHealthSummaryProps = {
  topology: Topology;
};

export default function TopologyItemHealthSummary({
  topology
}: TopologyItemHealthSummaryProps) {
  const statusLines = useMemo(() => {
    return getTopologyHealthSummary(topology, "individual_level");
  }, [topology]);

  if (!statusLines || statusLines.statuses.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <StatusLine {...statusLines} hideName />
    </div>
  );
}
