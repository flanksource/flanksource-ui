import { Routes, Route, BrowserRouter } from "react-router-dom";
import { FolderIcon, HomeIcon } from "@heroicons/react/outline";
import { ImLifebuoy } from "react-icons/im";
import { AiFillHeart } from "react-icons/ai";
import { FaProjectDiagram } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";

import { routeList, routes } from "./routes";
import SidebarLayout from "./components/Layout/sidebar";

export const navigation = [
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

export const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" }
];

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routeList.map((routeKey) => {
          const route = routes[routeKey];
          const element = route.useSidebarLayout ? (
            <SidebarLayout
              navigation={navigation}
              userNavigation={userNavigation}
            >
              {route.component}
            </SidebarLayout>
          ) : (
            route.component
          );
          return <Route key={route.path} path={route.path} element={element} />;
        })}
      </Routes>
    </BrowserRouter>
  );
}
