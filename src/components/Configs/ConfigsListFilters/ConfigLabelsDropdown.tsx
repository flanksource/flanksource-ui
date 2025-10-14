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
    // Create a set of tag identifiers for quick lookup
    const tagSet = new Set<string>();
    if (tagsData && Array.isArray(tagsData)) {
      tagsData.forEach(tag => {
        tagSet.add(`${tag.key}____${tag.value}`);
      });
    }

    // Separate labels into tags and non-tags
    const tagItems: TriStateOptions[] = [];
    const labelItems: TriStateOptions[] = [];

    if (labelsData && Array.isArray(labelsData)) {
      labelsData.forEach(item => {
        const identifier = `${item.key}____${item.value}`;
        const optionItem = {
          label: (
            <span className="space-x-1 text-sm">
              <span className="text-gray-600">{item.key}:</span>
              <span>{item.value}</span>
            </span>
          ),
          value: identifier,
          id: identifier
        } satisfies TriStateOptions;

        // If this item exists in tags, put it in tags section
        if (tagSet.has(identifier)) {
          tagItems.push(optionItem);
        } else {
          labelItems.push(optionItem);
        }
      });
    }

    // Sort both sections
    const sortFn = (a: TriStateOptions, b: TriStateOptions) => {
      return a.value.localeCompare(b.value);
    };
    
    tagItems.sort(sortFn);
    labelItems.sort(sortFn);

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
