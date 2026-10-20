import {
  deletePermission,
  fetchPermissions,
  FetchPermissionsInput
} from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { useEffect, useState } from "react";
import { Button } from "..";
import { FormikSelectDropdownOption } from "../Forms/Formik/FormikSelectDropdown";
import LegacyPermissionDetails from "./LegacyPermissionDetails";
import LegacyPermissionsBanner from "./LegacyPermissionsBanner";
import PermissionAccessCheckModal, {
  PermissionAccessCheckConfig
} from "./PermissionAccessCheckModal";
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

type PermissionsViewProps = {
  permissionRequest: FetchPermissionsInput;
  setIsLoading?: (isLoading: boolean) => void;
  hideResourceColumn?: boolean;
  hideSubjectColumn?: boolean;
  // hideBanner hides the deprecation banner, for a page that shows its own.
  hideBanner?: boolean;
  onRefetch?: (refetch: () => void) => void;
  accessCheckConfig?: PermissionAccessCheckConfig;
};

export default function PermissionsView({
  permissionRequest,
  setIsLoading = () => {},
  hideResourceColumn = false,
  hideSubjectColumn = false,
  hideBanner = false,
  onRefetch,
  accessCheckConfig
}: PermissionsViewProps) {
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionsSummary>();
  const { pageSize, pageIndex } = useReactTablePaginationState();
  const [sortState] = useReactTableSortState();
  const [isAccessCheckModalOpen, setIsAccessCheckModalOpen] = useState(false);

  const mappedSortBy =
    sortState[0]?.id === "created"
      ? "created_at"
      : sortState[0]?.id === "updated"
        ? "updated_at"
        : sortState[0]?.id === "createdBy"
          ? "created_by"
          : sortState[0]?.id;

  const { isLoading, data, refetch, isError, error } = useQuery({
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
    if (isError) {
      toastError(`Failed to fetch permissions: ${getErrorMessage(error)}`);
    }
  }, [error, isError]);

  useEffect(() => {
    if (onRefetch) {
      onRefetch(refetch);
    }
  }, [onRefetch, refetch]);

  const totalEntries = data?.totalEntries || 0;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : 1;
  const permissions = data?.data || [];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2">
      {!hideBanner && <LegacyPermissionsBanner />}
      {accessCheckConfig ? (
        <div className="flex shrink-0 flex-row items-center py-2">
          <Button
            className="btn-secondary"
            onClick={() => {
              setIsAccessCheckModalOpen(true);
            }}
          >
            Check Access
          </Button>
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col">
        <PermissionsTable
          permissions={permissions}
          isLoading={isLoading}
          pageCount={pageCount}
          totalEntries={totalEntries}
          handleRowClick={(row) => setSelectedPermission(row)}
          hideResourceColumn={hideResourceColumn}
          hideSubjectColumn={hideSubjectColumn}
        />
      </div>
      {selectedPermission && (
        <LegacyPermissionDetails
          title="Permission"
          record={selectedPermission}
          onDelete={deletePermission}
          onClose={() => {
            setSelectedPermission(undefined);
            refetch();
          }}
        />
      )}
      {accessCheckConfig ? (
        <PermissionAccessCheckModal
          open={isAccessCheckModalOpen}
          onOpenChange={setIsAccessCheckModalOpen}
          config={accessCheckConfig}
        />
      ) : null}
    </div>
  );
}
