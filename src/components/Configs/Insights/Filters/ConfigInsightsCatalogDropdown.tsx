import { ConfigInsightsCatalogOption } from "@flanksource-ui/api/services/configs";
import { ConfigIcon } from "@flanksource-ui/ui/Icons/ConfigIcon";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";

type Props = {
  name?: string;
  label?: string;
  options?: ConfigInsightsCatalogOption[];
  isLoading?: boolean;
};

export default function ConfigInsightsCatalogDropdown({
  name = "catalogId",
  label = "Catalog",
  options: rawOptions = [],
  isLoading = false
}: Props) {
  const [field] = useField({ name });

  const options = useMemo(
    () =>
      rawOptions.map(
        (config) =>
          ({
            id: config.id,
            label: config.name,
            value: config.id,
            icon: <ConfigIcon config={config} />
          }) satisfies TriStateOptions
      ),
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
