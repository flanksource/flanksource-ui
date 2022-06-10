import { FolderIcon, HomeIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { ImLifebuoy } from "react-icons/im";
import { VscJson } from "react-icons/vsc";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { getUser } from "./api/auth";
import { SidebarLayout, ConfigLayout } from "./components/Layout";
import { Loading } from "./components/Loading";
import { TraceView } from "./components/Traces";
import { AuthContext } from "./context";
import {
  ConfigDetailsPage,
  ConfigDetailsChangesPage,
  ConfigListPage,
  ConfigChangesPage,
  IncidentCreatePage,
  IncidentDetailsPage,
  IncidentListPage,
  LogsPage,
  TimelinePage,
  TopologyPage
} from "./pages";
import { DropdownDemoPage } from "./pages/Examples/dropdown-demo";
import { ModalPage } from "./pages/Examples/Modal/modal-page";
import { TypologyDropdownDemo } from "./pages/Examples/topology-dropdown";
import { RsDemoPage } from "./pages/Examples/rs-demo";
import { TopologyPage as ExamplesTopologyPage } from "./pages/Examples/Topology/topology-page";
import { TopologySelectorModalPage } from "./pages/Examples/TopologySelectorModalPage/TopologySelectorModalPage";
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

export function Placeholder({ text }) {
  return (
    <div className="py-4">
      <div className="h-96 border-4 border-dashed border-gray-200 rounded-lg">
        {text}
      </div>
    </div>
  );
}

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
        <Route path="create" element={<IncidentCreatePage />} />
        <Route index element={<IncidentListPage />} />
      </Route>

      <Route path="health" element={sidebar}>
        <Route index element={<HealthPage url="/canary/api" />} />
      </Route>

      <Route path="logs" element={sidebar}>
        <Route index element={<LogsPage />} />
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
          <Route index element={<ConfigDetailsPage />} />
          <Route path="changes" element={<ConfigDetailsChangesPage />} />
        </Route>
      </Route>

      <Route path="examples" element={sidebar}>
        <Route path="rs" element={<RsDemoPage />} />
        <Route path="dropdown" element={<DropdownDemoPage />} />
        <Route
          path="topology"
          element={<ExamplesTopologyPage url="/canary/api" />}
        />
        <Route
          path="topology-selector"
          element={<TopologySelectorModalPage url="/canary/api" />}
        />
        <Route path="modal" element={<ModalPage />} />
        <Route path="topology-dropdown" element={<TypologyDropdownDemo />} />
      </Route>

      <Route path="timeline" element={sidebar}>
        <Route index element={<TimelinePage />} />
      </Route>

      <Route path="metrics" element={sidebar}>
        <Route index element={<Placeholder text="metrics" />} />
      </Route>
      <Route path="layout">
        <Route index element={sidebar} />
      </Route>
      <Route path="traces" element={sidebar}>
        <Route index element={<TraceView />} />
      </Route>
    </Routes>
  );
}

function AppRoutes({ appDeployment, sidebar }) {
  switch (appDeployment) {
    case "INCIDENT_MANAGER":
      return <IncidentManagerRoutes sidebar={sidebar} />;
    case "CANARY_CHECKER":
      return <HealthRoutes sidebar={sidebar} />;
    default:
      return <div>Please set the APP_DEPLOYMENT config.</div>;
  }
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
        <AuthContext.Provider value={user}>
          <ReactTooltip />
          <AppRoutes appDeployment={window.APP_DEPLOYMENT} sidebar={sidebar} />
        </AuthContext.Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
