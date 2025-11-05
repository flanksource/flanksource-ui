import { useMemo } from "react";
import { groupLabelsByKey } from "../labels";
import { MultiSelectLabelsDropdownStandalone } from "./MultiSelectLabelsDropdownStandalone";
import { TristateLabelStandalone } from "./TristateLabelStandalone";

export function LabelFilterList({ labels }: { labels: any }) {
  const list: Record<string, any> = useMemo(() => {
    if (labels) {
      // Group all labels by key
      const groupedLabels = groupLabelsByKey(Object.values(labels));
      return groupedLabels;
    }
    return {};
  }, [labels]);

  // Check if a group of labels contains only boolean values (true/false)
  // Even if only one of true or false is present, use tristate toggle
  const isBooleanLabelGroup = (labelGroup: any[]) => {
    const uniqueValues = new Set(
      labelGroup.map((label) => label.value?.toString().toLowerCase())
    );
    // Check if all values are either "true" or "false"
    return Array.from(uniqueValues).every(
      (val) => val === "true" || val === "false"
    );
  };

  return (
    <div>
      {Object.entries(list)
        .sort((a, b) => (a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1))
        .map(([labelKey, labels]) => (
          <div key={labelKey} className="mb-2">
            {labels.length > 0 ? (
              isBooleanLabelGroup(labels) ? (
                // Boolean labels with only true/false values - use tristate toggle
                <div className="mb-3 flex w-full">
                  <div className="mr-3 flex w-full items-center overflow-x-hidden overflow-ellipsis break-all text-left text-xs capitalize text-gray-700">
                    {labelKey}
                  </div>
                  <TristateLabelStandalone
                    label={labels[0]}
                    className="flex items-center"
                    labelClass=""
                    hideLabel
                  />
                </div>
              ) : (
                // Non-boolean labels - use multi-select dropdown
                <>
                  <div className="mb-1 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xs capitalize">
                    {labelKey}
                  </div>
                  <MultiSelectLabelsDropdownStandalone labels={labels} />
                </>
              )
            ) : null}
          </div>
        ))}
    </div>
  );
}
