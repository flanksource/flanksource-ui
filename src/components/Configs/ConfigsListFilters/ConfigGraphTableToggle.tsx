import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type GraphType = "Table" | "Graph";
export const configRelationshipGraphTableToggle = atomWithStorage<GraphType>(
  "relationshipGraphTableToggle",
  "Table",
  undefined,
  {
    getOnInit: true
  }
);

export function useConfigGraphTableToggleViewValue() {
  const [hideDeletedConfigs] = useAtom(configRelationshipGraphTableToggle);
  return hideDeletedConfigs;
}

export default function ConfigGraphTableToggle() {
  const [toggleValue, setToggleValue] = useAtom(
    configRelationshipGraphTableToggle
  );

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
