import {
  ConfigTypeItem,
  getConfigsTypes
} from "@flanksource-ui/api/services/configs";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { useCallback } from "react";
import ConfigsTypeIcon from "../../ConfigsTypeIcon";

type ConfigTypesTristateDropdownProps = {
  searchParamKey?: string;
};

export default function ConfigTypesTristateDropdown({
  searchParamKey = "configTypes"
}: ConfigTypesTristateDropdownProps) {
  const [field] = useField({
    name: searchParamKey
  });

  const { isLoading, data: configTypeOptions } = useQuery({
    queryKey: ["db", "config_types"],
    queryFn: getConfigsTypes,
    select: useCallback((data: ConfigTypeItem[] | null) => {
      return data?.map(({ type }) => {
        const label =
          type?.split("::").length === 1
            ? type
            : type
                ?.substring(type.indexOf("::") + 2)
                .replaceAll("::", " ")
                .trim();

        return {
          id: type,
          label: label,
          value: type.replaceAll("::", "__"),
          icon: <ConfigsTypeIcon config={{ type: type }} />
        } satisfies TriStateOptions;
      });
    }, [])
  });

  const configItemsOptionsItems = configTypeOptions || [];

  return (
    <TristateReactSelect
      options={configItemsOptionsItems}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="20rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name: searchParamKey, value: value } });
        } else {
          field.onChange({
            target: { name: searchParamKey, value: undefined }
          });
        }
      }}
      label="Config Type"
    />
  );
}
