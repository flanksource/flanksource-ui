import { Topology } from "@flanksource-ui/api/types/topology";
import { TopologyCard } from "../Topology/TopologyCard";
import { useTopologyCardWidth } from "../Topology/TopologyPopover/topologyPreference";

type ConfigComponentsProps = {
  topology?: Topology;
};

export default function ConfigComponents({ topology }: ConfigComponentsProps) {
  const [topologyCardSize] = useTopologyCardWidth();

  return (
    <div className="flex w-full flex-1 overflow-y-auto">
      <div className="flex w-full flex-wrap p-4">
        {topology?.components?.map((component) => (
          <TopologyCard
            key={component.id}
            topology={component}
            size={topologyCardSize}
            menuPosition="absolute"
          />
        ))}
      </div>
    </div>
  );
}
