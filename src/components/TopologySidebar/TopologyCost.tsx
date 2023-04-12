import { Topology } from "../../context/TopologyPageContext";
import { CostInfoPanel } from "../CostDetails/CostDetails";

type Props = {
  topology?: Topology;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export default function TopologyCost({
  topology,
  isCollapsed = false,
  onCollapsedStateChange = () => {}
}: Props) {
  if (!topology) {
    return null;
  }
  return (
    <CostInfoPanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      title="Costs"
      {...topology}
    />
  );
}
