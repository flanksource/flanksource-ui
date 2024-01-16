import { useAtom } from "jotai";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { ConfigsDetailsBreadcrumbNav } from "../BreadcrumbNav/ConfigsDetailsBreadCrumb";
import { Head } from "../Head/Head";
import { SearchLayout } from "../Layout";
import { refreshButtonClickedTrigger } from "../SlidingSideBar";
import TabbedLinks from "../Tabs/TabbedLinks";
import { useConfigDetailsTabs } from "./ConfigTabsLinks";
import ConfigSidebar from "./Sidebar/ConfigSidebar";
import ConfigActionBar from "./Sidebar/ConfigActionBar";

type ConfigDetailsTabsProps = {
  refetch?: () => void;
  children: ReactNode;
  isLoading?: boolean;
  pageTitlePrefix: string;
  activeTabName:
    | "Catalog"
    | "Changes"
    | "Insights"
    | "Relationships"
    | "Playbooks";
};

export function ConfigDetailsTabs({
  refetch = () => {},
  children,
  isLoading = false,
  pageTitlePrefix,
  activeTabName = "Catalog"
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
        // todo, default to prefix
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
        <div className={`flex flex-row h-full`}>
          <div className="flex flex-col flex-1">
            <div className="flex flex-col h-auto bg-gray-100">
              <ConfigActionBar configId={id!} />
            </div>
            <TabbedLinks
              activeTabName={activeTabName}
              tabLinks={configTabList}
              contentClassName="bg-white border border-t-0 border-gray-300 flex-1 p-2 overflow-y-auto"
            >
              {children}
            </TabbedLinks>
          </div>
          <ConfigSidebar />
        </div>
      </SearchLayout>
    </>
  );
}
