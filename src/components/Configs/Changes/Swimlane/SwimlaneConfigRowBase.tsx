import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { ReactNode } from "react";
import { ResizeHandle } from "./ResizeHandle";
import { SeverityBadges } from "./SeverityBadges";
import { SeverityCounts } from "./Utils";

type SwimlaneConfigRowBaseProps = {
  label: ReactNode;
  timeline: ReactNode;
  severity: SeverityCounts;
  changes: ConfigChange[];
  columnWidth: number;
  onExpand: (change: ConfigChange) => void;
  onResizeMouseDown: (e: React.MouseEvent) => void;
  indentLevel?: number;
  even?: boolean;
  className?: string;
  labelClassName?: string;
};

export function SwimlaneConfigRowBase({
  label,
  timeline,
  severity,
  changes,
  columnWidth,
  onExpand,
  onResizeMouseDown,
  indentLevel = 0,
  even = false,
  className = "",
  labelClassName = ""
}: SwimlaneConfigRowBaseProps) {
  const bg = even ? "bg-gray-50/40" : "bg-white";

  return (
    <div
      className={`relative z-0 flex flex-row border-b border-gray-100 hover:z-50 hover:bg-gray-100/50 ${bg} ${className}`}
      style={{ minHeight: "36px" }}
    >
      <div
        className={`sticky left-0 z-20 flex shrink-0 items-center gap-3 overflow-visible px-2 py-1 text-sm shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] ${bg}`}
        style={{ width: columnWidth }}
      >
        <div
          className={`relative z-30 min-w-0 flex-1 ${labelClassName}`}
          style={{ paddingLeft: indentLevel * 24 }}
        >
          {label}
        </div>

        <span className="h-4 w-px shrink-0 bg-gray-200" />

        <SeverityBadges
          severity={severity}
          changes={changes}
          onExpand={onExpand}
        />

        <ResizeHandle onMouseDown={onResizeMouseDown} />
      </div>

      {timeline}
    </div>
  );
}
