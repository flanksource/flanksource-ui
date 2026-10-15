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
  }
] as const;

type PermissionsTabsLinksProps = {
  activeTab: "Permissions" | "Subjects" | "Scopes" | "Roles" | "Role Bindings";
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
  const { access } = useUser();

  const tabLinks = useMemo(() => {
    return PERMISSIONS_TAB_RESOURCES.filter(
      ({ type }) =>
        access?.[type]?.read === "all" || access?.[type]?.read === "some"
    ).map(({ label, path }) => ({ label, path, key: label }));
  }, [access]);

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
