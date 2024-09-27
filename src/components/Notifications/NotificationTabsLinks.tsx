import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import TabbedLinks from "@flanksource-ui/ui/Tabs/TabbedLinks";
import clsx from "clsx";
import { useAtom } from "jotai";
import { AiFillPlusCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import ConfigSidebar from "../Configs/Sidebar/ConfigSidebar";
import { ErrorBoundary } from "../ErrorBoundary";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";

const tabLinks = [
  { label: "Notifications", path: "/notifications" },
  { label: "Rules", path: "/notifications/rules" },
  { label: "Silences", path: "/notifications/silences" }
];

type NotificationTabsLinksProps = {
  activeTab: "Notifications" | "Rules" | "Silences";
  children: React.ReactNode;
  refresh?: () => void;
  isLoading?: boolean;
  className?: string;
  setIsModalOpen?: (isOpen: boolean) => void;
};

export default function NotificationTabsLinks({
  activeTab,
  children,
  refresh = () => {},
  isLoading,
  className,
  setIsModalOpen = () => {}
}: NotificationTabsLinksProps) {
  const pageTitle = activeTab;

  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  return (
    <>
      <Head prefix={pageTitle} />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="notifications" link="/notifications">
                Notifications
              </BreadcrumbRoot>,
              ...(activeTab === "Rules"
                ? [
                    <BreadcrumbChild key="rules">Rules</BreadcrumbChild>,

                    <AuthorizationAccessCheck
                      resource={tables.notifications}
                      action="write"
                      key="add-notifications"
                    >
                      <button
                        key="notifications-add"
                        type="button"
                        className=""
                        onClick={() => setIsModalOpen(true)}
                      >
                        <AiFillPlusCircle size={32} className="text-blue-600" />
                      </button>
                    </AuthorizationAccessCheck>
                  ]
                : []),
              ...(activeTab === "Silences"
                ? [
                    <BreadcrumbChild key="silenced-notifications">
                      Silences
                    </BreadcrumbChild>,

                    <AuthorizationAccessCheck
                      resource={tables.notifications}
                      action="write"
                      key="add-notifications"
                    >
                      <Link
                        key="notifications-silenced-add"
                        type="button"
                        className=""
                        to="/notifications/silences/add"
                      >
                        <AiFillPlusCircle size={32} className="text-blue-600" />
                      </Link>
                    </AuthorizationAccessCheck>
                  ]
                : [])
            ]}
          />
        }
        onRefresh={() => {
          setRefreshButtonClickedTrigger((prev) => prev + 1);
          refresh();
        }}
        loading={isLoading}
        contentClass="p-0 h-full overflow-y-hidden"
      >
        <div className={`flex h-full flex-row`}>
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
