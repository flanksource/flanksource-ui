import { AdjustmentsIcon } from "@heroicons/react/solid";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useQuery } from "@tanstack/react-query";
import { Provider } from "jotai";
import dynamic from "next/dynamic";
import React, { ReactNode, useEffect, useState, useMemo } from "react";
import { IconType } from "react-icons";
import { AiFillHeart } from "react-icons/ai";
import { BsLink, BsToggles } from "react-icons/bs";
import { FaBell, FaCrosshairs, FaTasks } from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import { ImLifebuoy } from "react-icons/im";
import {
  MdOutlineIntegrationInstructions,
  MdOutlineSupportAgent
} from "react-icons/md";
import { RiShieldUserFill } from "react-icons/ri";
import { VscKey } from "react-icons/vsc";
import { VscJson } from "react-icons/vsc";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { Canary, Icon } from "./components";
import AuthProviderWrapper from "./components/Authentication/AuthProviderWrapper";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { withAuthorizationAccessCheck } from "./components/Permissions/AuthorizationAccessCheck";
import { SchemaResource } from "./components/SchemaResourcePage/SchemaResource";
import {
  SchemaResourceType,
  schemaResourceTypes
} from "./components/SchemaResourcePage/resourceTypes";
import { ConfigPageContextProvider } from "./context/ConfigPageContext";
import { useFeatureFlagsContext } from "./context/FeatureFlagsContext";
import { HealthPageContextProvider } from "./context/HealthPageContext";
import { IncidentPageContextProvider } from "./context/IncidentPageContext";
import { UserAccessStateContextProvider } from "./context/UserAccessContext/UserAccessContext";
import { tables } from "./context/UserAccessContext/permissions";

import { PermissionsPage } from "./pages/Settings/PermissionsPage";
import ScopesPage from "./pages/Settings/ScopesPage";
import { features } from "./services/permissions/features";
import { getViewsForSidebar, ViewSummary } from "./api/services/views";
import { Head } from "./ui/Head";
import { LogsIcon } from "./ui/Icons/LogsIcon";
import { TopologyIcon } from "./ui/Icons/TopologyIcon";
import { SidebarLayout } from "./ui/Layout/SidebarLayout";
import FullPageSkeletonLoader from "./ui/SkeletonLoader/FullPageSkeletonLoader";
import { ToasterWithCloseButton } from "./ui/ToasterWithCloseButton";
import { stringSortHelper } from "./utils/common";

const TopologyPage = dynamic(
  import("@flanksource-ui/pages/TopologyPage").then((mod) => mod.TopologyPage)
);

const TopologyCardPage = dynamic(
  import("@flanksource-ui/pages/TopologyCard").then(
    (mod) => mod.TopologyCardPage
  )
);

const IncidentDetailsPage = dynamic(
  import("@flanksource-ui/pages/incident/IncidentDetails").then(
    (mod) => mod.IncidentDetailsPage
  )
);

const IncidentListPage = dynamic(
  import("@flanksource-ui/pages/incident/IncidentListPage").then(
    (mod) => mod.IncidentListPage
  )
);

const ConfigListPage = dynamic(
  import("@flanksource-ui/pages/config/ConfigList").then(
    (mod) => mod.ConfigListPage
  )
);

const ConfigDetailsPage = dynamic(
  import("@flanksource-ui/pages/config/details/ConfigDetailsPage").then(
    (mod) => mod.ConfigDetailsPage
  )
);

const ConfigDetailsIndexRedirect = dynamic(
  import(
    "@flanksource-ui/pages/config/details/ConfigDetailsIndexRedirect"
  ).then((mod) => mod.ConfigDetailsIndexRedirect)
);

const ConfigDetailsChangesPage = dynamic(
  import("@flanksource-ui/pages/config/details/ConfigDetailsChangesPage").then(
    (mod) => mod.ConfigDetailsChangesPage
  )
);

const PlaybooksListPage = dynamic(
  import("@flanksource-ui/pages/playbooks/PlaybooksList").then(
    (mod) => mod.PlaybooksListPage
  )
);

