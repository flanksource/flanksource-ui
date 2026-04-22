import { Button } from "@flanksource-ui/components/ui/button";
import { JobHistorySummary as JobHistorySummaryType } from "@flanksource-ui/api/services/jobsHistory";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { formatJobName } from "@flanksource-ui/utils/common";
import { formatDuration } from "@flanksource-ui/utils/date";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobHistoryOverridesDialog from "./JobHistoryOverridesDialog";

type JobHistorySummaryProps = {
  data: JobHistorySummaryType[];
  isLoading?: boolean;
  isRefetching?: boolean;
  pageCount: number;
  totalEntries?: number;
};

export default function JobHistorySummary({
  data,
  isLoading,
  isRefetching,
  pageCount,
  totalEntries
}: JobHistorySummaryProps) {
  const navigate = useNavigate();

  const [isOverridesDialogOpen, setIsOverridesDialogOpen] = useState(false);
  const [selectedJobName, setSelectedJobName] = useState<string>();

  const columns: MRT_ColumnDef<JobHistorySummaryType>[] = useMemo(
    () => [
      {
        header: "Job Name",
        id: "name",
        accessorKey: "name",
        minSize: 220,
        Cell: ({ row }) => <span>{formatJobName(row.original.name)}</span>
      },
      {
        header: "Average Duration",
        id: "average_duration",
        accessorKey: "average_duration",
        size: 100,
        Cell: ({ row }) => {
          const rawValue = row.original.average_duration;
          const duration = Number(rawValue ?? 0);

          if (!Number.isFinite(duration) || duration <= 0) {
            return <span>-</span>;
          }

          return <span>{formatDuration(duration)}</span>;
        }
      },
      {
        header: "Total",
        id: "total",
        accessorKey: "total",
        size: 70
      },
      {
        header: "Success",
        id: "success",
        accessorKey: "success",
        size: 70
      },
      {
        header: "Failed",
        id: "failed",
        accessorKey: "failed",
        size: 70,
        Cell: ({ row }) => (
          <span className={row.original.failed > 0 ? "text-red-500" : ""}>
            {row.original.failed}
          </span>
        )
      },
      {
        header: "Skipped",
        id: "skipped",
        accessorKey: "skipped",
        size: 70
      },
      {
        header: "Last Run",
        id: "last_run_at",
        accessorKey: "last_run_at",
        size: 90,
        Cell: MRTDateCell
      },
      {
        header: "Action",
        id: "edit",
        enableSorting: false,
        size: 80,
        Cell: ({ row }) => (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2"
              onClick={() => {
                setSelectedJobName(row.original.name);
                setIsOverridesDialogOpen(true);
              }}
            >
              Manage
            </Button>
          </div>
        )
      }
    ],
    []
  );

  return (
    <>
      <MRTDataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isRefetching={isRefetching}
        enableServerSideSorting
        enableServerSidePagination
        manualPageCount={pageCount}
        totalRowCount={totalEntries}
        defaultSorting={[{ id: "last_run_at", desc: true }]}
        onRowClick={(row) => {
          navigate(`/settings/jobs/${encodeURIComponent(row.name)}`);
        }}
      />

      <JobHistoryOverridesDialog
        open={isOverridesDialogOpen}
        jobName={selectedJobName}
        onOpenChange={(isOpen) => {
          setIsOverridesDialogOpen(isOpen);
          if (!isOpen) {
            setSelectedJobName(undefined);
          }
        }}
      />
    </>
  );
}
