import { getRoles } from "@flanksource-ui/api/services/roles";
import FormikCreatableMultiSelect from "@flanksource-ui/components/RoleBindings/Forms/FormikCreatableMultiSelect";
import { useUser } from "@flanksource-ui/context";
import { useQuery } from "@tanstack/react-query";

/** Role references limit tokens without granting access or requiring Role-read permission. */
export default function TokenRolesFieldsGroup({
  isMcpSetup = false
}: {
  isMcpSetup?: boolean;
}) {
  const { access } = useUser();
  const canReadRoles =
    access?.role?.read === "all" || access?.role?.read === "some";
  const {
    data: roles = [],
    isFetching,
    isError
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled: canReadRoles
  });
  const references = new Set([
    "mission-control-builtin/viewer",
    "mission-control-builtin/admin",
    "mission-control-builtin/plugin-admin",
    ...(canReadRoles ? roles : [])
      .filter((role) => role.namespace)
      .map((role) => `${role.namespace}/${role.name}`)
  ]);

  return (
    <div className="space-y-2">
      <FormikCreatableMultiSelect
        name="roles"
        label="Limiting Roles"
        options={Array.from(references).map((reference) => ({
          label: reference,
          value: reference
        }))}
        isLoading={canReadRoles && isFetching}
        placeholder="Select roles or enter namespace/name"
        hint="Select at least one role. You can enter a role from any namespace, even if you cannot browse it."
      />
      {isError && canReadRoles && (
        <p role="status" className="text-sm text-orange-700">
          Unable to load roles. You can still enter namespace/name manually.
        </p>
      )}
      <p className="text-sm text-gray-500">
        The token can only do what both your current access and the selected
        roles allow. Changes to your access or these roles take effect on the
        token. Missing or invalid roles grant nothing.
      </p>
      <p className="text-xs text-gray-500">
        To retain all your current access, select both
        mission-control-builtin/admin and mission-control-builtin/plugin-admin.
      </p>
      {isMcpSetup && (
        <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          For MCP, select roles allowing mcp:use and the resources and
          operations your tools need. Running playbooks through MCP also
          requires mcp:run and playbook:run.
        </p>
      )}
    </div>
  );
}
