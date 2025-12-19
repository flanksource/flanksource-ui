import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@flanksource-ui/components/ui/tabs";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import clsx from "clsx";
import { useAtom } from "jotai";
import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { ConfigsDetailsBreadcrumbNav } from "../../ui/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import { Head } from "../../ui/Head";
import { refreshButtonClickedTrigger } from "../../ui/SlidingSideBar/SlidingSideBar";
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
    | string; // Views
  className?: string;
};

export function ConfigDetailsTabs({
  refetch = () => {},
  children,
  isLoading = false,
  pageTitlePrefix,
  activeTabName = "Spec",
  className = "p-2"
}: ConfigDetailsTabsProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const { data: configItem, isLoading: isLoadingConfig } =
    useGetConfigByIdQuery(id!);

  const configTabList = useConfigDetailsTabs(configItem?.summary);

  const handleTabChange = (value: string) => {
    const tab = configTabList.find((t) => t.key === value);
    if (tab) {
      navigate(tab.path);
    }
  };

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
        contentClass="p-0 flex flex-1"
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-row overflow-y-hidden">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 py-6">
            <Tabs
              value={activeTabName}
              onValueChange={handleTabChange}
              className="flex h-full flex-col"
            >
              <TabsList className="w-fit">
                {configTabList.map((tab) => (
                  <TabsTrigger key={tab.key} value={tab.key}>
                    <div className="flex flex-row items-center gap-1">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent
                value={activeTabName}
                className={clsx("mt-4 flex-1 overflow-auto", className)}
              >
                <ErrorBoundary>{children}</ErrorBoundary>
              </TabsContent>
            </Tabs>
          </div>
          <ConfigSidebar />
        </div>
      </SearchLayout>
    </>
  );
}
