import { DateCell } from "@flanksource-ui/ui/DataTable/Cells/DateCells";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import {
  IncidentSeverity,
  IncidentStatus,
  IncidentSummary,
  Responder
} from "../../../api/types/incident";
import { Avatar } from "../../../ui/Avatar";
import { IncidentSeverityTag } from "../IncidentSeverityTag";
import { IncidentStatusTag } from "../IncidentStatusTag";
import { typeItems } from "../data";
import { IncidentTypeTag } from "../incidentTypeTag";

export const incidentListColumns: ColumnDef<IncidentSummary, any>[] = [
  {
    header: "Id",
    accessorKey: "incident_id",
    size: 50
  },
  {
    header: "Type",
    accessorKey: "type",
    size: 50,
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
    size: 50,
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
      const responders = getValue<Responder[] | undefined>();

      return (
        <div className="flex flex-row gap-2">
          {responders?.slice(0, 5).map((responder) => {
            return <Avatar user={responder} key={responder.id} />;
          })}
        </div>
      );
    }
  }
];
