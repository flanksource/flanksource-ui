import {
  bulkApplyPermission,
  BulkApplyScope
} from "@flanksource-ui/api/services/permissions";
import { View } from "@flanksource-ui/api/services/views";
import { Button } from "@flanksource-ui/components";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import useMrtBulkSelection from "@flanksource-ui/ui/MRTDataTable/Hooks/useMrtBulkSelection";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { ChangeEvent, useCallback } from "react";

type ViewsTableProps = {
  data: View[];
  isLoading?: boolean;
  pageCount?: number;
  totalRowCount?: number;
  filters?: Record<string, unknown>;
};

const columns: MRT_ColumnDef<View>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Namespace",
    accessorKey: "namespace"
  },
  {
    header: "Source",
    accessorKey: "source"
  },
  {
    header: "Created",
    accessorKey: "created_at",
    Cell: MRTDateCell,
    sortingFn: "datetime"
  },
  {
    header: "Updated",
    accessorKey: "updated_at",
    Cell: MRTDateCell,
    sortingFn: "datetime"
  }
];

export default function ViewsTable({
  data,
  isLoading,
  pageCount,
  totalRowCount = 0,
  filters = {}
}: ViewsTableProps) {
  const {
    rowSelection,
    hasSelectedRows,
    selectionSummary,
    onRowSelectionChange,
    onSelectAllChange,
    clearSelection,
    buildPayload
  } = useMrtBulkSelection<View, { table: "views" }>({
    rows: data,
    totalRowCount,
    getRowId: (row) => row.id,
    selectionScope: { table: "views" }
  });

  const triggerBulkAction = useCallback(
    async (action: "allow" | "deny") => {
      const selection = buildPayload();
      const scope: BulkApplyScope = {
        table: "views",
        filters
      };

      try {
        await bulkApplyPermission({
          action,
          selection,
          scope
        });

        toastSuccess(
          `action=${action}, ids=${selection.ids.join(",") || "none"}, mode=${selection.mode}`
        );

        clearSelection();
      } catch (error) {
        toastError(error as any);
      }
    },
    [buildPayload, clearSelection, filters]
  );

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-3 z-50 flex justify-center px-4">
        <div
          className={`pointer-events-auto flex flex-row flex-wrap items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-100 px-2.5 py-1.5 shadow-lg transition-all duration-500 ease-out ${
            hasSelectedRows
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          }`}
        >
          <span className="pr-1 text-xs font-medium text-gray-700">
            {selectionSummary}
          </span>
          <Button
            size="none"
            disabled={!hasSelectedRows}
            className="rounded border border-gray-400 bg-white px-2 py-1 text-xs leading-none text-gray-800 hover:bg-gray-50"
            onClick={() => triggerBulkAction("allow")}
          >
            Allow All
          </Button>
          <Button
            size="none"
            disabled={!hasSelectedRows}
            className="rounded border border-gray-400 bg-gray-200 px-2 py-1 text-xs leading-none text-gray-800 hover:bg-gray-300"
            onClick={() => triggerBulkAction("deny")}
          >
            Deny All
          </Button>
        </div>
      </div>
      <div className="relative flex h-full flex-col">
        <MRTDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          enableServerSideSorting
          enableServerSidePagination
          manualPageCount={pageCount}
          totalRowCount={totalRowCount}
          defaultPageSize={50}
          enableRowSelection
          enableSelectAll
          getRowId={(row) => row.id}
          rowSelection={rowSelection}
          onRowSelectionChange={onRowSelectionChange}
          mantineSelectCheckboxProps={{
            size: "xs",
            radius: "lg",
            styles: {
              icon: {
                display: "none"
              },
              input: {
                opacity: 0.9,
                borderWidth: 1,
                borderColor: "#d1d5db",
                backgroundColor: "#f9fafb"
              }
            }
          }}
          mantineSelectAllCheckboxProps={{
            size: "xs",
            radius: "lg",
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
              onSelectAllChange(event.currentTarget.checked);
            },
            styles: {
              icon: {
                display: "none"
              },
              input: {
                opacity: 0.9,
                borderWidth: 1,
                borderColor: "#d1d5db",
                backgroundColor: "#f9fafb"
              }
            }
          }}
        />
      </div>
    </>
  );
}
