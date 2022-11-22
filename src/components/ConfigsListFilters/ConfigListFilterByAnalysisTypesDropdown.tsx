import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ConfigAnalysisTypeItem,
  getConfigsAnalysisTypesFilter
} from "../../api/services/configs";
import { Icon } from "../Icon";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

export function ConfigListFilterByAnalysisTypesDropdown() {
  const { isLoading, data: configTypeOptions } = useQuery(
    ["db", "analysis_types"],
    getConfigsAnalysisTypesFilter,
    {
      select: useCallback((data: ConfigAnalysisTypeItem[]) => {
        return data.map((d) => ({
          id: d.analysis_type,
          value: d.analysis_type,
          description: d.analysis_type,
          name: d.analysis_type,
          icon: (
            <Icon
              name={d.analysis_type}
              secondary={d.analysis_type}
              size="lg"
            />
          )
        }));
      }, [])
    }
  );

  const configItemsOptionsItems = useMemo(
    () => [
      {
        id: "All",
        name: "All",
        description: "All",
        value: "All"
      },
      ...(configTypeOptions || [])
    ],
    [configTypeOptions]
  );

  const [params, setParams] = useSearchParams();

  return (
    <ReactSelectDropdown
      isLoading={isLoading}
      items={configItemsOptionsItems}
      name="type"
      onChange={(value) =>
        setParams({ ...Object.fromEntries(params), analysisType: value ?? "" })
      }
      value={params.get("analysisType") ?? "All"}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Analysis Type:
        </div>
      }
    />
  );
}
