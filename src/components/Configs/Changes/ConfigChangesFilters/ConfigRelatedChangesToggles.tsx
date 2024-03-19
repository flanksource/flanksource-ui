import { Toggle } from "@flanksource-ui/components/Toggle";
import { useSearchParams } from "react-router-dom";

export function ConfigRelatedChangesToggles() {
  const [params, setParams] = useSearchParams({
    downstream: "true",
    upstream: "false"
  });

  const downstream = params.get("downstream") === "true";
  const upstream = params.get("upstream") === "true";

  return (
    <div className="flex flex-row gap-2 px-2">
      <Toggle
        label="Downstream"
        value={downstream}
        onChange={(value) => {
          params.set("downstream", value ? "true" : "false");
          setParams(params);
        }}
      />
      <Toggle
        label="Upstream"
        value={upstream}
        onChange={(value) => {
          params.set("upstream", value ? "true" : "false");
          setParams(params);
        }}
      />
    </div>
  );
}
