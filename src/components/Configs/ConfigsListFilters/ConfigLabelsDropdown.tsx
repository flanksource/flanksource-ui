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
              <div className="block space-x-1 text-sm">
                <span className="w-auto text-gray-600">{tag.key}:</span>
                <span className="w-full">{tag.value}</span>
              </div>
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
      value={field.value}
      className="w-auto max-w-[400px]"
      label={"Labels"}
    />
  );
}
