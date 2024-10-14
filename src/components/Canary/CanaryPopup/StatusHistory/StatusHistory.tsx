import { useCheckStattiQuery } from "@flanksource-ui/api/query-hooks/useCheckStattiQuery";
import {
  HealthCheck,
  HealthCheckStatus
} from "@flanksource-ui/api/types/health";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { useAtom } from "jotai";
import React, { useEffect, useMemo, useState } from "react";
import { format } from "timeago.js";
import { toastError } from "../../../Toast/toast";
import { refreshCheckModalAtomTrigger } from "../../ChecksListing";
import { CanaryStatus, Duration } from "../../renderers";
import { StatusHistoryFilters } from "./StatusHistoryFilters";

type StatusHistoryProps = React.HTMLProps<HTMLDivElement> & {
  check: Pick<Partial<HealthCheck>, "id" | "checkStatuses" | "description">;
  timeRange: string;
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
    accessorKey: "time"
  },
  {
    header: "Duration",
    id: "duration",
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
    size: 550,
    cell: function MessageCell({ row }: CellContext<HealthCheckStatus, any>) {
      const status = row.original;
      return (
        <div className="overflow-x-hidden whitespace-normal">
          <CanaryStatus status={status} /> {status.message}
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
  const [refetchTrigger] = useAtom(refreshCheckModalAtomTrigger);

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });
  const [filters, setFilters] = useState<{
    duration: string | undefined;
    status: string | undefined;
  }>();

  const {
    data: response,
    isLoading,
    refetch
  } = useCheckStattiQuery(
    {
      start: timeRange,
      checkId: check.id!,
      status: filters?.status,
      duration: filters?.duration
    },
    {
      pageIndex,
      pageSize
    }
  );

  // Refetch the data when the refetchTrigger changes
  useEffect(() => {
    if (refetchTrigger) {
      refetch();
    }
  }, [refetch, refetchTrigger]);

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

  const onFiltersChange = (filters: {
    status: string | undefined;
    duration: string | undefined;
  }) => {
    let duration = filters.duration === "All" ? "" : filters.duration;
    let status = filters.status === "All" ? "" : filters.status;
    if (status) {
      status = status === "Healthy" ? "1" : "0";
    }
    if (filters.duration?.includes("ms")) {
      duration = filters.duration.replace("ms", "");
      if (isNaN(+duration)) {
        toastError("duration is allowed only in milli seconds & seconds");
        return;
      }
      duration = parseInt(duration, 10).toString();
    } else if (filters.duration?.includes("s")) {
      duration = filters.duration.replace("s", "");
      if (isNaN(+duration)) {
        toastError("duration is allowed only in milli seconds & seconds");
        return;
      }
      duration = (parseInt(duration, 10) * 1000).toString();
    } else if (duration) {
      toastError("duration is allowed only in milli seconds & seconds");
      return;
    }
    setFilters({
      status: status || undefined,
      duration: duration || undefined
    });
    setPageState({
      pageIndex: 0,
      pageSize: 50
    });
  };

  if (!check) {
    return null;
  }

  return (
    <div
      className={clsx(
        "flex w-full flex-1 flex-col overflow-y-auto bg-white",
        className
      )}
      {...props}
    >
      <StatusHistoryFilters onFiltersChanges={onFiltersChange} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <DataTable
          stickyHead
          columns={columns}
          data={statii}
          isLoading={isLoading || pagination.loading}
          tableStyle={{ borderSpacing: "0" }}
          className=""
          pagination={pagination}
          paginationClassName="pb-2"
          preferencesKey="health-check-status-list"
          savePreferences={false}
        />
      </div>
    </div>
  );
}
