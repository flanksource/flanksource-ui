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
import { useMemo } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import ConfigSidebar from "../Configs/Sidebar/ConfigSidebar";
import { ErrorBoundary } from "../ErrorBoundary";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import { BsBell, BsBellSlash, BsBraces } from "react-icons/bs";

type NotificationTabsLinksProps = {
  activeTab: "Notifications" | "Rules" | "Silences";
  children: React.ReactNode;
  refresh?: () => void;
  isLoading?: boolean;
  className?: string;
  setIsModalOpen?: (isOpen: boolean) => void;
  isAddSilence?: boolean;
};

export default function NotificationTabsLinks({
  activeTab,
  children,
  refresh = () => {},
  isLoading,
  className,
  setIsModalOpen = () => {},
  isAddSilence = false
}: NotificationTabsLinksProps) {
  const pageTitle = isAddSilence ? "Add Notification Silence" : activeTab;
  const [searchParams] = useSearchParams();

  const [, setRefreshButtonClickedTrigger] = useAtom(
    refreshButtonClickedTrigger
  );

  const tabLinks = useMemo(() => {
    const query = searchParams.toString();
    const search = query ? `?${query}` : "";

    return [
      {
        label: "Notifications",
        path: "/notifications",
        key: "Notifications",
        icon: <BsBell />,
        search
      },
      {
        label: "Rules",
        path: "/notifications/rules",
        key: "Rules",
        icon: <BsBraces />,
        search
      },
      {
        label: "Silences",
        path: "/notifications/silences",
        key: "Silences",
        icon: <BsBellSlash />,
        search
      }
    ];
  }, [searchParams]);

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

                    ...(isAddSilence
                      ? [
                          <BreadcrumbChild key="silenced-notifications-add">
                            Add
                          </BreadcrumbChild>
                        ]
                      : [
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
                              <AiFillPlusCircle
                                size={32}
                                className="text-blue-600"
                              />
                            </button>
                          </AuthorizationAccessCheck>
                        ])
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
