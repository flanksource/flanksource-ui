import { flexRender } from "@tanstack/react-table";
import { Row, RowData } from "@tanstack/table-core";
import { useCallback } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
import { Badge } from "../Badge/Badge";

type DataTableRowProps<TableColumns extends RowData> = {
  row: Row<TableColumns>;
  isGrouped?: boolean;
  onRowClick?: (row: Row<TableColumns>) => void;
  rowClassNames?: string;
  cellClassNames?: string;
};

export function DataTableRow<TableColumns extends RowData>({
  row,
  isGrouped,
  onRowClick: handleRowClick = () => {},
  rowClassNames,
  cellClassNames
}: DataTableRowProps<TableColumns>) {
  const onRowClick = useCallback(
    (row: Row<TableColumns>) => {
      if (row.getIsGrouped()) {
        row.getToggleExpandedHandler()();
      } else if (handleRowClick) {
        handleRowClick(row);
      }
    },
    [handleRowClick]
  );

  return (
    <tr className={`${rowClassNames}`} onClick={() => onRowClick(row)}>
      {row.getVisibleCells().map((cell, cellIndex) =>
        cell.getIsPlaceholder() ? null : (
          <td
            key={cell.id}
            className={`${cellClassNames} ${
              (cell.column.columnDef.meta as Record<string, string>)
                ?.cellClassName
            }`}
          >
            {cell.getIsGrouped() ? (
              <div className="relative flex flex-row items-center space-x-2">
                <div
                  className={`duration-200 ${
                    row.getIsExpanded() ? "rotate-90" : ""
                  }`}
                >
                  <IoChevronForwardOutline />
                </div>
                <div className="w-max">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
                <div className="flex items-center">
                  <Badge
                    colorClass="bg-gray-200 text-gray-800"
                    roundedClass="rounded-xl"
                    text={row?.subRows.length}
                    size="xs"
                  />
                </div>
              </div>
            ) : cell.getIsAggregated() ? (
              flexRender(
                cell.column.columnDef.aggregatedCell,
                cell.getContext()
              )
            ) : (
              <div
                // First column should be displaced if the table
                // is grouped
                className={`w-full overflow-hidden text-ellipsis ${
                  isGrouped && row?.subRows.length > 1 && cellIndex === 1
                    ? "pl-12"
                    : ""
                }`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            )}
          </td>
        )
      )}
    </tr>
  );
}
