import { useParams } from "react-router-dom";
import { Topology } from "../../context/TopologyPageContext";
import Configs from "../Sidebars/configs";
import Incidents from "../Sidebars/incidents";
import SlidingSideBar from "../SlidingSideBar";
import TopologyConfigChanges from "../TopologyConfigChanges";
import TopologyDetails from "../TopologyDetails";
import { ComponentTeams } from "./ComponentTeams";
import TopologyActionBar from "./TopologyActionBar";
import TopologyCost from "./TopologyCost";
import TopologyInsights from "./TopologyInsights";

type Props = {
  topology?: Topology;
  refererId?: string;
  onRefresh?: () => void;
};

export default function TopologySidebar({
  topology,
  refererId,
  onRefresh
}: Props) {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  return (
    <SlidingSideBar hideToggle>
      <TopologyActionBar topology={topology} onRefresh={onRefresh} />
      <TopologyDetails topology={topology} refererId={refererId} />
      <TopologyCost topology={topology} />
      <ComponentTeams componentId={id} />
      <TopologyInsights topologyId={id} />
      <Incidents topologyId={id} />
      <Configs topologyId={id} />
      <TopologyConfigChanges topologyID={id} />
    </SlidingSideBar>
  );
}
