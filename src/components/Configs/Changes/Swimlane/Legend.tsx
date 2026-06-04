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
    <div className="relative z-30 shrink-0 border-b border-gray-200 bg-white px-3 py-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {changeTypes.map(([type, sample]) => (
          <span
            key={type}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-gray-600"
          >
            <ChangeIcon change={sample} className="h-4 w-4" />
            <span>{type}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
