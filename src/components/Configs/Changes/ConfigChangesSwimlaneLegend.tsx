import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { useMemo } from "react";

type Props = {
  changes: ConfigChange[];
};

export default function ConfigChangesSwimlaneLegend({ changes }: Props) {
  const changeTypes = useMemo(() => {
    const seen = new Map<string, ConfigChange>();
    for (const c of changes) {
      if (c.change_type && !seen.has(c.change_type)) {
        seen.set(c.change_type, c);
      }
    }
    return Array.from(seen.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [changes]);

  if (changeTypes.length === 0) return null;

  return (
    <div className="sticky top-[28px] z-[19] flex gap-x-4 gap-y-0.5 overflow-x-auto border-b border-gray-200 bg-white px-3 py-1">
      {changeTypes.map(([type, sample]) => (
        <span
          key={type}
          className="inline-flex shrink-0 items-center gap-1 text-xs text-gray-600"
        >
          <ChangeIcon change={sample} className="h-3.5 w-3.5" />
          <span>{type}</span>
        </span>
      ))}
    </div>
  );
}
