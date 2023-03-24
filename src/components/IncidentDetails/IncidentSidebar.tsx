import { severityItems } from "../Incidents/data";
import { IncidentPriority } from "../../constants/incidentPriority";
import { Incident, IncidentStatus } from "../../api/services/incident";
import { IncidentsDefinitionOfDone } from "./DefinitionOfDone/IncidentsDefinitionOfDone";
import { IncidentChangelog } from "../Changelog/IncidentChangelog";
import SlidingSideBar from "../SlidingSideBar";
import { IncidentDetailsPanel } from "./IncidentDetailsPanel";

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

export const IncidentSidebar = ({
  incident,
  updateIncidentHandler
}: IncidentSidebarProps) => {
  return (
    <SlidingSideBar hideToggle={true}>
      <IncidentDetailsPanel
        incident={incident}
        updateIncidentHandler={updateIncidentHandler}
        data-panel-height-ratio="1.5"
      />
      <IncidentsDefinitionOfDone
        incidentId={incident.id}
        data-panel-height-ratio="0.75"
      />
      <IncidentChangelog
        incidentId={incident.id}
        className="flex flex-col bg-white"
        data-panel-height-ratio="0.75"
      />
    </SlidingSideBar>
  );
};
