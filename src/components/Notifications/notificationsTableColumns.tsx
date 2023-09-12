import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Team } from "../../api/services/teams";
import { User } from "../../api/services/users";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { DateCell } from "../ConfigViewer/columns";
import { Icon } from "../Icon";
import JobHistoryStatusColumn from "../JobsHistory/JobHistoryStatusColumn";
import { JobHistoryStatus } from "../JobsHistory/JobsHistoryTable";

export const notificationEvents = [
  {
    label: "check.passed",
    value: "check.passed"
  },
  {
    label: "check.failed",
    value: "check.failed"
  },
  {
    label: "incident.created",
    value: "incident.created"
  },
  {
    label: "incident.responder.added",
    value: "incident.responder.added"
  },
  {
    label: "incident.responder.removed",
    value: "incident.responder.removed"
  },
  {
    label: "incident.comment.added",
    value: "incident.comment.added"
  },
  {
    label: "incident.dod.added",
    value: "incident.dod.added"
  },
  {
    label: "incident.dod.passed",
    value: "incident.dod.passed"
  },
  {
    label: "incident.dod.regressed",
    value: "incident.dod.regressed"
  },
  {
    label: "incident.status.open",
    value: "incident.status.open"
  },
  {
    label: "incident.status.closed",
    value: "incident.status.closed"
  },
  {
    label: "incident.status.mitigated",
    value: "incident.status.mitigated"
  },
  {
    label: "incident.status.resolved",
    value: "incident.status.resolved"
  },
  {
    label: "incident.status.investigating",
    value: "incident.status.investigating"
  },
  {
    label: "incident.status.identified",
    value: "incident.status.cancelled"
  }
];

export function JobStatusColumn({ cell }: CellContext<Notification, any>) {
  const value = cell.row.original.job_status;

  return <JobHistoryStatusColumn status={value} />;
}

export type Notification = {
  id: string;
  events: string[];
  template: string;
  filter?: string;
  properties?: Record<string, any>;
  person_id?: string;
  team_id?: string;
  custom_services?: {
    name: string;
    filters?: string;
    url?: string;
    connection?: string;
    properties?: Record<string, any>;
  }[];
  created_by?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  person?: User;
  team?: Team;
  job_status?: JobHistoryStatus;
};

export type NewNotification = Omit<
  Notification,
  "id" | "created_at" | "team" | "job_status" | "person"
>;

export type UpdateNotification = Omit<
  Notification,
  "created_at" | "team" | "job_status" | "person"
>;

export const notificationsTableColumns: ColumnDef<Notification, any>[] = [
  {
    header: "Recipients",
    id: "recipients",
    size: 100,
    cell: ({ cell }) => {
      const person = cell.row.original.person;
      const team = cell.row.original.team;
      const custom_services = cell.row.original.custom_services;

      return (
        <div className="flex flex-wrap gap-2">
          {person && (
            <div className="flex flex-row gap-2 items-center">
              <Avatar user={person} circular size="sm" /> {person.name}{" "}
            </div>
          )}

          {team && (
            <div className="flex flex-row gap-2 items-center">
              <Icon className="inline-block h-6" name={team.icon} /> {team.name}{" "}
            </div>
          )}

          {custom_services &&
            custom_services.length > 0 &&
            custom_services.map(
              ({ connection, name, filters, properties, url }) => (
                <div className="flex flex-row gap-2 items-center">
                  <Icon
                    className="inline-block h-6"
                    name={connection ?? name}
                  />
                  {name}
                </div>
              )
            )}
        </div>
      );
    }
  },
  {
    header: "Events",
    id: "events",
    accessorKey: "events",
    size: 150,
    cell: ({ getValue }) => {
      const value = getValue<Notification["events"]>();

      return (
        <div className="w-full flex flex-col">
          {value.map((event) => (
            <div className="block p-1">
              <Badge text={event} className="w-auto text-sm" />
            </div>
          ))}
        </div>
      );
    }
  },
  {
    header: "Title",
    id: "title",
    size: 100,
    accessorKey: "title"
  },
  {
    header: "Filter",
    id: "filter",
    size: 100,
    accessorKey: "filter"
  },
  {
    header: "Job Status",
    id: "job_status",
    cell: JobStatusColumn
  },
  {
    header: "Created At",
    id: "created_at",
    accessorKey: "created_at",
    size: 100,
    cell: DateCell
  },
  {
    header: "Updated At",
    id: "updated_at",
    accessorKey: "updated_at",
    size: 100,
    cell: DateCell
  },
  {
    header: "Created By",
    id: "created_by",
    accessorKey: "created_by",
    size: 100,
    cell: ({ cell }) => {
      const value = cell.row.original.created_by;
      return <Avatar user={value} circular />;
    }
  }
];
