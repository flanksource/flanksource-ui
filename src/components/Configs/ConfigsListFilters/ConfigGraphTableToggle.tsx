import { Switch } from "@flanksource-ui/components/Switch";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const configRelationshipGraphTableToggle = atomWithStorage<
  "Table" | "Graph"
>("relationshipGraphTableToggle", "Table", undefined, {
  getOnInit: true
});

export default function ConfigGraphTableToggle() {
  const [toggleValue, setToggleValue] = useAtom(
    configRelationshipGraphTableToggle
  );

  return (
    <div className="flex flex-row gap-2 items-center px-2">
      <Switch
        options={["Table", "Graph"]}
        onChange={(v) => {
          setToggleValue(v);
        }}
        value={toggleValue}
      />
    </div>
  );
}
