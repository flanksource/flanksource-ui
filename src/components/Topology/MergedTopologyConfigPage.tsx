import { Topology } from "@flanksource-ui/api/types/topology";
import IncidentDetailsPageSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/IncidentDetailsPageSkeletonLoader";
import clsx from "clsx";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import TabbedLinks from "../../ui/Tabs/TabbedLinks";
import { ConfigTab } from "../Configs/ConfigDetailsTabs";
import { useConfigDetailsTabs } from "../Configs/ConfigTabsLinks";
import { ErrorBoundary } from "../ErrorBoundary";
import { TopologyCard } from "./TopologyCard";
import { useTopologyCardWidth } from "./TopologyPopover/topologyPreference";

type ConfigDetailsTabsForTopologyPageProps = {
  configId: string;
  topologies: Topology[];
  activeTabName?: ConfigTab;
  className?: string;
  children: React.ReactNode;
};

export function MergedTopologyConfigPage({
  children,
  activeTabName = "Catalog",
  className = "p-2",
  configId: id,
  topologies
}: ConfigDetailsTabsForTopologyPageProps) {
  const { data: configItem, isLoading: isLoadingConfig } =
    useGetConfigByIdQuery(id!);

  const configTabList = useConfigDetailsTabs(configItem?.summary, "/topology");

  const [topologyCardSize] = useTopologyCardWidth();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isLoadingConfig ? (
        <IncidentDetailsPageSkeletonLoader />
      ) : (
        <div className={`flex h-full flex-row bg-gray-100`}>
          <div className="flex flex-1 flex-col">
            {topologies.length > 0 && (
              <div className="flex max-h-[40%] w-full flex-wrap overflow-auto p-4">
                {topologies.map((topology) => (
                  <TopologyCard
                    key={topology.id}
                    topology={topology}
                    size={topologyCardSize}
                    menuPosition="absolute"
                  />
                ))}
              </div>
            )}

            <TabbedLinks
              activeTabName={activeTabName}
              tabLinks={configTabList}
              contentClassName={clsx(
                "bg-white border border-t-0 border-gray-300 flex-1 overflow-y-auto",
                className
              )}
            >
              <ErrorBoundary>{children}</ErrorBoundary>
            </TabbedLinks>
          </div>
        </div>
      )}
    </>
  );
}
