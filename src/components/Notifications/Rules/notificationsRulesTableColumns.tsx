import { NotificationRules } from "@flanksource-ui/api/types/notifications";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import MRTAvatarCell from "@flanksource-ui/ui/MRTDataTable/Cells/MRTAvataCell";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { formatDuration } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { useState } from "react";
import JobHistoryStatusColumn from "../../JobsHistory/JobHistoryStatusColumn";
import { JobsHistoryDetails } from "../../JobsHistory/JobsHistoryDetails";
import ErrorMessage from "@flanksource-ui/ui/FormControls/ErrorMessage";
import { FaDotCircle } from "react-icons/fa";

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

export function StatusColumn({ cell }: MRTCellProps<NotificationRules>) {
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
          name: cell.row.original.job_name ?? cell.row.original.name
        }}
      />
    </>
  );
}

export type NewNotificationRule = Omit<
  NotificationRules,
  "id" | "created_at" | "team" | "job_status" | "person"
>;

export type UpdateNotificationRule = Omit<
  NotificationRules,
  "created_at" | "team" | "job_status" | "person"
>;

export const notificationsRulesTableColumns: MRT_ColumnDef<NotificationRules>[] =
  [
    {
      header: "Events",
      id: "events",
      accessorKey: "events",
      size: 150,
      Cell: ({ row, column }) => {
        const value = row.getValue<NotificationRules["events"]>(column.id);

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
      header: "Name",
      id: "name",
      size: 150,
      accessorKey: "name"
    },
    {
      header: "Filter",
      id: "filter",
      size: 100,
      accessorKey: "filter",
      Cell: ({ row, column }) => {
        const value = row.original.filter;
        const error = row.original.error;

        return (
          <div className="flex flex-row overflow-hidden text-ellipsis">
            <ErrorMessage message={error} tooltip={true} />
            {value}
          </div>
        );
      }
    },
    {
      header: "Status",
      id: "status",
      accessorKey: "error",
      size: 100,
      Cell: ({ row }) => {
        const error = row.original.error;
        return (
          <div className="flex items-center gap-2" title={error || undefined}>
            <FaDotCircle className={error ? "text-red-500" : "text-green-500"} />
            <span>{error ? "Paused" : "Active"}</span>
          </div>
        );
      }
    },
    {
      header: "Pending",
      id: "pending",
      accessorKey: "pending",
      size: 90
    },
    {
      header: "Failed",
      id: "failed",
      accessorKey: "failed",
      size: 70,
      Cell: ({ row }) => {
        return (
          <ErrorMessage message={row.original.most_common_error} tooltip={true}>
            {row.original.failed}
          </ErrorMessage>
        );
      }
    },
    {
      header: "Sent",
      id: "sent",
      accessorKey: "sent",
      Cell: ({ row }) => {
        const value = row.original.sent;
        return value;
      },
      size: 70
    },
    {
      header: "Avg Duration",
      id: "avg_duration_ms",
      accessorKey: "avg_duration_ms",
      size: 130,
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
      header: "Repeat Interval",
      id: "repeat_interval",
      accessorKey: "repeat_interval",
      size: 130,
      Cell: ({ row }) => {
        const value = row.original.repeat_interval;
        return value;
      }
    },
    {
      header: "Wait For",
      id: "wait_for",
      accessorKey: "wait_for",
      size: 130,
      Cell: ({ row }) => {
        const value = row.original.wait_for;
        if (!value) {
          return null;
        }
        // Convert nanoseconds to date
        return dayjs.duration(value / 1000000, "milliseconds").humanize(false);
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
