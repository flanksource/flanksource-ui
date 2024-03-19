import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { getConfigsAnalysisAnalyzers } from "../../../../api/services/configs";
import { defaultSelections } from "../../../Incidents/data";
import { ReactSelectDropdown, StateOption } from "../../../ReactSelectDropdown";

type Props = React.HTMLProps<HTMLDivElement> & {
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
  paramsToReset?: string[];
};

export default function ConfigInsightsAnalyzerDropdown({
  prefix = "Analyzer:",
  name = "analyzer",
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
      onChange={(value) => {
        if (value?.toLowerCase() === "all" || !value) {
          params.delete(name);
        } else {
          params.set(name, value);
        }
        paramsToReset.forEach((param) => params.delete(param));
        setParams(params);
      }}
      prefix={<span className="text-gray-500 text-xs">{prefix}</span>}
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
