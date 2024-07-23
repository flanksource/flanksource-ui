import { Tag } from "@flanksource-ui/ui/Tags/Tag";
import { CellContext } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { ConfigItem } from "../../../../api/types/configs";

export default function ConfigListTagsCell<
  T extends { tags: Record<string, any> }
>({
  getValue,
  hideGroupByView = false
}: Pick<CellContext<Pick<T, "tags">, any>, "getValue"> & {
  hideGroupByView?: boolean;
  label?: string;
}): JSX.Element | null {
  const [params] = useSearchParams();

  const tagMap = getValue<ConfigItem["tags"]>() || {};
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
      <div className="font-mono flex flex-wrap w-full max-w-full pl-1 space-y-1">
        <div
          className="max-w-full overflow-hidden text-ellipsis bg-gray-200 border border-gray-300 px-1 py-0.75 mr-1 rounded-md text-gray-600 font-semibold text-xs"
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
          title={value}
          key={value}
          variant="gray"
        >
          {value}
        </Tag>
      ))}
    </div>
  );
}
