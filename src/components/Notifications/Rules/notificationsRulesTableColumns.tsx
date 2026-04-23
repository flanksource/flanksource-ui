import { NotificationRules } from "@flanksource-ui/api/types/notifications";
import { Badge } from "@flanksource-ui/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@flanksource-ui/components/ui/tooltip";
import MRTAvatarCell from "@flanksource-ui/ui/MRTDataTable/Cells/MRTAvataCell";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { formatDuration, age } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { useState } from "react";
import JobHistoryStatusColumn from "../../JobsHistory/JobHistoryStatusColumn";
import { JobsHistoryDetails } from "../../JobsHistory/JobsHistoryDetails";
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

function WrappedHeader({ title }: { title: string }) {
  return <span className="whitespace-normal leading-tight">{title}</span>;
}

function getEventBadgeClasses(event: string) {
  if (
    event.endsWith(".failed") ||
    event.endsWith(".unhealthy") ||
    event.endsWith(".deleted")
  ) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (event.endsWith(".warning")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (event.endsWith(".unknown")) {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }

  if (event.endsWith(".passed") || event.endsWith(".healthy")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (event.endsWith(".created") || event.endsWith(".updated")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (event.startsWith("playbook.")) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }

  return "border-muted-foreground/20 bg-muted text-foreground";
}

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
      header: "Name",
      id: "name",
      size: 150,
      accessorKey: "name"
    },
    {
      header: "Events",
      id: "events",
      accessorKey: "events",
      size: 150,
      Cell: ({ row, column }) => {
        const value =
          row.getValue<NotificationRules["events"]>(column.id) ?? [];
        const visibleEvents = value.slice(0, 2);
        const hiddenCount = value.length - visibleEvents.length;

        return (
          <div className="flex w-full flex-wrap items-center gap-1 py-1">
            {visibleEvents.map((event) => (
              <Badge
                key={event}
                variant="outline"
                className={`truncate text-xs ${getEventBadgeClasses(event)}`}
                title={event}
              >
                {event}
              </Badge>
            ))}
            {hiddenCount > 0 && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Badge variant="outline" className="px-2 text-xs">
                        +{hiddenCount}
                      </Badge>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[500px] break-all"
                  >
                    {value.slice(2).join(", ")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      }
    },
    {
      header: "Filter",
      id: "filter",
      size: 100,
      accessorKey: "filter",
      Cell: ({ row, column }) => {
        const value = row.getValue<string>(column.id) ?? "";

        if (!value) {
          return null;
        }

        return (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block max-w-[220px] truncate">{value}</span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[500px] break-all">
                {value}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      header: "Status",
      id: "status",
      accessorKey: "error",
      size: 80,
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
      Header: () => <WrappedHeader title="Sent / Failed / Pending" />,
      id: "sent_failed_pending",
      size: 200,
      Cell: ({ row }) => {
        const sent = row.original.sent ?? 0;
        const failed = row.original.failed ?? 0;
        const pending = row.original.pending ?? 0;
        const mostCommonError = row.original.most_common_error ?? "";
        const errorAt = row.original.error_at;

        const tooltipContent = errorAt
          ? `${age(errorAt)} ago: ${mostCommonError}`
          : mostCommonError;

        return (
          <div className="flex flex-row flex-wrap items-center gap-1">
            {sent > 0 && (
              <Status status="healthy" statusText={`Sent: ${sent}`} />
            )}
            {failed > 0 &&
              (tooltipContent ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-flex">
                        <Status
                          status="unhealthy"
                          statusText={`Failed: ${failed}`}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[500px]">
                      {tooltipContent}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Status status="unhealthy" statusText={`Failed: ${failed}`} />
              ))}
            {pending > 0 && (
              <Status status="warning" statusText={`Pending: ${pending}`} />
            )}
          </div>
        );
      }
    },
    {
      header: "Avg Duration",
      Header: () => <WrappedHeader title="Avg Duration" />,
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
      Header: () => <WrappedHeader title="Repeat Interval" />,
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
      Header: () => <WrappedHeader title="Created At" />,
      id: "created_at",
      accessorKey: "created_at",
      size: 100,
      Cell: MRTDateCell
    },
    {
      header: "Updated At",
      Header: () => <WrappedHeader title="Updated At" />,
      id: "updated_at",
      accessorKey: "updated_at",
      size: 100,
      Cell: MRTDateCell
    },
    {
      header: "Created By",
      Header: () => <WrappedHeader title="Created By" />,
      id: "created_by",
      accessorKey: "created_by",
      size: 100,
      Cell: MRTAvatarCell
    }
  ];
