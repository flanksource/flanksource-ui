import { useRoleBindingsQuery } from "@flanksource-ui/api/query-hooks/useRoleBindingsQuery";
import { RoleBindingDisplay } from "@flanksource-ui/api/types/roleBindings";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import AddRoleBindingButton from "@flanksource-ui/components/RoleBindings/Forms/AddRoleBindingButton";
import RoleBindingForm from "@flanksource-ui/components/RoleBindings/Forms/RoleBindingForm";
import RoleBindingsTable from "@flanksource-ui/components/RoleBindings/RoleBindingsTable";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { useState } from "react";

export default function RoleBindingsPage() {
  const {
    data: roleBindings,
    isLoading,
    isError,
    error,
    refetch
  } = useRoleBindingsQuery();
  const [selectedRoleBinding, setSelectedRoleBinding] = useState<
    RoleBindingDisplay | undefined
  >();

  return (
    <>
      <PermissionsTabsLinks
        activeTab="Role Bindings"
        loading={isLoading}
        onRefresh={() => refetch()}
        headerAction={
          // Role bindings are written through /api/rbac, which requires update on rbac
          <AuthorizationAccessCheck
            key="add-button"
            resource={tables.rbac}
            action="write"
          >
            <AddRoleBindingButton />
          </AuthorizationAccessCheck>
        }
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <div className="flex h-full flex-col overflow-y-auto py-6">
            {isError ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <p className="mb-2 font-medium text-red-600">
                    Error loading role bindings
                  </p>
                  <p className="text-sm text-gray-600">
                    {error instanceof Error
                      ? error.message
                      : "An error occurred"}
                  </p>
                </div>
              </div>
            ) : (
              <RoleBindingsTable
                data={roleBindings || []}
                isLoading={isLoading}
                handleRowClick={(row) => setSelectedRoleBinding(row)}
              />
            )}
          </div>
        </div>
      </PermissionsTabsLinks>

      {selectedRoleBinding && (
        <RoleBindingForm
          isOpen={!!selectedRoleBinding}
          onClose={() => setSelectedRoleBinding(undefined)}
          data={selectedRoleBinding}
        />
      )}
    </>
  );
}
