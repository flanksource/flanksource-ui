import {
  ConfigTypeItem,
  getConfigsTypes
} from "@flanksource-ui/api/services/configs";
import { ReactSelectDropdown } from "@flanksource-ui/components/ReactSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { useCallback, useMemo } from "react";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

type ConfigTypesDropdownProps = {
  label?: string;
};

export function ConfigTypesDropdown({
  label = "Type:"
}: ConfigTypesDropdownProps) {
  const [field] = useField({
    name: "configType"
  });

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
        if (value && value !== "All") {
          field.onChange({
            target: { name: "configType", value: value }
          });
        } else {
          field.onChange({
            target: { name: "configType", value: undefined }
          });
        }
      }}
      value={field.value ?? "All"}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="whitespace-nowrap text-xs text-gray-500">{label}</div>
      }
    />
  );
}
