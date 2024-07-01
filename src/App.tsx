import { AdjustmentsIcon } from "@heroicons/react/solid";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
import React, { ReactNode, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { AiFillHeart } from "react-icons/ai";
import { BsLink, BsToggles } from "react-icons/bs";
import { FaBell, FaTasks } from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import { ImLifebuoy } from "react-icons/im";
import {
  MdOutlineIntegrationInstructions,
  MdOutlineSupportAgent
} from "react-icons/md";
import { VscJson } from "react-icons/vsc";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { Canary } from "./components";
import AgentsPage from "./components/Agents/AgentPage";
import AuthProviderWrapper from "./components/Authentication/AuthProviderWrapper";
import { ErrorBoundary } from "./components/ErrorBoundary";
import EditIntegrationPage from "./components/Integrations/EditIntegrationPage";
import IntegrationsPage from "./components/Integrations/IntegrationsPage";
import JobsHistorySettingsPage from "./components/JobsHistory/JobsHistorySettingsPage";
import NotificationsPage from "./components/Notifications/NotificationsSettingsPage";
import { withAuthorizationAccessCheck } from "./components/Permissions/AuthorizationAccessCheck";
import { SchemaResourcePage } from "./components/SchemaResourcePage";
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
import {
  ConfigChangesPage,
  ConfigDetailsChangesPage,
  ConfigDetailsPage,
  ConfigListPage,
  IncidentDetailsPage,
  IncidentListPage,
  LogsPage,
  TopologyPage
} from "./pages";
import { ConnectionsPage } from "./pages/Settings/ConnectionsPage";
import { EventQueueStatusPage } from "./pages/Settings/EventQueueStatus";
import { FeatureFlagsPage } from "./pages/Settings/FeatureFlagsPage";
import { TopologyCardPage } from "./pages/TopologyCard";
import { UsersPage } from "./pages/UsersPage";
import { ConfigInsightsPage } from "./pages/config/ConfigInsightsList";
import { ConfigDetailsChecksPage } from "./pages/config/details/ConfigDetailsChecksPage";
import { ConfigDetailsInsightsPage } from "./pages/config/details/ConfigDetailsInsightsPage";
import { ConfigDetailsPlaybooksPage } from "./pages/config/details/ConfigDetailsPlaybooks";
import { ConfigDetailsRelationshipsPage } from "./pages/config/details/ConfigDetailsRelationshipsPage";
import { HealthPage } from "./pages/health";
import PlaybookRunsDetailsPage from "./pages/playbooks/PlaybookRunsDetails";
import PlaybookRunsPage from "./pages/playbooks/PlaybookRunsPage";
import { PlaybooksListPage } from "./pages/playbooks/PlaybooksList";
import { features } from "./services/permissions/features";
import { Head } from "./ui/Head";
import { LogsIcon } from "./ui/Icons/LogsIcon";
import { TopologyIcon } from "./ui/Icons/TopologyIcon";
import { SidebarLayout } from "./ui/Layout/SidebarLayout";
import FullPageSkeletonLoader from "./ui/SkeletonLoader/FullPageSkeletonLoader";
import { ToasterWithCloseButton } from "./ui/ToasterWithCloseButton";
import { stringSortHelper } from "./utils/common";

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
    icon: FaTasks,
    featureName: features.playbooks,
    resourceName: tables.database
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
    ...schemaResourceTypes.map((x) => ({
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
      name: "Notifications",
      href: "/settings/notifications",
      icon: FaBell,
      featureName: features["settings.notifications"],
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
      name: "Integrations",
      href: "/settings/integrations",
      icon: MdOutlineIntegrationInstructions,
      featureName: features["settings.integrations"],
      resourceName: tables.database
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
          "read"
        )}
      />

      <Route path="topology" element={sidebar}>
        <Route
          path=":id"
          element={withAuthorizationAccessCheck(
            <TopologyPage />,
            tables.database,
            "read"
          )}
        />
        <Route
          index
          element={withAuthorizationAccessCheck(
            <TopologyPage />,
            tables.database,
            "read"
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
                "read"
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
            "read"
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
              "read"
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
            "read"
          )}
        />
        <Route
          path="notifications"
          element={withAuthorizationAccessCheck(
            <NotificationsPage />,
            tables.database,
            "read"
          )}
        />
        <Route
          path="feature-flags"
          element={withAuthorizationAccessCheck(
            <FeatureFlagsPage />,
            tables.database,
            "read"
          )}
        />

        <Route
          path="event-queue-status"
          element={withAuthorizationAccessCheck(
            <EventQueueStatusPage />,
            tables.database,
            "read"
          )}
        />

        <Route path="agents">
          <Route
            index
            element={withAuthorizationAccessCheck(
              <AgentsPage />,
              tables.agents,
              "read"
            )}
          />
        </Route>

        <Route path="integrations">
          <Route index element={<IntegrationsPage />} />

          <Route path=":type" caseSensitive>
            <Route path=":id" element={<EditIntegrationPage />} />
          </Route>
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
                    "read"
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
                    "read"
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
                "read"
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
            "read"
          )}
        />
        <Route
          path="changes"
          element={withAuthorizationAccessCheck(
            <ConfigChangesPage />,
            tables.database,
            "read"
          )}
        />
        <Route
          path="insights"
          element={withAuthorizationAccessCheck(
            <ConfigInsightsPage />,
            tables.database,
            "read"
          )}
        />
        <Route path=":id">
          <Route
            index
            element={
              <ErrorBoundary>
                {withAuthorizationAccessCheck(
                  <ConfigDetailsPage />,
                  tables.database,
                  "read"
                )}
              </ErrorBoundary>
            }
          />
          <Route
            path="changes"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsChangesPage />,
              tables.database,
              "read"
            )}
          />
          <Route
            path="insights"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsInsightsPage />,
              tables.database,
              "read"
            )}
          />
          <Route
            path="relationships"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsRelationshipsPage />,
              tables.database,
              "read"
            )}
          />
          <Route
            path="playbooks"
            element={withAuthorizationAccessCheck(
              <ConfigDetailsPlaybooksPage />,
              tables.database,
              "read"
            )}
          />
          <Route
            path="checks"
            element={withAccessCheck(
              <ConfigDetailsChecksPage />,
              tables.database,
              "read"
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

function SidebarWrapper() {
  const location = useLocation();
  const url = location.pathname.split("/");
  const path = url[2];

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
      navigation={navigation}
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
