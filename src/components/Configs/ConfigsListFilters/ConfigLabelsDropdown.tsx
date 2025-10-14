import {
  useGetConfigLabelsListQuery,
  useGetConfigTagsListQuery
} from "@flanksource-ui/api/query-hooks";
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

  const { data: tagsData, isLoading: isTagsLoading } =
    useGetConfigTagsListQuery();
  const { data: labelsData, isLoading: isLabelsLoading } =
    useGetConfigLabelsListQuery();

  const isLoading = isTagsLoading || isLabelsLoading;

  const labelItems = useMemo(() => {
    const tagItems: TriStateOptions[] = [];
    const labelItems: TriStateOptions[] = [];

    // First, process ALL tags from tagsData (this ensures all tags are shown at the top)
    if (tagsData && Array.isArray(tagsData)) {
      const sortedTags = [...tagsData].sort((a, b) => {
        const keyCompare = a.key.localeCompare(b.key);
        if (keyCompare !== 0) return keyCompare;
        return String(a.value).localeCompare(String(b.value));
      });

      tagItems.push(...sortedTags.map(tag => ({
        label: (
          <span className="space-x-1 text-sm">
            <span className="text-gray-600">{tag.key}:</span>
            <span>{tag.value}</span>
          </span>
        ),
        value: `${tag.key}____${tag.value}`,
        id: `${tag.key}____${tag.value}`
      } satisfies TriStateOptions)));
    }

    // Create a set of tag identifiers for deduplication
    const tagSet = new Set<string>();
    if (tagsData && Array.isArray(tagsData)) {
      tagsData.forEach(tag => {
        tagSet.add(`${tag.key}____${tag.value}`);
      });
    }

    // Then, process labels from labelsData, but exclude items that are already in tags
    if (labelsData && Array.isArray(labelsData)) {
      const filteredLabels = labelsData.filter(item => {
        const identifier = `${item.key}____${item.value}`;
        return !tagSet.has(identifier); // Only include if NOT in tags
      });

      const sortedLabels = filteredLabels.sort((a, b) => {
        const keyCompare = a.key.localeCompare(b.key);
        if (keyCompare !== 0) return keyCompare;
        return String(a.value).localeCompare(String(b.value));
      });

      labelItems.push(...sortedLabels.map(item => ({
        label: (
          <span className="space-x-1 text-sm">
            <span className="text-gray-600">{item.key}:</span>
            <span>{item.value}</span>
          </span>
        ),
        value: `${item.key}____${item.value}`,
        id: `${item.key}____${item.value}`
      } satisfies TriStateOptions)));
    }

    // Combine with separator if both sections have items
    const allItems: TriStateOptions[] = [];

    if (tagItems.length > 0) {
      allItems.push(...tagItems);
    }

    if (tagItems.length > 0 && labelItems.length > 0) {
      // Add separator
      allItems.push({
        label: (
          <div className="pointer-events-none mx-2 my-1 border-t border-gray-300" />
        ),
        value: "separator",
        id: "separator"
      } satisfies TriStateOptions);
    }

    if (labelItems.length > 0) {
      allItems.push(...labelItems);
    }

    return allItems;
  }, [tagsData, labelsData]);

  return (
    <TristateReactSelect
      isLoading={isLoading}
      options={labelItems}
      onChange={(value) => {
        if (value && value !== "all" && value !== "separator") {
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
