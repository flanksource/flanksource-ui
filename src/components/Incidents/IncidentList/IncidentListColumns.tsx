import { CellContext, ColumnDef } from "@tanstack/react-table";
import {
  Incident,
  IncidentSeverity,
  IncidentStatus
} from "../../../api/services/incident";
import { DateCell } from "../../ConfigViewer/columns";
import { typeItems } from "../data";
import { IncidentTypeTag } from "../../incidentTypeTag";
import { IncidentSeverityTag } from "../../IncidentSeverityTag";
import { IncidentStatusTag } from "../../IncidentStatusTag";
import { Responder } from "../../../api/services/responder";
import { Avatar } from "../../Avatar";
import { Icon } from "../../Icon";

export const incidentListColumns: ColumnDef<Incident, any>[] = [
  {
    header: "Id",
    accessorKey: "incident_id",
    size: 20
  },
  {
    header: "Type",
    accessorKey: "type",
    size: 30,
    cell: ({ getValue }: CellContext<any, any>) => {
      const type = getValue<keyof typeof typeItems>();
      return (
        <div className="flex flex-row">
          <IncidentTypeTag type={type} />
        </div>
      );
    }
  },
  {
    header: "Severity",
    accessorKey: "severity",
    size: 30,
    cell: ({ getValue }: CellContext<any, any>) => {
      const severity = getValue<IncidentSeverity>();
      return (
        <div className="flex flex-row">
          <IncidentSeverityTag severity={severity} />
        </div>
      );
    }
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 30,
    cell: ({ getValue }: CellContext<any, any>) => {
      const status = getValue<IncidentStatus>();
      return (
        <div className="flex flex-row">
          <IncidentStatusTag className="px-2" status={status!} />
        </div>
      );
    }
  },
  {
    header: "Name",
    accessorKey: "title",
    size: 150
  },
  {
    header: "Age",
    accessorKey: "created_at",
    size: 20,
    cell: DateCell
  },
  {
    header: "Responders",
    accessorKey: "responders",
    size: 70,
    enableSorting: false,
    cell: ({ getValue }: CellContext<any, any>) => {
      const responders = getValue<Responder[]>();

      return (
        <div className="flex flex-row gap-2">
          {responders.slice(0, 5).map((responder) => {
            if (responder.person_id) {
              return <Avatar user={responder.person} circular />;
            }
            return (
              <Icon name={responder.team?.name} icon={responder.team?.icon} />
            );
          })}
        </div>
      );
    }
  }
];