const LogsPage = dynamic(
  import("@flanksource-ui/pages/LogsPage").then((mod) => mod.LogsPage)
);

const ApplicationsPage = dynamic(
  import("@flanksource-ui/pages/applications/ApplicationsPage").then(
    (mod) => mod.ApplicationsPage
  )
);

const AuditReportPage = dynamic(
  import("@flanksource-ui/pages/audit-report/AuditReportPage").then(
    (mod) => mod.AuditReportPage
  )
);

const ViewPage = dynamic(
  import("@flanksource-ui/pages/views/ViewPage").then((mod) => mod.ViewPage)
);

const ViewsPage = dynamic(
  import("@flanksource-ui/pages/views/ViewsPage").then((mod) => mod.ViewsPage)
);

const ConfigChangesPage = dynamic(
  import("@flanksource-ui/pages/config/ConfigChangesPage").then(
    (mod) => mod.ConfigChangesPage
  )
);

const PlaybookRunsPage = dynamic(
  import("@flanksource-ui/pages/playbooks/PlaybookRunsPage").then(
    (mod) => mod.default
  )
);

const PlaybookRunsDetailsPage = dynamic(
  import("@flanksource-ui/pages/playbooks/PlaybookRunsDetails").then(
    (mod) => mod.default
  )
);

const ConfigInsightsPage = dynamic(
  import("@flanksource-ui/pages/config/ConfigInsightsList").then(
    (mod) => mod.ConfigInsightsPage
  )
);

const HealthPage = dynamic(
  import("@flanksource-ui/pages/health").then((mod) => mod.HealthPage)
);

const ConnectionsPage = dynamic(() =>
  import("@flanksource-ui/pages/Settings/ConnectionsPage").then(
    (m) => m.ConnectionsPage
  )
);

const EventQueueStatusPage = dynamic(() =>
  import("@flanksource-ui/pages/Settings/EventQueueStatus").then(
    (m) => m.EventQueueStatusPage
  )
);

const FeatureFlagsPage = dynamic(() =>
  import("@flanksource-ui/pages/Settings/FeatureFlagsPage").then(
    (m) => m.FeatureFlagsPage
  )
);

const NotificationSilencedAddPage = dynamic(
  () =>
    import(
      "@flanksource-ui/pages/Settings/notifications/NotificationSilencedAddPage"
    )
);

const NotificationsPage = dynamic(
  () => import("@flanksource-ui/pages/Settings/notifications/NotificationsPage")
);

const NotificationRulesPage = dynamic(
  () =>
    import(
      "@flanksource-ui/pages/Settings/notifications/NotificationsRulesPage"
    )
);

const NotificationsSilencedPage = dynamic(
  () =>
    import(
      "@flanksource-ui/pages/Settings/notifications/NotificationsSilencedPage"
    )
);

const UsersPage = dynamic(() =>
  import("@flanksource-ui/pages/UsersPage").then((m) => m.UsersPage)
);

const ConfigDetailsChecksPage = dynamic(() =>
  import("@flanksource-ui/pages/config/details/ConfigDetailsChecksPage").then(
    (m) => m.ConfigDetailsChecksPage
  )
);

const ConfigDetailsInsightsPage = dynamic(() =>
  import("@flanksource-ui/pages/config/details/ConfigDetailsInsightsPage").then(
    (m) => m.ConfigDetailsInsightsPage
  )
);

const ConfigDetailsPlaybooksPage = dynamic(() =>
  import("@flanksource-ui/pages/config/details/ConfigDetailsPlaybooks").then(
    (m) => m.ConfigDetailsPlaybooksPage
  )
);

const ConfigDetailsRelationshipsPage = dynamic(() =>
  import(
    "@flanksource-ui/pages/config/details/ConfigDetailsRelationshipsPage"
  ).then((mod) => mod.ConfigDetailsRelationshipsPage)
);

