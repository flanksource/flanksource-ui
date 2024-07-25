import {
  ConfigChangesTypeItem,
  getConfigsChangesTypesFilter
} from "@flanksource-ui/api/services/configs";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { useCallback } from "react";

type Props = {
  searchParamKey?: string;
};

export function ChangesTypesDropdown({ searchParamKey = "changeType" }: Props) {
  const [field] = useField({
    name: searchParamKey
  });

  const { isLoading, data: configTypeOptions } = useQuery(
    ["db", "changes_types"],
    getConfigsChangesTypesFilter,
    {
      select: useCallback((data: ConfigChangesTypeItem[] | null) => {
        return data?.map(
          ({ change_type }) =>
            ({
              id: change_type,
              label: change_type,
              value: change_type,
              icon: <ChangeIcon change={{ change_type: change_type }} />
            }) satisfies TriStateOptions
        );
      }, [])
    }
  );

  const configItemsOptionsItems = configTypeOptions || [];

  return (
    <TristateReactSelect
      options={configItemsOptionsItems}
      isLoading={isLoading}
      value={field.value}
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({
            target: { name: searchParamKey, value: value }
          });
        } else {
          field.onChange({
            target: { name: searchParamKey, value: undefined }
          });
        }
      }}
      label="Change Type"
    />
  );
}
