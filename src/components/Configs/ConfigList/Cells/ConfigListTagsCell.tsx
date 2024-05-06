import { CellContext } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { ConfigItem } from "../../../../api/types/configs";

export default function ConfigListTagsCell({
  getValue,
  hideGroupByView = false,
  label = "Tags"
}: CellContext<ConfigItem, any> & {
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

  const tags = tagKeys.map((key) => {
    return tagMap[key];
  });

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <div
          className="flex flex-row p-[0.25rem] rounded-md bg-gray-200 text-gray-600 font-semibold text-xs whitespace-nowrap break-inside-avoid-column"
          key={tag}
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
