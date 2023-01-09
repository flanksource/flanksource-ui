import { useParams } from "react-router-dom";
import { Topology } from "../../context/TopologyPageContext";
import Configs from "../Sidebars/configs";
import Incidents from "../Sidebars/incidents";
import TopologyConfigChanges from "../TopologyConfigChanges";
import TopologyDetails from "../TopologyDetails";
import { ComponentTeams } from "./ComponentTeams";

type Props = {
  topology?: Topology;
  refererId?: string;
};

export default function TopologySidebar({ topology, refererId }: Props) {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return (
    <div
      className={`flex flex-col bg-white border-l transform origin-right duration-500 border-gray-200  w-full py-6 px-4  ${"w-[35rem]"}`}
    >
      <div className={`flex flex-col h-auto space-y-8 sticky top-0`}>
        <TopologyDetails topology={topology} refererId={refererId} />
        <Configs topologyId={id} />
        <Incidents topologyId={id} />
        <TopologyConfigChanges topologyID={id} />
        <ComponentTeams componentId={id} />
      </div>
    </div>
  );
}
