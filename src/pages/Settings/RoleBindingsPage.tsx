import { useRoleBindingsQuery } from "@flanksource-ui/api/query-hooks/useRoleBindingsQuery";
import { RoleBindingDisplay } from "@flanksource-ui/api/types/roleBindings";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import AddRoleBindingButton from "@flanksource-ui/components/RoleBindings/Forms/AddRoleBindingButton";
import RoleBindingForm from "@flanksource-ui/components/RoleBindings/Forms/RoleBindingForm";
import RoleBindingsTable from "@flanksource-ui/components/RoleBindings/RoleBindingsTable";
import { useRbacNamespaceFilter } from "@flanksource-ui/components/Permissions/Rbac/useRbacNamespaceFilter";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function RoleBindingsPage() {
  const {
    data: roleBindings,
    isLoading,
    isError,
    error,
    refetch
  } = useRoleBindingsQuery();
  const { filteredItems, namespaceFilter } =
    useRbacNamespaceFilter(roleBindings);
  const [selectedRoleBinding, setSelectedRoleBinding] = useState<
    RoleBindingDisplay | undefined
  >();
  const [searchParams, setSearchParams] = useSearchParams();

  // ?id= opens a role binding, e.g. from an access review
  const linkedID = searchParams.get("id");
  useEffect(() => {
    const linked = roleBindings?.find((binding) => binding.id === linkedID);
    if (linked) {
      setSelectedRoleBinding(linked);
      setSearchParams(
        (params) => {
          params.delete("id");
          return params;
        },
        { replace: true }
      );
    }
  }, [linkedID, roleBindings, setSearchParams]);

  return (
    <>
      <PermissionsTabsLinks
        activeTab="Role Bindings"
        loading={isLoading}
        onRefresh={() => refetch()}
        headerAction={
          <AuthorizationAccessCheck
            key="add-button"
            resource={tables.role_bindings}
            action="create"
          >
            <AddRoleBindingButton />
          </AuthorizationAccessCheck>
        }
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <div className="flex flex-row items-center gap-2 pt-4">
            {namespaceFilter}
          </div>
          <div className="flex h-full flex-col overflow-y-auto py-4">
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
                data={filteredItems}
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
