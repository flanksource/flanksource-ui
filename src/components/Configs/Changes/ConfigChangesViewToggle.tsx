import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type GraphType = "Table" | "Graph";
export const configChangesViewToggle = atomWithStorage<GraphType>(
  "configChangesViewToggleState",
  "Table",
  undefined,
  {
    getOnInit: true
  }
);

export function useConfigChangesViewToggleState() {
  const [hideDeletedConfigs] = useAtom(configChangesViewToggle);
  return hideDeletedConfigs;
}

export default function ConfigChangesViewToggle() {
  const [toggleValue, setToggleValue] = useAtom(configChangesViewToggle);

  return (
    <div className="ml-auto flex flex-row items-center gap-2 px-2">
      <Switch
        options={["Table", "Graph"]}
        onChange={(v) => {
          setToggleValue(v as GraphType);
        }}
        value={toggleValue}
      />
    </div>
  );
}
