import React, { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "timeago.js";
import { CanaryStatus, Duration } from "../renderers";
import { HealthCheck, HealthCheckStatus } from "../../../types/healthChecks";
import { getCheckStatuses } from "../../../api/services/topology";
import { toastError } from "../../Toast/toast";
import { useLoader } from "../../../hooks";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../DataTable";
import clsx from "clsx";
import { useCheckStattiQuery } from "../../../api/query-hooks/useCheckStattiQuery";

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

  const { data: response, isLoading } = useCheckStattiQuery(
    {
      start: timeRange,
      checkId: check.id!
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
            "h-64 flex items-center justify-center text-gray-400 text-md",
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
          "h-64 flex items-center justify-center text-gray-400 text-md",
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
      {statii?.length && (
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
