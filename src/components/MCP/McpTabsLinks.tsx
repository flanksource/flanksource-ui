import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { useUser } from "@flanksource-ui/context";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ConfigSidebar from "../Configs/Sidebar/ConfigSidebar";
import { ErrorBoundary } from "../ErrorBoundary";
import { canOpenPermissionsTab } from "../Permissions/PermissionsTabsLinks";

// The tabs of the MCP settings, in order. Each reviews the access the MCP server enforces, so each takes
// access:review: Access lists who may use MCP (mcp:use), Subjects what one subject may use through it, and
// Playbooks and Views who may use one of them through it.
export const MCP_TAB_RESOURCES = [
  {
    label: "Access",
    path: "/settings/mcp/access",
    key: "Access",
    type: "access:review",
    resource: tables.access_review
  },
  {
    label: "Subjects",
    path: "/settings/mcp/subject-access",
    key: "Subject access",
    type: "access:review",
    resource: tables.access_review
  },
  {
    label: "Playbooks",
    path: "/settings/mcp/playbooks",
    key: "Playbooks",
    type: "access:review",
    resource: tables.access_review
  },
  {
    label: "Views",
    path: "/settings/mcp/views",
    key: "Views",
    type: "access:review",
    resource: tables.access_review
  }
] as const;

type McpTabsLinksProps = {
  activeTab: "Access" | "Playbooks" | "Views" | "Subject access";
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
};

export default function McpTabsLinks({
  activeTab,
  children,
  className,
  headerAction
}: McpTabsLinksProps) {
  const [searchParams] = useSearchParams();
  const { access, access_actions } = useUser();
  const queryClient = useQueryClient();
  // Every query of the MCP tabs, and of the explanation sheet, is refreshed together
  const loading =
    useIsFetching({ queryKey: ["mcp"] }) +
      useIsFetching({ queryKey: ["permissions-subjects"] }) >
    0;

  const tabLinks = useMemo(() => {
    const query = searchParams.toString();
    const search = query ? `?${query}` : "";

    return MCP_TAB_RESOURCES.filter((tab) =>
      canOpenPermissionsTab(tab, access, access_actions)
    ).map(({ label, path, key }) => ({ label, path, key, search }));
  }, [searchParams, access, access_actions]);

  return (
    <>
      <Head prefix={`MCP - ${activeTab}`} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="mcp" link="/settings/mcp">
                MCP
              </BreadcrumbRoot>,
              <BreadcrumbChild key={activeTab}>{activeTab}</BreadcrumbChild>,
              ...(headerAction ? [headerAction] : [])
            ]}
          />
        }
        onRefresh={() => {
          queryClient.invalidateQueries({ queryKey: ["mcp"] });
          queryClient.invalidateQueries({ queryKey: ["permissions-subjects"] });
        }}
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
