import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { TagList } from "@flanksource-ui/ui/Tags/TagList";
import { useMemo } from "react";
import ConfigLink from "../../ConfigLink/ConfigLink";
import { BucketCells } from "./BucketCells";
import { SwimlaneConfigRowBase } from "./SwimlaneConfigRowBase";
import { BucketedRow } from "./Utils";

export function SwimlaneRow({
  row,
  columnWidth,
  numBuckets,
  onItemClicked,
  onResizeMouseDown,
  min,
  max,
  indentLevel = 0,
  even = false
}: {
  row: BucketedRow;
  columnWidth: number;
  numBuckets: number;
  onItemClicked: (change: ConfigChange) => void;
  onResizeMouseDown: (e: React.MouseEvent) => void;
  min: number;
  max: number;
  indentLevel?: number;
  even?: boolean;
}) {
  const allChanges = useMemo(() => row.buckets.flat(), [row.buckets]);
  const tags = useMemo(
    () =>
      Object.entries(row.tags ?? {})
        .filter(([key]) => key !== "toString")
        .map(([key, value]) => ({ key, value: String(value) })),
    [row.tags]
  );
  const tooltipContent =
    tags.length > 0 ? (
      <div className="flex max-w-md flex-col gap-2 text-white">
        <div>{row.config?.type}</div>
        <TagList
          tags={tags}
          layout="row"
          className="flex flex-row flex-wrap gap-1"
          childClassName="text-white"
        />
      </div>
    ) : undefined;

  return (
    <SwimlaneConfigRowBase
      label={
        <ConfigLink
          config={row.config}
          configId={row.config?.id}
          tooltipContent={tooltipContent}
          className="min-w-0 text-sm text-zinc-600"
        />
      }
      timeline={
        <div className="flex flex-1 flex-row items-stretch border-l border-gray-200">
          {row.preRangeBadge && (
            <span className="flex items-center px-1 text-[10px] text-gray-400">
              {row.preRangeBadge}
            </span>
          )}
          <BucketCells
            buckets={row.buckets}
            numBuckets={numBuckets}
            onItemClicked={onItemClicked}
            min={min}
            max={max}
          />
        </div>
      }
      severity={row.severity}
      changes={allChanges}
      columnWidth={columnWidth}
      onExpand={onItemClicked}
      onResizeMouseDown={onResizeMouseDown}
      indentLevel={indentLevel}
      even={even}
    />
  );
}
