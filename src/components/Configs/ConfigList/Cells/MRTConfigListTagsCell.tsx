import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import TagsFilterCell from "@flanksource-ui/ui/Tags/TagsFilterCell";
import { ConfigItem } from "../../../../api/types/configs";

type MRTConfigListTagsCellProps<
  T extends {
    tags?: Record<string, any>;
    id: string;
  }
> = MRTCellProps<T> & {
  hideGroupByView?: boolean;
  enableFilterByTag?: boolean;
  filterByTagParamKey?: string;
  /**
   * Optional prefix to namespace the search params.
   */
  paramPrefix?: string;
};

export default function MRTConfigListTagsCell<
  T extends { tags?: Record<string, any>; id: string }
>({
  cell,
  hideGroupByView = false,
  enableFilterByTag = false,
  filterByTagParamKey = "tags",
  paramPrefix
}: MRTConfigListTagsCellProps<T>): JSX.Element | null {
  const [params] = usePrefixedSearchParams(paramPrefix, false);

  const tagMap = cell.getValue<ConfigItem["tags"]>() || {};
  const tagKeys = Object.keys(tagMap)
    .sort()
    .filter((key) => key !== "toString");

  const groupByProp = decodeURIComponent(params.get("groupByProp") ?? "");

  if (tagKeys.length === 0) {
    return null;
  }

  if (!hideGroupByView && groupByProp) {
    if (!tagMap[groupByProp]) {
      return null;
    }

    return (
      <div className="flex w-full max-w-full flex-wrap space-y-1 pl-1 font-mono">
        <div
          className="mr-1 max-w-full overflow-hidden text-ellipsis rounded-md border border-gray-300 bg-gray-200 px-1 py-0.75 text-xs font-semibold text-gray-600"
          key={groupByProp}
        >
          {groupByProp}:{" "}
          <span className="font-light">{tagMap[groupByProp]}</span>
        </div>
      </div>
    );
  }

  if (!enableFilterByTag) {
    return (
      <div className="flex flex-wrap gap-1">
        {Object.entries(tagMap)
          .filter(([key]) => key !== "toString")
          .map(([key, value]) => (
            <div
              key={key}
              className="rounded-md bg-gray-100 px-1 py-0.5 text-xs text-gray-600"
            >
              {key}: {String(value)}
            </div>
          ))}
      </div>
    );
  }

  return (
    <TagsFilterCell
      tags={tagMap}
      filterByTagParamKey={filterByTagParamKey}
      paramPrefix={paramPrefix}
    />
  );
}
