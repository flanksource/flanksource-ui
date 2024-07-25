import { useAtom } from "jotai";
import { useEffect } from "react";
import { MdOutlineInsights } from "react-icons/md";
import { useGetTopologyRelatedInsightsQuery } from "../../../api/query-hooks";
import PillBadge from "../../../ui/Badge/PillBadge";
import CollapsiblePanel from "../../../ui/CollapsiblePanel/CollapsiblePanel";
import { refreshButtonClickedTrigger } from "../../../ui/SlidingSideBar/SlidingSideBar";
import InsightsDetails from "../../Configs/Sidebar/Insights/Insights";
import Title from "../../Title/title";

type Props = {
  topologyId: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export default function TopologyInsights({
  topologyId,
  isCollapsed = false,
  onCollapsedStateChange = () => {}
}: Props) {
  const {
    data: topologyInsights,
    isLoading,
    isRefetching,
    refetch
  } = useGetTopologyRelatedInsightsQuery(topologyId);

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  const totalCount = topologyInsights?.totalEntries ?? 0;

  useEffect(() => {
    if (!isLoading && !isRefetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex w-full flex-row items-center space-x-2">
          <Title
            title="Insights"
            icon={<MdOutlineInsights className="h-auto w-6" />}
          />
          <PillBadge>{totalCount}</PillBadge>
        </div>
      }
    >
      <InsightsDetails type="topologies" topologyId={topologyId} />
    </CollapsiblePanel>
  );
}
