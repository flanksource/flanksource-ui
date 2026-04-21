import { useState, useEffect, useRef } from "react";
import type { ScrapeResult, TypeGroup } from "../types";
import { typeIcon } from "../utils";
import { ConfigNode, type ConfigItemCounts } from "./ConfigNode";

interface Props {
  groups: TypeGroup[];
  selected: ScrapeResult | null;
  onSelect: (item: ScrapeResult) => void;
  expandAll: boolean | null;
  configCounts?: Map<string, ConfigItemCounts>;
}

function TypeGroupNode({
  group,
  selected,
  onSelect,
  expandAll,
  configCounts
}: {
  group: TypeGroup;
  selected: ScrapeResult | null;
  onSelect: (item: ScrapeResult) => void;
  expandAll: boolean | null;
  configCounts?: Map<string, ConfigItemCounts>;
}) {
  const [open, setOpen] = useState(true);
  const prevExpandAll = useRef(expandAll);

  useEffect(() => {
    if (expandAll !== null && expandAll !== prevExpandAll.current) {
      setOpen(expandAll);
    }
    prevExpandAll.current = expandAll;
  }, [expandAll]);

  return (
    <div>
      <div
        className="flex cursor-pointer select-none items-center gap-2 border-b border-gray-100 px-3 py-2 hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs text-gray-400">{open ? "▼" : "▶"}</span>
        <iconify-icon icon={typeIcon(group.type)} className="text-base" />
        <span className="flex-1 truncate text-sm font-medium text-gray-800">
          {group.type}
        </span>
        <span className="text-xs text-gray-400">{group.items.length}</span>
      </div>
      {open && (
        <div className="ml-2">
          {group.items.map((item) => (
            <ConfigNode
              key={`${item.config_type}-${item.id}`}
              item={item}
              selected={selected}
              onSelect={onSelect}
              counts={configCounts?.get(`${item.config_type}-${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ConfigTree({
  groups,
  selected,
  onSelect,
  expandAll,
  configCounts
}: Props) {
  return (
    <div>
      {groups.map((group) => (
        <TypeGroupNode
          key={group.type}
          group={group}
          selected={selected}
          onSelect={onSelect}
          expandAll={expandAll}
          configCounts={configCounts}
        />
      ))}
    </div>
  );
}
