import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { Link } from "react-router-dom";
import ConfigsTypeIcon from "../../ConfigsTypeIcon";
import { GroupedChange } from "./Utils";
import { ChangeRow } from "./ChangeRow";

export function SwimlaneTooltip({
  change,
  onExpand
}: {
  change: ConfigChange;
  onExpand?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-gray-100 p-2 text-black shadow-sm">
      <ChangeRow change={change} onExpand={onExpand} />
    </div>
  );
}

export function GroupedSwimlaneTooltip({
  group,
  onExpand
}: {
  group: GroupedChange;
  onExpand?: (change: ConfigChange) => void;
}) {
  const { count, changes } = group;
  const allSameConfig = changes.every(
    (c) => c.config_id === changes[0]?.config_id
  );
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-gray-100 p-2 text-black shadow-sm">
      <div className="flex flex-col gap-2 divide-y divide-gray-300">
        {changes.slice(0, 5).map((change, i) => (
          <div
            key={change.id}
            className="flex flex-col gap-1 pt-1.5 first:pt-0"
          >
            {!allSameConfig && (
              <Link
                to={`/catalog/${change.config?.id}`}
                className="flex items-center gap-1 text-xs hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ConfigsTypeIcon config={change.config}>
                  <span className="truncate">{change.config?.name}</span>
                </ConfigsTypeIcon>
              </Link>
            )}
            <ChangeRow
              change={change}
              onExpand={onExpand ? () => onExpand(change) : undefined}
              showType={i === 0}
            />
          </div>
        ))}
      </div>
      {count > 5 && (
        <span className="border-t border-gray-300 pt-1 text-xs text-gray-500">
          +{count - 5} more
        </span>
      )}
    </div>
  );
}
