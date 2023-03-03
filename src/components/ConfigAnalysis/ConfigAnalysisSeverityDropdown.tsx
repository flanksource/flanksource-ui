import React from "react";
import { Control } from "react-hook-form";
import {
  HiExclamation,
  HiExclamationCircle,
  HiInformationCircle
} from "react-icons/hi";
import { defaultSelections } from "../Incidents/data";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

export const configAnalysisSeverityItems = {
  Info: {
    id: "dropdown-severity-info",
    icon: <HiInformationCircle className="text-gray-500" />,
    name: "Info",
    description: "Info",
    value: "Info"
  },
  Warning: {
    id: "dropdown-severity-warning",
    icon: <HiExclamation className="text-yellow-500" />,
    name: "Warning",
    description: "Warning",
    value: "warning"
  },
  Critical: {
    id: "dropdown-severity-critical",
    icon: <HiExclamationCircle className="text-red-500" />,
    name: "Critical",
    description: "Critical",
    value: "critical"
  }
} as const;

type Props = React.HTMLProps<HTMLDivElement> & {
  control?: Control<any, any>;
  value?: string;
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
};

export default function ConfigAnalysisSeverityDropdown({
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
        ...configAnalysisSeverityItems
      }}
      hideControlBorder={hideControlBorder}
    />
  );
}
