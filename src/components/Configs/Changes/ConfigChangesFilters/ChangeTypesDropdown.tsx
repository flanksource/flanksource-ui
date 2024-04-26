import { ChangeIcon } from "@flanksource-ui/components/Icon/ChangeIcon";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  paramsToReset?: string[];
  changeTypes?: Record<string, number>;
  isLoading?: boolean;
};

export function ChangesTypesDropdown({
  onChange = () => {},
  searchParamKey = "changeType",
  changeTypes,
  paramsToReset = [],
  isLoading
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const configTypeOptions = useMemo(() => {
    return changeTypes
      ? Object.entries(changeTypes).map(([change_type]) => {
          return {
            id: change_type,
            label: change_type,
            value: change_type,
            icon: <ChangeIcon change={{ change_type: change_type }} />
          } satisfies TriStateOptions;
        })
      : [];
  }, [changeTypes]);

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
