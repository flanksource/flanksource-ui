import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useSearchParams } from "react-router-dom";

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
  paramsToReset?: string[];
  paramsKey?: string;
};

export function ConfigHealthyDropdown({
  label = "Health",
  paramsKey = "health",
  paramsToReset = []
}: ConfigTypesDropdownProps) {
  const [params, setParams] = useSearchParams();

  const type = params.get(paramsKey) ?? undefined;

  return (
    <TristateReactSelect
      options={options}
      onChange={(value) => {
        if (value === "All" || !value) {
          params.delete(paramsKey);
        } else {
          params.set(paramsKey, value);
        }
        paramsToReset.forEach((param) => params.delete(param));
        setParams(params);
      }}
      value={type}
      className="w-auto max-w-[400px]"
      label={label}
    />
  );
}
