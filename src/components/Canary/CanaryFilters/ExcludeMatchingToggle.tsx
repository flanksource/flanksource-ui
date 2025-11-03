import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function ExcludeMatchingToggle() {
  const [searchParams, setSearchParams] = useSearchParams();

  const excludeMatching = searchParams.get("excludeMatching") === "true";

  const handleToggle = useCallback(
    (value: boolean) => {
      if (value) {
        searchParams.set("excludeMatching", "true");
      } else {
        searchParams.delete("excludeMatching");
      }
      setSearchParams(searchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return <Toggle value={excludeMatching} onChange={handleToggle} />;
}
