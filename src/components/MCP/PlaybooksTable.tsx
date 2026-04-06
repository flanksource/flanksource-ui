import { bulkApplyMcpPermission } from "@flanksource-ui/api/services/permissions";
import { PlaybookNames } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/components";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import useMrtBulkSelection from "@flanksource-ui/ui/MRTDataTable/Hooks/useMrtBulkSelection";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { ChangeEvent, useCallback } from "react";

type PlaybooksTableProps = {
  data: PlaybookNames[];
  isLoading?: boolean;
  pageCount?: number;
  totalRowCount?: number;
};

const columns: MRT_ColumnDef<PlaybookNames>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Namespace",
    accessorKey: "namespace"
  },
  {
    header: "Title",
    accessorKey: "title"
  },
  {
    header: "Category",
    accessorKey: "category"
  },
  {
    header: "Description",
    accessorKey: "description"
  }
];

export default function PlaybooksTable({
  data,
  isLoading,
  pageCount,
  totalRowCount = 0
}: PlaybooksTableProps) {
  const {
    rowSelection,
    hasSelectedRows,
    selectionSummary,
    onRowSelectionChange,
    onSelectAllChange,
    clearSelection,
    buildPayload
  } = useMrtBulkSelection<PlaybookNames, { table: "playbooks" }>({
    rows: data,
    totalRowCount,
    getRowId: (row) => row.id,
    selectionScope: { table: "playbooks" }
  });

  const triggerBulkAction = useCallback(
    async (action: "allow" | "deny") => {
      const selection = buildPayload();

      if (selection.mode !== "selective") {
        toastError(
          "This endpoint only accepts explicit user changes. Please select rows directly instead of using Select All."
        );
        return;
      }

      if (selection.ids.length === 0) {
        toastError("No rows selected");
        return;
      }

      try {
        await bulkApplyMcpPermission({
          object: "mcp",
          action: "mcp:use",
          changes: selection.ids.map((id) => ({
            user_id: id,
            effect: action
          }))
        });

        toastSuccess(
          `Applied ${action} to ${selection.ids.length} selected rows`
        );

        clearSelection();
      } catch (error) {
        toastError(error as any);
      }
    },
    [buildPayload, clearSelection]
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
          enableServerSidePagination
          enableServerSideSorting
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
