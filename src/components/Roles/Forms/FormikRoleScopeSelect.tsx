import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import {
  absoluteRbacReference,
  parseRbacReference,
  qualifiedRbacReference
} from "@flanksource-ui/api/types/rbacResources";
import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";
import { useUser } from "@flanksource-ui/context";
import { useField } from "formik";
import { useMemo } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { RoleActionContract, getScopeMismatch } from "../roleActions";

type ScopeOption = {
  // The Scope as namespace/name
  value: string;
  scope: ScopeDisplay;
};

type FormikRoleScopeSelectProps = {
  // Path of the scopeRef in the form, kept as namespace/name
  name: string;
  label: string;
  hint?: string;
  // Namespace of the Role or RoleBinding: a name entered without a namespace is in it.
  // Scopes in every namespace can be referenced.
  namespace: string;
  contract?: RoleActionContract;
  input: "resource" | "target";
  required?: boolean;
  disabled?: boolean;
  allowManual?: boolean;
};

export default function FormikRoleScopeSelect({
  name,
  label,
  hint,
  namespace,
  contract,
  input,
  required = false,
  disabled = false,
  allowManual = false
}: FormikRoleScopeSelectProps) {
  const [field, meta, helpers] = useField<string>(name);
  const { access } = useUser();
  const canRead =
    !allowManual ||
    access?.scope?.read === "all" ||
    access?.scope?.read === "some";
  const {
    data: scopes,
    isFetching,
    isError
  } = useScopesQuery(undefined, canRead);
  const ScopeSelect = allowManual ? CreatableSelect : Select;

  const options = useMemo<ScopeOption[]>(
    () =>
      (canRead ? (scopes ?? []) : [])
        // Scopes without a namespace can't be referenced
        .filter((scope) => scope.namespace)
        .map((scope) => ({
          value: qualifiedRbacReference({
            namespace: scope.namespace!,
            name: scope.name
          }),
          scope
        })),
    [scopes, canRead]
  );

  const selected = useMemo(
    () =>
      field.value
        ? (options.find((option) => option.value === field.value) ?? null)
        : null,
    [field.value, options]
  );
  const reference = field.value
    ? parseRbacReference(namespace, field.value)
    : undefined;

  const mismatch = getScopeMismatch(contract, input, selected?.scope.targets);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <ScopeSelect<ScopeOption>
        inputId={name}
        isLoading={canRead && isFetching}
        isClearable={!required}
        isDisabled={disabled}
        placeholder={
          allowManual
            ? "Select a scope or enter its name..."
            : "Select a scope..."
        }
        formatCreateLabel={(value) => `Use Scope "${value}"`}
        onCreateOption={(value) =>
          helpers.setValue(absoluteRbacReference(namespace, value.trim()))
        }
        options={options}
        // A saved reference to a Scope that doesn't exist is shown as is
        value={
          selected ??
          (field.value
            ? ({
                value: field.value,
                scope: {
                  name: reference?.name ?? field.value,
                  namespace: reference?.namespace,
                  targets: []
                }
              } as unknown as ScopeOption)
            : null)
        }
        getOptionLabel={(option) => option.scope?.name ?? option.value}
        formatOptionLabel={(option) => (
          <div className="flex items-center justify-between gap-2">
            <span>{option.scope?.name ?? option.value}</span>
            {option.scope?.namespace && (
              <span className="text-xs text-gray-500">
                {option.scope.namespace}
              </span>
            )}
          </div>
        )}
        onChange={(option) => helpers.setValue(option?.value ?? "")}
        onBlur={() => helpers.setTouched(true)}
        className="text-sm"
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {allowManual && (
        <p className="text-xs text-gray-500">
          You can enter a Scope without browsing it: its name, in the
          binding&apos;s namespace, or namespace/name. A missing or invalid
          Scope makes the binding ineffective.
        </p>
      )}
      {canRead && isError && allowManual && (
        <p role="status" className="text-xs text-yellow-700">
          Unable to load Scopes. You can still enter a name manually.
        </p>
      )}
      {field.value && !selected && !(canRead && isFetching) && (
        <p className="text-xs text-yellow-700">
          Scope {field.value}{" "}
          {allowManual ? "cannot be verified" : "doesn't exist"}; what uses it
          won&apos;t be in effect unless it exists and is valid.
        </p>
      )}
      {mismatch && <p className="text-xs text-yellow-700">{mismatch}</p>}
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
