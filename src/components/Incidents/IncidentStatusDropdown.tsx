import React from "react";
import { Control } from "react-hook-form";
import { incidentStatusItems } from "./data";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultSelections } from "./data";

type Props = React.HTMLProps<HTMLDivElement> & {
  control: Control<any, any>;
  value?: string;
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
};

export default function IncidentStatusDropdown({
  control,
  value,
  prefix = "Status:",
  name = "status",
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
        ...incidentStatusItems
      }}
      hideControlBorder={hideControlBorder}
    />
  );
}
