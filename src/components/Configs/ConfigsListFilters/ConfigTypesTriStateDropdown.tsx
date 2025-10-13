import {
  ConfigTypeItem,
  getConfigsTypes
} from "@flanksource-ui/api/services/configs";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { usePartialUpdateSearchParams } from "../../../hooks/usePartialUpdateSearchParams";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

type ConfigTypesTriStateDropdownProps = {
  label?: string;
  paramsToReset?: string[];
  paramKey?: string;
};

export function ConfigTypesTriStateDropdown({
  label = "Type:",
  paramsToReset = [],
  paramKey = "configType"
}: ConfigTypesTriStateDropdownProps) {
  const [params, setParams] = usePartialUpdateSearchParams();
  const type = params.get(paramKey) ?? undefined;

  const { isLoading, data: configTypeOptions = [] } = useQuery(
    ["db", "config_types"],
    getConfigsTypes,
    {
      select: useCallback((data: ConfigTypeItem[] | null) => {
        return data
          ?.map((d) => {
            const label =
              d.type?.split("::").length === 1
                ? d.type
                : d.type
                    ?.substring(d.type.indexOf("::") + 2)
                    .replaceAll("::", " ")
                    .trim();

            return {
              id: d.type,
              value: d.type.replaceAll("::", "__"),
              label: label,
              icon: (
                <ConfigsTypeIcon
                  showPrimaryIcon={false}
                  config={{ type: d.type }}
                />
              )
            } satisfies TriStateOptions;
          })
          .sort((a, b) => a.label.localeCompare(b.label));
      }, [])
    }
  );

  return (
    <TristateReactSelect
      isLoading={isLoading}
      options={configTypeOptions}
      onChange={(value) => {
        if (value === "All" || !value) {
          params.delete(paramKey);
        } else {
          params.set(paramKey, value);
        }
        paramsToReset.forEach((param) => params.delete(param));
        setParams(Object.fromEntries(params.entries()));
      }}
      value={type}
      className="w-auto max-w-[400px]"
      label={label}
    />
  );
}
