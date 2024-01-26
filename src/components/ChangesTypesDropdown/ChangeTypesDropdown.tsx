import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ConfigChangesTypeItem,
  getConfigsChangesTypesFilter
} from "../../api/services/configs";
import { Icon } from "../Icon";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

type Props = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  paramsToReset?: Record<string, string>;
  value?: string;
};

export function ChangesTypesDropdown({
  onChange = () => {},
  searchParamKey = "change_type",
  paramsToReset = {},
  value
}: Props) {
  const { isLoading, data: configTypeOptions } = useQuery(
    ["db", "changes_types"],
    getConfigsChangesTypesFilter,
    {
      select: useCallback((data: ConfigChangesTypeItem[] | null) => {
        return data?.map(({ change_type }) => ({
          id: change_type,
          value: change_type,
          description: change_type,
          name: change_type,
          icon: <Icon name={change_type} secondary={change_type} />
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
        if (value === "All" || !value) {
          params.delete(searchParamKey);
        } else {
          params.set(searchParamKey, value);
        }
        setParams(params);
        onChange(value);
      }}
      value={params.get(searchParamKey) ?? "All"}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Change Type:
        </div>
      }
    />
  );
}
