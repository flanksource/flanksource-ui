import {
  ConfigStatusesItem,
  getConfigsStatusesItems
} from "@flanksource-ui/api/services/configs";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type ConfigTypesDropdownProps = {
  label?: string;
  paramsToReset?: string[];
  paramsKey?: string;
};

export function ConfigStatusDropdown({
  label = "Status",
  paramsKey = "status",
  paramsToReset = []
}: ConfigTypesDropdownProps) {
  const [params, setParams] = useSearchParams();
  const type = params.get(paramsKey) ?? undefined;

  const { isLoading, data: configStatusesOptions } = useQuery(
    ["db", "config_statues"],
    getConfigsStatusesItems,
    {
      select: useCallback((data: ConfigStatusesItem[] | null) => {
        return data?.map((d) => {
          return {
            value: d.status,
            label: d.status,
            id: d.status
          } satisfies TriStateOptions;
        });
      }, [])
    }
  );

  const configItemsOptionsItems = useMemo(
    () =>
      (configStatusesOptions || []).sort((a, b) => {
        if (a.label === "All") {
          return -1;
        }
        if (b.label === "All") {
          return 1;
        }
        return a.label?.localeCompare(b.label);
      }),
    [configStatusesOptions]
  );

  return (
    <TristateReactSelect
      isLoading={isLoading}
      options={configItemsOptionsItems}
      onChange={(value) => {
        if (value === "All" || !value) {
          params.delete(paramsKey);
        } else {
          params.set(paramsKey, value);
        }
        paramsToReset.forEach((param) => params.delete(param));
        setParams(params);
      }}
      value={type}
      className="w-auto max-w-[400px]"
      label={label}
    />
  );
}
