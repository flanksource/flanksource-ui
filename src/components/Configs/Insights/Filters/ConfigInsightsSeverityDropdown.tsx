import React from "react";
import { useSearchParams } from "react-router-dom";
import { defaultSelections, severityItems } from "../../../Incidents/data";
import { ReactSelectDropdown } from "../../../ReactSelectDropdown";

type Props = React.HTMLProps<HTMLDivElement> & {
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
  paramsToReset?: string[];
};

export default function ConfigInsightsSeverityDropdown({
  prefix = "Severity:",
  name = "severity",
  className,
  showAllOption,
  dropDownClassNames,
  hideControlBorder,
  paramsToReset = []
}: Props) {
  const [params, setParams] = useSearchParams({
    [name]: "all"
  });

  const value = params.get(name) || "all";

  return (
    <ReactSelectDropdown
      prefix={
        <span className="text-gray-500 text-xs font-semibold">{prefix}</span>
      }
      onChange={(value) => {
        if (value?.toLowerCase() === "all" || !value) {
          params.delete(name);
        } else {
          params.set(name, value);
        }
        paramsToReset.forEach((param) => params.delete(param));
        setParams(params);
      }}
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
