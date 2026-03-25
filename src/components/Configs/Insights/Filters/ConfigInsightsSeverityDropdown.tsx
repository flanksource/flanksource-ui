import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import React from "react";
import { severityItems } from "../../../Incidents/data";

type Props = React.HTMLProps<HTMLDivElement> & {
  label?: string;
};

export default function ConfigInsightsSeverityDropdown({
  label = "Severity",
  name = "severity"
}: Props) {
  const [field] = useField({
    name
  });

  const options = Object.values(severityItems)
    .map((item) => ({
      id: item.id,
      label: item.name,
      value: item.value.toLowerCase(),
      icon: item.icon
    }))
    .sort((a, b) => a.label.localeCompare(b.label)) satisfies TriStateOptions[];

  return (
    <TristateReactSelect
      options={options}
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
