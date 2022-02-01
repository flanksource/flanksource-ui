import { Routes, Route, Navigate } from "react-router-dom";

import { FolderIcon, HomeIcon } from "@heroicons/react/outline";

import { ImLifebuoy } from "react-icons/im";
import { AiFillHeart } from "react-icons/ai";
import { FaProjectDiagram } from "react-icons/fa";
import { ImLifebuoy } from "react-icons/im";
import { VscGraph } from "react-icons/vsc";
import { Route, Routes } from "react-router-dom";
import { getUser } from "./api/auth";
import { IncidentCreate } from "./components/Incidents/IncidentCreate";
import SidebarLayout from "./components/Layout/sidebar";
import { Loading } from "./components/Loading";
import { TraceView } from "./components/Traces";
import { AuthContext } from "./context";
import {
  IncidentDetailsPage,
  IncidentListPage, LogsPage,
  TopologyPage
} from "./pages";
import { getUser } from "./api/auth";
import { AuthContext } from "./context";
import { Loading } from "./components/Loading";
import { Toast, ToastContext } from "./components/Toast/toast";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
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
  { name: "Metrics", href: "/metrics", icon: VscGraph, current: false },
  { name: "Traces", href: "/traces", icon: FaProjectDiagram, current: false },
  {
    name: "Incidents",
    href: "/incidents",
    icon: ImLifebuoy,
    current: true
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

export function App() {
  const [user, setUser] = useState();
  const [toasts, setToasts] = useState([]);

  const toast = (title, message) => {
    setToasts([{ title, message }]);
    setTimeout(() => setToasts([]), 5000);
  };

  useEffect(() => {
    getUser()
      .then((u) => {
        setUser(u);
      })
      .catch(console.error);
  }, []);
  if (user == null) {
    return <Loading text="Logging in" />;
  }

  const sidebar = <SidebarLayout navigation={navigation} />;
  return (
    <ToastContext.Provider value={toast}>
      <AuthContext.Provider value={user}>
        <Routes path="/" element={sidebar}>
          <Route path="" element={<Navigate to="/topology" />} />
          <Route path="incidents" element={sidebar}>
            <Route path=":id" element={<IncidentDetailsPage />} />
            <Route path="create" element={<IncidentCreate />} />
            <Route index element={<IncidentListPage />} />
          </Route>
          <Route path="health" element={sidebar}>
            <Route index element={<CanaryPage url="/canary/api" />} />
          </Route>

          <Route path="topology" element={sidebar}>
            <Route path=":id" element={<TopologyPage url="/canary/api" />} />
            <Route index element={<TopologyPage url="/canary/api" />} />
          </Route>

          <Route path="examples" element={sidebar}>
            <Route path="topology" element={<TopologyPage url="/canary/api" />} />
          </Route>

          <Route path="logs" element={sidebar}>
            <Route index element={<LogsPage />} />
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
      </AuthContext.Provider>
    </ToastContext.Provider>
  );
}
