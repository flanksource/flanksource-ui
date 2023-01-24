import { Topology } from "../../context/TopologyPageContext";
import { CostInfoPanel } from "../CostDetails/CostDetails";

type Props = {
  topology?: Topology;
};

export default function TopologyCost({ topology }: Props) {
  if (!topology) {
    return null;
  }
  return <CostInfoPanel title="Costs" {...topology} />;
}
