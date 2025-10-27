import { useField } from "formik";
import { useQuery } from "@tanstack/react-query";
import Select, { components } from "react-windowed-select";
import { getViewsSummary } from "@flanksource-ui/api/services/views";
import { useCallback, useMemo } from "react";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";

type FormikViewSelectorDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function FormikViewSelectorDropdown({
  name,
  label = "View",
  required = false,
  disabled = false,
  className = "flex flex-col space-y-2"
}: FormikViewSelectorDropdownProps) {
  const [field, meta, helpers] = useField<string>({
    name,
    type: "text",
    required,
    validate: useCallback(
      (value: string) => {
        if (required && !value) {
          return "This field is required";
        }
      },
      [required]
    )
  });

  const { data: views, isLoading } = useQuery({
    queryKey: ["views_summary"],
    queryFn: getViewsSummary,
    staleTime: 5 * 60 * 1000
  });

  const options = useMemo(() => {
    if (!views) return [];

    return views.map((view) => ({
      value: view.name,
      label: view.name,
      namespace: view.namespace,
      view: view
    }));
  }, [views]);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === field.value) || null;
  }, [options, field.value]);

  const handleChange = useCallback(
    (option: any) => {
      helpers.setValue(option?.value || "");
    },
    [helpers]
  );

  const showError = meta.touched && meta.error;

  const Option = (props: any) => {
    return (
      <components.Option {...props}>
        <div className="flex items-center gap-2">
          {props.data.namespace && (
            <Badge
              text={props.data.namespace}
              colorClass="bg-gray-200 text-gray-700"
            />
          )}
          <span>{props.data.label}</span>
        </div>
      </components.Option>
    );
  };

  const SingleValue = (props: any) => {
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center gap-2">
          {props.data.namespace && (
            <Badge
              text={props.data.namespace}
              colorClass="bg-gray-200 text-gray-700"
            />
          )}
          <span>{props.data.label}</span>
        </div>
      </components.SingleValue>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <Select
        name={field.name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        components={{
          Option,
          SingleValue
        }}
        isClearable
        isDisabled={disabled || isLoading}
        placeholder={isLoading ? "Loading views..." : "Select a view"}
        className="react-select-container"
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        windowThreshold={50}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
      />
      {showError && (
        <span className="mt-1 text-sm text-red-500">{meta.error}</span>
      )}
    </div>
  );
}
