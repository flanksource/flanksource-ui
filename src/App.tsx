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
import { VscJson } from "react-icons/vsc";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Canary } from "./components";
import { withAccessCheck } from "./components/AccessCheck/AccessCheck";
import AuthProviderWrapper from "./components/Authentication/AuthProviderWrapper";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LogsIcon } from "./components/Icons/LogsIcon";
import { TopologyIcon } from "./components/Icons/TopologyIcon";
import JobsHistorySettingsPage from "./components/JobsHistory/JobsHistorySettingsPage";
import { SidebarLayout } from "./components/Layout";
import NotificationsPage from "./components/Notifications/NotificationsSettingsPage";
import { SchemaResourcePage } from "./components/SchemaResourcePage";
import { SchemaResource } from "./components/SchemaResourcePage/SchemaResource";
import {
  SchemaResourceType,
  schemaResourceTypes
} from "./components/SchemaResourcePage/resourceTypes";
import FullPageSkeletonLoader from "./components/SkeletonLoader/FullPageSkeletonLoader";
import { ConfigPageContextProvider } from "./context/ConfigPageContext";
import {
  FeatureFlagsContextProvider,
  useFeatureFlagsContext
} from "./context/FeatureFlagsContext";
import { HealthPageContextProvider } from "./context/HealthPageContext";
import { IncidentPageContextProvider } from "./context/IncidentPageContext";
import { TopologyPageContextProvider } from "./context/TopologyPageContext";
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
import { LogBackendsPage } from "./pages/Settings/LogBackendsPage";
import { UsersPage } from "./pages/UsersPage";
import { ConfigDetailsInsightsPage } from "./pages/config/ConfigDetailsInsightsPage";
import { ConfigInsightsPage } from "./pages/config/ConfigInsightsList";
import { HealthPage } from "./pages/health";
import { features } from "./services/permissions/features";
import { stringSortHelper } from "./utils/common";
import { PlaybookSettingsPage } from "./pages/Settings/PlaybookSettingsPage";

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
    name: "Config",
    href: "/configs",
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
      featureName: features["settings.feature_flags"],
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
      name: "Playbooks",
      href: "/settings/playbooks",
      icon: FaTasks,
      featureName: features["settings.playbooks"],
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

  if (!featureFlagsLoaded) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <Routes>
      <Route path="" element={<Navigate to="/topology" />} />

      <Route path="topology" element={sidebar}>
        <Route
          path=":id"
          element={withAccessCheck(<TopologyPage />, tables.database, "read")}
        />
        <Route
          index
          element={withAccessCheck(<TopologyPage />, tables.database, "read")}
        />
      </Route>

      <Route path="incidents" element={sidebar}>
        <Route
          path=":id"
          element={
            <ErrorBoundary>
              {withAccessCheck(
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
          element={withAccessCheck(
            <HealthPage url={CANARY_API} />,
            tables.canaries,
            "read"
          )}
        />
      </Route>

      <Route path="settings" element={sidebar}>
        <Route
          path="connections"
          element={withAccessCheck(
            <ConnectionsPage />,
            tables.connections,
            "read"
          )}
        />
        <Route
          path="users"
          element={withAccessCheck(<UsersPage />, tables.identities, "read")}
        />
        <Route
          path="jobs"
          element={withAccessCheck(
            <JobsHistorySettingsPage />,
            tables.database,
            "read"
          )}
        />
        <Route
          path="notifications"
          element={withAccessCheck(
            <NotificationsPage />,
            tables.database,
            "read"
          )}
        />
        <Route
          path="feature-flags"
          element={withAccessCheck(
            <FeatureFlagsPage />,
            tables.database,
            "read"
          )}
        />
        <Route
          path="log-backends"
          element={withAccessCheck(
            <LogBackendsPage />,
            tables.database,
            "read"
          )}
        />

        <Route
          path="event-queue-status"
          element={withAccessCheck(
            <EventQueueStatusPage />,
            tables.database,
            "read"
          )}
        />

        <Route
          path="playbooks"
          element={withAccessCheck(
            <PlaybookSettingsPage />,
            tables.database,
            "read"
          )}
        />

        {settingsNav.submenu
          .filter((v) => (v as SchemaResourceType).table)
          .map((x) => {
            return (
              <Route key={x.name} path={(x as SchemaResourceType).table}>
                <Route
                  index
                  key={`${x.name}-list`}
                  element={withAccessCheck(
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
                  element={withAccessCheck(
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
              {withAccessCheck(<LogsPage />, tables.database, "read")}
            </ErrorBoundary>
          }
        />
      </Route>

      <Route path="configs" element={sidebar}>
        <Route
          index
          element={withAccessCheck(<ConfigListPage />, tables.database, "read")}
        />
        <Route
          path="changes"
          element={withAccessCheck(
            <ConfigChangesPage />,
            tables.database,
            "read"
          )}
        />
        <Route
          path="insights"
          element={withAccessCheck(
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
                {withAccessCheck(
                  <ConfigDetailsPage />,
                  tables.database,
                  "read"
                )}
              </ErrorBoundary>
            }
          />
          <Route
            path="changes"
            element={withAccessCheck(
              <ConfigDetailsChangesPage />,
              tables.database,
              "read"
            )}
          />
          <Route
            path="insights"
            element={withAccessCheck(
              <ConfigDetailsInsightsPage />,
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
    <BrowserRouter>
      <Provider>
        <FeatureFlagsContextProvider>
          <HealthPageContextProvider>
            <ReactTooltip />
            <Canary url="/api/canary/api/summary" />
            <ReactQueryDevtools initialIsOpen={false} />
          </HealthPageContextProvider>
        </FeatureFlagsContextProvider>
      </Provider>
    </BrowserRouter>
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
        <AuthProviderWrapper>
          <UserAccessStateContextProvider>
            <FeatureFlagsContextProvider>
              <TopologyPageContextProvider>
                <HealthPageContextProvider>
                  <ConfigPageContextProvider>
                    <IncidentPageContextProvider>
                      <ReactTooltip />
                      <IncidentManagerRoutes sidebar={<SidebarWrapper />} />
                      <ReactQueryDevtools initialIsOpen={false} />
                    </IncidentPageContextProvider>
                  </ConfigPageContextProvider>
                </HealthPageContextProvider>
              </TopologyPageContextProvider>
            </FeatureFlagsContextProvider>
          </UserAccessStateContextProvider>
        </AuthProviderWrapper>
      </Provider>
    </BrowserRouter>
  );
}
