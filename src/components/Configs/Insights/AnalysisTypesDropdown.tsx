import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ConfigAnalysisTypeItem,
  getConfigsAnalysisTypesFilter
} from "../../../api/services/configs";
import { Icon } from "../../../ui/Icons/Icon";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";

type Props = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  value?: string;
};

export function AnalysisTypesDropdown({
  onChange = () => {},
  searchParamKey = "analysisType",
  value
}: Props) {
  const { isLoading, data: configTypeOptions } = useQuery(
    ["db", "analysis_types"],
    getConfigsAnalysisTypesFilter,
    {
      select: useCallback((data: ConfigAnalysisTypeItem[] | null) => {
        return data?.map((d) => ({
          id: d.analysis_type,
          value: d.analysis_type,
          description: d.analysis_type,
          name: d.analysis_type,
          icon: <Icon name={d.analysis_type!} />
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

  const [params, setParams] = useSearchParams({
    ...(value && { [searchParamKey]: value })
  });

  return (
    <ReactSelectDropdown
      isLoading={isLoading}
      items={configItemsOptionsItems}
      name="type"
      onChange={(value) => {
        setParams({
          ...Object.fromEntries(params),
          [searchParamKey]: value ?? ""
        });
        onChange(value);
      }}
      value={params.get(searchParamKey) ?? "All"}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
          Analysis Type:
        </div>
      }
    />
  );
}
