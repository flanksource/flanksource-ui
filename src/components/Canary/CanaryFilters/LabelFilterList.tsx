import { useMemo } from "react";
import { groupLabelsByKey, separateLabelsByBooleanType } from "../labels";
import { MultiSelectLabelsDropdownStandalone } from "./MultiSelectLabelsDropdownStandalone";
import { TristateLabelStandalone } from "./TristateLabelStandalone";

export function LabelFilterList({ labels }: { labels: any }) {
  const list: Record<string, any> = useMemo(() => {
    if (labels) {
      const [bl, nbl] = separateLabelsByBooleanType(Object.values(labels));
      const groupedNbl = groupLabelsByKey(nbl);
      const keyedBl = bl
        .map((o) => ({ ...o, isBoolean: true }))
        .reduce((acc, current) => {
          acc[current.key] = [current];
          return acc;
        }, {});
      const mergedLabels = { ...keyedBl, ...groupedNbl };
      return mergedLabels;
    }
    return {};
  }, [labels]);

  return (
    <div>
      {Object.entries(list)
        .sort((a, b) => (a[0].toLowerCase() > b[0].toLowerCase() ? 1 : -1))
        .map(([labelKey, labels]) => (
          <div key={labelKey} className="mb-2">
            {labels.length > 1 ? (
              <>
                <div className="mb-1 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-xs capitalize">
                  {labelKey}
                </div>
                <MultiSelectLabelsDropdownStandalone labels={labels} />
              </>
            ) : labels.length === 1 ? (
              <div className="mb-3 flex w-full">
                <div className="mr-3 flex w-full items-center overflow-x-hidden overflow-ellipsis break-all text-left text-xs capitalize text-gray-700">
                  {labels[0].key}
                </div>
                <TristateLabelStandalone
                  label={labels[0]}
                  className="flex items-center"
                  labelClass=""
                  hideLabel
                />
              </div>
            ) : null}
          </div>
        ))}
    </div>
  );
}
