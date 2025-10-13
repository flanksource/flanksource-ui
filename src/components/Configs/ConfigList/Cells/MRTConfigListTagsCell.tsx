import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { Tag } from "@flanksource-ui/ui/Tags/Tag";
import { useCallback } from "react";
import { ConfigItem } from "../../../../api/types/configs";
import { usePartialUpdateSearchParams } from "../../../../hooks/usePartialUpdateSearchParams";

type MRTConfigListTagsCellProps<
  T extends {
    tags?: Record<string, any>;
    id: string;
  }
> = MRTCellProps<T> & {
  hideGroupByView?: boolean;
  enableFilterByTag?: boolean;
  filterByTagParamKey?: string;
};

export default function MRTConfigListTagsCell<
  T extends { tags?: Record<string, any>; id: string }
>({
  row,
  cell,
  hideGroupByView = false,
  enableFilterByTag = false,
  filterByTagParamKey = "tags"
}: MRTConfigListTagsCellProps<T>): JSX.Element | null {
  const [params, setParams] = usePartialUpdateSearchParams();

  const tagMap = cell.getValue<ConfigItem["tags"]>() || {};
  const tagKeys = Object.keys(tagMap)
    .sort()
    .filter((key) => key !== "toString");

  const onFilterByTag = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement>,
      tag: {
        key: string;
        value: string;
      },
      action: "include" | "exclude"
    ) => {
      if (!enableFilterByTag) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Get the current tags from the URL
      const currentTags = params.get(filterByTagParamKey);
      const currentTagsArray = (
        currentTags ? currentTags.split(",") : []
      ).filter((value) => {
        const tagKey = value.split("____")[0];
        const tagAction = value.split(":")[1] === "1" ? "include" : "exclude";

        if (tagKey === tag.key && tagAction !== action) {
          return false;
        }
        return true;
      });

      // Append the new value, but for same tags, don't allow including and excluding at the same time
      const updatedValue = currentTagsArray
        .concat(`${tag.key}____${tag.value}:${action === "include" ? 1 : -1}`)
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(",");

      // Update the URL
      params.set(filterByTagParamKey, updatedValue);
      setParams(Object.fromEntries(params.entries()));
    },
    [enableFilterByTag, filterByTagParamKey, params, setParams]
  );

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

  return (
    <div className="flex flex-wrap gap-1">
      {Object.entries(tagMap).map(([key, value]) => (
        <Tag
          tag={{
            key,
            value
          }}
          id={row.original.id}
          key={value}
          variant="gray"
          onFilterByTag={enableFilterByTag ? onFilterByTag : undefined}
        >
          {value}
        </Tag>
      ))}
    </div>
  );
}
