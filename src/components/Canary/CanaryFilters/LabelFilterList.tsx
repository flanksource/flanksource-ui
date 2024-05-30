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
                <div className="text-xs whitespace-nowrap overflow-ellipsis w-full overflow-hidden mb-1 capitalize">
                  {labelKey}
                </div>
                <MultiSelectLabelsDropdownStandalone labels={labels} />
              </>
            ) : labels.length === 1 ? (
              <div className="flex w-full mb-3">
                <div className="mr-3 w-full text-xs text-left text-gray-700 break-all overflow-ellipsis overflow-x-hidden flex items-center capitalize">
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
