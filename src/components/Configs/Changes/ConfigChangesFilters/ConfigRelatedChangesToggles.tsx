import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { usePartialUpdateSearchParams } from "../../../../hooks/usePartialUpdateSearchParams";

export function ConfigRelatedChangesToggles() {
  const [params, setParams] = usePartialUpdateSearchParams();

  const downstream =
    params.get("downstream") === "true" || params.get("downstream") === null;
  const upstream = params.get("upstream") === "true";

  return (
    <div className="flex flex-row gap-2 px-2">
      <Toggle
        label="Downstream"
        value={downstream}
        onChange={(value) => {
          setParams({ downstream: value ? "true" : "false" });
        }}
      />
      <Toggle
        label="Upstream"
        value={upstream}
        onChange={(value) => {
          setParams({ upstream: value ? "true" : "false" });
        }}
      />
    </div>
  );
}
