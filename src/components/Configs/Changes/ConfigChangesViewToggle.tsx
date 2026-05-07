import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useSearchParams } from "react-router-dom";

export type ConfigChangesView = "Table" | "Graph";

function isDefaultTableTimeRange(params: URLSearchParams) {
  const rangeType = params.get("rangeType");
  const range = params.get("range");
  const display = params.get("display");

  return (
    !rangeType ||
    (rangeType === "relative" && range === "now-2d" && display === "2 days")
  );
}

export function useConfigChangesViewToggleState(): ConfigChangesView {
  const [params] = useSearchParams();
  return (params.get("view") as ConfigChangesView) || "Table";
}

export default function ConfigChangesViewToggle() {
  const [params, setParams] = useSearchParams();
  const value = (params.get("view") as ConfigChangesView) || "Table";

  return (
    <div className="flex flex-row items-center gap-2 px-2">
      <Switch
        options={["Table", "Graph"]}
        onChange={(v) => {
          const next = new URLSearchParams(params);
          next.set("view", v);

          if (v === "Graph" && isDefaultTableTimeRange(params)) {
            next.set("rangeType", "relative");
            next.set("display", "2 hours");
            next.set("range", "now-2h");
            next.delete("from");
            next.delete("to");
            next.delete("duration");
            next.delete("timeRange");
          }

          setParams(next, { replace: true });
        }}
        value={value}
      />
    </div>
  );
}
