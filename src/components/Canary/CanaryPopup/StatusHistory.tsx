import React, { useEffect, useMemo, useState } from "react";
import { format } from "timeago.js";
import { CanaryStatus, Duration } from "../renderers";
import { HealthCheck, HealthCheckStatus } from "../../../types/healthChecks";
import { getStartValue } from "../../../utils/common";
import { getCheckStatuses } from "../../../api/services/topology";
import { toastError } from "../../Toast/toast";
import { useLoader } from "../../../hooks";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../DataTable";

type StatusHistoryProps = {
  check: Pick<Partial<HealthCheck>, "id" | "checkStatuses" | "description">;
  sticky?: boolean;
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
            status.error.split("\n").map((item) => (
              <>
                {item}
                <br />
              </>
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
  sticky = false
}: StatusHistoryProps) {
  const [statii, setStatti] = useState<HealthCheckStatus[]>([]);
  const { loading, setLoading } = useLoader();

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });

  const totalEntries = statii.length;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex,
      pageSize,
      pageCount,
      remote: false,
      enable: true,
      loading
    };
  }, [pageIndex, pageSize, pageCount, loading]);

  useEffect(() => {
    const payload = {
      check: check.id,
      includeMessages: true,
      start: getStartValue(timeRange)
    };
    setLoading(true);
    getCheckStatuses(check.id!, payload.start)
      .then((results) => {
        setStatti(results.data || []);
        setLoading(false);
      })
      .catch((err) => {
        toastError(`Loading status history failed`);
        setLoading(false);
      });
  }, [timeRange, check]);

  const getHistoryListView = (loading: boolean) => {
    if (loading) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400 text-md">
          Loading please wait...
        </div>
      );
    }
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-md">
        No status history available
      </div>
    );
  };

  if (!check) {
    return null;
  }

  if (loading) {
    return getHistoryListView(loading);
  }

  return (
    <div
      className="w-full flex flex-col"
      style={{ maxHeight: "calc(40vh - 10px)" }}
    >
      {statii?.length && (
        <DataTable
          stickyHead
          columns={columns}
          data={statii}
          tableStyle={{ borderSpacing: "0" }}
          className="flex-1"
          pagination={pagination}
          paginationClassName="p-2"
        />
      )}
      {!statii?.length && getHistoryListView(false)}
    </div>
  );
}
