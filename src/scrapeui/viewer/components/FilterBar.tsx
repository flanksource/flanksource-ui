export interface Filters {
  health: Set<string>;
  type: Set<string>;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  healthValues: string[];
  typeValues: string[];
}

function toggle(set: Set<string>, val: string): Set<string> {
  const next = new Set(set);
  if (next.has(val)) next.delete(val);
  else next.add(val);
  return next;
}

const HEALTH_COLORS: Record<string, string> = {
  healthy: "bg-green-100 text-green-700 border-green-300",
  unhealthy: "bg-red-100 text-red-700 border-red-300",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
  unknown: "bg-gray-100 text-gray-600 border-gray-300"
};

export function FilterBar({
  filters,
  onChange,
  healthValues,
  typeValues
}: Props) {
  if (healthValues.length === 0 && typeValues.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {healthValues.map((h) => {
        const active = filters.health.has(h);
        const colors = HEALTH_COLORS[h] || HEALTH_COLORS["unknown"];
        return (
          <button
            key={h}
            className={`rounded-full border px-2 py-0.5 text-xs transition-all ${
              active
                ? colors + " font-semibold ring-1 ring-offset-1"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() =>
              onChange({ ...filters, health: toggle(filters.health, h) })
            }
          >
            {h}
          </button>
        );
      })}
      {healthValues.length > 0 && typeValues.length > 0 && (
        <span className="mx-1 text-gray-300">|</span>
      )}
      {typeValues.map((t) => {
        const active = filters.type.has(t);
        return (
          <button
            key={t}
            className={`rounded-full border px-2 py-0.5 text-xs transition-all ${
              active
                ? "border-blue-300 bg-blue-100 font-semibold text-blue-700 ring-1 ring-offset-1"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() =>
              onChange({ ...filters, type: toggle(filters.type, t) })
            }
          >
            {t.split("::").pop()}
          </button>
        );
      })}
      {(filters.health.size > 0 || filters.type.size > 0) && (
        <button
          className="ml-1 text-xs text-gray-400 hover:text-gray-600"
          onClick={() => onChange({ health: new Set(), type: new Set() })}
        >
          clear
        </button>
      )}
    </div>
  );
}
