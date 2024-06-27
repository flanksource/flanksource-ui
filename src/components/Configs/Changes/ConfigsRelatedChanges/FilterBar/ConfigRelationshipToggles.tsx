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
        // We might want to disable the toggle when incoming is false, but
        // context is needed to understand the behavior of the toggle by the
        // user (e.g. why is it disabled?)
        hint={
          incoming ? undefined : "This is the default when incoming is false"
        }
        disabled={!incoming}
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
          // When incoming is false, we want to set outgoing to true, as the
          // default is outgoing when both are false, so from a user perspective
          // it's easier to understand the default behavior
          if (!value) {
            params.set("outgoing", "true");
          }
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
