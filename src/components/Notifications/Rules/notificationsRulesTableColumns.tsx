import { NotificationRules } from "@flanksource-ui/api/types/notifications";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import MRTAvatarCell from "@flanksource-ui/ui/MRTDataTable/Cells/MRTAvataCell";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { formatDuration, age } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { useState, useId } from "react";
import JobHistoryStatusColumn from "../../JobsHistory/JobHistoryStatusColumn";
import { JobsHistoryDetails } from "../../JobsHistory/JobsHistoryDetails";
import { Tooltip } from "react-tooltip";
import { Status } from "../../Status";

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
      accessorKey: "filter"
    },
    {
      header: "Status",
      id: "status",
      accessorKey: "error",
      size: 100,
      Cell: ({ row }) => {
        const error = row.original.error;
        return (
          <div title={error || undefined}>
            <Status
              status={error ? "unhealthy" : "healthy"}
              statusText={error ? "Paused" : "Active"}
            />
          </div>
        );
      }
    },
    {
      header: "Sent / Failed / Pending",
      id: "sent_failed_pending",
      size: 200,
      Cell: ({ row }) => {
        const sent = row.original.sent ?? 0;
        const failed = row.original.failed ?? 0;
        const pending = row.original.pending ?? 0;
        const mostCommonError = row.original.most_common_error ?? "";
        const errorAt = row.original.error_at;
        const tooltipId = useId();

        const tooltipContent = errorAt
          ? `${age(errorAt)} ago: ${mostCommonError}`
          : mostCommonError;

        return (
          <div className="flex flex-row flex-wrap items-center gap-1">
            {sent > 0 && (
              <Status status="healthy" statusText={`Sent: ${sent}`} />
            )}
            {failed > 0 && (
              <div
                className="inline-flex"
                data-tooltip-id={tooltipId}
                data-tooltip-content={tooltipContent}
              >
                <Status status="unhealthy" statusText={`Failed: ${failed}`} />
                {tooltipContent && (
                  <Tooltip id={tooltipId} className="z-[999999]" />
                )}
              </div>
            )}
            {pending > 0 && (
              <Status status="warning" statusText={`Pending: ${pending}`} />
            )}
          </div>
        );
      }
    },
    {
      header: "Avg Duration",
      id: "avg_duration_ms",
      accessorKey: "avg_duration_ms",
      size: 80,
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
      size: 80,
      Cell: ({ row }) => {
        const value = row.original.repeat_interval;
        return value;
      }
    },
    {
      header: "Wait For",
      id: "wait_for",
      accessorKey: "wait_for",
      size: 80,
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
