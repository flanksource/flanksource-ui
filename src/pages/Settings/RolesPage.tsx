import { useRolesQuery } from "@flanksource-ui/api/query-hooks/useRolesQuery";
import { RoleDisplay } from "@flanksource-ui/api/types/roles";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import AddRoleButton from "@flanksource-ui/components/Roles/Forms/AddRoleButton";
import RoleForm from "@flanksource-ui/components/Roles/Forms/RoleForm";
import RolesTable from "@flanksource-ui/components/Roles/RolesTable";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "@flanksource-ui/ui/Dropdowns/MultiSelectDropdown";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function RolesPage() {
  const { data: roles, isLoading, isError, error, refetch } = useRolesQuery();
  const [selectedRole, setSelectedRole] = useState<RoleDisplay | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();

  // ?id= opens a role, e.g. from an access review
  const linkedID = searchParams.get("id");
  useEffect(() => {
    const linked = roles?.find((role) => role.id === linkedID);
    if (linked) {
      setSelectedRole(linked);
      setSearchParams(
        (params) => {
          params.delete("id");
          return params;
        },
        { replace: true }
      );
    }
  }, [linkedID, roles, setSearchParams]);

  const selectedActions = useMemo(
    () => searchParams.get("actions")?.split(",").filter(Boolean) ?? [],
    [searchParams]
  );

  const actionOptions = useMemo<GroupByOptions[]>(() => {
    const actions = new Set(
      (roles ?? []).flatMap((role) =>
        (role.rules ?? []).map((rule) => rule.action)
      )
    );
    // Keep selected actions listed even when no loaded role has them
    selectedActions.forEach((action) => actions.add(action));
    return Array.from(actions)
      .sort()
      .map((action) => ({ value: action, label: action }));
  }, [roles, selectedActions]);

  // A role matches when any of its rules has one of the selected actions
  const filteredRoles = useMemo(() => {
    if (selectedActions.length === 0) {
      return roles ?? [];
    }
    return (roles ?? []).filter((role) =>
      (role.rules ?? []).some((rule) => selectedActions.includes(rule.action))
    );
  }, [roles, selectedActions]);

  return (
    <>
      <PermissionsTabsLinks
        activeTab="Roles"
        loading={isLoading}
        onRefresh={() => refetch()}
        headerAction={
          <AuthorizationAccessCheck
            key="add-button"
            resource={tables.roles}
            action="create"
          >
            <AddRoleButton />
          </AuthorizationAccessCheck>
        }
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <div className="flex flex-row items-center pt-4">
            <MultiSelectDropdown
              label="Action"
              defaultValue="All"
              options={actionOptions}
              value={actionOptions.filter((option) =>
                selectedActions.includes(option.value)
              )}
              onChange={(selected: unknown) => {
                const actions = (
                  (selected as GroupByOptions[] | null) ?? []
                ).map((option) => option.value);
                setSearchParams((params) => {
                  if (actions.length > 0) {
                    params.set("actions", actions.join(","));
                  } else {
                    params.delete("actions");
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
                data={filteredRoles}
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
