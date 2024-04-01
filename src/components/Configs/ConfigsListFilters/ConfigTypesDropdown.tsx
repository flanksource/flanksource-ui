import {
  ConfigTypeItem,
  getConfigsTypes
} from "@flanksource-ui/api/services/configs";
import { ReactSelectDropdown } from "@flanksource-ui/components/ReactSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

type ConfigTypesDropdownProps = {
  label?: string;
  paramsToReset?: string[];
};

export function ConfigTypesDropdown({
  label = "Type:",
  paramsToReset = []
}: ConfigTypesDropdownProps) {
  const [params, setParams] = useSearchParams();
  const type = params.get("configType") ?? undefined;

  const { isLoading, data: configTypeOptions } = useQuery(
    ["db", "config_types"],
    getConfigsTypes,
    {
      select: useCallback((data: ConfigTypeItem[] | null) => {
        return data?.map((d) => {
          const label =
            d.type?.split("::").length === 1
              ? d.type
              : d.type
                  ?.substring(d.type.indexOf("::") + 2)
                  .replaceAll("::", " ")
                  .trim();

          return {
            id: d.type,
            value: d.type,
            description: label,
            name: d.type,
            icon: (
              <ConfigsTypeIcon
                showPrimaryIcon={false}
                config={{ type: d.type }}
              />
            )
          };
        });
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
    return a.name?.localeCompare(b.name);
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

  return (
    <ReactSelectDropdown
      isLoading={isLoading}
      items={configItemsOptionsItems}
      name="configType"
      onChange={(value) => {
        if (value === "All" || !value) {
          params.delete("configType");
        } else {
          params.set("configType", value);
        }
        paramsToReset.forEach((param) => params.delete(param));
        setParams(params);
      }}
      value={type ?? "All"}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 whitespace-nowrap">{label}</div>
      }
    />
  );
}
