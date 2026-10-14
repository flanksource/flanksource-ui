import { useRolesQuery } from "@flanksource-ui/api/query-hooks/useRolesQuery";
import { RoleDisplay } from "@flanksource-ui/api/types/roles";
import { useUser } from "@flanksource-ui/context";
import { useField } from "formik";
import { useMemo } from "react";
import CreatableSelect from "react-select/creatable";

type RoleOption = Pick<RoleDisplay, "id" | "name" | "namespace">;

type FormikBindingRoleSelectProps = {
  // Only Roles in this namespace can be granted. Every namespace is offered when it's unset.
  namespace?: string;
  onRoleChange: (role?: Pick<RoleDisplay, "name" | "namespace">) => void;
};

export default function FormikBindingRoleSelect({
  namespace,
  onRoleChange
}: FormikBindingRoleSelectProps) {
  const [field, meta, helpers] = useField<string>("role");
  const { access } = useUser();
  const canRead = access?.role?.read === "all" || access?.role?.read === "some";
  const { data: roles, isFetching, isError } = useRolesQuery(canRead);

  const options = useMemo(
    () =>
      (canRead ? (roles ?? []) : [])
        .filter((role) => role.namespace)
        .filter((role) => !namespace || role.namespace === namespace),
    [roles, namespace, canRead]
  );

  const selected = field.value
    ? (options.find((role) => role.name === field.value) ?? null)
    : null;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="role" className="text-sm font-medium text-gray-700">
        Role <span className="text-red-500">*</span>
      </label>
      <CreatableSelect<RoleOption>
        inputId="role"
        isLoading={canRead && isFetching}
        placeholder="Select a role or enter its name..."
        getNewOptionData={(name) => ({
          id: name,
          name: `Use Role "${name}"`,
          __isNew__: true
        })}
        onCreateOption={(name) => {
          helpers.setValue(name.trim());
          onRoleChange({
            name: name.trim(),
            namespace: namespace || "default"
          });
        }}
        options={options}
        // A saved reference to a Role that doesn't exist is shown as is
        value={
          selected ??
          (field.value ? { id: field.value, name: field.value } : null)
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
      <p className="text-xs text-gray-500">
        Enter a Role name even if you cannot browse it. References resolve only
        in the binding&apos;s namespace.
      </p>
      {field.value && !selected && !(canRead && isFetching) && (
        <p className="text-xs text-yellow-700">
          Role {field.value} cannot be verified
          {namespace ? ` in ${namespace}` : ""}. A missing or invalid Role
          grants nothing; the server reports the binding&apos;s status after
          saving.
        </p>
      )}
      {canRead && isError && (
        <p role="status" className="text-xs text-yellow-700">
          Unable to load Roles. You can still enter a name manually.
        </p>
      )}
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
