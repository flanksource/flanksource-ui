import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { useUser } from "@flanksource-ui/context";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { Loading } from "@flanksource-ui/ui/Loading";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import clsx from "clsx";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ConfigSidebar from "../Configs/Sidebar/ConfigSidebar";
import { ErrorBoundary } from "../ErrorBoundary";
import { canOpenPermissionsTab } from "../Permissions/PermissionsTabsLinks";

// The tabs of the MCP settings, in order, with the grant each needs. These are
// admin tools, so none of them is gated on mcp:use. Playbooks and Views list
// the grants of mcp:run; Subjects answers what a subject may do through MCP.
export const MCP_TAB_RESOURCES = [
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
    type: "roleBinding",
    resource: tables.role_bindings
  },
  {
    label: "Views",
    path: "/settings/mcp/views",
    key: "Views",
    type: "roleBinding",
    resource: tables.role_bindings
  }
] as const;

// MCP_ACCESS_READ_ONLY disables the allow/deny switches on the MCP tabs. They
// write legacy Permission rows, which must no longer be created; they show the
// current state until they're changed to create Roles and RoleBindings.
export const MCP_ACCESS_READ_ONLY = true;

type McpTabsLinksProps = {
  activeTab: "Playbooks" | "Views" | "Subject access";
  children: React.ReactNode;
  className?: string;
  onRefresh?: () => void;
  loading?: boolean;
  isInitialLoading?: boolean;
  loadingText?: string;
  headerAction?: React.ReactNode;
};

export default function McpTabsLinks({
  activeTab,
  children,
  className,
  onRefresh = () => {},
  loading = false,
  isInitialLoading = false,
  loadingText = "Loading...",
  headerAction
}: McpTabsLinksProps) {
  const [searchParams] = useSearchParams();
  const { access, access_actions } = useUser();

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
              <ErrorBoundary>
                {isInitialLoading ? (
                  <Loading className="h-full w-full py-8" text={loadingText} />
                ) : (
                  children
                )}
              </ErrorBoundary>
            </TabbedLinks>
          </div>
          <ConfigSidebar />
        </div>
      </SearchLayout>
    </>
  );
}
