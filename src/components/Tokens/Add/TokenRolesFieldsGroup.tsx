import { getRoles } from "@flanksource-ui/api/services/roles";
import FormikCreatableMultiSelect from "@flanksource-ui/components/RoleBindings/Forms/FormikCreatableMultiSelect";
import { useQuery } from "@tanstack/react-query";

/** Lists only the Roles the database lets the caller read; any other namespace/name can still be typed in. */
export default function TokenRolesFieldsGroup({
  isMcpSetup = false
}: {
  isMcpSetup?: boolean;
}) {
  const {
    data: roles = [],
    isFetching,
    isError
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles
  });
  const references = new Set(
    roles
      .filter((role) => role.namespace)
      .map((role) => `${role.namespace}/${role.name}`)
  );

  return (
    <div className="space-y-2">
      <FormikCreatableMultiSelect
        name="roles"
        label="Role Bindings"
        options={Array.from(references).map((reference) => ({
          label: reference,
          value: reference
        }))}
        isLoading={isFetching}
        placeholder="Select roles or enter namespace/name"
        hint="Select at least one role. You can enter a role from any namespace, even if you cannot browse it."
      />
      {isError && (
        <p role="status" className="text-sm text-orange-700">
          Unable to load roles. You can still enter namespace/name manually.
        </p>
      )}
      <p className="text-sm text-gray-500">
        Each role you pick is bound to the token. The token can only do what
        both your current access and these roles allow. You can't change them
        later: create a new token instead.
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
