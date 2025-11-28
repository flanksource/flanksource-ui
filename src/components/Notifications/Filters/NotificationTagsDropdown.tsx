import { useGetNotificationTagsListQuery } from "@flanksource-ui/api/query-hooks";
import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";

/**
 * Escapes ':' and ',' characters in tag values to avoid tristate parsing issues.
 * These characters have special meaning in the tristate selector format.
 */
function escapeTagValue(value: string): string {
  return value.replace(/:/g, "\\:").replace(/,/g, "\\,");
}

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

    return tagsData.map((tag) => {
      const escapedKey = escapeTagValue(tag.key);
      const escapedValue = escapeTagValue(tag.value);
      const optionValue = `${escapedKey}____${escapedValue}`;

      return {
        label: (
          <span className="space-x-1 text-sm">
            <span className="text-gray-600">{tag.key}:</span>
            <span>{tag.value}</span>
          </span>
        ),
        value: optionValue,
        id: optionValue
      } satisfies TriStateOptions;
    });
  }, [tagsData]);

  return (
    <TristateReactSelect
      isLoading={isLoading}
      options={tagItems}
      isTagsDropdown
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
