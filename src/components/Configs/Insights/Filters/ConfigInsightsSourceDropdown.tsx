import { getConfigInsightsSources } from "@flanksource-ui/api/services/configs";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import React, { useMemo } from "react";

type Props = React.HTMLProps<HTMLDivElement> & {
  label?: string;
};

export default function ConfigInsightsSourceDropdown({
  label = "Source",
  name = "source"
}: Props) {
  const [field] = useField({
    name
  });

  const { data: sources, isLoading } = useQuery(
    ["config_analysis_sources"],
    () => getConfigInsightsSources()
  );

  const options = useMemo(() => {
    return (sources ?? [])
      .map((item) => {
        return {
          id: item.source,
          label: item.source,
          value: item.source
        } satisfies TriStateOptions;
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [sources]);

  return (
    <TristateReactSelect
      options={options}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="14rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({
            target: { name, value }
          });
        } else {
          field.onChange({
            target: { name, value: undefined }
          });
        }
      }}
      label={label}
    />
  );
}
