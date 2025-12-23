import {
  ConfigStatusesItem,
  getConfigsStatusesItems
} from "@flanksource-ui/api/services/configs";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { useCallback, useMemo } from "react";

type ConfigTypesDropdownProps = {
  label?: string;
  paramsKey?: string;
};

export function ConfigStatusDropdown({
  label = "Status",
  paramsKey = "status"
}: ConfigTypesDropdownProps) {
  const [field] = useField({
    name: paramsKey
  });

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
        if (value && value !== "all") {
          field.onChange({
            target: { name: paramsKey, value: value }
          });
        } else {
          field.onChange({
            target: { name: paramsKey, value: undefined }
          });
        }
      }}
      minMenuWidth="250px"
      value={field.value}
      label={label}
    />
  );
}
