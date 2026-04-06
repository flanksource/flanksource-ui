import {
  fetchPermissions,
  FetchPermissionsInput
} from "@flanksource-ui/api/services/permissions";
import {
  PermissionsSummary,
  PermissionTable
} from "@flanksource-ui/api/types/permissions";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "..";
import { toastSuccess } from "../Toast/toast";
import useMrtBulkSelection, {
  BulkSelectionPayload
} from "@flanksource-ui/ui/MRTDataTable/Hooks/useMrtBulkSelection";
import { FormikSelectDropdownOption } from "../Forms/Formik/FormikSelectDropdown";
import PermissionForm from "./ManagePermissions/Forms/PermissionForm";
import PermissionsTable from "./PermissionsTable";

// Source: github.com/flanksource/duty/rbac/policy/policy.go
export const permissionsActionsList: FormikSelectDropdownOption[] = [
  { value: "read", label: "read" },
  { value: "update", label: "update" },
  { value: "create", label: "create" },
  { value: "delete", label: "delete" },
  { value: "*", label: "*" },
  { value: "create,read,update,delete", label: "create,read,update,delete" },
  { value: "playbook:run", label: "playbook:run" },
  { value: "playbook:approve", label: "playbook:approve" },
  { value: "playbook:*", label: "playbook:*" },
  { value: "mcp:run", label: "mcp:run" },
  { value: "mcp:use", label: "mcp:use" }
];

const commonActions: FormikSelectDropdownOption[] = [
  { value: "read", label: "read" },
  { value: "update", label: "update" },
  { value: "create", label: "create" },
  { value: "delete", label: "delete" },
  { value: "*", label: "*" },
  { value: "create,read,update,delete", label: "create,read,update,delete" }
];

const playbookSpecificActions: FormikSelectDropdownOption[] = [
  { value: "playbook:run", label: "playbook:run" },
  { value: "playbook:approve", label: "playbook:approve" },
  { value: "playbook:*", label: "playbook:*" }
];

export type ResourceType =
  | "catalog"
  | "component"
  | "playbook"
  | "connection"
  | "canary"
  | "view"
  | "global";

export function getActionsForResourceType(
  resourceType?: ResourceType
): FormikSelectDropdownOption[] {
  if (!resourceType) {
    return [];
  }

  if (resourceType === "playbook") {
    return [...commonActions, ...playbookSpecificActions];
  }

  if (resourceType === "view") {
    return [{ value: "read", label: "read" }];
  }

  return commonActions;
}

type SelectionScope = {
  permissionRequest: FetchPermissionsInput;
  sortBy?: string;
  sortOrder: "asc" | "desc";
};

export type PermissionsBulkActionControls = {
  hasSelectedRows: boolean;
  selectionSummary: string;
  onAllowSelected: () => void;
  onDenySelected: () => void;
  onClearSelection: () => void;
};

type PermissionsViewProps = {
  permissionRequest: FetchPermissionsInput;
  setIsLoading?: (isLoading: boolean) => void;
  hideResourceColumn?: boolean;
  newPermissionData?: Partial<PermissionTable>;
  showAddPermission?: boolean;
  showInlineBulkActionControls?: boolean;
  onRefetch?: (refetch: () => void) => void;
  onBulkActionControlsChange?: (
    controls: PermissionsBulkActionControls
  ) => void;
};

