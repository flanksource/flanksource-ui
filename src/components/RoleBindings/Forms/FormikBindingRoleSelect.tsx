import { useRolesQuery } from "@flanksource-ui/api/query-hooks/useRolesQuery";
import { RoleDisplay } from "@flanksource-ui/api/types/roles";
import { useField } from "formik";
import { useMemo } from "react";
import Select from "react-select";

type FormikBindingRoleSelectProps = {
  // Only Roles in this namespace can be granted. Every namespace is offered when it's unset.
  namespace?: string;
  onRoleChange: (role?: RoleDisplay) => void;
};

export default function FormikBindingRoleSelect({
  namespace,
  onRoleChange
}: FormikBindingRoleSelectProps) {
  const [field, meta, helpers] = useField<string>("role");
  const { data: roles, isLoading } = useRolesQuery();

  const options = useMemo(
    () =>
      (roles ?? [])
        .filter((role) => role.namespace)
        .filter((role) => !namespace || role.namespace === namespace),
    [roles, namespace]
  );

  const selected = field.value
    ? (options.find((role) => role.name === field.value) ?? null)
    : null;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="role" className="text-sm font-medium text-gray-700">
        Role <span className="text-red-500">*</span>
      </label>
      <Select<RoleDisplay>
        inputId="role"
        isLoading={isLoading}
        placeholder="Select a role..."
        options={options}
        // A saved reference to a Role that doesn't exist is shown as is
        value={
          selected ??
          (field.value
            ? ({ id: field.value, name: field.value } as RoleDisplay)
            : null)
        }
        getOptionValue={(role) => role.id}
        getOptionLabel={(role) => role.name}
        formatOptionLabel={(role) => (
          <div className="flex items-center justify-between gap-2">
            <span>{role.name}</span>
            {role.namespace && (
              <span className="text-xs text-gray-500">{role.namespace}</span>
            )}
          </div>
        )}
        onChange={(role) => {
          helpers.setValue(role?.name ?? "");
          onRoleChange(role ?? undefined);
        }}
        onBlur={() => helpers.setTouched(true)}
        className="text-sm"
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      {field.value && !selected && !isLoading && (
        <p className="text-xs text-yellow-700">
          Role {field.value} doesn&apos;t exist
          {namespace ? ` in ${namespace}` : ""}; the binding won&apos;t be in
          effect until it does.
        </p>
      )}
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
