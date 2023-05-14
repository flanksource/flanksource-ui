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
  TopologyPage
} from "./pages";
import { ConnectionsPage } from "./pages/ConnectionsPage";
import { FeatureFlagsPage } from "./pages/FeatureFlagsPage";
import { LogBackendsPage } from "./pages/LogBackendsPage";
import { UsersPage } from "./pages/UsersPage";
import { ConfigInsightsPage } from "./pages/config/ConfigInsightsList";
import { HealthPage } from "./pages/health";
import { resources } from "./services/permissions/resources";
import { stringSortHelper } from "./utils/common";
import { UserAccessStateContextProvider } from "./context/UserAccessContext";

export type NavigationItems = {
  name: string;
  icon: React.ComponentType<any> | IconType;
  href: string;
  resourceName: string;
}[];

const navigation: NavigationItems = [
  {
    name: "Dashboard",
    href: "/topology",
    icon: TopologyIcon,
    resourceName: resources.topology
  },
  {
    name: "Health",
    href: "/health",
    icon: AiFillHeart,
    resourceName: resources.health
  },
  {
    name: "Incidents",
    href: "/incidents",
    icon: ImLifebuoy,
    resourceName: resources.incidents
  },
  {
    name: "Config",
    href: "/configs",
    icon: VscJson,
    resourceName: resources.config
  },
  { name: "Logs", href: "/logs", icon: LogsIcon, resourceName: resources.logs }
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
      resourceName: resources["settings.connections"]
    },
    {
      name: "Users",
      href: "/settings/users",
      icon: HiUser,
      resourceName: resources["settings.users"]
    },
    ...schemaResourceTypes.map((x) => ({
      ...x,
      href: `/settings/${x.table}`
    })),
    {
      name: "Jobs History",
      href: "/settings/jobs",
      icon: FaTasks,
      resourceName: resources["settings.job_history"]
    },
    {
      name: "Feature Flags",
      href: "/settings/feature-flags",
      icon: BsToggles,
      resourceName: resources["settings.feature_flags"]
    },
    {
      name: "Log Backends",
      href: "/settings/log-backends",
      icon: LogsIcon,
      resourceName: resources["settings.logging_backends"]
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
        <Route path=":id" element={<TopologyPage />} />
        <Route index element={<TopologyPage />} />
      </Route>

      <Route path="incidents" element={sidebar}>
        <Route
          path=":id"
          element={
            <ErrorBoundary>
              <IncidentDetailsPage />
            </ErrorBoundary>
          }
        />
        <Route index element={<IncidentListPage />} />
      </Route>

      <Route path="health" element={sidebar}>
        <Route index element={<HealthPage url={CANARY_API} />} />
      </Route>

      <Route path="settings" element={sidebar}>
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="log-backends" element={<LogBackendsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="jobs" element={<JobsHistorySettingsPage />} />
        <Route path="feature-flags" element={<FeatureFlagsPage />} />
        {settingsNav.submenu
          .filter((v) => (v as SchemaResourceType).table)
          .map((x) => {
            return (
              <Route key={x.name} path={(x as SchemaResourceType).table}>
                <Route
                  index
                  key={`${x.name}-list`}
                  element={
                    <SchemaResourcePage
                      resourceInfo={x as SchemaResourceType & { href: string }}
                    />
                  }
                />
                <Route
                  key={`${x.name}-detail`}
                  path={`:id`}
                  element={
                    <SchemaResource resourceInfo={x as SchemaResourceType} />
                  }
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
              <LogsPage />
            </ErrorBoundary>
          }
        />
      </Route>

      <Route path="configs" element={sidebar}>
        <Route index element={<ConfigListPage />} />
        <Route path="changes" element={<ConfigChangesPage />} />
        <Route path="insights" element={<ConfigInsightsPage />} />

        <Route path=":id">
          <Route
            index
            element={
              <ErrorBoundary>
                <ConfigDetailsPage />
              </ErrorBoundary>
            }
          />
          <Route path="changes" element={<ConfigDetailsChangesPage />} />
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
    "templates",
    "canaries"
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
  const [user, setUser] = useState<User>();

  const { isLoading, error } = useQuery<User | null, AxiosError>(
    ["getUser", process.env.NEXT_PUBLIC_WITHOUT_SESSION === "true"],
    () => getUser(),
    {
      onSuccess: (data) => {
        setUser(data ?? undefined);
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
