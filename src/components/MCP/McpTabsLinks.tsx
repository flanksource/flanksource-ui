import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import clsx from "clsx";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ConfigSidebar from "../Configs/Sidebar/ConfigSidebar";
import { ErrorBoundary } from "../ErrorBoundary";

type McpTabsLinksProps = {
  activeTab: "Overview" | "Playbooks" | "Views";
  children: React.ReactNode;
  className?: string;
  onRefresh?: () => void;
  loading?: boolean;
};

export default function McpTabsLinks({
  activeTab,
  children,
  className,
  onRefresh = () => {},
  loading = false
}: McpTabsLinksProps) {
  const [searchParams] = useSearchParams();

  const tabLinks = useMemo(() => {
    const query = searchParams.toString();
    const search = query ? `?${query}` : "";

    return [
      {
        label: "Overview",
        path: "/settings/mcp/overview",
        key: "Overview",
        search
      },
      {
        label: "Playbooks",
        path: "/settings/mcp/playbooks",
        key: "Playbooks",
        search
      },
      {
        label: "Views",
        path: "/settings/mcp/views",
        key: "Views",
        search
      }
    ];
  }, [searchParams]);

  return (
    <>
      <Head prefix={`MCP - ${activeTab}`} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="mcp" link="/settings/mcp/overview">
                MCP
              </BreadcrumbRoot>,
              <BreadcrumbChild key={activeTab}>{activeTab}</BreadcrumbChild>
            ]}
          />
        }
        onRefresh={onRefresh}
        loading={loading}
        contentClass="p-0 h-full overflow-y-hidden"
      >
        <div className="flex h-full flex-row">
          <div className="flex flex-1 flex-col">
            <TabbedLinks
              activeTabName={activeTab}
              tabLinks={tabLinks}
              contentClassName={clsx(
                "bg-white border border-t-0 border-gray-300 flex-1 overflow-y-auto",
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
