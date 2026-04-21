import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useCallback, useState } from "react";
import { JobsHistoryDetails } from "./JobsHistoryDetails";
import { JobsHistoryTableColumn as jobsHistoryTableColumn } from "./JobsHistoryTableColumn";

export type JobHistoryStatus =
  | "RUNNING"
  | "WARNING"
  | "FAILED"
  | "SUCCESS"
  | "STOPPED";

export const classNameMaps = new Map<JobHistoryStatus, string>([
  ["RUNNING", "text-yellow-500"],
  ["WARNING", "text-orange-500"],
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
    errors?:
      | {
          [key: string]: {
            error: {
              error?: string;
            };
          };
        }
      | string
      | string[];
    scrape_summary?: Record<string, Record<string, any>>;
    summary?: Record<string, any>;
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
  artifacts?: {
    id: string;
    filename?: string;
    path?: string;
    deleted_at?: string | null;
  }[];
  agent?: {
    id: string;
    name: string;
  };
};

type JobsHistoryTableProps = {
  jobs: JobHistory[];
  isLoading?: boolean;
  isRefetching?: boolean;
  pageCount: number;
  hiddenColumns?: string[];
  totalJobHistoryItems?: number;
  columns?: MRT_ColumnDef<JobHistory>[];
  mantineTableBodyCellProps?: {
    sx?: Record<string, any>;
  };
};

export default function JobsHistoryTable({
  jobs,
  isLoading,
  isRefetching,
  pageCount,
  hiddenColumns = [],
  totalJobHistoryItems,
  columns,
  mantineTableBodyCellProps
}: JobsHistoryTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobHistory>();

  const onRowClick = useCallback(
    (row: JobHistory) => {
      const jobId = row.id;
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
      <MRTDataTable
        data={jobs}
        columns={columns ?? jobsHistoryTableColumn}
        isLoading={isLoading}
        isRefetching={isRefetching}
        onRowClick={onRowClick}
        enableServerSideSorting
        enableServerSidePagination
        manualPageCount={pageCount}
        hiddenColumns={hiddenColumns}
        totalRowCount={totalJobHistoryItems}
        mantineTableBodyCellProps={mantineTableBodyCellProps}
      />
      {selectedJob && (
        <JobsHistoryDetails
          job={selectedJob}
          isModalOpen={isModalOpen}
          setIsModalOpen={(isOpen) => setIsModalOpen(isOpen)}
        />
      )}
    </>
  );
}
