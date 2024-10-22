import {
  ConfigTypeItem,
  getConfigsTypes
} from "@flanksource-ui/api/services/configs";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "@flanksource-ui/ui/Dropdowns/MultiSelectDropdown";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { useCallback } from "react";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

function sortOptions(a: { label: string }, b: { label: string }) {
  if (a.label === "All") {
    return -1;
  }
  if (b.label === "All") {
    return 1;
  }
  return a.label?.localeCompare(b.label);
}

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
        const res = data?.map((d) => {
          const label =
            d.type?.split("::").length === 1
              ? d.type
              : d.type
                  ?.substring(d.type.indexOf("::") + 2)
                  .replaceAll("::", " ")
                  .trim();

          return {
            value: d.type,
            label: label,
            icon: (
              <ConfigsTypeIcon
                showPrimaryIcon={false}
                config={{ type: d.type }}
              />
            )
          } satisfies GroupByOptions;
        });
        return [
          {
            value: "all",
            label: "All"
          } satisfies GroupByOptions,
          ...(res || []).sort(sortOptions)
        ];
      }, [])
    }
  );

  console.log(field.value);

  return (
    <MultiSelectDropdown
      isLoading={isLoading}
      options={configTypeOptions as GroupByOptions[]}
      name="configType"
      isMulti={false}
      closeMenuOnSelect={true}
      // @ts-ignore
      onChange={(value: GroupByOptions) => {
        if (value && value.value.toLowerCase() !== "all") {
          field.onChange({
            target: { name: "configType", value: value.value }
          });
        } else {
          field.onChange({
            target: { name: "configType", value: undefined }
          });
        }
      }}
      value={
        field.value
          ? (configTypeOptions?.find(
              (option) => option.value === field.value
            ) ?? configTypeOptions?.find((option) => option.value === "all"))
          : {
              value: "all",
              label: "All"
            }
      }
      className="w-auto max-w-[400px]"
      label="Config Type"
    />
  );
}
