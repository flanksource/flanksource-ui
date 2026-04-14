import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Fragment, ReactNode } from "react";

export type PermissionsMatrixRow = {
  id: string;
  displayName: string;
  subtitle?: string;
  icon?: string;
};

type PermissionsMatrixTableProps<TRow extends PermissionsMatrixRow> = {
  rows: TRow[];
  actions: string[];
  renderCell: (row: TRow, action: string) => ReactNode;
  onRowClick?: (row: TRow) => void;
  isRowSelected?: (row: TRow) => boolean;
  isRowExpanded?: (row: TRow) => boolean;
  renderExpandedRow?: (row: TRow) => ReactNode;
};

export default function PermissionsMatrixTable<
  TRow extends PermissionsMatrixRow
>({
  rows,
  actions,
  renderCell,
  onRowClick,
  isRowSelected,
  isRowExpanded,
  renderExpandedRow
}: PermissionsMatrixTableProps<TRow>) {
  return (
    <div className="overflow-x-auto overflow-y-visible">
      <table className="w-full min-w-max table-auto border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 border-b border-r border-gray-200 bg-white px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Resource
            </th>
            {actions.map((action) => (
              <th
                key={action}
                className="sticky top-0 z-10 whitespace-nowrap border-b border-gray-200 bg-white px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {action}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const selected = isRowSelected?.(row) ?? false;
            const expanded = isRowExpanded?.(row) ?? false;

            return (
              <Fragment key={row.id}>
                <tr
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  <td
                    className={`sticky left-0 z-10 border-b border-r border-gray-200 px-3 py-2 ${
                      selected ? "bg-indigo-50" : "bg-white"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Icon
                        name={row.icon || "database"}
                        className="h-4 w-4 shrink-0 text-gray-500"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-gray-900">
                          {row.displayName}
                        </div>
                        <div className="truncate text-xs text-gray-500">
                          {row.subtitle || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  {actions.map((action) => (
                    <td
                      key={`${row.id}:${action}`}
                      className={`border-b border-gray-200 px-3 py-2 text-center ${
                        selected ? "bg-indigo-50/50" : "bg-white"
                      }`}
                    >
                      {renderCell(row, action)}
                    </td>
                  ))}
                </tr>
                {expanded && renderExpandedRow ? (
                  <tr>
                    <td
                      colSpan={actions.length + 1}
                      className="border-b border-gray-200 bg-indigo-50/30 px-2 py-1 align-top"
                    >
                      {renderExpandedRow(row)}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
