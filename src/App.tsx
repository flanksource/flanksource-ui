import { AdjustmentsIcon } from "@heroicons/react/solid";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { Provider } from "jotai";
import React, { ReactNode, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { AiFillHeart } from "react-icons/ai";
import { BsLink, BsToggles } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
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
import { getUser } from "./api/auth";
import { User } from "./api/services/users";
import { Canary } from "./components";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ErrorPage from "./components/Errors/ErrorPage";
import { LogsIcon } from "./components/Icons/LogsIcon";
import { TopologyIcon } from "./components/Icons/TopologyIcon";
import JobsHistorySettingsPage from "./components/JobsHistory/JobsHistorySettingsPage";
import { SidebarLayout } from "./components/Layout";
import { SchemaResourcePage } from "./components/SchemaResourcePage";
import { SchemaResource } from "./components/SchemaResourcePage/SchemaResource";
import {
  SchemaResourceType,
  schemaResourceTypes
} from "./components/SchemaResourcePage/resourceTypes";
import FullPageSkeletonLoader from "./components/SkeletonLoader/FullPageSkeletonLoader";
import { AuthContext } from "./context";
import { ConfigPageContextProvider } from "./context/ConfigPageContext";
import {
  FeatureFlagsContextProvider,
  useFeatureFlagsContext
} from "./context/FeatureFlagsContext";
import { HealthPageContextProvider } from "./context/HealthPageContext";
import { IncidentPageContextProvider } from "./context/IncidentPageContext";
import { TopologyPageContextProvider } from "./context/TopologyPageContext";
import {
  ConfigChangesPage,
  ConfigDetailsChangesPage,
  ConfigDetailsPage,
  ConfigListPage,
  IncidentDetailsPage,
  IncidentListPage,
  LogsPage,
  TopologyPage,
  ConfigDetailsInsights
} from "./pages";
import { ConnectionsPage } from "./pages/ConnectionsPage";
import { FeatureFlagsPage } from "./pages/FeatureFlagsPage";
import { LogBackendsPage } from "./pages/LogBackendsPage";
import { UsersPage } from "./pages/UsersPage";
import { ConfigInsightsPage } from "./pages/config/ConfigInsightsList";
import { HealthPage } from "./pages/health";
import { stringSortHelper } from "./utils/common";
import { UserAccessStateContextProvider } from "./context/UserAccessContext/UserAccessContext";
import { features } from "./services/permissions/features";
import { withAccessCheck } from "./components/AccessCheck/AccessCheck";
import { tables } from "./context/UserAccessContext/permissions";
import { isAuthEnabled } from "./context/Environment";

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
    {
      name: "Users",
      href: "/settings/users",
      icon: HiUser,
      featureName: features["settings.users"],
      resourceName: tables.identities
    },
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
              <Route path="insights" element={<ConfigDetailsInsights />} />
          <Route
            path="changes"
            element={withAccessCheck(
              <ConfigDetailsChangesPage />,
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
  const [user, setUser] = useState<User | null>(null);

  const { isLoading, error } = useQuery<User | null, AxiosError>(
    ["getUser", !isAuthEnabled()],
    () => getUser(),
    {
      onSuccess: (data) => {
        setUser(data ?? null);
      },
      onError: (err) => {
        console.error(err);
      }
    }
  );

  if (error && !user) {
    return <ErrorPage error={error} />;
  }

  if (!user || isLoading) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <BrowserRouter>
      <Provider>
        <AuthContext.Provider value={{ user, setUser }}>
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
        </AuthContext.Provider>
      </Provider>
    </BrowserRouter>
  );
}
