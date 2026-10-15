import { useRolesQuery } from "@flanksource-ui/api/query-hooks/useRolesQuery";
import {
  absoluteRbacReference,
  qualifiedRbacReference
} from "@flanksource-ui/api/types/rbacResources";
import { RoleDisplay } from "@flanksource-ui/api/types/roles";
import { useUser } from "@flanksource-ui/context";
import { useField } from "formik";
import { useMemo } from "react";
import CreatableSelect from "react-select/creatable";

type RoleOption = Pick<RoleDisplay, "name" | "namespace"> & {
  // The Role as namespace/name, the form's value
  value: string;
};

type FormikBindingRoleSelectProps = {
  // The binding's namespace: a name entered without a namespace is in it. Roles in every namespace can be granted.
  namespace: string;
};

export default function FormikBindingRoleSelect({
  namespace
}: FormikBindingRoleSelectProps) {
  const [field, meta, helpers] = useField<string>("role");
  const { access } = useUser();
  const canRead = access?.role?.read === "all" || access?.role?.read === "some";
  const { data: roles, isFetching, isError } = useRolesQuery(canRead);

  const options = useMemo<RoleOption[]>(
    () =>
      (canRead ? (roles ?? []) : [])
        .filter((role) => role.namespace)
        .map((role) => ({
          name: role.name,
          namespace: role.namespace,
          value: qualifiedRbacReference({
            namespace: role.namespace!,
            name: role.name
          })
        })),
    [roles, canRead]
  );

  const selected = field.value
    ? (options.find((role) => role.value === field.value) ?? null)
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
          value: name,
          name: `Use Role "${name}"`
        })}
        onCreateOption={(name) =>
          helpers.setValue(absoluteRbacReference(namespace, name.trim()))
        }
        options={options}
        // A saved reference to a Role that doesn't exist is shown as is
        value={
          selected ??
          (field.value ? { value: field.value, name: field.value } : null)
        }
        getOptionValue={(role) => role.value}
        getOptionLabel={(role) => role.name}
        formatOptionLabel={(role) => (
          <div className="flex items-center justify-between gap-2">
            <span>{role.name}</span>
            {role.namespace && (
              <span className="text-xs text-gray-500">{role.namespace}</span>
            )}
          </div>
        )}
        onChange={(role) => helpers.setValue(role?.value ?? "")}
        onBlur={() => helpers.setTouched(true)}
        className="text-sm"
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      <p className="text-xs text-gray-500">
        You can enter a Role without browsing it: its name, in the
        binding&apos;s namespace, or namespace/name.
      </p>
      {field.value && !selected && !(canRead && isFetching) && (
        <p className="text-xs text-yellow-700">
          Role {field.value} cannot be verified. A missing or invalid Role
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
