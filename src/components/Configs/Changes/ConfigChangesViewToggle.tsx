import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useSearchParams } from "react-router-dom";

export type ConfigChangesView = "Table" | "Graph";

export function useConfigChangesViewToggleState(): ConfigChangesView {
  const [params] = useSearchParams();
  return (params.get("view") as ConfigChangesView) || "Table";
}

export default function ConfigChangesViewToggle() {
  const [params, setParams] = useSearchParams();
  const value = (params.get("view") as ConfigChangesView) || "Table";

  return (
    <div className="ml-auto flex flex-row items-center gap-2 px-2">
      <Switch
        options={["Table", "Graph"]}
        onChange={(v) => {
          const next = new URLSearchParams(params);
          next.set("view", v);
          setParams(next, { replace: true });
        }}
        value={value}
      />
    </div>
  );
}
