import { useField } from "formik";
import React from "react";
import { defaultSelections, severityItems } from "../../../Incidents/data";
import { ReactSelectDropdown } from "../../../ReactSelectDropdown";

type Props = React.HTMLProps<HTMLDivElement> & {
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
};

export default function ConfigInsightsSeverityDropdown({
  prefix = "Severity:",
  name = "severity",
  className,
  showAllOption,
  dropDownClassNames,
  hideControlBorder
}: Props) {
  const [field] = useField({
    name
  });

  return (
    <ReactSelectDropdown
      prefix={<span className="text-xs text-gray-500">{prefix}</span>}
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
      name={name}
      className={className}
      dropDownClassNames={dropDownClassNames}
      value={field.value ?? "all"}
      items={{
        ...(showAllOption ? defaultSelections : {}),
        ...Object.values(severityItems).sort((a, b) =>
          a.name > b.name ? 1 : -1
        )
      }}
      hideControlBorder={hideControlBorder}
    />
  );
}
