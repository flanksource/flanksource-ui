import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { Age } from "@flanksource-ui/ui/Age";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { Maximize2 } from "lucide-react";

export function SeverityTooltip({
  changes,
  severityKey,
  onExpand
}: {
  changes: ConfigChange[];
  severityKey: string;
  onExpand: (change: ConfigChange) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-gray-100 p-2 text-black shadow-sm">
      <span className="text-xs font-medium capitalize text-gray-600">
        {severityKey}
      </span>
      <div className="flex flex-col gap-1.5 divide-y divide-gray-300">
        {changes.slice(0, 5).map((change) => (
          <div
            key={change.id}
            className="flex items-center gap-2 pt-1.5 text-xs first:pt-0"
          >
            <span className="flex shrink-0 items-center gap-1 font-medium">
              <ChangeIcon change={change} className="h-4 w-4" />
              {change.change_type}
            </span>
            <span className="h-3 w-px shrink-0 bg-gray-300" />
            <span className="shrink-0 whitespace-nowrap text-gray-500">
              <Age from={change.first_observed} />
            </span>
            {change.summary && (
              <>
                <span className="h-3 w-px shrink-0 bg-gray-300" />
                <span className="truncate text-gray-600">{change.summary}</span>
              </>
            )}
            <span className="flex-1" />
            <button
              className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                onExpand(change);
              }}
              title="View full details"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      {changes.length > 5 && (
        <span className="border-t border-gray-300 pt-1 text-xs text-gray-500">
          +{changes.length - 5} more
        </span>
      )}
    </div>
  );
}
