import { useRoleBindingsQuery } from "@flanksource-ui/api/query-hooks/useRoleBindingsQuery";
import { absoluteRbacReference } from "@flanksource-ui/api/types/rbacResources";
import { RoleBindingDisplay } from "@flanksource-ui/api/types/roleBindings";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import AddRoleBindingButton from "@flanksource-ui/components/RoleBindings/Forms/AddRoleBindingButton";
import RoleBindingForm from "@flanksource-ui/components/RoleBindings/Forms/RoleBindingForm";
import RoleBindingsTable from "@flanksource-ui/components/RoleBindings/RoleBindingsTable";
import { useRbacNamespaceFilter } from "@flanksource-ui/components/Permissions/Rbac/useRbacNamespaceFilter";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "@flanksource-ui/ui/Dropdowns/MultiSelectDropdown";
import { useEffect, useMemo, useState } from "react";
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

  const selectedRoles = useMemo(
    () => searchParams.get("roles")?.split(",").filter(Boolean) ?? [],
    [searchParams]
  );

  const roleOptions = useMemo<GroupByOptions[]>(() => {
    // Only the roles of bindings in the selected namespaces
    const roles = new Set(filteredItems.map(bindingRole));
    // Keep selected roles listed even when no listed binding has them
    selectedRoles.forEach((role) => roles.add(role));
    return Array.from(roles)
      .sort()
      .map((role) => ({ value: role, label: role }));
  }, [filteredItems, selectedRoles]);

  const filteredRoleBindings = useMemo(() => {
    if (selectedRoles.length === 0) {
      return filteredItems;
    }
    return filteredItems.filter((binding) =>
      selectedRoles.includes(bindingRole(binding))
    );
  }, [filteredItems, selectedRoles]);

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
            <MultiSelectDropdown
              label="Role"
              defaultValue="All"
              options={roleOptions}
              value={roleOptions.filter((option) =>
                selectedRoles.includes(option.value)
              )}
              onChange={(selected: unknown) => {
                const roles = ((selected as GroupByOptions[] | null) ?? []).map(
                  (option) => option.value
                );
                setSearchParams((params) => {
                  if (roles.length > 0) {
                    params.set("roles", roles.join(","));
                  } else {
                    params.delete("roles");
                  }
                  return params;
                });
              }}
              minMenuWidth="250px"
              dropDownClassNames="w-auto min-w-[250px]"
            />
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
                data={filteredRoleBindings}
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

// The binding's role as namespace/name, since the same name can be a different
// role in another namespace
function bindingRole({ namespace, role }: RoleBindingDisplay) {
  return namespace ? absoluteRbacReference(namespace, role) : role;
}
