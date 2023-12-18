import React from "react";
import { Control } from "react-hook-form";
import { defaultSelections, severityItems } from "../../../Incidents/data";
import { ReactSelectDropdown } from "../../../ReactSelectDropdown";

type Props = React.HTMLProps<HTMLDivElement> & {
  control?: Control<any, any>;
  value?: string;
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
};

export default function ConfigInsightsSeverityDropdown({
  control,
  value,
  prefix = "Severity:",
  name = "severity",
  className,
  showAllOption,
  dropDownClassNames,
  hideControlBorder
}: Props) {
  return (
    <ReactSelectDropdown
      control={control}
      prefix={prefix}
      name={name}
      className={className}
      dropDownClassNames={dropDownClassNames}
      value={value}
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
