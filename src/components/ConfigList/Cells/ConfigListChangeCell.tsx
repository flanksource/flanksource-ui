import { CellContext } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import ReactTooltip from "react-tooltip";
import { ConfigItem } from "../../../api/services/configs";

const MIN_ITEMS = 2;

export default function ConfigListChangeCell({
  row,
  column
}: CellContext<ConfigItem, any>) {
  const [showMore, setShowMore] = useState(false);

  const changes = row?.getValue<ConfigItem["changes"]>(column.id);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (changes == null) {
    return null;
  }

  const renderKeys = showMore ? changes : changes.slice(0, MIN_ITEMS);

  const cell = renderKeys.map((item: any, index: number) => {
    return (
      <div className="flex flex-row max-w-full overflow-hidden" key={index}>
        <div className="flex max-w-full items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 overflow-hidden">
          {item.change_type === "diff" ? (
            item.total
          ) : (
            <div
              data-tip={`${item.change_type}: ${item.total}`}
              className="flex flex-row max-w-full space-x-1"
            >
              <div className="text-ellipsis overflow-hidden">
                {item.change_type}
              </div>
              :<div className="flex-1"> {item.total}</div>
            </div>
          )}
        </div>
      </div>
    );
  });
  return (
    <div
      className="flex flex-row items-start"
      onClick={(e) => {
        if (changes.length > MIN_ITEMS) {
          e.stopPropagation();
          setShowMore((showMore) => !showMore);
        }
      }}
    >
      {changes.length > MIN_ITEMS && (
        <button className="text-sm focus:outline-none">
          {showMore ? (
            <IoMdArrowDropdown size={24} />
          ) : (
            <IoMdArrowDropright size={24} />
          )}
        </button>
      )}
      <div className="flex flex-col flex-1 w-full max-w-full">{cell}</div>
    </div>
  );
}
