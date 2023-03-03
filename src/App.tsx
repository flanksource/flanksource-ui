import { AdjustmentsIcon } from "@heroicons/react/solid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
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
import { Canary } from "./components";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LogsIcon } from "./components/Icons/LogsIcon";
import { TopologyIcon } from "./components/Icons/TopologyIcon";
import { SidebarLayout } from "./components/Layout";
import { SchemaResourcePage } from "./components/SchemaResourcePage";
import {
  SchemaResourceType,
  schemaResourceTypes
} from "./components/SchemaResourcePage/resourceTypes";
import { SchemaResource } from "./components/SchemaResourcePage/SchemaResource";
import { AuthContext } from "./context";
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
import { HealthPage } from "./pages/health";
import { TopologyPageContextProvider } from "./context/TopologyPageContext";
import { HealthPageContextProvider } from "./context/HealthPageContext";
import { ConfigPageContextProvider } from "./context/ConfigPageContext";
import { IncidentPageContextProvider } from "./context/IncidentPageContext";
import { User } from "./api/services/users";
import FullPageSkeletonLoader from "./components/SkeletonLoader/FullPageSkeletonLoader";
import { UsersPage } from "./pages/UsersPage";
import { HiUser } from "react-icons/hi";
import { FaTasks } from "react-icons/fa";
import JobsHistorySettingsPage from "./components/JobsHistory/JobsHistorySettingsPage";
import { ConfigInsightsPage } from "./pages/config/ConfigInsightsList";

const defaultStaleTime = 1000 * 60 * 5;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: defaultStaleTime
    }
  }
});

const navigation = [
  { name: "Topology", href: "/topology", icon: TopologyIcon },
  { name: "Health", href: "/health", icon: AiFillHeart },
  { name: "Logs", href: "/logs", icon: LogsIcon },
  { name: "Config", href: "/configs", icon: VscJson },
  { name: "Incidents", href: "/incidents", icon: ImLifebuoy }
];

export type NavigationItems = typeof navigation;

const settingsNav = {
  name: "Settings",
  icon: AdjustmentsIcon,
  checkPath: false,
  submenu: [
    {
      name: "Users",
      href: "/settings/users",
      icon: HiUser
    },
    ...schemaResourceTypes.map((x) => ({
      ...x,
      href: `/settings/${x.table}`
    })),
    {
      name: "Jobs History",
      href: "/settings/jobs",
      icon: FaTasks
    }
  ]
};

export type SettingsNavigationItems = typeof settingsNav;

const CANARY_API = "/api/canary/api";

export function HealthRoutes({ sidebar }: { sidebar: ReactNode }) {
  return (
    <Routes>
      <Route index element={<HealthPage url={CANARY_API} />} />
    </Routes>
  );
}

export function IncidentManagerRoutes({ sidebar }: { sidebar: ReactNode }) {
  return (
    <Routes>
      <Route path="" element={<Navigate to="/topology" />} />

      <Route path="topology" element={sidebar}>
        <Route path=":id" element={<TopologyPage />} />
        <Route index element={<TopologyPage />} />
      </Route>

      <Route path="incidents" element={sidebar}>
        <Route path=":id" element={<IncidentDetailsPage />} />
        <Route index element={<IncidentListPage />} />
      </Route>

      <Route path="health" element={sidebar}>
        <Route index element={<HealthPage url={CANARY_API} />} />
      </Route>

      <Route path="settings" element={sidebar}>
        <Route path="users" element={<UsersPage />} />
        <Route path="jobs" element={<JobsHistorySettingsPage />} />
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
      <QueryClientProvider client={queryClient}>
        <HealthPageContextProvider>
          <ReactTooltip />
          <Canary url="/api/canary/api" />
          <ReactQueryDevtools initialIsOpen={false} />
        </HealthPageContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

function SidebarWrapper() {
  const location = useLocation();
  const url = location.pathname.split("/");
  const path = url[2];

  const pathTrack = [
    "users",
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

  useEffect(() => {
    getUser().then((u) => {
      setUser(u);
    });
  }, []);

  if (!user) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TopologyPageContextProvider>
          <HealthPageContextProvider>
            <ConfigPageContextProvider>
              <IncidentPageContextProvider>
                <AuthContext.Provider value={{ user, setUser }}>
                  <ReactTooltip />
                  <IncidentManagerRoutes sidebar={<SidebarWrapper />} />
                </AuthContext.Provider>
                <ReactQueryDevtools initialIsOpen={false} />
              </IncidentPageContextProvider>
            </ConfigPageContextProvider>
          </HealthPageContextProvider>
        </TopologyPageContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
