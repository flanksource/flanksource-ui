import { Team, User } from "@flanksource-ui/api/types/users";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import MRTAvatarCell from "@flanksource-ui/ui/MRTDataTable/Cells/MRTAvataCell";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { formatDuration } from "@flanksource-ui/utils/date";
import { atom, useAtom } from "jotai";
import { MRT_ColumnDef } from "mantine-react-table";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { Icon } from "../../ui/Icons/Icon";
import JobHistoryStatusColumn from "../JobsHistory/JobHistoryStatusColumn";
import { JobsHistoryDetails } from "../JobsHistory/JobsHistoryDetails";
import { JobHistoryStatus } from "../JobsHistory/JobsHistoryTable";

export const notificationMostCommonErrorAtom = atom<Notification | undefined>(
  undefined
);

export const notificationEvents = [
  // Source: mission-control/api/event.go
  {
    label: "check.failed",
    value: "check.failed"
  },
  {
    label: "check.passed",
    value: "check.passed"
  },
  {
    label: "component.healthy",
    value: "component.healthy"
  },
  {
    label: "component.unhealthy",
    value: "component.unhealthy"
  },
  {
    label: "component.unknown",
    value: "component.unknown"
  },
  {
    label: "component.warning",
    value: "component.warning"
  },
  {
    label: "config.created",
    value: "config.created"
  },
  {
    label: "config.deleted",
    value: "config.deleted"
  },
  {
    label: "config.healthy",
    value: "config.healthy"
  },
  {
    label: "config.unhealthy",
    value: "config.unhealthy"
  },
  {
    label: "config.unknown",
    value: "config.unknown"
  },
  {
    label: "config.updated",
    value: "config.updated"
  },
  {
    label: "config.warning",
    value: "config.warning"
  },
  {
    label: "playbook.approval.inserted",
    value: "playbook.approval.inserted"
  },
  {
    label: "playbook.spec.approval.updated",
    value: "playbook.spec.approval.updated"
  }
].sort((a, b) => a.label.localeCompare(b.label));

export function StatusColumn({ cell }: MRTCellProps<Notification>) {
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
  source?: "KubernetesCRD" | "ConfigFile" | "UI" | "Topology";
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
  pending?: number;
  avg_duration_ms?: number;
  failed?: number;
  success?: number;
  most_common_error?: string;
};

export type NewNotification = Omit<
  Notification,
  "id" | "created_at" | "team" | "job_status" | "person"
>;

export type UpdateNotification = Omit<
  Notification,
  "created_at" | "team" | "job_status" | "person"
>;

export const notificationsTableColumns: MRT_ColumnDef<Notification>[] = [
  {
    header: "Recipients",
    id: "recipients",
    size: 150,
    Cell: ({ cell }) => {
      const person = cell.row.original.person;
      const team = cell.row.original.team;
      const custom_services = cell.row.original.custom_services;

      return (
        <div className="flex flex-wrap gap-2">
          {person && (
            <div className="flex max-w-full flex-wrap items-center gap-2">
              <Avatar user={person} circular size="sm" /> {person.name}{" "}
            </div>
          )}

          {team && (
            <div className="flex max-w-full flex-wrap items-center gap-2">
              <Icon className="inline-block h-6" name={team.icon} /> {team.name}{" "}
            </div>
          )}

          {custom_services &&
            custom_services.length > 0 &&
            custom_services.map(({ connection, name }) => (
              <div
                className="flex flex-row items-center gap-2"
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
    Cell: ({ row, column }) => {
      const value = row.getValue<Notification["events"]>(column.id);

      return (
        <div className="flex w-full flex-col">
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
    size: 150,
    accessorKey: "title",
    Cell: ({ row, column }) => {
      const value = row.getValue<string>(column.id);
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
    Cell: ({ row, column }) => {
      const value = row.getValue<string>(column.id);
      return (
        <div className="w-full overflow-hidden text-ellipsis">{value}</div>
      );
    }
  },
  // {
  //   header: "Status",
  //   id: "job_status",
  //   cell: StatusColumn
  // },
  {
    header: "Pending",
    id: "pending",
    accessorKey: "pending",
    size: 70
  },
  {
    header: "Failed",
    id: "failed",
    accessorKey: "failed",
    size: 70,
    Cell: ({ column, row }) => {
      const value = row.getValue<number>(column.id);
      const notification = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [, setMostCommonErrorNotification] = useAtom(
        notificationMostCommonErrorAtom
      );

      if (!value) {
        return null;
      }

      return (
        <>
          <div
            className="w-full"
            data-tooltip-id="most-common-error-tooltip"
            data-tooltip-content={
              value > 0 ? notification.most_common_error : undefined
            }
            onClick={(e) => {
              if (notification.most_common_error) {
                e.stopPropagation();
                setMostCommonErrorNotification(notification);
              }
            }}
          >
            {value}
          </div>
          {value > 0 && <Tooltip id="most-common-error-tooltip" />}
        </>
      );
    }
  },
  {
    header: "Success",
    id: "success",
    accessorKey: "success",
    size: 70
  },
  {
    header: "Avg Duration",
    id: "avg_duration_ms",
    accessorKey: "avg_duration_ms",
    size: 70,
    Cell: ({ row, column }) => {
      const value = row.getValue<number>(column.id);
      if (!value) {
        return null;
      }
      const formattedDuration = formatDuration(value);
      return formattedDuration;
    }
  },
  {
    header: "Created At",
    id: "created_at",
    accessorKey: "created_at",
    size: 100,
    Cell: MRTDateCell
  },
  {
    header: "Updated At",
    id: "updated_at",
    accessorKey: "updated_at",
    size: 100,
    Cell: MRTDateCell
  },
  {
    header: "Created By",
    id: "created_by",
    accessorKey: "created_by",
    size: 100,
    Cell: MRTAvatarCell
  }
];
