import { useGetConfigLabelsListQuery } from "@flanksource-ui/api/query-hooks";
import { useField } from "formik";
import { useMemo } from "react";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";

type Props = {
  searchParamKey?: string;
};

export function ConfigLabelsDropdown({ searchParamKey = "labels" }: Props) {
  const [field] = useField({
    name: searchParamKey
  });

  const { data, isLoading } = useGetConfigLabelsListQuery();

  const labelItems = useMemo(() => {
    if (data) {
      const options = data.map((tag) => ({
        label: (
          <div className="block space-x-1 text-sm">
            <span className="w-auto text-gray-600">{tag.key}:</span>
            <span className="w-full">{tag.value}</span>
          </div>
        ),
        value: `${tag.key}__:__${tag.value}`
      }));
      return [{ label: "All", value: "All" }, ...options];
    }
  }, [data]);

  return (
    <ReactSelectDropdown
      items={labelItems}
      name="type"
      onChange={(value) => {
        if (value && value !== "All") {
          field.onChange({
            target: { name: searchParamKey, value: value }
          });
        } else {
          field.onChange({
            target: { name: searchParamKey, value: undefined }
          });
        }
      }}
      value={field.value ?? "All"}
      className="w-auto max-w-[38rem]"
      dropDownClassNames="w-auto max-w-[38rem] left-0"
      hideControlBorder
      isMulti
      prefix={
        <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
          Labels:
        </div>
      }
      isLoading={isLoading}
    />
  );
}
