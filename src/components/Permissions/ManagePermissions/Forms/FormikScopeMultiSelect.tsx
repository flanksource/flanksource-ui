import { useScopesQuery } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import { useField, useFormikContext } from "formik";
import { useMemo } from "react";
import Select from "react-select";

type ScopeRef = {
  namespace?: string;
  name: string;
};

type ScopeOption = {
  value: string;
  label: string;
  namespace?: string;
  name: string;
};

export default function FormikScopeMultiSelect() {
  const { setFieldValue } = useFormikContext<Record<string, any>>();
  const [field] = useField<{ scopes?: ScopeRef[] }>({
    name: "object_selector"
  });

  const { data: scopes, isLoading } = useScopesQuery();

  const scopeOptions = useMemo(() => {
    if (!scopes) return [];
    return scopes.map((scope) => ({
      value: JSON.stringify({
        namespace: scope.namespace,
        name: scope.name
      }),
      label: scope.name,
      namespace: scope.namespace,
      name: scope.name
    }));
  }, [scopes]);

  const selectedScopes = useMemo(() => {
    const scopeRefs = field.value?.scopes || [];
    return scopeRefs.map((scopeRef) => ({
      value: JSON.stringify(scopeRef),
      label: scopeRef.name,
      namespace: scopeRef.namespace,
      name: scopeRef.name
    }));
  }, [field.value]);

  const formatOptionLabel = (option: ScopeOption) => (
    <div className="flex items-center justify-between gap-2">
      <span>{option.name}</span>
      {option.namespace && (
        <span className="text-xs text-gray-500">{option.namespace}</span>
      )}
    </div>
  );

  return (
    <div className="mt-2 flex flex-col gap-2">
      <Select
        isMulti
        isLoading={isLoading}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder="Select..."
        options={scopeOptions}
        value={selectedScopes}
        formatOptionLabel={formatOptionLabel}
        onChange={(selectedOptions) => {
          const scopeRefs = selectedOptions.map((option) =>
            JSON.parse(option.value)
          );
          setFieldValue("object_selector", { scopes: scopeRefs });
        }}
        onBlur={field.onBlur}
      />
    </div>
  );
}
