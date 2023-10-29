import { useParams } from "react-router-dom";
import ConfigChanges from "../../Sidebars/ConfigChanges";
import ConfigInsights from "../../Sidebars/ConfigInsights";
import Configs from "../../Sidebars/configs";
import Incidents from "../../Sidebars/incidents";
import SlidingSideBar from "../../SlidingSideBar";
import { ConfigDetails } from "./ConfigDetails";
import ConfigActionBar from "./ConfigActionBar";
import { useCallback, useState } from "react";
import { PlaybookRunsSidePanel } from "../../Playbooks/Runs/PlaybookRunsSidePanel";

type SidePanels =
  | "ConfigDetails"
  | "Configs"
  | "Incidents"
  | "Costs"
  | "ConfigChanges"
  | "Insights"
  | "PlaybookRuns";

export default function ConfigSidebar() {
  const [openedPanel, setOpenedPanel] = useState<SidePanels | undefined>(
    "ConfigDetails"
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
      <ConfigActionBar configId={id} />
      <ConfigDetails
        configId={id}
        isCollapsed={openedPanel !== "ConfigDetails"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "ConfigDetails")
        }
      />
      <Incidents
        configId={id}
        isCollapsed={openedPanel !== "Incidents"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "Incidents")
        }
      />
      <ConfigInsights
        configID={id}
        isCollapsed={openedPanel !== "Insights"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "Insights")
        }
      />
      <PlaybookRunsSidePanel
        panelType="config"
        configId={id}
        isCollapsed={openedPanel !== "PlaybookRuns"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "PlaybookRuns")
        }
      />
      <ConfigChanges
        configID={id}
        isCollapsed={openedPanel !== "ConfigChanges"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "ConfigChanges")
        }
      />
      <Configs
        configId={id}
        isCollapsed={openedPanel !== "Configs"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "Configs")
        }
      />
    </SlidingSideBar>
  );
}
