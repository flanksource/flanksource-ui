import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getConfigsTypes, ConfigTypeItem } from "../../api/services/configs";
import { Icon } from "../Icon";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

type Props = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  value?: string;
  paramsToReset?: Record<string, string>;
};

export function ConfigTypesDropdown({
  onChange = () => {},
  searchParamKey = "type",
  paramsToReset = {},
  value
}: Props) {
  const { isLoading, data: configTypeOptions } = useQuery(
    ["db", "config_types"],
    getConfigsTypes,
    {
      select: useCallback((data: ConfigTypeItem[] | null) => {
        return data?.map((d) => ({
          id: d.config_class,
          value: d.config_class,
          description: d.config_class,
          name: d.config_class,
          icon: <Icon name={d.config_class} secondary={d.config_class} />
        }));
      }, [])
    }
  );

  function sortOptions(a: { name: string }, b: { name: string }) {
    if (a.name === "All") {
      return -1;
    }
    if (b.name === "All") {
      return 1;
    }
    return a.name.localeCompare(b.name);
  }

  const configItemsOptionsItems = useMemo(
    () =>
      [
        {
          id: "All",
          name: "All",
          description: "All",
          value: "All"
        },
        ...(configTypeOptions || [])
      ].sort(sortOptions),
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
          [searchParamKey]: value ?? "",
          ...paramsToReset
        });
        onChange(value);
      }}
      value={params.get(searchParamKey) ?? "All"}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Type:
        </div>
      }
    />
  );
}
