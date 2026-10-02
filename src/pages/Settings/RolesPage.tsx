import { useRolesQuery } from "@flanksource-ui/api/query-hooks/useRolesQuery";
import { RoleDisplay } from "@flanksource-ui/api/types/roles";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import AddRoleButton from "@flanksource-ui/components/Roles/Forms/AddRoleButton";
import RoleForm from "@flanksource-ui/components/Roles/Forms/RoleForm";
import RolesTable from "@flanksource-ui/components/Roles/RolesTable";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { useState } from "react";

export default function RolesPage() {
  const { data: roles, isLoading, isError, error, refetch } = useRolesQuery();
  const [selectedRole, setSelectedRole] = useState<RoleDisplay | undefined>();

  return (
    <>
      <PermissionsTabsLinks
        activeTab="Roles"
        loading={isLoading}
        onRefresh={() => refetch()}
        headerAction={
          // Roles are written through /api/rbac, which requires update on rbac
          <AuthorizationAccessCheck
            key="add-button"
            resource={tables.rbac}
            action="write"
          >
            <AddRoleButton />
          </AuthorizationAccessCheck>
        }
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <div className="flex h-full flex-col overflow-y-auto py-6">
            {isError ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <p className="mb-2 font-medium text-red-600">
                    Error loading roles
                  </p>
                  <p className="text-sm text-gray-600">
                    {error instanceof Error
                      ? error.message
                      : "An error occurred"}
                  </p>
                </div>
              </div>
            ) : (
              <RolesTable
                data={roles || []}
                isLoading={isLoading}
                handleRowClick={(row) => setSelectedRole(row)}
              />
            )}
          </div>
        </div>
      </PermissionsTabsLinks>

      {selectedRole && (
        <RoleForm
          isOpen={!!selectedRole}
          onClose={() => setSelectedRole(undefined)}
          data={selectedRole}
        />
      )}
    </>
  );
}
