import { useQuery } from "@tanstack/react-query";
import { ComponentProps, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getConfigsTypes, ConfigTypeItem } from "../../api/services/configs";
import { Icon } from "../Icon";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

export function ConfigTypeFilterDropdown({
  ...props
}: ComponentProps<typeof ReactSelectDropdown>) {
  const { isLoading, data: configTypeOptions } = useQuery(
    ["db", "config_types"],
    getConfigsTypes,
    {
      select: useCallback((data: ConfigTypeItem[]) => {
        return data.map((d) => ({
          id: d.config_type,
          value: d.config_type,
          description: d.config_type,
          name: d.config_type,
          icon: (
            <Icon name={d.config_type} secondary={d.config_type} size="lg" />
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
      {...props}
      isLoading={isLoading}
      items={configItemsOptionsItems}
      name="type"
      onChange={(value) =>
        setParams({ ...Object.fromEntries(params), type: value ?? "" })
      }
      value={params.get("type") ?? "All"}
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
