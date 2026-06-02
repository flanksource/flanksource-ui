/**
 * Wraps a resource-type group in section styling and forwards rendering to the
 * reusable permissions matrix table.
 */
import PermissionsMatrixTable, {
  PermissionsMatrixRow
} from "@flanksource-ui/components/Permissions/SubjectPermissions/PermissionsMatrixTable";
import { ReactNode } from "react";

type ResourceTypeMatrixSectionProps<TRow extends PermissionsMatrixRow> = {
  actions: string[];
  rows: TRow[];
  onRowClick?: (row: TRow) => void;
  isRowSelected?: (row: TRow) => boolean;
  isRowExpanded?: (row: TRow) => boolean;
  renderExpandedRow?: (row: TRow) => ReactNode;
  renderCell: (row: TRow, action: string) => ReactNode;
};

export default function ResourceTypeMatrixSection<
  TRow extends PermissionsMatrixRow
>({
  actions,
  rows,
  onRowClick,
  isRowSelected,
  isRowExpanded,
  renderExpandedRow,
  renderCell
}: ResourceTypeMatrixSectionProps<TRow>) {
  return (
    <section>
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
