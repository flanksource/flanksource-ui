import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import IncidentDetailsPageSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/IncidentDetailsPageSkeletonLoader";
import clsx from "clsx";
import { useAtom } from "jotai";
import { ReactNode } from "react";
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
  isLoading = false,
  pageTitlePrefix,
  activeTabName = "Catalog",
  className = "p-2"
}: ConfigDetailsTabsProps) {
  const { id } = useParams();

  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const { data: configItem, isLoading: isLoadingConfig } =
    useGetConfigByIdQuery(id!);

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
        }}
        loading={isLoading}
        contentClass="p-0 h-full overflow-y-hidden"
      >
        {isLoadingConfig ? (
          <IncidentDetailsPageSkeletonLoader />
        ) : (
          <div className={`flex h-full flex-row bg-gray-100`}>
            <div className="flex h-full flex-1 flex-col">
              {configItem?.components && configItem.components.length === 1 && (
                <ConfigComponents topologyId={configItem.components[0].id} />
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
            <ConfigSidebar
              topologyProperties={configItem?.components?.[0]?.properties}
            />
          </div>
        )}
      </SearchLayout>
    </>
  );
}
