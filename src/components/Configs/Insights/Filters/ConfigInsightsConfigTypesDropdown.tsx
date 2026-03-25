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

type Props = {
  name?: string;
  label?: string;
};

export default function ConfigInsightsConfigTypesDropdown({
  name = "configType",
  label = "Config Type"
}: Props) {
  const [field] = useField({ name });

  const { isLoading, data: configTypeOptions } = useQuery({
    queryKey: ["db", "config_types"],
    queryFn: getConfigsTypes,
    select: useCallback((data: ConfigTypeItem[] | null) => {
      return data?.map(({ type }) => {
        const typeLabel =
          type?.split("::").length === 1
            ? type
            : type
                ?.substring(type.indexOf("::") + 2)
                .replaceAll("::", " ")
                .trim();

        return {
          id: type,
          label: typeLabel,
          value: type,
          icon: <ConfigsTypeIcon config={{ type }} />
        } satisfies TriStateOptions;
      });
    }, [])
  });

  return (
    <TristateReactSelect
      options={configTypeOptions || []}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="20rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name, value } });
        } else {
          field.onChange({
            target: { name, value: undefined }
          });
        }
      }}
      label={label}
    />
  );
}
