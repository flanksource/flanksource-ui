// ABOUTME: Toggle component to show/hide deleted configs in filter bars.
// ABOUTME: Syncs state with URL search params (showDeletedConfigs=true).

import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { useSearchParams } from "react-router-dom";

export default function ShowDeletedConfigs() {
  const [params, setParams] = useSearchParams();
  const showDeleted = params.get("showDeletedConfigs") === "true";

  return (
    <Toggle
      label="Show deleted"
      value={showDeleted}
      onChange={(value) => {
        if (value) {
          params.set("showDeletedConfigs", "true");
        } else {
          params.delete("showDeletedConfigs");
        }
        setParams(params);
      }}
    />
  );
}
