import { Button } from "@flanksource-ui/ui/Buttons/Button";
import SlidingSideBar from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useCallback, useState } from "react";
import { MdMenu } from "react-icons/md";
import { useParams } from "react-router-dom";
import { Topology } from "../../../api/types/topology";
import ConfigsPanel from "../../Configs/Sidebar/ConfigsPanel";
import Incidents from "../../Incidents/Sidebars/incidents";
import { PlaybookRunsSidePanel } from "../../Playbooks/Runs/PlaybookRunsSidePanel";
import { ComponentChecks } from "./ComponentChecks";
import { ComponentTeams } from "./ComponentTeams";
import TopologyActionBar from "./TopologyActionBar";
import TopologyConfigChanges from "./TopologyConfigChanges";
import TopologyDetails from "./TopologyDetails";
import TopologyInsights from "./TopologyInsights";

type Props = {
  topology?: Topology;
  refererId?: string;
  onRefresh?: () => void;
};

type SidePanels =
  | "TopologyDetails"
  | "Configs"
  | "Incidents"
  | "Costs"
  | "ConfigChanges"
  | "Teams"
  | "Insights"
  | "PlaybookRuns"
  | "ComponentChecks";

export default function TopologySidebar({
  topology,
  refererId,
  onRefresh
}: Props) {
  const [openedPanel, setOpenedPanel] = useState<SidePanels | undefined>(
    "TopologyDetails"
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { id } = useParams();

  const panelCollapsedStatusChange = useCallback(
    (status: boolean, panel: SidePanels) => {
      if (status) {
        setOpenedPanel(panel);
      } else {
        setOpenedPanel(undefined);
      }
    },
    []
  );

  if (!id) {
    return null;
  }

  return (
    <>
      <div className="fixed right-2 top-20 flex flex-col lg:hidden">
        <Button
          title="Show Sidebar"
          className="btn-text"
          icon={<MdMenu />}
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
        />
      </div>
      <SlidingSideBar hideToggle>
        <TopologyActionBar topology={topology} onRefresh={onRefresh} />
        <TopologyDetails
          isCollapsed={openedPanel !== "TopologyDetails"}
          onCollapsedStateChange={(status) =>
            panelCollapsedStatusChange(status, "TopologyDetails")
          }
          topology={topology}
          refererId={refererId}
        />
        <ConfigsPanel
          topologyId={id}
          isCollapsed={openedPanel !== "Configs"}
          onCollapsedStateChange={(status) =>
            panelCollapsedStatusChange(status, "Configs")
          }
        />
        <Incidents
          topologyId={id}
          isCollapsed={openedPanel !== "Incidents"}
          onCollapsedStateChange={(status) =>
            panelCollapsedStatusChange(status, "Incidents")
          }
        />

        <TopologyConfigChanges
          topologyID={id}
          isCollapsed={openedPanel !== "ConfigChanges"}
          onCollapsedStateChange={(status) =>
            panelCollapsedStatusChange(status, "ConfigChanges")
          }
        />

        <ComponentChecks
          componentId={id}
          isCollapsed={openedPanel !== "ComponentChecks"}
          onCollapsedStateChange={(status) =>
            panelCollapsedStatusChange(status, "ComponentChecks")
          }
        />

        <PlaybookRunsSidePanel
          panelType="topology"
          componentId={id}
          isCollapsed={openedPanel !== "PlaybookRuns"}
          onCollapsedStateChange={(status) =>
            panelCollapsedStatusChange(status, "PlaybookRuns")
          }
        />

        <ComponentTeams
          componentId={id}
          isCollapsed={openedPanel !== "Teams"}
          onCollapsedStateChange={(status) =>
            panelCollapsedStatusChange(status, "Teams")
          }
        />
        <TopologyInsights
          topologyId={id}
          isCollapsed={openedPanel !== "Insights"}
          onCollapsedStateChange={(status) =>
            panelCollapsedStatusChange(status, "Insights")
          }
        />
      </SlidingSideBar>
    </>
  );
}
