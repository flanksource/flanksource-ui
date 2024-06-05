import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";

const options: TriStateOptions[] = [
  {
    label: "Unhealthy",
    value: "unhealthy",
    id: "unhealthy"
  },
  {
    label: "Healthy",
    value: "healthy",
    id: "healthy"
  },
  {
    label: "Unknown",
    value: "unknown",
    id: "unknown"
  },
  {
    label: "Warn",
    value: "warn",
    id: "warn"
  }
].sort((a, b) => a.label.localeCompare(b.label));

type ConfigTypesDropdownProps = {
  label?: string;
  paramsKey?: string;
};

export function ConfigHealthyDropdown({
  label = "Health",
  paramsKey = "health"
}: ConfigTypesDropdownProps) {
  const [field] = useField({
    name: paramsKey
  });

  return (
    <TristateReactSelect
      options={options}
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({
            target: { name: paramsKey, value: value }
          });
        } else {
          field.onChange({
            target: { name: paramsKey, value: undefined }
          });
        }
      }}
      value={field.value}
      className="w-auto max-w-[400px]"
      label={label}
    />
  );
}
