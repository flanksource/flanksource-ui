import { useParams } from "react-router-dom";
import { Topology } from "../../context/TopologyPageContext";
import Configs from "../Sidebars/configs";
import Incidents from "../Sidebars/incidents";
import SlidingSideBar from "../SlidingSideBar";
import TopologyConfigChanges from "../TopologyConfigChanges";
import TopologyDetails from "../TopologyDetails";
import { ComponentTeams } from "./ComponentTeams";
import TopologyCost from "./TopologyCost";

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
    <SlidingSideBar hideToggle>
      <TopologyDetails topology={topology} refererId={refererId} />
      <Configs topologyId={id} />
      <Incidents topologyId={id} />
      <TopologyCost topology={topology} />
      <TopologyConfigChanges topologyID={id} />
      <ComponentTeams componentId={id} />
    </SlidingSideBar>
  );
}
