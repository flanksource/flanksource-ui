import PermissionsMatrixTable, {
  PermissionsMatrixRow
} from "@flanksource-ui/components/Permissions/SubjectPermissions/PermissionsMatrixTable";
import { ReactNode } from "react";

type ResourceTypeMatrixSectionProps<TRow extends PermissionsMatrixRow> = {
  title: string;
  count: number;
  actions: string[];
  rows: TRow[];
  isRefreshing?: boolean;
  onRowClick?: (row: TRow) => void;
  isRowSelected?: (row: TRow) => boolean;
  isRowExpanded?: (row: TRow) => boolean;
  renderExpandedRow?: (row: TRow) => ReactNode;
  renderCell: (row: TRow, action: string) => ReactNode;
};

export default function ResourceTypeMatrixSection<
  TRow extends PermissionsMatrixRow
>({
  title,
  count,
  actions,
  rows,
  isRefreshing = false,
  onRowClick,
  isRowSelected,
  isRowExpanded,
  renderExpandedRow,
  renderCell
}: ResourceTypeMatrixSectionProps<TRow>) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <span>
          {title} ({count})
        </span>
        {isRefreshing ? (
          <span
            className="inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
            aria-label="Refreshing effective access"
            title="Refreshing effective access"
          />
        ) : null}
      </div>
      <div className="rounded-md border border-gray-200 bg-white">
        <PermissionsMatrixTable
          rows={rows}
          actions={actions}
          onRowClick={onRowClick}
          isRowSelected={isRowSelected}
          isRowExpanded={isRowExpanded}
          renderExpandedRow={renderExpandedRow}
          renderCell={renderCell}
        />
      </div>
    </section>
  );
}
