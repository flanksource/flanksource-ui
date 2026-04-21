import { JobHistorySummary as JobHistorySummaryType } from "@flanksource-ui/api/services/jobsHistory";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { formatJobName } from "@flanksource-ui/utils/common";
import { formatDuration } from "@flanksource-ui/utils/date";
import { MRT_ColumnDef } from "mantine-react-table";
import { useNavigate } from "react-router-dom";

type JobHistorySummaryProps = {
  data: JobHistorySummaryType[];
  isLoading?: boolean;
  isRefetching?: boolean;
  pageCount: number;
  totalEntries?: number;
};

const columns: MRT_ColumnDef<JobHistorySummaryType>[] = [
  {
    header: "Job Name",
    id: "name",
    accessorKey: "name",
    minSize: 220,
    Cell: ({ row }) => <span>{formatJobName(row.original.name)}</span>
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
    header: "Warning",
    id: "warning",
    accessorKey: "warning",
    size: 70
  },
  {
    header: "Running",
    id: "running",
    accessorKey: "running",
    size: 70
  },
  {
    header: "Stale",
    id: "stale",
    accessorKey: "stale",
    size: 70
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
  }
];

export default function JobHistorySummary({
  data,
  isLoading,
  isRefetching,
  pageCount,
  totalEntries
}: JobHistorySummaryProps) {
  const navigate = useNavigate();

  return (
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
  );
}
