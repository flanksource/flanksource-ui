import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ConfigItem } from "../../api/services/configs";
import { CellContext } from "@tanstack/react-table";
import ReactTooltip from "react-tooltip";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
const MIN_ITEMS = 2;

export function Tags({
  getValue,
  hideGroupByView = false
}: CellContext<ConfigItem, any> & {
  hideGroupByView?: boolean;
}): JSX.Element | null {
  const [showMore, setShowMore] = useState(false);
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

  const renderKeys = showMore ? tagKeys : tagKeys.slice(0, MIN_ITEMS);

  return (
    <div
      onClick={(e) => {
        /* Don't trigger click for parent. E.g without stopPropagation,
           handleRowClick would be called. */
        e.stopPropagation();
        setShowMore((showMore) => !showMore);
      }}
      className="flex items-start"
    >
      {tagKeys.length > MIN_ITEMS && (
        <button className="text-sm focus:outline-none">
          {showMore ? (
            <IoMdArrowDropdown size={24} />
          ) : (
            <IoMdArrowDropright size={24} />
          )}
        </button>
      )}

      <div className="font-mono flex flex-wrap flex-1 max-w-full pl-1 space-y-1">
        {renderKeys.map((key) => (
          <div
            data-tip={`${key}: ${tagMap[key]}`}
            className="max-w-full overflow-hidden text-ellipsis bg-gray-200 border border-gray-300 px-1 py-0.75 mr-1 rounded-md text-gray-600 font-semibold text-xs"
            key={key}
          >
            {key}: <span className="font-light">{tagMap[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
