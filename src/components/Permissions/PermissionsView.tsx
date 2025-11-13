import {
  fetchPermissions,
  FetchPermissionsInput
} from "@flanksource-ui/api/services/permissions";
import {
  PermissionsSummary,
  PermissionTable
} from "@flanksource-ui/api/types/permissions";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "..";
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
  { value: "mcp:run", label: "mcp:run" }
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

type PermissionsViewProps = {
  permissionRequest: FetchPermissionsInput;
  setIsLoading?: (isLoading: boolean) => void;
  hideResourceColumn?: boolean;
  newPermissionData?: Partial<PermissionTable>;
  showAddPermission?: boolean;
  onRefetch?: (refetch: () => void) => void;
};

export default function PermissionsView({
  permissionRequest,
  setIsLoading = () => {},
  hideResourceColumn = false,
  newPermissionData,
  showAddPermission = false,
  onRefetch
}: PermissionsViewProps) {
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionsSummary>();
  const { pageSize, pageIndex } = useReactTablePaginationState();
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  const { isLoading, data, refetch } = useQuery({
    queryKey: [
      "permissions_summary",
      permissionRequest,
      {
        pageIndex,
        pageSize
      }
    ],
    queryFn: () =>
      fetchPermissions(permissionRequest, {
        pageIndex,
        pageSize
      })
    // enabled: isEnabled
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
  const permissions = data?.data || [];

  return (
    <>
      {showAddPermission && (
        <div className="flex flex-row items-center justify-between p-2">
          <Button
            onClick={() => {
              setIsPermissionModalOpen(true);
            }}
          >
            Add Permission
          </Button>
        </div>
      )}
      <PermissionsTable
        permissions={permissions}
        isLoading={isLoading}
        pageCount={pageCount}
        totalEntries={totalEntries}
        handleRowClick={(row) => setSelectedPermission(row)}
        hideResourceColumn={hideResourceColumn}
      />
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
