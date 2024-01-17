import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getConfigsTypes, ConfigTypeItem } from "../../../api/services/configs";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

type Props = {
  paramsToReset?: Record<string, string | undefined>;
};

export function ConfigTypesDropdown({ paramsToReset }: Props) {
  const [params, setParams] = useSearchParams();

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
                className="max-h-4 max-w-[1.25rem]"
                config={{ type: d.type }}
              />
            )
          };
        });
      }, [])
    }
  );

  const type = params.get("type") ?? undefined;

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
      name="type"
      onChange={(value) => {
        if (value === "All" || !value) {
          params.delete("type");
        } else {
          params.set("type", value);
        }
        setParams(params);
      }}
      value={type ?? "All"}
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