export default function PermissionsView({
  permissionRequest,
  setIsLoading = () => {},
  hideResourceColumn = false,
  newPermissionData,
  showAddPermission = false,
  showInlineBulkActionControls = true,
  onRefetch,
  onBulkActionControlsChange
}: PermissionsViewProps) {
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionsSummary>();
  const { pageSize, pageIndex } = useReactTablePaginationState();
  const [sortState] = useReactTableSortState();
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  const mappedSortBy =
    sortState[0]?.id === "created"
      ? "created_at"
      : sortState[0]?.id === "updated"
        ? "updated_at"
        : sortState[0]?.id === "createdBy"
          ? "created_by"
          : sortState[0]?.id;

  const { isLoading, data, refetch } = useQuery({
    queryKey: [
      "permissions_summary",
      permissionRequest,
      {
        pageIndex,
        pageSize,
        sortBy: mappedSortBy,
        sortOrder: sortState[0]?.desc ? "desc" : "asc"
      }
    ],
    queryFn: () =>
      fetchPermissions(permissionRequest, {
        pageIndex,
        pageSize,
        sortBy: mappedSortBy,
        sortOrder: sortState[0]?.desc ? "desc" : "asc"
      }),
    keepPreviousData: true
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (onRefetch) {
      onRefetch(refetch);
    }
  }, [onRefetch, refetch]);

  const totalEntries = data?.totalEntries || 0;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : 1;
  const permissions = useMemo(() => data?.data ?? [], [data?.data]);

  const selectionScope = useMemo<SelectionScope>(
    () => ({
      permissionRequest,
      sortBy: mappedSortBy,
      sortOrder: sortState[0]?.desc ? "desc" : "asc"
    }),
    [mappedSortBy, permissionRequest, sortState]
  );

  const selectionResetKey = useMemo(
    () => JSON.stringify(permissionRequest),
    [permissionRequest]
  );

  const {
    rowSelection,
    selectedCount,
    hasSelectedRows,
    selectionSummary,
    onRowSelectionChange: handleRowSelectionChange,
    onSelectAllChange: handleSelectAllChange,
    clearSelection: handleClearSelection,
    buildPayload
  } = useMrtBulkSelection<PermissionsSummary, SelectionScope>({
    rows: permissions,
    totalRowCount: totalEntries,
    getRowId: (row) => row.id,
    selectionScope,
    resetKey: selectionResetKey
  });

  const handleBulkAction = useCallback(
    (action: "allow" | "deny") => {
      const payload: BulkSelectionPayload<SelectionScope> = buildPayload();

      toastSuccess(
        `${action === "allow" ? "Allow Selected" : "Deny Selected"} prepared for ${selectedCount} permission${selectedCount === 1 ? "" : "s"}`
      );

      // Frontend-only wiring for now. API call will use this payload in follow-up work.
      void payload;
    },
    [buildPayload, selectedCount]
  );

  const handleAllowSelected = useCallback(() => {
    handleBulkAction("allow");
  }, [handleBulkAction]);

  const handleDenySelected = useCallback(() => {
    handleBulkAction("deny");
  }, [handleBulkAction]);

  useEffect(() => {
    if (!onBulkActionControlsChange) {
      return;
    }

    onBulkActionControlsChange({
      hasSelectedRows,
      selectionSummary,
      onAllowSelected: handleAllowSelected,
      onDenySelected: handleDenySelected,
      onClearSelection: handleClearSelection
    });
  }, [
    hasSelectedRows,
    handleAllowSelected,
    handleClearSelection,
    handleDenySelected,
    onBulkActionControlsChange,
    selectionSummary
  ]);

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        {showAddPermission && (
          <div className="mb-2 flex flex-row flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                setIsPermissionModalOpen(true);
              }}
            >
              Add Permission
            </Button>
          </div>
        )}

        <div className="relative flex min-h-0 flex-1 flex-col">
          {showInlineBulkActionControls && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-50 flex justify-center px-4">
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
                  onClick={handleAllowSelected}
                >
                  Allow Selected
                </Button>
                <Button
                  size="none"
                  disabled={!hasSelectedRows}
                  className="rounded border border-gray-400 bg-gray-200 px-2 py-1 text-xs leading-none text-gray-800 hover:bg-gray-300"
                  onClick={handleDenySelected}
                >
                  Deny Selected
                </Button>
                <Button
                  size="none"
                  className="rounded border border-gray-400 bg-white px-2 py-1 text-xs leading-none text-gray-800 hover:bg-gray-50"
                  onClick={handleClearSelection}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <PermissionsTable
            permissions={permissions}
            isLoading={isLoading}
            pageCount={pageCount}
            totalEntries={totalEntries}
            enableRowSelection
            rowSelection={rowSelection}
            onRowSelectionChange={handleRowSelectionChange}
            onSelectAllChange={handleSelectAllChange}
            handleRowClick={(row) => setSelectedPermission(row)}
            hideResourceColumn={hideResourceColumn}
          />
        </div>
      </div>
      {selectedPermission && (
        <PermissionForm
          isOpen={!!selectedPermission}
          onClose={() => {
            setSelectedPermission(undefined);
            refetch();
          }}
          data={selectedPermission}
        />
      )}
      {showAddPermission && (
        <PermissionForm
          data={newPermissionData}
          isOpen={isPermissionModalOpen}
          onClose={() => {
            setIsPermissionModalOpen(false);
            refetch();
          }}
        />
      )}
    </>
  );
}
