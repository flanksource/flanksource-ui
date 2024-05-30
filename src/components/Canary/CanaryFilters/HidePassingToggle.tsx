import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { healthSettingsAtom } from "..";
import { useUpdateParams } from "../url";

export function HidePassingToggle({ defaultValue = false }) {
  const [settings] = useAtom(healthSettingsAtom);
  const hidePassing = settings?.hidePassing ?? null;
  const paramsValue = hidePassing ? hidePassing === "true" : null;

  const [value, setValue] = useState(paramsValue ?? defaultValue);
  const updateParams = useUpdateParams();

  useEffect(() => {
    updateParams({ hidePassing: value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Toggle
      value={value}
      onChange={(val: boolean) => {
        setValue(val);
        updateParams({ hidePassing: val });
      }}
    />
  );
}
