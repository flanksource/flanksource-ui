import { useGetNotificationTagsListQuery } from "@flanksource-ui/api/query-hooks";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";

type Props = {
  searchParamKey?: string;
};

export default function NotificationTagsDropdown({
  searchParamKey = "tags"
}: Props) {
  const [field] = useField({
    name: searchParamKey
  });

  const { data: tagsData, isLoading } = useGetNotificationTagsListQuery();

  const tagItems = useMemo(() => {
    if (!tagsData || !Array.isArray(tagsData)) {
      return [];
    }

    return tagsData.map(
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
  }, [tagsData]);

  return (
    <TristateReactSelect
      isLoading={isLoading}
      options={tagItems}
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
      label="Tags"
    />
  );
}
