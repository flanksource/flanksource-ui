import { CellContext, ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Team, User } from "../../api/types/users";
import { DateCell } from "../../ui/table";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import JobHistoryStatusColumn from "../JobsHistory/JobHistoryStatusColumn";
import { JobsHistoryDetails } from "../JobsHistory/JobsHistoryDetails";
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
  },
  {
    label: "component.status.healthy",
    value: "component.status.healthy"
  },
  {
    label: "component.status.unhealthy",
    value: "component.status.unhealthy"
  },
  {
    label: "component.status.warning",
    value: "component.status.warning"
  },
  {
    label: "component.status.error",
    value: "component.status.error"
  },
  {
    label: "component.status.info",
    value: "component.status.info"
  }
].sort((a, b) => a.label.localeCompare(b.label));

export function StatusColumn({ cell }: CellContext<Notification, any>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const value = cell.row.original.job_status;

  return (
    <>
      <JobHistoryStatusColumn
        status={value}
        onClick={() => setIsModalOpen(true)}
      />
      <JobsHistoryDetails
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        job={{
          details: cell.row.original.job_details,
          name: cell.row.original.job_name ?? cell.row.original.title
        }}
      />
    </>
  );
}

export type Notification = {
  id: string;
  title: string;
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
  job_name?: string;
  job_details?: {
    errors?: string[];
  };
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
            <div className="flex flex-wrap gap-2 items-center max-w-full">
              <Avatar user={person} circular size="sm" /> {person.name}{" "}
            </div>
          )}

          {team && (
            <div className="flex flex-wrap gap-2 items-center max-w-full">
              <Icon className="inline-block h-6" name={team.icon} /> {team.name}{" "}
            </div>
          )}

          {custom_services &&
            custom_services.length > 0 &&
            custom_services.map(({ connection, name }) => (
              <div
                className="flex flex-row gap-2 items-center"
                key={connection ?? name}
              >
                <Icon className="inline-block h-6" name={connection ?? name} />
                {name}
              </div>
            ))}
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
            <div className="block p-1" key={event}>
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
    accessorKey: "title",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <div className="w-full overflow-hidden text-ellipsis">{value}</div>
      );
    }
  },
  {
    header: "Filter",
    id: "filter",
    size: 100,
    accessorKey: "filter",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <div className="w-full overflow-hidden text-ellipsis">{value}</div>
      );
    }
  },
  {
    header: "Status",
    id: "job_status",
    cell: StatusColumn
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
