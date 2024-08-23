import useTopologyByIDQuery from "@flanksource-ui/api/query-hooks/useTopologyByIDQuery";
import IncidentDetailsPageSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/IncidentDetailsPageSkeletonLoader";
import { TopologyCard } from "../Topology/TopologyCard";
import { useTopologyCardWidth } from "../Topology/TopologyPopover/topologyPreference";

type ConfigComponentsProps = {
  topologyId: string;
};

export default function ConfigComponents({
  topologyId
}: ConfigComponentsProps) {
  const { data, isLoading } = useTopologyByIDQuery(topologyId);

  const [topologyCardSize] = useTopologyCardWidth();

  return (
    <div className="flex w-full flex-1 overflow-y-auto">
      <div className="flex w-full flex-wrap p-4">
        {isLoading && data ? (
          <IncidentDetailsPageSkeletonLoader />
        ) : (
          data?.components?.[0].components?.map((component) => (
            <TopologyCard
              key={component.id}
              topology={component}
              size={topologyCardSize}
              menuPosition="absolute"
            />
          ))
        )}
      </div>
    </div>
  );
}
