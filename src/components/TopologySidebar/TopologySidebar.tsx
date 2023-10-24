import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { PlaybookRunsSidePanel } from "../Playbooks/Runs/PlaybookRunsSidePanel";
import Configs from "../Sidebars/configs";
import Incidents from "../Sidebars/incidents";
import SlidingSideBar from "../SlidingSideBar";
import TopologyConfigChanges from "../TopologyConfigChanges";
import TopologyDetails from "../TopologyDetails";
import { ComponentTeams } from "./ComponentTeams";
import TopologyActionBar from "./TopologyActionBar";
import TopologyCost from "./TopologyCost";
import TopologyInsights from "./TopologyInsights";
import { ComponentChecks } from "./ComponentChecks";
import { Topology } from "../../api/types/topology";

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
      <Configs
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

      <TopologyCost
        topology={topology}
        isCollapsed={openedPanel !== "Costs"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "Costs")
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
  );
}