const ConfigDetailsAccessPage = dynamic(() =>
  import("@flanksource-ui/pages/config/details/ConfigDetailsAccessPage").then(
    (mod) => mod.ConfigDetailsAccessPage
  )
);

const ConfigDetailsAccessLogsPage = dynamic(() =>
  import(
    "@flanksource-ui/pages/config/details/ConfigDetailsAccessLogsPage"
  ).then((mod) => mod.ConfigDetailsAccessLogsPage)
);

const ConfigDetailsViewPage = dynamic(() =>
  import("@flanksource-ui/pages/config/details/ConfigDetailsViewPage").then(
    (mod) => mod.ConfigDetailsViewPage
  )
);

const ConfigScrapersEditPage = dynamic(
  () => import("@flanksource-ui/pages/config/settings/ConfigScrapersEditPage")
);

const ConfigScrapersPage = dynamic(
  () => import("@flanksource-ui/pages/config/settings/ConfigScrapersPage")
);

const ConfigPluginsPage = dynamic(
  () => import("@flanksource-ui/pages/config/settings/ConfigPluginsPage")
);

const EditIntegrationPage = dynamic(
  () => import("./components/Integrations/EditIntegrationPage")
);

const IntegrationsPage = dynamic(
  () => import("./components/Integrations/IntegrationsPage")
);

const JobsHistorySettingsPage = dynamic(
  () => import("./components/JobsHistory/JobsHistorySettingsPage")
);

const AgentsPage = dynamic(
  () => import("@flanksource-ui/components/Agents/AgentPage")
);

const TokensPage = dynamic(
  () => import("@flanksource-ui/components/Tokens/TokensPage")
);

const SchemaResourcePage = dynamic(() =>
  import("@flanksource-ui/components/SchemaResourcePage").then(
    (mod) => mod.SchemaResourcePage
  )
);

const ResourceNotificationsPage = dynamic(
  () =>
    import(
      "@flanksource-ui/pages/Settings/notifications/ResourceNotificationsPage"
    )
);

const isDevelopment = process.env.NODE_ENV === "development";

export type NavigationItems = {
  name: string;
  icon: React.ComponentType<any> | IconType;
  href: string;
  featureName: string;
  resourceName: string;
}[];

const navigation: NavigationItems = [
  {
    name: "Dashboard",
    href: "/topology",
    icon: TopologyIcon,
    featureName: features.topology,
    resourceName: tables.database
  },
  {
    name: "Health",
    href: "/health",
    icon: AiFillHeart,
    featureName: features.health,
    resourceName: tables.canaries
  },
  {
    name: "Incidents",
    href: "/incidents",
    icon: ImLifebuoy,
    featureName: features.incidents,
    resourceName: tables.incident
  },
  {
    name: "Catalog",
    href: "/catalog",
    icon: VscJson,
    featureName: features.config,
    resourceName: tables.database
  },
  {
    name: "Logs",
    href: "/logs",
    icon: LogsIcon,
    featureName: features.logs,
    resourceName: tables.database
  },
  {
    name: "Playbooks",
    href: "/playbooks",
    icon: ({ className }: { className?: string }) => (
      <Icon name="playbook" className={`${className} text-white`} />
    ),
    featureName: features.playbooks,
    resourceName: tables.database
  },
  {
    name: "Applications",
    href: "/applications",
    icon: ({ className }: { className?: string }) => (
      <Icon name="workflow" className={`${className} text-white`} />
    ),
    featureName: features.applications,
    resourceName: tables.applications
  }
];

export type SettingsNavigationItems = {
  name: string;
  icon: IconType;
  checkPath: boolean;
  submenu: (
    | (SchemaResourceType & { href: string })
    | {
        name: string;
        href: string;
        icon: React.ComponentType<{ className: string }>;
        featureName: string;
        resourceName: string;
      }
  )[];
};

