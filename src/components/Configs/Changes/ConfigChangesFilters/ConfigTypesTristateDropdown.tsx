import {
  ConfigTypeItem,
  getConfigsTypes
} from "@flanksource-ui/api/services/configs";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ConfigsTypeIcon from "../../ConfigsTypeIcon";

type ConfigTypesTristateDropdownProps = {
  paramsToReset?: string[];
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
};

export default function ConfigTypesTristateDropdown({
  paramsToReset = [],
  onChange = () => {},
  searchParamKey = "configTypes"
}: ConfigTypesTristateDropdownProps) {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const value = searchParams.get(searchParamKey) || undefined;

  const configItemsOptionsItems = configTypeOptions || [];

  return (
    <TristateReactSelect
      options={configItemsOptionsItems}
      isLoading={isLoading}
      value={value}
      onChange={(value) => {
        if (value) {
          searchParams.set(searchParamKey, value);
        } else {
          searchParams.delete(searchParamKey);
        }
        paramsToReset.forEach((param) => searchParams.delete(param));
        setSearchParams(searchParams);
        onChange(value);
      }}
      label="Config Type"
    />
  );
}
