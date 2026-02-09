// ABOUTME: Multi-select form field for selecting agents by name
// ABOUTME: Uses Formik integration to populate spec.agentSelector field

import { useAllAgentNamesQuery } from "@flanksource-ui/api/query-hooks";
import { useField } from "formik";
import { useMemo } from "react";
import CreatableSelect from "react-select/creatable";

type FormikAgentSelectorProps = {
  name: string;
  label?: string;
  className?: string;
};

export default function FormikAgentSelector({
  name,
  label = "Agents",
  className = "flex flex-col"
}: FormikAgentSelectorProps) {
  const [field, , helpers] = useField<string[]>({
    name,
    type: "text"
  });

  const { isLoading, data: agents } = useAllAgentNamesQuery({});

  const agentOptions = useMemo(
    () =>
      (agents || []).map((agent) => ({
        value: agent.name,
        label: agent.name
      })),
    [agents]
  );

  const selectedValues = useMemo(
    () =>
      (field.value || []).map((agentName) => ({
        value: agentName,
        label: agentName
      })),
    [field.value]
  );

  return (
    <div className={className}>
      <label className="form-label">{label}</label>
      <CreatableSelect
        isMulti
        isLoading={isLoading}
        options={agentOptions}
        value={selectedValues}
        onChange={(selectedOptions) => {
          helpers.setValue(
            selectedOptions ? selectedOptions.map((opt) => opt.value) : []
          );
        }}
        onBlur={() => helpers.setTouched(true)}
        placeholder="Select or type agent names..."
        className="react-select-container"
        classNamePrefix="react-select"
        isClearable
        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
      />
      <p className="mt-1 text-xs text-gray-500">
        Select which agents should run this health check
      </p>
    </div>
  );
}
