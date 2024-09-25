import {
  fetchPermissions,
  FetchPermissionsInput
} from "@flanksource-ui/api/services/permissions";
import { PermissionAPIResponse } from "@flanksource-ui/api/types/permissions";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PermissionForm from "./ManagePermissions/Forms/PermissionForm";
import PermissionsTable from "./PermissionsTable";

type PermissionsViewProps = {
  permissionRequest: FetchPermissionsInput;
  setIsLoading?: (isLoading: boolean) => void;
  hideResourceColumn?: boolean;
};

export default function PermissionsView({
  permissionRequest,
  setIsLoading = () => {},
  hideResourceColumn = false
}: PermissionsViewProps) {
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionAPIResponse>();
  const { pageSize, pageIndex } = useReactTablePaginationState();

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
    </>
  );
}
