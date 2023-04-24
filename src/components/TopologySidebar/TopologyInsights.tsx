import { MdOutlineInsights } from "react-icons/md";
import { useGetTopologyRelatedInsightsQuery } from "../../api/query-hooks";
import CollapsiblePanel from "../CollapsiblePanel";
import InsightsDetails from "../Insights/Insights";
import Title from "../Title/title";
import { Badge } from "../Badge";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { refreshButtonClickedTrigger } from "../SlidingSideBar";

type Props = {
  topologyId: string;
};

export default function TopologyInsights({ topologyId }: Props) {
  const {
    data: topologyInsights = [],
    isLoading,
    isRefetching,
    refetch
  } = useGetTopologyRelatedInsightsQuery(topologyId);

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  useEffect(() => {
    if (!isLoading && !isRefetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  return (
    <CollapsiblePanel
      isClosed={topologyInsights.length === 0}
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title
            title="Insights"
            icon={<MdOutlineInsights className="w-6 h-auto" />}
          />
          <Badge
            className="w-5 h-5 flex items-center justify-center"
            roundedClass="rounded-full"
            text={topologyInsights?.length ?? 0}
          />
        </div>
      }
    >
      <InsightsDetails insights={topologyInsights} isLoading={isLoading} />
    </CollapsiblePanel>
  );
}
