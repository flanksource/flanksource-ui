import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { useSearchParams } from "react-router-dom";

export const ConfigRelationKey = "relation";

export function ConfigRelationshipToggles() {
  const [params, setParams] = useSearchParams({
    outgoing: "true",
    incoming: "false"
  });

  const outgoing = params.get("outgoing") === "true";
  const incoming = params.get("incoming") === "true";
  const relation = params.get(ConfigRelationKey) === "soft";

  return (
    <div className="flex flex-row gap-2 px-2">
      <Toggle
        label="Outgoing"
        value={outgoing}
        onChange={(value) => {
          params.set("outgoing", value ? "true" : "false");
          setParams(params);
        }}
      />
      <Toggle
        label="Incoming"
        value={incoming}
        onChange={(value) => {
          params.set("incoming", value ? "true" : "false");
          setParams(params);
        }}
      />
      <Toggle
        label="Soft"
        value={relation}
        onChange={(value) => {
          params.set(ConfigRelationKey, value ? "soft" : "hard");
          setParams(params);
        }}
      />
    </div>
  );
}
