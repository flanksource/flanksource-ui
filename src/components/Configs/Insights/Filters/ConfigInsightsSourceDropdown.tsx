import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";

type Props = {
  name?: string;
  label?: string;
  options?: string[];
  isLoading?: boolean;
};

export default function ConfigInsightsSourceDropdown({
  name = "source",
  label = "Source",
  options: rawOptions = [],
  isLoading = false
}: Props) {
  const [field] = useField({ name });

  const options = useMemo(
    () =>
      rawOptions.map(
        (value) =>
          ({ id: value, label: value, value }) satisfies TriStateOptions
      ),
    [rawOptions]
  );

  return (
    <TristateReactSelect
      options={options}
      isLoading={isLoading}
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
