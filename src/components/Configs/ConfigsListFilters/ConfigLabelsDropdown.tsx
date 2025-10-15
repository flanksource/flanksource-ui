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

    // Create a set of tag identifiers for deduplication
    // Since /config_labels returns both tags and labels, we need to filter out duplicates
    const tagSet = new Set<string>();

    // Process tags from tagsData - these will appear at the top
    if (tagsData && Array.isArray(tagsData)) {
      const sortedTags = [...tagsData].sort((a, b) => {
        const keyCompare = a.key.localeCompare(b.key);
        if (keyCompare !== 0) return keyCompare;
        return String(a.value).localeCompare(String(b.value));
      });

      sortedTags.forEach((tag) => {
        const identifier = `${tag.key}____${tag.value}`;
        // Add to tagSet for deduplication
        tagSet.add(identifier);

        tagItems.push({
          label: (
            <span className="space-x-1 text-sm">
              <span className="text-gray-600">{tag.key}:</span>
              <span>{tag.value}</span>
            </span>
          ),
          value: identifier,
          id: identifier
        } satisfies TriStateOptions);
      });
    }

    // Process labels from labelsData, excluding items that are already in tags
    if (labelsData && Array.isArray(labelsData)) {
      const filteredLabels = labelsData.filter((item) => {
        const identifier = `${item.key}____${item.value}`;
        return !tagSet.has(identifier); // Only include if NOT in tags
      });

      const sortedLabels = filteredLabels.sort((a, b) => {
        const keyCompare = a.key.localeCompare(b.key);
        if (keyCompare !== 0) return keyCompare;
        return String(a.value).localeCompare(String(b.value));
      });

      labelItems.push(
        ...sortedLabels.map(
          (item) =>
            ({
              label: (
                <span className="space-x-1 text-sm">
                  <span className="text-gray-600">{item.key}:</span>
                  <span>{item.value}</span>
                </span>
              ),
              value: `${item.key}____${item.value}`,
              id: `${item.key}____${item.value}`
            }) satisfies TriStateOptions
        )
      );
    }

    // Combine tags, separator, and labels
    const allItems: TriStateOptions[] = [];

    if (tagItems.length > 0) {
      allItems.push(...tagItems);
    }

    // Add separator if both sections have items
    if (tagItems.length > 0 && labelItems.length > 0) {
      allItems.push({
        label: (
          <div className="pointer-events-none mx-2 my-1 border-t border-gray-300" />
        ),
        value: "separator",
        id: "separator",
        disabled: true
      } satisfies TriStateOptions);
    }

    if (labelItems.length > 0) {
      allItems.push(...labelItems);
    }

    // Fallback error handling for invalid data
    if (
      allItems.length === 0 &&
      ((labelsData && !Array.isArray(labelsData)) ||
        (tagsData && !Array.isArray(tagsData)))
    ) {
      console.error(
        "Invalid data for ConfigLabelsDropdown",
        "tags:",
        tagsData,
        "labels:",
        labelsData
      );
    }

    return allItems;
  }, [tagsData, labelsData]);

  return (
    <TristateReactSelect
      isLoading={isLoading}
      options={labelItems}
      onChange={(value) => {
        // Ignore separator clicks (though it should be disabled anyway)
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
      minMenuWidth="500px"
      value={field.value}
      className="w-[500px]"
      label={"Labels"}
    />
  );
}
