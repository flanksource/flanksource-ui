import { useMemo } from "react";
import { groupLabelsByKey } from "../labels";
import { MultiSelectLabelsDropdownStandalone } from "./MultiSelectLabelsDropdownStandalone";

export function LabelFilterList({ labels }: { labels: any }) {
  const list: Record<string, any> = useMemo(() => {
    if (labels) {
      // Group all labels by key, regardless of whether they're boolean or not
      const groupedLabels = groupLabelsByKey(Object.values(labels));
      return groupedLabels;
    }
    return {};
  }, [labels]);

  return (
    <div>
      {Object.entries(list)
        .sort((a, b) => (a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1))
        .map(([labelKey, labels]) => (
          <div key={labelKey} className="mb-2">
            {labels.length > 0 ? (
              <>
                <div className="mb-1 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xs capitalize">
                  {labelKey}
                </div>
                <MultiSelectLabelsDropdownStandalone labels={labels} />
              </>
            ) : null}
          </div>
        ))}
    </div>
  );
}
