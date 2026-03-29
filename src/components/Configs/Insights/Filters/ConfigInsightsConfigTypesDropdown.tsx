import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";
import ConfigsTypeIcon from "../../ConfigsTypeIcon";

type Props = {
  name?: string;
  label?: string;
  options?: string[];
  isLoading?: boolean;
};

export default function ConfigInsightsConfigTypesDropdown({
  name = "configType",
  label = "Config Type",
  options: rawOptions = [],
  isLoading = false
}: Props) {
  const [field] = useField({ name });

  const options = useMemo(
    () =>
      rawOptions.map((type) => {
        const typeLabel =
          type.split("::").length === 1
            ? type
            : type
                .substring(type.indexOf("::") + 2)
                .replaceAll("::", " ")
                .trim();

        return {
          id: type,
          label: typeLabel,
          value: type,
          icon: <ConfigsTypeIcon config={{ type }} />
        } satisfies TriStateOptions;
      }),
    [rawOptions]
  );

  return (
    <TristateReactSelect
      options={options}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="20rem"
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