const settingsNav: SettingsNavigationItems = {
  name: "Settings",
  icon: AdjustmentsIcon,
  checkPath: false,
  submenu: [
    {
      name: "Connections",
      href: "/settings/connections",
      icon: BsLink,
      featureName: features["settings.connections"],
      resourceName: tables.connections
    },
    {
      name: "Permissions",
      href: "/settings/permissions",
      icon: RiShieldUserFill,
      featureName: features["settings.permissions"],
      resourceName: tables.permissions
    },
    {
      name: "Scopes",
      href: "/settings/scopes",
      icon: FaCrosshairs,
      featureName: features["settings.permissions"],
      resourceName: tables.scopes
    },
    ...(process.env.NEXT_PUBLIC_AUTH_IS_CLERK === "true"
      ? []
      : [
          {
            name: "Users",
            href: "/settings/users",
            icon: HiUser,
            featureName: features["settings.users"],
            resourceName: tables.identities
          }
        ]),
    ...schemaResourceTypes
      // remove catalog_scraper from settings
      .filter((resource) => resource.table !== "config_scrapers")
      .map((x) => ({
        ...x,
        href: `/settings/${x.table}`
      })),
    {
      name: "Jobs History",
      href: "/settings/jobs",
      icon: FaTasks,
      featureName: features["settings.job_history"],
      resourceName: tables.database
    },
    {
      name: "Feature Flags",
      href: "/settings/feature-flags",
      icon: BsToggles,
      featureName: features["settings.feature_flags"],
      resourceName: tables.database
    },
    {
      name: "Log Backends",
      href: "/settings/log-backends",
      icon: LogsIcon,
      featureName: features["logs"],
      resourceName: tables.database
    },
    {
      name: "Event Queue",
      href: "/settings/event-queue-status",
      icon: FaTasks,
      featureName: features["settings.event_queue_status"],
      resourceName: tables.database
    },
    {
      name: "Agents",
      href: "/settings/agents",
      icon: MdOutlineSupportAgent,
      featureName: features.agents,
      resourceName: tables.database
    },
    {
      name: "Tokens",
      href: "/settings/tokens",
      icon: VscKey,
      featureName: features.agents,
      resourceName: tables.database
    },
    {
      name: "Notifications",
      href: "/notifications/rules",
      icon: FaBell,
      featureName: features["settings.notifications"],
      resourceName: tables.notifications
    },
    {
      name: "Integrations",
      href: "/settings/integrations",
      icon: MdOutlineIntegrationInstructions,
      featureName: features["settings.integrations"],
      resourceName: tables.database
    },
    {
      name: "Views",
      href: "/settings/views",
      icon: ({ className }: { className: string }) => (
        <Icon name="workflow" className={className} />
      ),
      featureName: features.views,
      resourceName: tables.views
    }
  ].sort((v1, v2) => stringSortHelper(v1.name, v2.name))
};

const CANARY_API = "/api/canary/api/summary";

export function HealthRoutes({ sidebar }: { sidebar: ReactNode }) {
  return (
    <Routes>
      <Route index element={<HealthPage url={CANARY_API} />} />
    </Routes>
  );
}

