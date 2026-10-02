import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";
import { useField } from "formik";
import { useMemo } from "react";
import Select from "react-select";
import { RoleActionContract, getScopeMismatch } from "../roleActions";

type ScopeOption = {
  value: string;
  scope: ScopeDisplay;
};

type FormikRoleScopeSelectProps = {
  // Path of the scopeRef (a Scope name) in the form
  name: string;
  label: string;
  hint?: string;
  // Only Scopes in this namespace can be referenced. Every namespace is offered when it's unset.
  namespace?: string;
  contract?: RoleActionContract;
  input: "resource" | "target";
  required?: boolean;
  disabled?: boolean;
  onScopeChange?: (scope?: ScopeDisplay) => void;
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
  onScopeChange = () => {}
}: FormikRoleScopeSelectProps) {
  const [field, meta, helpers] = useField<string>(name);
  const { data: scopes, isLoading } = useScopesQuery();

  const options = useMemo<ScopeOption[]>(
    () =>
      (scopes ?? [])
        // Scopes without a namespace can't be referenced by any Role
        .filter((scope) => scope.namespace)
        .filter((scope) => !namespace || scope.namespace === namespace)
        .map((scope) => ({ value: scope.id, scope })),
    [scopes, namespace]
  );

  const selected = useMemo(
    () =>
      field.value
        ? (options.find((option) => option.scope.name === field.value) ?? null)
        : null,
    [field.value, options]
  );

  const mismatch = getScopeMismatch(contract, input, selected?.scope.targets);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <Select<ScopeOption>
        inputId={name}
        isLoading={isLoading}
        isClearable={!required}
        isDisabled={disabled}
        placeholder="Select a scope..."
        options={options}
        // A saved reference to a Scope that doesn't exist is shown as is
        value={
          selected ??
          (field.value
            ? ({
                value: field.value,
                scope: {
                  name: field.value,
                  namespace,
                  targets: []
                }
              } as unknown as ScopeOption)
            : null)
        }
        getOptionLabel={(option) => option.scope.name}
        formatOptionLabel={(option) => (
          <div className="flex items-center justify-between gap-2">
            <span>{option.scope.name}</span>
            {option.scope.namespace && (
              <span className="text-xs text-gray-500">
                {option.scope.namespace}
              </span>
            )}
          </div>
        )}
        onChange={(option) => {
          helpers.setValue(option?.scope.name ?? "");
          onScopeChange(option?.scope);
        }}
        onBlur={() => helpers.setTouched(true)}
        className="text-sm"
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {field.value && !selected && !isLoading && (
        <p className="text-xs text-yellow-700">
          Scope {field.value} doesn&apos;t exist
          {namespace ? ` in ${namespace}` : ""}; what uses it won&apos;t be in
          effect until it does.
        </p>
      )}
      {mismatch && <p className="text-xs text-yellow-700">{mismatch}</p>}
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
