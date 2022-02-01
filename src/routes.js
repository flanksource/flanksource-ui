import { FolderIcon, HomeIcon } from "@heroicons/react/outline";

import { ImLifebuoy } from "react-icons/im";
import { AiFillHeart } from "react-icons/ai";
import { FaProjectDiagram } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { Examples } from "./pages/Examples";
import { CanaryPage } from "./pages/Examples/canary";
import { TopologyPageSmall } from "./pages/Examples/TopologyPageSmall/TopologyPageSmall";
import { TopologyPageMedium } from "./pages/Examples/TopologyPageMedium/TopologyPageMedium";
import { TopologyPageLarge } from "./pages/Examples/TopologyPageLarge/TopologyPageLarge";
import { HeirarchyTestPageOld } from "./pages/Examples/heirarchyTestOld";
import { IncidentDetailsPage } from "./pages/TopologyViewer/Incident/IncidentDetails";
import { IncidentListPage } from "./pages/TopologyViewer/Incident/IncidentList";
import SidebarLayout from "./components/Layout/sidebar";

const navigation = [
  {
    name: "Dashboard",
    href: "#",
    icon: HomeIcon,
    current: false,
    body: <TopologyPageMedium />
  },
  {
    name: "Health",
    href: "#health",
    icon: AiFillHeart,
    current: false,
    body: <CanaryPage />
  },
  { name: "Logs", href: "#logs", icon: FolderIcon, current: false },
  { name: "Metrics", href: "#metrics", icon: VscGraph, current: false },
  { name: "Traces", href: "#traces", icon: FaProjectDiagram, current: false },
  {
    name: "Incidents",
    href: "#incidents",
    icon: ImLifebuoy,
    current: true,
    body: <IncidentListPage />
  }
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" }
];

export const routes = {
  examples: {
    name: "Examples",
    exact: true,
    path: `/examples`,
    component: <Examples />
  },
  layout: {
    name: "Layout",
    exact: true,
    path: `/layout`,
    component: (
      <SidebarLayout navigation={navigation} userNavigation={userNavigation} />
    )
  },
  topology: {
    name: "Topology",
    exact: true,
    path: `/topology-small`,
    component: <TopologyPageSmall />
  },
  topologyMedium: {
    name: "TopologyMedium",
    exact: true,
    path: `/topology-medium`,
    component: <TopologyPageMedium />
  },
  topologyLarge: {
    name: "TopologyLarge",
    exact: true,
    path: `/topology-large`,
    component: <TopologyPageLarge />
  },
  canary: {
    name: "Canary",
    exact: true,
    path: `/`,
    component: <CanaryPage />
  },
  heirarchyTest: {
    name: "HeirarchyTestPage",
    exact: true,
    path: `/heirarchyTest`,
    component: <HeirarchyTestPageOld />
  },
  incidentList: {
    name: "Incident List",
    exact: true,
    path: `/incident`,
    component: <IncidentListPage />
  },
  incidentDetails: {
    name: "Incident Details",
    exact: true,
    path: `/incident/:id`,
    component: <IncidentDetailsPage />
  }
};

export const routeList = Object.keys(routes);
