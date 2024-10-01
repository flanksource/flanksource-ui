import {
  fetchPermissions,
  FetchPermissionsInput
} from "@flanksource-ui/api/services/permissions";
import {
  PermissionAPIResponse,
  PermissionTable
} from "@flanksource-ui/api/types/permissions";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "..";
import { FormikSelectDropdownOption } from "../Forms/Formik/FormikSelectDropdown";
import PermissionForm from "./ManagePermissions/Forms/PermissionForm";
import PermissionsTable from "./PermissionsTable";

export const permissionsActionsList: FormikSelectDropdownOption[] = [
  { value: "ActionRead", label: "read" },
  { value: "ActionUpdate", label: "update" },
  { value: "ActionCreate", label: "create" },
  { value: "ActionDelete", label: "delete" },
  { value: "ActionAll", label: "*" },
  { value: "ActionCRUD", label: "create,read,update,delete" },
  { value: "ActionRun", label: "run" },
  { value: "ActionApprove", label: "approve" }
];

type PermissionsViewProps = {
  permissionRequest: FetchPermissionsInput;
  setIsLoading?: (isLoading: boolean) => void;
  hideResourceColumn?: boolean;
  newPermissionData?: Partial<PermissionTable>;
  showAddPermission?: boolean;
};

export default function PermissionsView({
  permissionRequest,
  setIsLoading = () => {},
  hideResourceColumn = false,
  newPermissionData,
  showAddPermission = false
}: PermissionsViewProps) {
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionAPIResponse>();
  const { pageSize, pageIndex } = useReactTablePaginationState();
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  const { isLoading, data, refetch } = useQuery({
    queryKey: [
      "permissions",
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

  const totalEntries = data?.totalEntries || 0;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;
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
