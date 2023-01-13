import { Cell, NoInfer } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import LogItem from "../../../types/Logs";
import { IndeterminateCheckbox } from "../../IndeterminateCheckbox/IndeterminateCheckbox";
import { Tags } from "../../Tags";

export type LogsTableTimestampCellProps = React.HTMLProps<HTMLDivElement> & {
  cell: Cell<LogItem, unknown>;
  variant?: "comfortable" | "compact";
  viewOnly?: boolean;
};

export function LogsTableTimestampCell({
  cell: { row },
  variant,
  viewOnly,
  className = "min-w-max flex flex-row text-left"
}: LogsTableTimestampCellProps) {
  return (
    <div className={className}>
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
    <div className={`flex flex-row text-left items-start`}>
      <div ref={innerContainerRef} className={`flex flex-wrap flex-1 h-auto `}>
        <Tags type={"logs"} labels={labelsToDisplay} />
      </div>
    </div>
  );
}
