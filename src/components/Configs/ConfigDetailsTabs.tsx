import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import clsx from "clsx";
import { useAtom } from "jotai";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { ConfigsDetailsBreadcrumbNav } from "../../ui/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import { Head } from "../../ui/Head";
import { refreshButtonClickedTrigger } from "../../ui/SlidingSideBar/SlidingSideBar";
import TabbedLinks from "../../ui/Tabs/TabbedLinks";
import PlaybooksDropdownMenu from "../Playbooks/Runs/Submit/PlaybooksDropdownMenu";
import { ErrorBoundary } from "../ErrorBoundary";
import { useConfigDetailsTabs } from "./ConfigTabsLinks";
import ConfigSidebar from "./Sidebar/ConfigSidebar";

type ConfigDetailsTabsProps = {
  refetch?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  pageTitlePrefix: string;
  activeTabName:
    | "Spec"
    | "Changes"
    | "Insights"
    | "Relationships"
    | "Playbooks"
    | "Checks"
    | "Access"
    | string; // Views
  className?: string;
  extra?: ReactNode;
};

export function ConfigDetailsTabs({
  refetch = () => {},
  children,
  isLoading = false,
  pageTitlePrefix,
  activeTabName = "Spec",
  className = "p-2",
  extra
}: ConfigDetailsTabsProps) {
  const { id } = useParams();

  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const { data: configItem, isLoading: isLoadingConfig } =
    useGetConfigByIdQuery(id!);

  const { tabs: configTabList } = useConfigDetailsTabs(configItem?.summary);

  const playbooksButton = id ? (
    <PlaybooksDropdownMenu config_id={id} highlight containerClassName="my-0" />
  ) : null;
  const layoutExtra =
    extra || playbooksButton ? (
      <div className="flex items-center gap-2">
        {extra}
        {playbooksButton}
      </div>
    ) : undefined;

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
        extra={layoutExtra}
        contentClass="p-0 h-full overflow-y-hidden"
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-row overflow-y-hidden">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <TabbedLinks
              activeTabName={activeTabName}
              tabLinks={configTabList}
              contentClassName={clsx(
                "bg-white border border-t-0 border-gray-300 flex-1 min-h-0 overflow-auto",
                className
              )}
            >
              <ErrorBoundary>{children}</ErrorBoundary>
            </TabbedLinks>
          </div>
          <ConfigSidebar />
        </div>
      </SearchLayout>
    </>
  );
}
