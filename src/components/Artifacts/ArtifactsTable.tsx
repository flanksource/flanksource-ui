import { Artifact } from "@flanksource-ui/api/types/artifacts";
import { formatBytes } from "@flanksource-ui/utils/common";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { Link } from "react-router-dom";

function SizeCell({ row }: MRTCellProps<Artifact>) {
  return <span className="text-xs">{formatBytes(row.original.size)}</span>;
}

function SourceCell({ row }: MRTCellProps<Artifact>) {
  const { playbook_run_action, config_change } = row.original;

  if (playbook_run_action) {
    return (
      <Link
        to={`/playbooks/runs/${playbook_run_action.playbook_run_id}`}
        className="text-xs text-blue-500 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        Playbook: {playbook_run_action.name}
      </Link>
    );
  }

  if (config_change) {
    return (
      <Link
        to={`/catalog/${config_change.config_id}/changes`}
        className="text-xs text-blue-500 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        Config Change: {config_change.change_type}
      </Link>
    );
  }

  return <span className="text-xs text-gray-400">-</span>;
}

const columns: MRT_ColumnDef<Artifact>[] = [
  {
    header: "Filename",
    accessorKey: "filename",
    minSize: 200,
    enableResizing: true
  },
  {
    header: "Content Type",
    accessorKey: "content_type",
    maxSize: 120
  },
  {
    header: "Size",
    accessorKey: "size",
    Cell: SizeCell,
    maxSize: 80
  },
  {
    header: "Source",
    accessorKey: "playbook_run_action_id",
    Cell: SourceCell,
    enableSorting: false,
    minSize: 150
  },
  {
    header: "Created",
    accessorKey: "created_at",
    Cell: MRTDateCell,
    sortingFn: "datetime",
    maxSize: 100
  }
];

type ArtifactsTableProps = {
  artifacts: Artifact[];
  isLoading?: boolean;
  pageCount?: number;
  totalRowCount?: number;
  onRowClick?: (artifact: Artifact) => void;
};

export function ArtifactsTable({
  artifacts,
  isLoading,
  pageCount,
  totalRowCount,
  onRowClick
}: ArtifactsTableProps) {
  return (
    <MRTDataTable
      columns={columns}
      data={artifacts}
      isLoading={isLoading}
      onRowClick={onRowClick}
      enableServerSideSorting
      enableServerSidePagination
      manualPageCount={pageCount}
      totalRowCount={totalRowCount}
      defaultSorting={[{ id: "created_at", desc: true }]}
    />
  );
}
