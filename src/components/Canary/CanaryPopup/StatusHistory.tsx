import React, { useEffect, useMemo, useState } from "react";
import { format } from "timeago.js";
import { CanaryStatus, Duration } from "../renderers";
import { HealthCheck, HealthCheckStatus } from "../../../types/healthChecks";
import { toastError } from "../../Toast/toast";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../DataTable";
import clsx from "clsx";
import { useCheckStattiQuery } from "../../../api/query-hooks/useCheckStattiQuery";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";

type StatusHistoryProps = React.HTMLProps<HTMLDivElement> & {
  check: Pick<Partial<HealthCheck>, "id" | "checkStatuses" | "description">;
  timeRange: string;
};

const statuses = {
  Healthy: {
    id: "Healthy",
    name: "Healthy",
    description: "Healthy",
    value: "Healthy"
  },
  Unhealthy: {
    id: "Unhealthy",
    name: "Unhealthy",
    description: "Unhealthy",
    value: "Unhealthy"
  },
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
  }
};

const durations = {
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
  },
  InASecond: {
    id: "InASecond",
    name: "in a second",
    description: "in a second",
    value: "in a second"
  },
  In5Seconds: {
    id: "In5Seconds",
    name: "in 5 seconds",
    description: "in 5 seconds",
    value: "in 5 seconds"
  },
  In10Seconds: {
    id: "In10Seconds",
    name: "in 10 seconds",
    description: "in 10 seconds",
    value: "in 10 seconds"
  },
  In30Seconds: {
    id: "In30Seconds",
    name: "in 30 seconds",
    description: "in 30 seconds",
    value: "in 30 seconds"
  },
  InAMinute: {
    id: "InAMinute",
    name: "in a minute",
    description: "in a minute",
    value: "in a minute"
  }
};

const columns: ColumnDef<HealthCheckStatus, any>[] = [
  {
    header: "Age",
    id: "age",
    cell: function AgeCell({
      row,
      getValue
    }: CellContext<HealthCheckStatus, any>) {
      const status = row.original;
      return <>{format(`${status.time} UTC`)}</>;
    },
    aggregatedCell: "",
    size: 100,
    accessorKey: "time"
  },
  {
    header: "Duration",
    id: "duration",
    size: 75,
    cell: function DurationCell({
      row,
      getValue
    }: CellContext<HealthCheckStatus, any>) {
      // const duration = row.original.duration;
      return <Duration ms={getValue()} />;
    },
    aggregatedCell: "",
    accessorKey: "duration"
  },
  {
    header: "Message",
    id: "message",
    size: 325,
    cell: function MessageCell({ row }: CellContext<HealthCheckStatus, any>) {
      const status = row.original;
      return (
        <div className="whitespace-normal overflow-x-hidden">
          {/* @ts-expect-error */}
          <CanaryStatus className="" status={status} /> {status.message}{" "}
          {status.error &&
            status.error.split("\n").map((item, index) => (
              <React.Fragment key={index}>
                {item}
                <br />
              </React.Fragment>
            ))}
        </div>
      );
    },
    aggregatedCell: "",
    accessorKey: "message"
  }
];

export function StatusHistory({
  check,
  timeRange,
  className,
  ...props
}: StatusHistoryProps) {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    "All"
  );
  const [selectedDuration, setSelectedDuration] = useState<string | undefined>(
    "All"
  );
  const status = useMemo(() => {
    if (selectedStatus === statuses.All.value) {
      return undefined;
    } else if (selectedStatus === statuses.Healthy.value) {
      return "true";
    } else if (selectedStatus === statuses.Unhealthy.value) {
      return "false";
    }
  }, [selectedStatus]);
  const duration = useMemo(() => {
    if (selectedDuration === durations.All.value) {
      return undefined;
    } else if (selectedDuration === durations.InASecond.value) {
      return 1000;
    } else if (selectedDuration === durations.In5Seconds.value) {
      return 5000;
    } else if (selectedDuration === durations.In10Seconds.value) {
      return 10000;
    } else if (selectedDuration === durations.In30Seconds.value) {
      return 30000;
    } else if (selectedDuration === durations.InAMinute.value) {
      return 60000;
    }
  }, [selectedDuration]);

  const { data: response, isLoading } = useCheckStattiQuery(
    {
      start: timeRange,
      checkId: check.id!,
      status,
      duration
    },
    {
      pageIndex,
      pageSize
    }
  );

  const statii = response?.data || [];
  const totalEntries = response?.totalEntries ?? 0;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading
    };
  }, [pageIndex, pageSize, pageCount, isLoading]);

  useEffect(() => {
    if (response?.error) {
      toastError(response?.error?.message);
    }
  }, [response?.error]);

  const getHistoryListView = (loading: boolean) => {
    if (loading) {
      return (
        <div
          className={clsx(
            "h-64 flex items-center justify-center text-gray-400 text-md h-full",
            className
          )}
          {...props}
        >
          Loading please wait...
        </div>
      );
    }
    return (
      <div
        className={clsx(
          "h-64 flex items-center justify-center text-gray-400 text-md h-full",
          className
        )}
        {...props}
      >
        No status history available
      </div>
    );
  };

  if (!check) {
    return null;
  }

  if (isLoading) {
    return getHistoryListView(isLoading);
  }

  return (
    <div className={clsx("w-full flex flex-col", className)} {...props}>
      <div className="flex flex-row space-x-4 p-2">
        <ReactSelectDropdown
          items={statuses}
          name="status"
          onChange={(value) => {
            setSelectedStatus(value);
          }}
          value={selectedStatus}
          className="w-auto max-w-[38rem]"
          dropDownClassNames="w-auto max-w-[38rem] left-0"
          hideControlBorder
          prefix={
            <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
              Status:
            </div>
          }
        />
        <ReactSelectDropdown
          items={durations}
          name="duration"
          onChange={(value) => {
            setSelectedDuration(value);
          }}
          value={selectedDuration}
          className="w-auto max-w-[38rem]"
          dropDownClassNames="w-auto max-w-[38rem] left-0"
          hideControlBorder
          prefix={
            <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
              Duration:
            </div>
          }
        />
      </div>
      {Boolean(statii?.length) && (
        <DataTable
          stickyHead
          columns={columns}
          data={statii}
          tableStyle={{ borderSpacing: "0" }}
          className="flex-1"
          pagination={pagination}
          paginationClassName="px-2 pb-2"
          preferencesKey="health-check-status-list"
          savePreferences={false}
        />
      )}
      {!statii?.length && getHistoryListView(false)}
    </div>
  );
}
