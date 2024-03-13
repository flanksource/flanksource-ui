import {
  ConfigChangesTypeItem,
  getConfigsChangesTypesFilter
} from "@flanksource-ui/api/services/configs";
import { Icon } from "@flanksource-ui/components/Icon";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/TristateReactSelect/TristateReactSelect";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  paramsToReset?: string[];
};

export function ChangesTypesDropdown({
  onChange = () => {},
  searchParamKey = "changeType",
  paramsToReset = []
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

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
              icon: <Icon name={change_type} secondary={change_type} />
            } satisfies TriStateOptions)
        );
      }, [])
    }
  );

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
      label="Change Type"
    />
  );
}
