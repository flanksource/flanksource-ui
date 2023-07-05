import React from "react";
import { Control } from "react-hook-form";
import { typeItems } from "./data";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultSelections } from "./data";

type Props = React.HTMLProps<HTMLDivElement> & {
  control: Control<any, any>;
  value?: string;
  prefix?: string;
  showAllOption?: boolean;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
};

export default function IncidentTypeDropdown({
  control,
  value,
  prefix = "Type:",
  name = "incidentType",
  className = "border-none shadow-none font-semibold space-x-3 capitalize text-sm px-2",
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
      items={{ ...(showAllOption ? defaultSelections : {}), ...typeItems }}
      hideControlBorder={hideControlBorder}
    />
  );
}
