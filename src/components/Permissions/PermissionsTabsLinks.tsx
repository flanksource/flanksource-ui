import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { useUser } from "@flanksource-ui/context";
import {
  AccessActions,
  AccessSummary
} from "@flanksource-ui/api/services/users";
import { fetchLegacyPermissionCounts } from "@flanksource-ui/api/services/permissions";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo } from "react";
import ConfigSidebar from "../Configs/Sidebar/ConfigSidebar";
import { ErrorBoundary } from "../ErrorBoundary";

// The tabs of the Permissions page, in order, with the type each lists
export const PERMISSIONS_TAB_RESOURCES = [
  {
    label: "Role Bindings",
    path: "/settings/permissions/role-bindings",
    type: "roleBinding",
    resource: tables.role_bindings
  },
  {
    label: "Roles",
    path: "/settings/permissions/roles",
    type: "role",
    resource: tables.roles
  },
  {
    label: "Scopes",
    path: "/settings/permissions/scopes",
    type: "scope",
    resource: tables.scopes
  },
  {
    label: "Subjects",
    path: "/settings/permissions/subjects",
    type: "access:review",
    resource: tables.access_review
  },
  {
    label: "Check Access",
    path: "/settings/permissions/check-access",
    type: "access:review",
    resource: tables.access_review
  }
] as const;

// The tabs of the deprecated Permissions and Permission Groups. They're read
// with read on role bindings, and only shown while some remain.
export const LEGACY_PERMISSIONS_TABS = [
  {
    label: "Permissions",
    path: "/settings/permissions/legacy-permissions",
    count: "permissions"
  },
  {
    label: "Permission Groups",
    path: "/settings/permissions/legacy-permission-groups",
    count: "permissionGroups"
  }
] as const;

// canOpenPermissionsTab reports whether the user may open a tab: its type's
// listing, or for subject tabs, access:review. The MCP tabs use it too.
export function canOpenPermissionsTab(
  tab: { type: string },
  access?: AccessSummary,
  accessActions?: AccessActions
) {
  if (tab.type === "access:review") {
    return accessActions?.[tab.type] === true;
  }
  const read = access?.[tab.type]?.read;
  return read === "all" || read === "some";
}

type PermissionsTabsLinksProps = {
  activeTab:
    | "Permissions"
    | "Permission Groups"
    | "Subjects"
    | "Check Access"
    | "Scopes"
    | "Roles"
    | "Role Bindings";
  children: React.ReactNode;
  className?: string;
  onRefresh?: () => void;
  loading?: boolean;
  headerAction?: React.ReactNode;
};

export default function PermissionsTabsLinks({
  activeTab,
  children,
  className,
  onRefresh = () => {},
  loading = false,
  headerAction
}: PermissionsTabsLinksProps) {
  const { access, access_actions } = useUser();

  const canReadLegacy = access?.[tables.role_bindings]?.read === "all";
  const { data: legacyCounts } = useQuery({
    queryKey: ["legacy_permission_counts"],
    queryFn: fetchLegacyPermissionCounts,
    enabled: canReadLegacy
  });

  const tabLinks = useMemo(() => {
    const tabs = PERMISSIONS_TAB_RESOURCES.filter((tab) =>
      canOpenPermissionsTab(tab, access, access_actions)
    ).map(({ label, path }) => ({ label, path, key: label }));

    const legacyTabs = canReadLegacy
      ? LEGACY_PERMISSIONS_TABS.filter(
          (tab) =>
            (legacyCounts?.[tab.count] ?? 0) > 0 || tab.label === activeTab
        ).map(({ label, path }) => ({
          label: `${label} (deprecated)`,
          path,
          key: label
        }))
      : [];

    return [...tabs, ...legacyTabs];
  }, [access, access_actions, activeTab, canReadLegacy, legacyCounts]);

  return (
    <>
      <Head prefix={`Permissions - ${activeTab}`} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="permissions" link="/settings/permissions">
                Permissions
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
              <ErrorBoundary>{children}</ErrorBoundary>
            </TabbedLinks>
          </div>
          <ConfigSidebar />
        </div>
      </SearchLayout>
    </>
  );
}
