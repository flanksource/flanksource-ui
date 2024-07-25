import { getConfigsAnalysisAnalyzers } from "@flanksource-ui/api/services/configs";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import React from "react";
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
  const [field] = useField({
    name
  });

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
      prefix={<span className="text-xs text-gray-500">{prefix}</span>}
      name={name}
      className={className}
      dropDownClassNames={dropDownClassNames}
      value={field.value ?? "all"}
      isLoading={isLoading}
      items={{
        ...(showAllOption ? defaultSelections : {}),
        ...analyzers
      }}
      hideControlBorder={hideControlBorder}
    />
  );
}
