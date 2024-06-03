import { useGetConfigTagsListQuery } from "@flanksource-ui/api/query-hooks";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";

type Props = {
  searchParamKey?: string;
};

export function ConfigTagsDropdown({ searchParamKey = "tags" }: Props) {
  const [field] = useField({
    name: searchParamKey
  });

  const { data, isLoading } = useGetConfigTagsListQuery();

  const tagItems = useMemo(() => {
    if (data) {
      return data.map(
        (tag) =>
          ({
            id: `${tag.key}____${tag.value}`,
            label: (
              <div className="block space-x-1 text-sm">
                <span className="w-auto text-gray-600">{tag.key}:</span>
                <span className="w-full">{tag.value}</span>
              </div>
            ),
            value: `${tag.key}____${tag.value}`
          } satisfies TriStateOptions)
      );
    }
  }, [data]);

  return (
    <TristateReactSelect
      options={tagItems ?? []}
      onChange={(value) => {
        if (value) {
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
      className="w-auto max-w-[38rem]"
      label={"Tags"}
      isLoading={isLoading}
    />
  );
}
