import { CellContext } from "@tanstack/react-table";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { ConfigItem } from "../../../api/services/configs";
import { TagList } from "../../TagList/TagList";

export default function ConfigListTagsCell({
  getValue,
  hideGroupByView = false
}: CellContext<ConfigItem, any> & {
  hideGroupByView?: boolean;
}): JSX.Element | null {
  const [params] = useSearchParams();

  const tagMap = getValue<ConfigItem["tags"]>() || {};
  const tagKeys = Object.keys(tagMap)
    .sort()
    .filter((key) => key !== "toString");
  const groupByProp = decodeURIComponent(params.get("groupByProp") ?? "");

  useEffect(() => {
    ReactTooltip.rebuild();
  });

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
          data-tip={`${groupByProp}: ${tagMap[groupByProp]}`}
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
    return {
      key,
      value: tagMap[key]
    };
  });

  return <TagList tags={tags} minimumItemsToShow={2} />;
}
