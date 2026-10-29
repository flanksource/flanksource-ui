import { getRoles } from "@flanksource-ui/api/services/roles";
import FormikCreatableMultiSelect from "@flanksource-ui/components/RoleBindings/Forms/FormikCreatableMultiSelect";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

// A token's own Roles must also allow mcp:use for it to reach /mcp, so the MCP
// setup preselects the Role that grants only that. It adds nothing the owner
// lacks.
export const MCP_USER_ROLE = "mission-control-builtin/mcp-user";

/** Lists only the Roles the database lets the caller read; any other namespace/name can still be typed in. */
export default function TokenRolesFieldsGroup({
  isMcpSetup = false
}: {
  isMcpSetup?: boolean;
}) {
  const {
    data: roles = [],
    isFetching,
    error
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
      {error instanceof Error && (
        <p role="status" className="text-sm text-orange-700">
          {isAxiosError(error) && error.response?.status === 403
            ? "You don't have read access to roles, so they can't be listed."
            : `Unable to load roles: ${error.message}.`}{" "}
          You can still enter namespace/name manually.
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
          For MCP, keep {MCP_USER_ROLE}, which lets the token use MCP, and add
          roles for the resources and operations your tools need. Running
          playbooks through MCP also requires mcp:run and playbook:run.
        </p>
      )}
    </div>
  );
}
