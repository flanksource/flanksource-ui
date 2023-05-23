import { Row, SortingState, Updater } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import { JobsHistoryDetails } from "./JobsHistoryDetails";
import { JobsHistoryTableColumn } from "./JobsHistoryTableColumn";

export type JobHistoryStatus = "FINISHED" | "RUNNING";

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
};

type JobsHistoryTableProps = {
  jobs: JobHistory[];
  isLoading?: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  setPageState?: (state: { pageIndex: number; pageSize: number }) => void;
  hiddenColumns?: string[];
  onSortByChanged?: (sortByState: Updater<SortingState>) => void;
};

export default function JobsHistoryTable({
  jobs,
  isLoading,
  pageCount,
  pageIndex,
  pageSize,
  hiddenColumns = [],
  sortBy,
  sortOrder,
  onSortByChanged = () => {},
  setPageState = () => {}
}: JobsHistoryTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobHistory>();
  const tableSortByState = useMemo(() => {
    return [
      {
        id: sortBy,
        desc: sortOrder === "desc"
      }
    ];
  }, [sortBy, sortOrder]);

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
  }, [setPageState, pageIndex, pageSize, pageCount, isLoading]);

  const columns = useMemo(() => JobsHistoryTableColumn, []);

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
        columns={columns}
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
