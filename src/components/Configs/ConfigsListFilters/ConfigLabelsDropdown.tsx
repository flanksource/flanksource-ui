import { useGetConfigLabelsListQuery } from "@flanksource-ui/api/query-hooks";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";

type Props = {
  searchParamKey?: string;
};

export function ConfigLabelsDropdown({ searchParamKey = "labels" }: Props) {
  const [field] = useField({
    name: searchParamKey
  });

  const { data, isLoading } = useGetConfigLabelsListQuery();

  const labelItems = useMemo(() => {
    if (data && Array.isArray(data)) {
      return data.map(
        (tag) =>
          ({
            label: (
              <span className="space-x-1 text-sm">
                <span className="text-gray-600">{tag.key}:</span>
                <span>{tag.value}</span>
              </span>
            ),
            value: `${tag.key}____${tag.value}`,
            id: `${tag.key}____${tag.value}`
          }) satisfies TriStateOptions
      );
    } else {
      // Adding this console.error to help debug the issue I noticed happening
      // inside the Saas, that's leading to the catalog page crashing
      console.error("Invalid data for ConfigLabelsDropdown", data);
      return [];
    }
  }, [data]);

  return (
    <TristateReactSelect
      isLoading={isLoading}
      options={labelItems}
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
      minMenuWidth="400px"
      value={field.value}
      className="w-auto max-w-[400px]"
      label={"Labels"}
    />
  );
}
