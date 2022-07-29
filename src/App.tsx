import { FolderIcon, HomeIcon } from "@heroicons/react/outline";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { ImLifebuoy } from "react-icons/im";
import { VscJson } from "react-icons/vsc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { getUser } from "./api/auth";
import { Canary } from "./components";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ConfigLayout, SidebarLayout } from "./components/Layout";
import { Loading } from "./components/Loading";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true
    }
  }
});

const navigation = [
  {
    name: "Topology",
    href: "/topology",
    icon: HomeIcon,
    current: false
  },
  {
    name: "Health",
    href: "/health",
    icon: AiFillHeart,
    current: false
  },
  { name: "Logs", href: "/logs", icon: FolderIcon, current: false },
  // { name: "Metrics", href: "/metrics", icon: VscGraph, current: false },
  // { name: "Traces", href: "/traces", icon: FaProjectDiagram, current: false },
  { name: "Config", href: "/config", icon: VscJson, current: false },
  // {
  //   name: "Timeline",
  //   href: "/timeline",
  //   icon: MdTimeline,
  //   current: false
  // },
  {
    name: "Incidents",
    href: "/incidents",
    icon: ImLifebuoy
  }
];

export function HealthRoutes({ sidebar }) {
  return (
    <Routes path="/" element={sidebar}>
      <Route index element={<HealthPage url="/canary/api" />} />
    </Routes>
  );
}

export function IncidentManagerRoutes({ sidebar }) {
  return (
    <Routes path="/" element={sidebar}>
      <Route path="" element={<Navigate to="/topology" />} />

      <Route path="topology" element={sidebar}>
        <Route path=":id" element={<TopologyPage url="/canary/api" />} />
        <Route index element={<TopologyPage url="/canary/api" />} />
      </Route>

      <Route path="incidents" element={sidebar}>
        <Route path=":id" element={<IncidentDetailsPage />} />
        <Route index element={<IncidentListPage />} />
      </Route>

      <Route path="health" element={sidebar}>
        <Route index element={<HealthPage url="/canary/api" />} />
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

      <Route path="config" element={sidebar}>
        {/* https://github.com/remix-run/react-router/issues/7239#issuecomment-898747642 */}
        <Route
          path=""
          element={
            <ConfigLayout
              title="Config"
              showSearchInput
              basePath="/config"
              navLinks={[
                { title: "Items", index: true },
                { title: "Changes", path: "changes" }
              ]}
            />
          }
        >
          <Route index element={<ConfigListPage />} />
          <Route path="changes" element={<ConfigChangesPage />} />
        </Route>

        <Route
          path=":id"
          element={
            <ConfigLayout
              backPath="/config"
              title="Config"
              basePath="/config/:id"
              navLinks={[
                { title: "Config", index: true },
                { title: "Changes", path: "changes" }
              ]}
            />
          }
        >
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
  // TODO(ciju): the url is set at two places. axios.js#CanaryChecker and here.
  // Consolidate logic to one place.
  return <Canary url="/api" />;
}

export function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    getUser().then((u) => {
      setUser(u);
    });
  }, []);
  if (user == null) {
    return <Loading text="Logging in" />;
  }

  const sidebar = <SidebarLayout navigation={navigation} />;
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ user, setUser }}>
          <ReactTooltip />
          <IncidentManagerRoutes sidebar={sidebar} />
        </AuthContext.Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
