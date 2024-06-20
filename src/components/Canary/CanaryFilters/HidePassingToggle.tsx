import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import { useAtom } from "jotai";
import { healthSettingsAtom } from "../useHealthUserSettings";

export function HidePassingToggle() {
  const [settings, setSettings] = useAtom(healthSettingsAtom);

  const hidePassing = settings?.hidePassing ?? null;
  const paramsValue = hidePassing ? hidePassing.toString() === "true" : true;

  const value = !hidePassing ? true : paramsValue;

  return (
    <Toggle
      value={value}
      onChange={(val) => {
        setSettings((prev) => ({
          ...prev,
          hidePassing: val.toString()
        }));
      }}
    />
  );
}
