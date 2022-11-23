import { Cell } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import LogItem from "../../../types/Logs";
import { IndeterminateCheckbox } from "../../IndeterminateCheckbox/IndeterminateCheckbox";

export function LogsTableTimestampCell({
  cell: { row },
  variant,
  viewOnly
}: {
  cell: Cell<LogItem, unknown>;
  variant?: "comfortable" | "compact";
  viewOnly?: boolean;
}) {
  return (
    <div className="min-w-max flex flex-row text-left">
      {variant === "comfortable" && !viewOnly && (
        <div className="mr-1.5">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        </div>
      )}
      <p>{dayjs(row.original.timestamp).format("YYYY-MM-DD HH:mm.ss.SSS")}</p>
    </div>
  );
}

export function LogsTableLabelsCell({
  cell: { row }
}: {
  cell: Cell<LogItem, unknown>;
}) {
  const [showAll, setShowAll] = useState(false);

  const labels = row.original.labels;

  const outerContainerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);

  const handleResize = () => {
    if (outerContainerRef.current && innerContainerRef.current) {
      const isOverflowing =
        innerContainerRef.current.scrollHeight >
        outerContainerRef.current.scrollHeight;
      setIsOverflowing(isOverflowing);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const labelsToDisplay = Object.entries(labels);

  return (
    <div
      ref={outerContainerRef}
      className={`flex flex-row text-left items-start`}
    >
      {isOverflowing && (
        <button
          onClick={(e) => {
            /* Don't trigger click for parent. E.g without stopPropagation,
           handleRowClick would be called. */
            e.stopPropagation();
            setShowAll((showMore) => !showMore);
          }}
          className="text-sm focus:outline-none"
        >
          {showAll ? (
            <IoMdArrowDropdown size={24} />
          ) : (
            <IoMdArrowDropright size={24} />
          )}
        </button>
      )}
      <div
        ref={innerContainerRef}
        className={`flex flex-wrap flex-1 h-auto ${
          !showAll ? "h-7 overflow-y-hidden" : ""
        } `}
      >
        {labelsToDisplay.map(([key, value]) => (
          <div className="flex flex-row p-[0.15rem] max-w-full">
            <div className="flex flex-row max-w-full space-x-1 font-semibold p-[0.2rem] bg-gray-200 text-gray-600 rounded-md text-xs">
              <span className="inline text-ellipsis overflow-hidden">
                {key}:
              </span>
              <span className="inline text-ellipsis overflow-hidden font-light">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
