import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { useMemo } from "react";
import { computeLabelPlacements, groupBucketByType } from "./Utils";
import { IconWithLabel } from "./IconWithLabel";

export function BucketCells({
  buckets,
  numBuckets,
  onItemClicked,
  min,
  max
}: {
  buckets: ConfigChange[][];
  numBuckets: number;
  onItemClicked: (change: ConfigChange) => void;
  min: number;
  max: number;
}) {
  const placements = useMemo(
    () => computeLabelPlacements(buckets, numBuckets, min, max),
    [buckets, numBuckets, min, max]
  );

  return (
    <>
      {buckets.map((bucket, bIdx) => {
        const grouped = groupBucketByType(bucket);
        const nextBucketEmpty = !buckets[bIdx + 1]?.length;

        return (
          <div
            key={bIdx}
            className={`flex flex-nowrap items-center gap-1 border-r border-dotted border-gray-200 py-1 last:border-r-0 ${nextBucketEmpty ? "" : "overflow-hidden"}`}
            style={{ width: `${100 / numBuckets}%` }}
          >
            {grouped.map((group, gIdx) => {
              const key = `${bIdx}-${gIdx}`;
              const placed = placements.get(key);
              const labelPlacement = placed?.label ?? "none";

              return (
                <IconWithLabel
                  key={key}
                  group={group}
                  labelPlacement={labelPlacement}
                  onItemClicked={onItemClicked}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}
