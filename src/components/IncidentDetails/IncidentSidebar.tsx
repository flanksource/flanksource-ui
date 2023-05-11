import { severityItems } from "../Incidents/data";
import { IncidentPriority } from "../../constants/incidentPriority";
import { Incident, IncidentStatus } from "../../api/services/incident";
import { IncidentsDefinitionOfDone } from "./DefinitionOfDone/IncidentsDefinitionOfDone";
import { IncidentChangelog } from "../Changelog/IncidentChangelog";
import SlidingSideBar from "../SlidingSideBar";
import { IncidentDetailsPanel } from "./IncidentDetailsPanel";
import { useCallback, useState } from "react";

export const priorities = Object.entries(severityItems).map(([key, value]) => ({
  label: value.name,
  value: key as keyof typeof IncidentPriority,
  icon: value.icon
}));

type IncidentSidebarProps = React.HTMLProps<HTMLDivElement> & {
  incident: Incident;
  updateStatusHandler: (status: IncidentStatus) => void;
  updateIncidentHandler: (newDataIncident: Partial<Incident>) => void;
  textButton: string;
};

type SidePanels = "IncidentDetails" | "DefinitionOfDone" | "Changelog";

export const IncidentSidebar = ({
  incident,
  updateIncidentHandler
}: IncidentSidebarProps) => {
  const [openedPanel, setOpenedPanel] = useState<SidePanels | undefined>(
    "IncidentDetails"
  );

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

  return (
    <SlidingSideBar hideToggle={true}>
      <IncidentDetailsPanel
        incident={incident}
        updateIncidentHandler={updateIncidentHandler}
        isCollapsed={openedPanel !== "IncidentDetails"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "IncidentDetails")
        }
      />
      <IncidentsDefinitionOfDone
        incidentId={incident.id}
        isCollapsed={openedPanel !== "DefinitionOfDone"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "DefinitionOfDone")
        }
      />
      <IncidentChangelog
        incidentId={incident.id}
        className="flex flex-col bg-white"
        isCollapsed={openedPanel !== "Changelog"}
        onCollapsedStateChange={(status) =>
          panelCollapsedStatusChange(status, "Changelog")
        }
      />
    </SlidingSideBar>
  );
};