export function IncidentManagerRoutes({ sidebar }: { sidebar: ReactNode }) {
  const { featureFlagsLoaded } = useFeatureFlagsContext();

  if (
    !featureFlagsLoaded &&
    !window.location.pathname.startsWith("/view/topology")
  ) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <Routes>
      <Route path="" element={<Navigate to="/topology" />} />

      <Route
        path="/view/topology/:id"
        element={withAuthorizationAccessCheck(
          <TopologyCardPage />,
          tables.topologies,
          "read",
          true
        )}
      />

      <Route path="/view/health" element={<HealthPage url={CANARY_API} />} />

      <Route path="topology" element={sidebar}>
        <Route
          index
          element={withAuthorizationAccessCheck(
            <TopologyPage />,
            tables.database,
            "read",
            true
          )}
        />

        <Route
          path=":id"
          element={withAuthorizationAccessCheck(
            <TopologyPage />,
            tables.topologies,
            "read",
            true
          )}
        />
      </Route>

      <Route path="incidents" element={sidebar}>
        <Route
          path=":id"
          element={
            <ErrorBoundary>
              {withAuthorizationAccessCheck(
                <IncidentDetailsPage />,
                tables.incident,
                "read",
                true
              )}
            </ErrorBoundary>
          }
        />
        <Route index element={<IncidentListPage />} />
      </Route>

      <Route path="health" element={sidebar}>
        <Route
          index
          element={withAuthorizationAccessCheck(
            <HealthPage url={CANARY_API} />,
            tables.canaries,
            "read"
          )}
        />
      </Route>

      <Route path="playbooks" element={sidebar}>
        <Route
          index
          element={withAuthorizationAccessCheck(
            <PlaybooksListPage />,
            tables.database,
            "read",
            true
          )}
        />

        <Route path="runs">
          <Route
            index
            element={withAuthorizationAccessCheck(
              <PlaybookRunsPage />,
              tables.database,
              "read"
            )}
          />

          <Route
            path=":id"
            element={withAuthorizationAccessCheck(
              <PlaybookRunsDetailsPage />,
              tables.database,
              "read",
              true
            )}
          />
        </Route>
      </Route>

      <Route path="applications" element={sidebar}>
        <Route
          index
          element={withAuthorizationAccessCheck(
            <ApplicationsPage />,
            tables.applications,
            "read",
            true
          )}
        />
        <Route
          path=":namespace/:name"
          element={withAuthorizationAccessCheck(
            <AuditReportPage />,
            tables.applications,
            "read",
            true
          )}
        />
      </Route>

      <Route path="views" element={sidebar}>
        <Route
          path=":id"
          element={withAuthorizationAccessCheck(
            <ViewPage />,
            tables.views,
            "read",
            true
          )}
        />
      </Route>

      <Route path="view" element={sidebar}>
        <Route
          path=":namespace/:name"
          element={withAuthorizationAccessCheck(
            <ViewPage />,
            tables.views,
            "read",
            true
          )}
        />
        <Route
          path=":name"
          element={withAuthorizationAccessCheck(
            <ViewPage />,
            tables.views,
            "read",
            true
          )}
        />
      </Route>

      <Route path="notifications" element={sidebar}>
        <Route
          index
          element={withAuthorizationAccessCheck(
            <NotificationsPage />,
            tables.database,
            "read",
            true
          )}
        />

        <Route
          path="rules"
          element={withAuthorizationAccessCheck(
            <NotificationRulesPage />,
            tables.database,
            "read",
            true
          )}
        />

        <Route
          path="resource/:resourceId"
          element={withAuthorizationAccessCheck(
            <ResourceNotificationsPage />,
            tables.database,
            "read",
            true
          )}
        />

        <Route path="silences">
          <Route
            index
            element={withAuthorizationAccessCheck(
              <NotificationsSilencedPage />,
              tables.database,
              "read",
              true
            )}
          />

          <Route
            path="add"
            element={withAuthorizationAccessCheck(
              <NotificationSilencedAddPage />,
              tables.database,
              "write",
              true
            )}
          />
        </Route>
      </Route>

      <Route path="settings" element={sidebar}>
        <Route
          path="connections"
          element={withAuthorizationAccessCheck(
            <ConnectionsPage />,
            tables.connections,
            "read",
            true
          )}
        />
        <Route
          path="permissions"
          element={withAuthorizationAccessCheck(
            <PermissionsPage />,
            tables.permissions,
            "read"
          )}
        />
        <Route
          path="scopes"
          element={withAuthorizationAccessCheck(
            <ScopesPage />,
            tables.scopes,
            "read"
          )}
        />
        <Route
          path="users"
          element={withAuthorizationAccessCheck(
            <UsersPage />,
            tables.identities,
            "read"
          )}
        />
        <Route
          path="jobs"
          element={withAuthorizationAccessCheck(
            <JobsHistorySettingsPage />,
            tables.database,
            "read",
            true
          )}
        />

        <Route
          path="feature-flags"
          element={withAuthorizationAccessCheck(
            <FeatureFlagsPage />,
            tables.database,
            "read",
            true
          )}
        />

        <Route
          path="event-queue-status"
          element={withAuthorizationAccessCheck(
            <EventQueueStatusPage />,
            tables.database,
            "read",
            true
          )}
        />

        <Route path="agents">
          <Route
            index
            element={withAuthorizationAccessCheck(
              <AgentsPage />,
              tables.agents,
              "read",
              true
            )}
          />
        </Route>

        <Route path="tokens">
          <Route
            index
            element={withAuthorizationAccessCheck(
              <TokensPage />,
              tables.database,
              "read",
              true
            )}
          />
        </Route>

        <Route path="integrations">
          <Route
            index
            element={withAuthorizationAccessCheck(
              <IntegrationsPage />,
              tables.integrations,
              "read",
              true
            )}
          />

          <Route path=":type" caseSensitive>
            <Route
              path=":id"
              element={withAuthorizationAccessCheck(
                <EditIntegrationPage />,
                tables.integrations,
                "write",
                true
              )}
            />
          </Route>
        </Route>

        <Route path="views">
          <Route
            index
            element={withAuthorizationAccessCheck(
              <ViewsPage />,
              tables.views,
              "read",
              true
            )}
          />
        </Route>

        {settingsNav.submenu
          .filter((v) => (v as SchemaResourceType).table)
          .map((x) => {
            return (
              <Route key={x.name} path={(x as SchemaResourceType).table}>
                <Route
                  index
                  key={`${x.name}-list`}
                  element={withAuthorizationAccessCheck(
                    <SchemaResourcePage
                      resourceInfo={x as SchemaResourceType & { href: string }}
                    />,
                    tables[
                      (x as SchemaResourceType).table as keyof typeof tables
                    ] ?? tables.database,
                    "read",
                    true
                  )}
                />
                <Route
                  key={`${x.name}-detail`}
                  path={`:id`}
                  element={withAuthorizationAccessCheck(
                    <SchemaResource resourceInfo={x as SchemaResourceType} />,
                    tables[
                      (x as SchemaResourceType).table as keyof typeof tables
                    ] ?? tables.database,
                    "read",
                    true
                  )}
                />
              </Route>
            );
          })}
      </Route>

      <Route path="logs" element={sidebar}>
        <Route
          index
          element={
            <ErrorBoundary>
              {withAuthorizationAccessCheck(
                <LogsPage />,
                tables.database,
                "read",
                true
              )}
            </ErrorBoundary>
          }
        />
      </Route>

      {/* Redirect configs to catalog */}
      <Route path="configs" element={<Navigate to="/catalog" />} />

      <Route path="catalog" element={sidebar}>
        <Route
          index
          element={withAuthorizationAccessCheck(
            <ConfigListPage />,
            tables.database,
            "read",
            true
          )}
        />
        <Route
          path="changes"
          element={withAuthorizationAccessCheck(
            <ConfigChangesPage />,
            tables.database,
            "read",
            true
          )}
        />
        <Route
          path="insights"
          element={withAuthorizationAccessCheck(
            <ConfigInsightsPage />,
            tables.database,
            "read",
            true
          )}
        />
        <Route path="scrapers">
          <Route
            index
            element={withAuthorizationAccessCheck(
              <ConfigScrapersPage />,
              tables.database,
              "read",
              true
            )}
          />

          <Route
            path=":id"
            element={withAuthorizationAccessCheck(
              <ConfigScrapersEditPage />,
              tables.database,
              "read",
              true
            )}
          />
        </Route>
        <Route
          path="plugins"
          element={withAuthorizationAccessCheck(
            <ConfigPluginsPage />,
            tables.database,
            "read",
            true
          )}
        />
        <Route path=":id">
          <Route
            index
            element={
              <ErrorBoundary>
                {withAuthorizationAccessCheck(
                  <ConfigDetailsIndexRedirect />,
                  tables.database,
                  "read",
                  true
                )}
              </ErrorBoundary>
            }
          />
          <Route
            path="spec"
            element={
              <ErrorBoundary>
                {withAuthorizationAccessCheck(
                  <ConfigDetailsPage />,
                  tables.database,
                  "read",
                  true
                )}
              </ErrorBoundary>
            }
          />
          <Route
            path="changes"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsChangesPage />,
              tables.database,
              "read",
              true
            )}
          />
          <Route
            path="insights"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsInsightsPage />,
              tables.database,
              "read",
              true
            )}
          />
          <Route
            path="relationships"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsRelationshipsPage />,
              tables.database,
              "read",
              true
            )}
          />
          <Route
            path="playbooks"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsPlaybooksPage />,
              tables.database,
              "read",
              true
            )}
          />
          <Route
            path="checks"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsChecksPage />,
              tables.database,
              "read"
            )}
          />
          <Route
            path="access"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsAccessPage />,
              tables.database,
              "read"
            )}
          />
          <Route
            path="access-logs"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsAccessLogsPage />,
              tables.database,
              "read"
            )}
          />
          <Route
            path="view/:viewId"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsViewPage />,
              tables.database,
              "read",
              true
            )}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export function CanaryCheckerApp() {
  const [isBrowserEnv, setIsBrowserEnv] = useState(false);

  useEffect(() => {
    setIsBrowserEnv(true);
  }, []);

  if (!isBrowserEnv) {
    return null;
  }

  // TODO(ciju): the url is set at two places. axios.js#CanaryChecker and here.
  // Consolidate logic to one place.
  if (typeof window === "undefined") {
    return <FullPageSkeletonLoader />;
  }

  return (
    <>
      <Head prefix={"Canary Checker"} suffix="" />
      <BrowserRouter>
        <ToasterWithCloseButton />
        <Provider>
          <HealthPageContextProvider>
            <Canary url="/api/canary/api/summary" />
            <ReactQueryDevtools initialIsOpen={false} />
          </HealthPageContextProvider>
        </Provider>
      </BrowserRouter>
    </>
  );
}

