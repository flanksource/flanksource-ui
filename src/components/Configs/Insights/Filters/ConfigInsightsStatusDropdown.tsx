import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";

// Fixed domain list — these are the only valid analysis statuses.
const STATUS_OPTIONS = ["open", "resolved", "silenced"];

type Props = {
  name?: string;
  label?: string;
};

export default function ConfigInsightsStatusDropdown({
  name = "status",
  label = "Status"
}: Props) {
  const [field] = useField({ name });

  const options = useMemo(
    () =>
      STATUS_OPTIONS.map(
        (value) =>
          ({
            id: value,
            label: value.charAt(0).toUpperCase() + value.slice(1),
            value
          }) satisfies TriStateOptions
      ),
    []
  );

  return (
    <TristateReactSelect
      options={options}
      value={field.value}
      minMenuWidth="14rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name, value } });
        } else {
          field.onChange({ target: { name, value: undefined } });
        }
      }}
      label={label}
    />
  );
}
