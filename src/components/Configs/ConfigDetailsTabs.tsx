import useTopologyByIDQuery from "@flanksource-ui/api/query-hooks/useTopologyByIDQuery";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import CardsSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/CardsSkeletonLoader";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ReactNode, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { ConfigsDetailsBreadcrumbNav } from "../../ui/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import { Head } from "../../ui/Head";
import { refreshButtonClickedTrigger } from "../../ui/SlidingSideBar/SlidingSideBar";
import TabbedLinks from "../../ui/Tabs/TabbedLinks";
import { ErrorBoundary } from "../ErrorBoundary";
import ConfigComponents from "./ConfigComponents";
import { useConfigDetailsTabs } from "./ConfigTabsLinks";
import ConfigSidebar from "./Sidebar/ConfigSidebar";

const panelSizesAtom = atomWithStorage<[number, number] | undefined>(
  "configDetailsPanelSizes",
  undefined,
  undefined,
  {
    getOnInit: true
  }
);

export type ConfigTab =
  | "Catalog"
  | "Changes"
  | "Insights"
  | "Relationships"
  | "Playbooks"
  | "Checks";

export type ConfigDetailsTabsProps = {
  refetch?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  pageTitlePrefix: string;
  activeTabName: ConfigTab;
  className?: string;
};

export function ConfigDetailsTabs({
  refetch = () => {},
  children,
  isLoading: isLoadingProps = false,
  pageTitlePrefix,
  activeTabName = "Catalog",
  className = "p-2"
}: ConfigDetailsTabsProps) {
  const { id } = useParams();
  const [panelSize, setPanelSize] = useAtom(panelSizesAtom);

  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const { data: configItem, isLoading: isLoadingConfig } =
    useGetConfigByIdQuery(id!);

  const topologyId = useMemo(() => {
    if (configItem?.components?.length === 1) {
      return configItem.components[0].id;
    }
    return undefined;
  }, [configItem]);

  const {
    data: topology,
    isLoading: isLoadingTopology,
    refetch: refetchTopology
  } = useTopologyByIDQuery(topologyId);

  const isLoading = isLoadingConfig || isLoadingTopology || isLoadingProps;

  const configTabList = useConfigDetailsTabs(configItem?.summary);

  return (
    <>
      <Head
        prefix={configItem ? `${pageTitlePrefix} - ${configItem.name}` : ""}
      />
      <SearchLayout
        title={
          <div className="flex space-x-2">
            <span className="text-lg">
              <ConfigsDetailsBreadcrumbNav
                config={configItem}
                isLoading={isLoadingConfig}
              />
            </span>
          </div>
        }
        onRefresh={() => {
          setRefreshButtonClickedTrigger((prev) => prev + 1);
          refetch();
          refetchTopology();
        }}
        loading={isLoading}
        contentClass="p-0 h-full overflow-y-hidden"
      >
        {isLoading ? (
          <CardsSkeletonLoader />
        ) : (
          <div className={`flex h-full flex-row overflow-auto bg-gray-100`}>
            <div className="flex h-full flex-1 flex-col overflow-auto">
              {configItem?.components &&
              configItem.components.length === 1 &&
              topology?.components &&
              // if the topology has components, then render the
              // ConfigComponents, else we just render the config details tab
              (topology?.components[0]?.components ?? []).length > 0 ? (
                <Allotment
                  className="flex w-full flex-1 overflow-auto"
                  vertical
                  onDragEnd={(e) => {
                    setPanelSize([e[0], e[1]]);
                  }}
                  defaultSizes={panelSize}
                >
                  <div className="flex h-full flex-col overflow-auto">
                    <ConfigComponents topology={topology.components[0]} />
                  </div>
                  <div className="flex h-full flex-1 flex-col">
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
                </Allotment>
              ) : (
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
              )}
            </div>
            <ConfigSidebar
              topologyProperties={configItem?.components?.[0]?.properties}
            />
          </div>
        )}
      </SearchLayout>
    </>
  );
}