function useDynamicNavigation() {
  const { data: views = [] } = useQuery<ViewSummary[]>({
    queryKey: ["views-sidebar"],
    queryFn: getViewsForSidebar,
    staleTime: 5 * 60 * 1000
  });

  return useMemo(() => {
    const viewsNavigationItems = views.map((view) => ({
      name: view.title || view.name,
      href: `/views/${view.id}`,
      icon: ({ className }: { className?: string }) => (
        <Icon
          name={view.icon || "workflow"}
          className={`${className} text-white`}
        />
      ),
      featureName: features.views,
      resourceName: tables.views
    }));

    const navigationWithViews = [...navigation, ...viewsNavigationItems];
    return navigationWithViews;
  }, [views]);
}

function SidebarWrapper() {
  const location = useLocation();
  const url = location.pathname.split("/");
  const path = url[2];
  const dynamicNavigation = useDynamicNavigation();

  const pathTrack = [
    "users",
    "jobs",
    "teams",
    "incident_rules",
    "config_scrapers",
    "topologies",
    "canaries",
    "connections",
    "feature-flags",
    "jobs"
  ];
  const checkPath = pathTrack.includes(path);

  return (
    <SidebarLayout
      navigation={dynamicNavigation}
      settingsNav={settingsNav}
      checkPath={checkPath}
    />
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Provider>
        <ToasterWithCloseButton />
        <AuthProviderWrapper>
          <UserAccessStateContextProvider>
            <HealthPageContextProvider>
              <ConfigPageContextProvider>
                <IncidentPageContextProvider>
                  <IncidentManagerRoutes sidebar={<SidebarWrapper />} />
                  {isDevelopment && (
                    <ReactQueryDevtools initialIsOpen={false} />
                  )}
                </IncidentPageContextProvider>
              </ConfigPageContextProvider>
            </HealthPageContextProvider>
          </UserAccessStateContextProvider>
        </AuthProviderWrapper>
      </Provider>
    </BrowserRouter>
  );
}
