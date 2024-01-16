import React from "react";
import { Control } from "react-hook-form";
import { defaultSelections } from "../../../Incidents/data";
import { ReactSelectDropdown, StateOption } from "../../../ReactSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { getConfigsAnalysisAnalyzers } from "../../../../api/services/configs";

type Props = React.HTMLProps<HTMLDivElement> & {
  control?: Control<any, any>;
  value?: string;
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
};

export default function ConfigInsightsAnalyzerDropdown({
  control,
  value,
  prefix = "Severity:",
  name = "severity",
  className,
  showAllOption,
  dropDownClassNames,
  hideControlBorder
}: Props) {
  const { data: analyzers, isLoading } = useQuery(
    ["config_analysis_analyzers"],
    () => getConfigsAnalysisAnalyzers(),
    {
      select: (data) => {
        return data
          .map((item) => {
            return {
              description: item.analyzer,
              value: item.analyzer
            };
          })
          .reduce((acc: Record<string, StateOption>, item) => {
            acc[item.value] = item;
            return acc;
          }, {});
      }
    }
  );

  return (
    <ReactSelectDropdown
      control={control}
      prefix={prefix}
      name={name}
      className={className}
      dropDownClassNames={dropDownClassNames}
      value={value}
      isLoading={isLoading}
      items={{
        ...(showAllOption ? defaultSelections : {}),
        ...analyzers
      }}
      hideControlBorder={hideControlBorder}
    />
  );
}
