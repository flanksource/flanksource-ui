import { DataTable, PaginationOptions } from "@flanksource-ui/ui/DataTable";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { Row } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { JobsHistoryDetails } from "./JobsHistoryDetails";
import { JobsHistoryTableColumn as jobsHistoryTableColumn } from "./JobsHistoryTableColumn";

export type JobHistoryStatus =
  | "FINISHED"
  | "RUNNING"
  | "WARNING"
  | "FAILED"
  | "SUCCESS"
  | "STOPPED";

export const classNameMaps = new Map<JobHistoryStatus, string>([
  ["RUNNING", "text-yellow-500"],
  ["WARNING", "text-orange-500"],
  ["FINISHED", "text-green-500"],
  ["SUCCESS", "text-green-500"],
  ["FAILED", "text-red-500"],
  ["STOPPED", "text-red-500"]
]);

export type JobHistory = {
  id: string;
  name: string;
  success_count: number;
  error_count: number;
  details?: {
    errors?: string[];
  };
  hostname: string;
  duration_millis: number;
  resource_type: string;
  resource_id: string;
  status: JobHistoryStatus;
  time_start: string;
  time_end: string;
  created_at: string;
  resource_name: string;
};

type JobsHistoryTableProps = {
  jobs: JobHistory[];
  isLoading?: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  hiddenColumns?: string[];
};

export default function JobsHistoryTable({
  jobs,
  isLoading,
  pageCount,
  pageIndex,
  pageSize,
  hiddenColumns = []
}: JobsHistoryTableProps) {
  const [params, setParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobHistory>();

  const [tableSortByState, onSortByChanged] = useReactTableSortState();

  const pagination: PaginationOptions = useMemo(() => {
    return {
      setPagination: (updater) => {
        const newParams =
          typeof updater === "function"
            ? updater({
                pageIndex,
                pageSize
              })
            : updater;
        params.set("pageIndex", newParams.pageIndex.toString());
        params.set("pageSize", newParams.pageSize.toString());
        setParams(params);
      },
      pageIndex,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading
    };
  }, [pageIndex, pageSize, pageCount, isLoading, params, setParams]);

  const onSelectJob = useCallback(
    (row: Row<JobHistory>) => {
      const jobId = row.original.id;
      const job = jobs.find((job) => job.id === jobId);
      if (job) {
        setSelectedJob(job);
        setIsModalOpen(true);
      }
    },
    [jobs]
  );

  return (
    <>
      <DataTable
        data={jobs}
        columns={jobsHistoryTableColumn}
        isLoading={isLoading}
        handleRowClick={onSelectJob}
        pagination={pagination}
        stickyHead
        preferencesKey="job-history"
        savePreferences={false}
        hiddenColumns={hiddenColumns}
        tableSortByState={tableSortByState}
        onTableSortByChanged={onSortByChanged}
        enableServerSideSorting
      />
      <JobsHistoryDetails
        job={selectedJob}
        isModalOpen={isModalOpen}
        setIsModalOpen={(isOpen) => setIsModalOpen(isOpen)}
      />
    </>
  );
}
