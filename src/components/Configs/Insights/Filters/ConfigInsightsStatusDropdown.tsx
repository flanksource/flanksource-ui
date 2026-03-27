import { getConfigInsightsStatuses } from "@flanksource-ui/api/services/configs";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import React, { useMemo } from "react";

type Props = React.HTMLProps<HTMLDivElement> & {
  label?: string;
};

export default function ConfigInsightsStatusDropdown({
  label = "Status",
  name = "status"
}: Props) {
  const [field] = useField({
    name
  });

  const { data: statuses, isLoading } = useQuery(
    ["config_analysis_statuses"],
    () => getConfigInsightsStatuses()
  );

  const options = useMemo(() => {
    return (statuses ?? [])
      .map((item) => {
        return {
          id: item.status,
          label: item.status,
          value: item.status
        } satisfies TriStateOptions;
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [statuses]);

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
