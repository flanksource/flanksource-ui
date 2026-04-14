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

type PermissionsTabsLinksProps = {
  activeTab: "Permissions" | "Subjects";
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
  const [searchParams] = useSearchParams();

  const tabLinks = useMemo(() => {
    const query = searchParams.toString();
    const search = query ? `?${query}` : "";

    return [
      {
        label: "Permissions",
        path: "/settings/permissions",
        key: "Permissions",
        search
      },
      {
        label: "Subjects",
        path: "/settings/permissions/subjects",
        key: "Subjects",
        search
      }
    ];
  }, [searchParams]);

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
